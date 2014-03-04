var url = require("url")
  , fs = require("fs")
  , extend = require("extend")
  , path = require('path')
  , fileUrl = process.env.BWLIST_CONF || path.dirname(require.main.filename) + '/bwlist.json'
  , defaultConf = {
        "whitelist": {
            "enabled": false,
            "list": []
        },
        "blacklist": {
            "enabled": false,
            "list": []
        }
    };
module.exports = {
    setConf: function (input) {
        // Reset existing settings.
        this.fileUrl = null;
        this.confObj = null;

        // Interpret arguments and set new or default settings.
        if (typeof input === 'string') {
            this.fileUrl = input;
        } else if (Object.prototype.toString.call(input) === "[object Object]") {
            this.confObj = input;
        } else {
            this.fileUrl = fileUrl; // default
        }
    },
    init: function () {
        // If setConf has not been called already, call it to configure.
        if (!this.fileUrl && !this.confObj) this.setConf();

        // Handle configuration.
        if (this.fileUrl) {
            this.getJSONLists();
            fs.watchFile(this.fileUrl, { persistent: true }, this.getJSONLists);
        } else if (this.confObj)  {
            this.confObj = extend(true, defaultConf, this.confObj);
            this.setFromConfig();
        }
    },
    beforePhantomRequest: function (req, res, next) {
        var parsed = url.parse(req.prerender.url);
        if (this.ENABLED_BLACKLIST && -1 !== this.BLACKLISTED_DOMAINS.indexOf(parsed.hostname)) {
            res.send(404);
        } else if (this.ENABLED_WHITELIST && -1 === this.ALLOWED_DOMAINS.indexOf(parsed.hostname)) {
            res.send(404);
        } else {
            next();
        }

    },
    getJSONLists: function () {
        // We're using module.exports, since the fs.watchFile-
        // callback (getJSONLists) loses it's context.
        var that = module.exports;

        // Add the rest from bwlist.json
        fs.readFile(that.fileUrl, 'utf8', function callback (err, data) {
            var list = (data) ? JSON.parse(data) || null : null;
            if (!err && list) {
                that.setFromConfig();
            } else {
                console.log('No or empty bwlist.json');
            }
        });
    },
    setFromEnvVariables: function () {
        var that = module.exports;
        that.BLACKLISTED_DOMAINS = (process.env.BLACKLISTED_DOMAINS && process.env.BLACKLISTED_DOMAINS.split(',')) || [];
        that.ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS && process.env.ALLOWED_DOMAINS.split(',')) || [];
    },
    setFromConfig: function () {
        var that = module.exports
          , conf = this.confObj || defaultConf;
        that.setFromEnvVariables();
        that.ALLOWED_DOMAINS = that.ALLOWED_DOMAINS.concat(conf.whitelist.list);
        that.BLACKLISTED_DOMAINS = that.BLACKLISTED_DOMAINS.concat(conf.blacklist.list);
        that.ENABLED_WHITELIST = conf.whitelist.enabled;
        that.ENABLED_BLACKLIST = conf.blacklist.enabled;
    }
};