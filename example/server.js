var prerender = require('prerender')
  , bwlist = require('../index.js');

var server = prerender({
    workers: process.env.PHANTOM_CLUSTER_NUM_WORKERS,
    iterations: process.env.PHANTOM_WORKER_ITERATIONS || 10,
    phantomArguments: ["--load-images=false", "--ignore-ssl-errors=true"],
    phantomBasePort: process.env.PHANTOM_CLUSTER_BASE_PORT,
    messageTimeout: process.env.PHANTOM_CLUSTER_MESSAGE_TIMEOUT
});

// Either specify a folder path
// bwlist.setConf(__dirname + '/prerender-bwlist/bwlist.sample.json');

// Or set the config directly
bwlist.setConf({
    "whitelist": {
        "enabled": true,
        "list": [
            "google.ch",
            "www.google.ch"
        ]
    },
    "blacklist": {
        "enabled": false,
        "list": []
    }
});
// If setConf is not called prerender-bwlist will look for a bwlist.json file in your app's root

// Tell Prerender to use it!
server.use(bwlist);

// server.use(prerender.whitelist());
// server.use(prerender.blacklist());
// server.use(prerender.inMemoryHtmlCache());
// server.use(prerender.s3HtmlCache());
// server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
