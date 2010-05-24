require.paths.push("./model");
require.paths.push("./view");
require.paths.push("./controller");
var
  http        = require('http'),
  sys         = require('sys'),
  routes      = require('routes'),
  staticFiles = require('static'),
  PORT        = 8080,
  count=0;

// Some notes. We'll need some sort of very simple RPC system.
// Server:
//   List of prepared questions
//       "Create new" either makes a question or adds it to the prepared
//       questions
//       "Edit" a prepared question
//       Save it to db or files! Probably files
//   Then the "Waiting for votes..." screen
//     Constantly polls for number of votes
//     Will ask to end the poll
//   Then the "Poll Results" screen.
//     Buttons to create a new poll
//
// Voter:
//   Just one "open" question at a time.
//   It will constantly poll the poll status. If it sees that it's already
//     voted, then it will gray out the buttons. If it sees that the last open
//     poll has results, then it will simply use those.
//     Sends a "vote" request. Server keeps IPs hashed against votes. May send
//     success or failure.
//

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

