// routes.js -- routing table
var
  url           = require('url'),
  sys           = require('sys'),
  switchboard   = require('./switchboard'),
  staticFiles   = require('./static'),
  routes        = {};

function addRoutes(newRoutes) {
  for (var route in newRoutes) {
      if (newRoutes.hasOwnProperty(route)) {
          routes[route] = newRoutes[route];
      }
  }
  return routes;
}


// Use this function to do things from our HTTP server.
function dispatch(req, res) {
  try {
    switchboard.dispatch(req, res,
      url.parse(req.url).pathname,
      routes);
  } catch(err) {
    sys.log("Exception! URL: " + req.url + "\n\n" + (err.stack || sys.inspect(err)));
    var errtext = "Internal server error.";
    res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8",
                          "Content-Length": errtext.length});
    res.end(errtext);
  }
}

exports.addRoutes = addRoutes;
exports.routes = routes;
exports.dispatch = dispatch;
