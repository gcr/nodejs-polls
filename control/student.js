// Handles rendering templates for the student
var templates = require('../view/templating'),
    redirect = require('../view/view_helpers').redirect;

// Curry me!
function viewPoll(poll, req, res) {
  // If there is no poll, redirect to 'nopoll'
  // If the poll is closed, redirect to 'poll_results'
  // If we already voted, redirect to 'voted'
  // otherwise render the poll template
  if (!poll) {
    return redirect(req, res, 'nopoll');
  } else if (!poll.open) {
    return redirect(req, res, 'poll_results');
  } else if (poll.myVote(req.connection.remoteAddress)) {
    return redirect(req, res, 'voted');
  } else {
    return null; //TODO
  }
}

exports.viewPoll = viewPoll;
