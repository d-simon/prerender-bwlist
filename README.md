Prerender Black/Whitelist Plugin
================================

Easy and comfortable Black-/Whitelisting configuration plugin for [Prerender server](http://www.prerender.io/server) (from [prerender.io](http://www.prerender.io)). Configuration can be set through a json file or directly from within your prerender server.

## Usage

    var bwlist = require('./bwlist');
    server.use(bwlist);
    
## Configuration

### Inline

You can set the config directly inside your prerender server.
```javascript
var prerender = require('prerender')
  , bwlist = require('../index.js');

// Either specify a folder path
bwlist.setConf(__dirname + '/prerender-bwlist/bwlist.sample.json');

// Or set it directly (this will overwrite the previous bit!)
bwlist.setConf({
    "whitelist": {
        "enabled": true,
        "list": [
            "google.com",
            "www.google.com"
        ]
    },
    "blacklist": {
        "enabled": false,
        "list": []
    }
});

server.use(bwlist);
server.start();
```

If `bwlist.setConf` is not called prerender-bwlist will look for a `bwlist.json` file in your app's root folder.

### Through a bwlist.json

Create a *bwlist.json* from *bwlist.sample.json* in your app's root folder
```json
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
```
Alternatively specify a different location for your bwlist.json through an environment variable 
```bash
BWLIST_CONF='/ path/to/bwlist.json'
```
or inline with `bwlist.setConf`