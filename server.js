var
  http        = require('http'),
  sys         = require('sys'),
  routes      = require('./routes'),
  staticFiles = require('./static'),
  PORT        = 8080,
  count=0;

sys.log("Starting up...");
routes.addRoutes(
  {
    // Default page.
    // http://localhost:8080/
    '': staticFiles.makeFileServer("static/index.htm"),
    'css': staticFiles.makeFileServer("static/css"),
    'js': staticFiles.makeFileServer("static/js"),
    'foo': function(req, res) {
      res.writeHead(200);
      res.end(""+(count+1));
      count = count + 1;
    }

    //'matches': matchViews.makeMatchListViews(matches)

  }
);
http.createServer(routes.dispatch).listen(PORT);

