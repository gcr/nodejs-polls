var
  http        = require('http'),
  routes      = require('./routes'),
  staticFiles = require('./static'),
  PORT        = 8080;

routes.addRoutes(
  {
    // Default page.
    // http://localhost:8080/
    '': staticFiles.makeFileServer("server/static/index.htm"),
    'css': staticFiles.makeFileServer("server/static/css"),
    'js': staticFiles.makeFileServer("server/static/js")

    //'matches': matchViews.makeMatchListViews(matches)

  }
);
http.createServer(routes.dispatch).listen(PORT);

