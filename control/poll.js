// Manages the active poll

var sys = require('sys'),
    assert = require('assert'),
    Poll = require('./../model/poll'),
    renderJson = require('./../view/view_helpers').renderJson,
    uid = require('./uid'),
    redirect = require('./../view/view_helpers').redirect;

function set(req, res, ignore, title, answers) {
  uid.verifyUidExists(req, res);
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
  uid.verifyUidExists(req, res);
  if (poll) {
    var result = poll.toJson();
    result.my_vote = poll.myVote(uid.uniqId(req, res)) || false;
    return renderJson(req, res, result);
  }
  return renderJson(req, res, "no poll");
}

exports.set = set;
exports.renderStatus = renderStatus;
