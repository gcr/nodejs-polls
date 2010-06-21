var
// AUX
  http          = require('http'),
  sys           = require('sys'),
  routes        = require('./view/routes'),
// View helpers
  staticFiles   = require('./view/static'),
  curry         = require('./view/view_helpers').curry,
  curryRedirect = require('./view/view_helpers').curryRedirect,
  switchboard   = require("./view/switchboard"),
// Controllers
  student       = require('./control/student'),
  voting        = require('./control/voting'),
  poll          = require('./control/poll'),
  pollListCtl   = require('./control/poll_list'),
// Models
  pl            = require('./model/poll_list'),
  ap            = require('./model/active_poll'),
  activePoll    = new ap.Container(),
  plist         = new pl.PollList('saved_polls.json'),
// Settings
  PORT          = 8001;

// Some notes. We'll need some sort of very simple RPC system.
// Server: Designed to be seen in-class
//   Create a new poll. Either "Save" it for later or "Open" a poll.
//       Also present a list of prepared questions:
//          "Use" a poll or
//          "Delete" it
//   Then comes the "Waiting for votes..." screen
//     Constantly polls and displays the total number of votes
//     Will ask to end the poll
//   Then the "Poll Results" screen.
//     Buttons to create a new poll
//
// Voter:
//   Just one "open" question at a time.
//   It will constantly poll the poll status. If it sees that it's already
//     voted, then it will gray out the buttons. If it sees that the poll is
//     closed, it will display a graph of results.
//     Poll twice a second.
//     Sends a "vote" request. Server keeps IPs hashed against votes. May send
//     success or failure.

sys.log("Starting up...");
routes.addRoutes(
  {
    '': activePoll.curryGet(student.pickOne),
    // Send users to the correct spot

    'css': staticFiles.makeFileServer("static/css"),
    'js': staticFiles.makeFileServer("static/js"),
    'img': staticFiles.makeFileServer("static/img"),

    'poll': activePoll.curryGet(student.viewPoll),
    'nopoll': activePoll.curryGet(student.noPoll),
    'vote': null,
    'results': activePoll.curryGet(student.pollResults),

    'debug': function(req, res) {
      sys.log("Dumping poll state at remote's request");
      sys.puts(sys.inspect(activePoll.get()));
      res.writeHead(500); res.end();
    },

    'api': switchboard.makeDispatchQueryOverloader(
      ['vote'],
      activePoll.curryGet(voting.vote),
      ['close'],
      activePoll.curryGet(voting.close),
      ['set', 'title', 'answers'],
      activePoll.currySet(poll.set),
      [],
      activePoll.curryGet(poll.renderStatus)
    ),

    'list': switchboard.makeDispatchQueryOverloader(
      ['get'],
      curry(pollListCtl.get, plist),
      ['del'],
      curry(pollListCtl.del, plist),
      ['save', 'title', 'answers'],
      curry(pollListCtl.add, plist),
      [],
      curry(pollListCtl.get, plist)
    )

  }
);
http.createServer(routes.dispatch).listen(PORT);

