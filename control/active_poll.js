// Manages the active poll

var sys = require('sys'),
    poll = require('poll'),
    renderJson = require('view_helpers').renderJson,
    activePoll = null;

function set(req, res, title, questions) {
  activePoll = new poll.Poll(title, questions);

  return renderJson(req, res, "success");
}

function renderStatus(req, res) {
  if (activePoll) {
    sys.log(sys.inspect(activePoll));
    var result = activePoll.toJson();
    result.my_vote = activePoll.myVote(req.connection.remoteAddress) || false;
    return renderJson(req, res, result);
  }
  return renderJson(req, res, "no poll");
}

function get() {
  return activePoll;
}

exports.set = set;
exports.get = get;
exports.renderStatus = renderStatus;
