// Handles voting from IP addresses
var activePoll = require('active_poll'),
    renderJson = require('view_helpers').renderJson;

function close(req, res) {
  // Close the current poll
  activePoll.get().close();
  return renderJson(req, res, "success");
}

function vote(req, res, choice) {
  // Vote in a poll from an IP
  activePoll.get().vote(req.connection.remoteAddress, choice);
  return renderJson(req, res, "success");
}

exports.vote = vote;
