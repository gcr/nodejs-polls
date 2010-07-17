// Handles rendering the admin interface
/*global escape: true */
var templates = require('../view/templating'),
    Poll = require('../model/poll'),
    redirect = require('../view/view_helpers').redirect,
    uid = require('./uid'),
    url = require('url');

function pickOne(poll, req, res) {
  return redirect(req, res, "/admin/new");
}

// Curry me!
function newPoll(poll, req, res, errors) {
  var query = url.parse(req.url, true).query || {},
      title = query.title || "",
      answers = query.answers || [];
  // Pre-fill answers
  answers[0] = answers[0] || "Yes";
  answers[1] = answers[1] || "No";
  answers[2] = answers[2] || "";
  answers[3] = answers[3] || "";

  return templates.render('admin_new', {
    title: "Make a new poll",
    student: false,
    errors: errors,
    pollTitle: title,
    pollAnswers: answers,
    hasErrors: errors instanceof Array && errors.length,
    scripts: ["/js/admin_new.js"]
  }, req, res);
}

// Curry me!
function setPoll(req, res) {
  var query = url.parse(req.url, true).query || {},
      title = query.title,
      answers = query.answers.map(function(x) {
          return typeof x == 'string'? x.trim() : '';
        }).filter(function(x) {
          return x.length;
        }),
      errors = [];
  if (typeof title != 'string' || title.length === 0) {
    errors.push("You must set a title.");
  }
  if (!answers instanceof Array || answers.length === 0) {
    errors.push("You must have one or more answers.");
  }
  if (errors.length) {
    return newPoll(null, req, res, errors);
  } else {
    var poll = new Poll.Poll(title, answers);
    redirect(req, res, "/admin/wait");
    return poll;
  }
}

// Curry me!
function waitPoll(poll, req, res) {
  // Redirect the person to where they need to go
  if (!poll) {
    return redirect(req, res, "/admin/new"); //redirected
  } else if (!poll.open) {
    return redirect(req, res, "/admin/results"); //redirected
  }
  var numVotes = 0;
  for (var k in poll.votes) {
      if (poll.votes.hasOwnProperty(k)) {
        numVotes++;
      }
  }
  return templates.render('admin_wait', {
    title: poll.title + " -- Waiting for votes",
    student: false,
    //           !! casts to boolean
    clientVoted: !!poll.myVote(uid.uniqId(req, res)),
    numVotes: numVotes,
    pollTitle: poll.title,
    scripts: ["/js/admin.js"],
    answers: poll.answers.map(function(q) {
    return {
      answer: q,
      url: "/vote?choice=" + escape(q),
      isMyVote: poll.myVote(uid.uniqId(req, res)) == q};
    })
  }, req, res);
}

// Curry me!
function closePoll(poll, req, res) {
  if (!poll) {
    throw new Error("There is no poll to close");
  }
  poll.close();
  redirect(req, res, "/admin/results");
}


function results(poll, req, res) {
  // Redirect the person to where they need to go
  if (!poll) {
    return redirect(req, res, "/admin/new"); //redirected
  }
  if (poll.open) {
    return redirect(req, res, "/admin/wait"); //redirected
  }
  return templates.render('admin_results', {
    title: poll.title + " -- Results",
    student: false,
    //           !! casts to boolean
    clientVoted: !!poll.myVote(uid.uniqId(req, res)),
    pollTitle: poll.title,
    numVotes: poll.numVotes(),
    answers: poll.tally().map(function(x){
        var answer=x[0], votes=x[1];
        return {
          answer: answer,
          percent: poll.numVotes()===0?"0%":((votes/poll.numVotes()*100)+"%"),
          votes: votes,
          isMyVote: poll.myVote(uid.uniqId(req, res))==answer
        };
      }),
    scripts: ["/js/admin.js"]
  }, req, res);
}

exports.newPoll = newPoll;
exports.setPoll = setPoll;
exports.waitPoll = waitPoll;
exports.closePoll = closePoll;
exports.results = results;
exports.pickOne = pickOne;
