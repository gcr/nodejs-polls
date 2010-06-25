// Manages the active poll

var sys = require('sys'),
    Poll = require('./../model/poll'),
    renderJson = require('./../view/view_helpers').renderJson,
    uniqId = require('./uid').uniqId,
    redirect = require('./../view/view_helpers').redirect;

function set(req, res, ignore, title, answers) {
  var poll = new Poll.Poll(title, answers);
  renderJson(req, res, "success");
  return poll;
}

function renderStatus(poll, req, res) {
  if (poll) {
    var result = poll.toJson();
    result.my_vote = poll.myVote(uniqId(req, res)) || false;
    return renderJson(req, res, result);
  }
  return renderJson(req, res, "no poll");
}

exports.set = set;
exports.renderStatus = renderStatus;
