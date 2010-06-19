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
      clientVoted: !!poll.myVote(req.headers['x-forwarded-for']||req.connection.remoteAddress),
      answers: poll.answers.map(function(q) {
      return {
        answer: q,
        isMyVote: poll.myVote(req.headers['x-forwarded-for']||req.connection.remoteAddress) == q};
      })
    }, req, res);
  }
}

// Curry me!
function pollResults(poll, req, res) {
  // Redirect the person to where they need to go
  if (!poll) {
    return redirect(req, res, 'nopoll');
  } else if (!poll.open) {
    // map answers to both text and whether that's my vote or not.
    var tally = poll.tally(), resultTally = [];
    for (var answer in tally) {
        if (tally.hasOwnProperty(answer)) {
          resultTally.push({
            answer: answer,
            votes: tally[answer],
            isMyVote: poll.myVote(req.headers['x-forwarded-for']||req.connection.remoteAddress)==answer
          });
        }
    }
    return templates.render('results', {
      student: true,
      scripts: ["/js/student.js"],
      //           !! casts to boolean
      clientVoted: !!poll.myVote(req.headers['x-forwarded-for']||req.connection.remoteAddress),
      answers: resultTally
    }, req, res);
  } else {
    return redirect(req, res, 'poll');
  }
}



exports.viewPoll = viewPoll;
exports.noPoll = noPoll;
exports.pollResults = pollResults;
