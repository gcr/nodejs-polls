// routes.js -- routing table
var
  url           = require('url'),
  sys           = require('sys'),
  switchboard   = require('./switchboard'),
  staticFiles   = require('./static'),
  routes        = {};

function addRoutes(newRoutes) {
  return process.mixin(routes, newRoutes);
}


// Use this function to do things from our HTTP server.
function dispatch(req, res) {
  try {
    switchboard.dispatch(req, res,
      url.parse(req.url).pathname,
      routes);
  } catch(err) {
    sys.puts("Exception! URL: " + req.url + "\n\n" + (err.stack || sys.inspect(err)));
    var errtext = "Internal server error.";
    res.writeHeader(500, {"Content-Type": "text/plain; charset=utf-8",
                                          // todo: change to text/json
                          "Content-Length": errtext.length});
    res.write(errtext);
    res.close();
  }
}

process.mixin(exports,
  {
    addRoutes: addRoutes,
    routes: routes,
    dispatch: dispatch
  }
);
