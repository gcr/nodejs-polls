// Handles rendering templates for the student
var templates = require('../view/templating'),
    redirect = require('../view/view_helpers').redirect;

// Curry me!
function noPoll(poll, req, res) {
  // If the poll is closed, redirect to 'poll_results'
  // If we already voted, redirect to 'voted'
  // If there is a poll, redirect to 'poll'
  // otherwise render the nopoll template
  if (poll) {
    if (!poll.open) {
      return redirect(req, res, 'results');
    } else if (req.headers['x-forwarded-for'] || poll.myVote(req.connection.remoteAddress)) {
      return redirect(req, res, 'voted');
    } else {
      return redirect(req, res, 'poll');
    }
  } else {
    return templates.render('nopoll', {
      student: true
    }, req, res);
  }
}

// Curry me!
function viewPoll(poll, req, res) {
  // If there is no poll, redirect to 'nopoll'
  // If the poll is closed, redirect to 'poll_results'
  // If we already voted, redirect to 'voted'
  // otherwise render the poll template
  if (!poll) {
    return redirect(req, res, 'nopoll');
  } else if (!poll.open) {
    return redirect(req, res, 'results');
  } else if (poll.myVote(req.headers['x-forwarded-for'] || req.connection.remoteAddress)) {
    return redirect(req, res, 'voted');
  } else {
    return templates.render('open_poll', {}, req, res);
  }
}

exports.viewPoll = viewPoll;
exports.noPoll = noPoll;
