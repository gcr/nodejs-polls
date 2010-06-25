// Handles rendering the admin interface
/*global escape: true */
var templates = require('../view/templating'),
    Poll = require('../model/poll'),
    redirect = require('../view/view_helpers').redirect,
    uniqId = require('./uid').uniqId,
    url = require('url');

function thisIs(req, res, poll, urlname) {
  // See student.thisIs()
  // Side effects: redirects client if needed.
  if (poll && poll.open) {
    // Open, existing poll
    return urlname=='wait'? true : redirect(req, res, '/admin/wait');
  } else {
    // Either waiting on results or creating a new poll.
    return urlname=='new'? true : redirect(req, res, '/admin/new');
  }
}

function pickOne(poll, req, res) {
  return thisIs(req, res, poll, 'nothing');
}

// Curry me!
function newPoll(poll, req, res) {
  // We need to send the person to the right spot, se let's redirect
  // him/her everywhere.
  if (!thisIs(req, res, poll, 'new')) {
    return; //redirected
  }
  return templates.render('admin_new', {
    student: true,
    scripts: ["/js/student.js"]
  }, req, res);
}

// Curry me!
function setPoll(req, res) {
  var query = url.parse(req.url, true).query || {},
      title = query.title,
      answers = query.answers;
  if (!title) {
    throw new Error("You must have a title");
  }
  if (!answers || !answers.length) {
    throw new Error("You must have one or more answers");
  }
  var poll = new Poll.Poll(title, answers);
  redirect(req, res, "/admin/wait");
  return poll;
}

// Curry me!
function waitPoll(poll, req, res) {
  // Redirect the person to where they need to go
  if (!thisIs(req, res, poll, 'wait')) {
    return; //redirected
  }
  var numVotes = 0;
  for (var k in poll.votes) {
      if (poll.votes.hasOwnProperty(k)) {
        numVotes++;
      }
  }
  return templates.render('admin_wait', {
    student: true,
    scripts: ["/js/student.js"],
    //           !! casts to boolean
    clientVoted: !!poll.myVote(uniqId(req, res)),
    numVotes: numVotes,
    pollTitle: poll.title,
    answers: poll.answers.map(function(q) {
    return {
      answer: q,
      url: "/vote?choice=" + escape(q),
      isMyVote: poll.myVote(uniqId(req, res)) == q};
    })
  }, req, res);
}

////////////////////////////////////
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
    pollTitle: poll.title,
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


exports.newPoll = newPoll;
exports.setPoll = setPoll;
exports.waitPoll = waitPoll;
exports.pollResults = pollResults;
exports.pickOne = pickOne;
exports.vote = vote;
