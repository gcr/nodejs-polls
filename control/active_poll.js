// Manages the active poll

var sys = require('sys'),
    activePoll = null,
    poll = require('poll'),
    renderJson = require('view_helpers').renderJson;

function set(req, res, title, questions) {
  activePoll = new poll.Poll(title, questions);

  return renderJson(req, res, "success");
}

function renderStatus(req, res) {
  if (activePoll) {
    sys.log(sys.inspect(activePoll));
    return renderJson(req, res, activePoll.toJson());
  }
  return renderJson(req, res, {});
}

function get() {
  return activePoll;
}

exports.set = set;
exports.get = get;
exports.renderStatus = renderStatus;
