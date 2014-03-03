var url = require("url")
  , fs = require("fs")
  , fileUrl = process.env.BWLIST_CONF || './bwlist.json';

module.exports = {
    getJSONLists: function () {
        // We're using module.exports, since the fs.watchFile-
        // callback (getJSONLists) loses it's context.
        var that = module.exports;

        // set B/W domains from the ENV variables
        that.BLACKLISTED_DOMAINS = (process.env.BLACKLISTED_DOMAINS && process.env.BLACKLISTED_DOMAINS.split(',')) || [];
        that.ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS && process.env.ALLOWED_DOMAINS.split(',')) || [];

        // add the rest from bwlist.json
        fs.readFile(fileUrl, 'utf8', function callback (err, data) {
            var list = (data) ? JSON.parse(data) || null : null;
            if (!err && list) {
                that.ALLOWED_DOMAINS = that.ALLOWED_DOMAINS.concat(list.whitelist.list);
                that.BLACKLISTED_DOMAINS = that.BLACKLISTED_DOMAINS.concat(list.blacklist.list);
                that.ENABLED_WHITELIST = list.whitelist.enabled;
                that.ENABLED_BLACKLIST = list.blacklist.enabled;
            } else {
                console.log('No or empty bwlist.json');
            }
        });
    },
    init: function () {
        this.getJSONLists();
        fs.watchFile(fileUrl, { persistent: true }, this.getJSONLists);
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

    }
}