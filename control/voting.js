// Handles voting from IP addresses
var renderJson = require('./../view/view_helpers').renderJson;

// Curry me!
function close(poll, req, res) {
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
  if (poll) {
    return renderJson(req, res, poll.vote(req.connection.remoteAddress, choice)?"success":"fail");
  } else {
    return renderJson(req, res, "no poll");
  }
}

exports.vote = vote;
exports.close = close;
