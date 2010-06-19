// Handles rendering templates for the student
var templates = require('../view/templating'),
    redirect = require('../view/view_helpers').redirect;

// Curry me!
function noPoll(poll, req, res) {
  // We need to send the person to the right spot, se let's redirect
  // him/her everywhere.
  if (poll) {
    if (!poll.open) {
      return redirect(req, res, 'results');
    } else {
      return redirect(req, res, 'poll');
    }
  } else {
    return templates.render('nopoll', {
      student: true,
      scripts: ["/js/student.js"]
    }, req, res);
  }
}

// Curry me!
function viewPoll(poll, req, res) {
  // Redirect the person to where they need to go
  if (!poll) {
    return redirect(req, res, 'nopoll');
  } else if (!poll.open) {
    return redirect(req, res, 'results');
  } else {
    return templates.render('open_poll', {
      student: true,
      scripts: ["/js/student.js"],
      //           !! casts to boolean
      clientVoted: !!poll.myVote(req.headers['x-forwarded-for']),
      questions: poll.mapMyVote(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    }, req, res);
  }
}

// Curry me!
function pollResults(poll, req, res) {
  // Redirect the person to where they need to go
  if (!poll) {
    return redirect(req, res, 'nopoll');
  } else if (!poll.open) {
    return templates.render('results', {
      student: true,
      scripts: ["/js/student.js"],
      //           !! casts to boolean
      clientVoted: !!poll.myVote(req.headers['x-forwarded-for']),
      questions: poll.mapMyVote(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    }, req, res);
  } else {
    return redirect(req, res, 'poll');
  }
}



exports.viewPoll = viewPoll;
exports.noPoll = noPoll;
exports.pollResults = pollResults;
