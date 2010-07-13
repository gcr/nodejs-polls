// Handles voting from IP addresses
var renderJson = require('./../view/view_helpers').renderJson,
    uid = require('./uid'),
    Poll = require('./../model/poll'),
    assert = require('assert');

// Curry me!
function close(poll, req, res) {
  uid.pokeUid(req, res);
  // Close the current poll
  if (poll) {
    return renderJson(req, res, poll.close()?"success":"fail");
  } else {
    return renderJson(req, res, "no poll");
  }
}

// Curry me!
function vote(poll, req, res, choice) {
  // Vote in a poll from an IP
  if (poll && uid.hasId(req, res)) {
    return renderJson(req, res, poll.vote(uid.uniqId(req, res), choice)?"success":"fail");
  } else {
    return renderJson(req, res, "no poll");
  }
}

function set(req, res, title, answers) {
  uid.pokeUid(req, res);
  answers = answers.filter(function(x) {
      return typeof x == 'string' && x.length;
    });
  assert.ok(typeof title == 'string' && title.length > 0, "You must set a title.");
  assert.ok(answers instanceof Array && answers.length > 0, "You must have one or more answers.");
  var poll = new Poll.Poll(title, answers);
  renderJson(req, res, "success");
  return poll;
}

function renderStatus(poll, req, res) {
  uid.pokeUid(req, res);
  if (poll) {
    var result = poll.toJson();
    result.my_vote = poll.myVote(uid.uniqId(req, res)) || false;
    return renderJson(req, res, result);
  }
  return renderJson(req, res, "no poll");
}

exports.vote = vote;
exports.close = close;
exports.set = set;
exports.renderStatus = renderStatus;
