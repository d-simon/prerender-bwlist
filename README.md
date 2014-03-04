Prerender Black/Whitelist Plugin
================================

Easy black-/whitelisting plugin configuration through a json file.

## Usage

    var bwlist = require('./bwlist');

    server.use(bwlist);

## Configuration

Create a *bwlist.json* from *bwlist.sample.json* for example like so

    {
        "whitelist": {
            "enabled": true,
            "list": ["google.ch", "www.google.ch"]
        },
        "blacklist": {
            "enabled": false,
            "list": []
        }
    }

Alternatively specify a different location for your bwlist.json
    BWLIST_CONF='/path/to/bwlist.json'