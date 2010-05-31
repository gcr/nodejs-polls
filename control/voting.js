// Handles voting from IP addresses
var activePoll = require('./active_poll'),
    renderJson = require('./../view/view_helpers').renderJson;

function close(req, res) {
  // Close the current poll
  var poll = activePoll.get();
  if (poll) {
    return renderJson(req, res, poll.close()?"success":"fail");
  } else {
    return renderJson(req, res, "no poll");
  }
}

function vote(req, res, choice) {
  // Vote in a poll from an IP
  var poll = activePoll.get();
  if (poll) {
    return renderJson(req, res, poll.vote(req.connection.remoteAddress, choice)?"success":"fail");
  } else {
    return renderJson(req, res, "no poll");
  }
}

exports.vote = vote;
exports.close = close;
