// Handles rendering templates for the student
var templates = require('../view/templating'),
    redirect = require('../view/view_helpers').redirect,
    uniqId = require('./uid').uniqId,
    url = require('url');

function thisIs(req, res, poll, urlname) {
  // This function directs the student to the correct URL based on a hardcoded
  // set of conditions. Returns 'true' if this is the correct URL, or 'false'
  // if the client was redirected.
  // Side effects: redirects client if needed.
  if (poll) {
    if (poll.open) {
      // Open, existing poll
      return urlname=='poll'? true : redirect(req, res, 'poll');
    } else {
      // Finished poll
      return urlname=='results'? true :  redirect(req, res, 'results');
    }
  } else {
    // No poll open
    return urlname=='nopoll'? true : redirect(req, res, 'nopoll');
  }
}

function pickOne(poll, req, res) {
  return thisIs(req, res, poll, 'nothing');
}

// Curry me!
function noPoll(poll, req, res) {
  // We need to send the person to the right spot, se let's redirect
  // him/her everywhere.
  if (!thisIs(req, res, poll, 'nopoll')) {
    return; //redirected
  }
  return templates.render('nopoll', {
    student: true,
    scripts: ["/js/student.js"]
  }, req, res);
}

// Curry me!
function viewPoll(poll, req, res) {
  // Redirect the person to where they need to go
  if (!thisIs(req, res, poll, 'poll')) {
    return; //redirected
  }
  return templates.render('open_poll', {
    student: true,
    scripts: ["/js/student.js"],
    //           !! casts to boolean
    clientVoted: !!poll.myVote(uniqId(req, res)),
    answers: poll.answers.map(function(q) {
    return {
      answer: q,
      isMyVote: poll.myVote(uniqId(req, res)) == q};
    })
  }, req, res);
}

// Curry me!
function pollResults(poll, req, res) {
  // Redirect the person to where they need to go
  if (!thisIs(req, res, poll, 'results')) {
    return; //redirected
  }
  // map answers to both text and whether that's my vote or not.
  var tally = poll.tally(), resultTally = [];
  for (var answer in tally) {
      if (tally.hasOwnProperty(answer)) {
        resultTally.push({
          answer: answer,
          votes: tally[answer],
          isMyVote: poll.myVote(uniqId(req, res))==answer
        });
      }
  }
  return templates.render('results', {
    student: true,
    scripts: ["/js/student.js"],
    //           !! casts to boolean
    clientVoted: !!poll.myVote(uniqId(req, res)),
    answers: resultTally
  }, req, res);
}

// Curry me!
function vote(poll, req, res) {
  // Vote in a poll from an IP
  if (poll) {
    poll.vote(uniqId(req, res),
      (url.parse(req.url, true).query || {}).choice
    );
    return redirect(req, res, "poll");
  } else {
    return redirect(req, res, "nopoll");
  }
}


exports.viewPoll = viewPoll;
exports.noPoll = noPoll;
exports.pollResults = pollResults;
exports.pickOne = pickOne;
exports.vote = vote;
