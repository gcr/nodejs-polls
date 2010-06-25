// This module is for calculating a 'unique ID' for users.

var cookie = require('../view/cookie-node/'), // HAS SIDE-EFFECTS: tampers with http
    buildUuid = require('../view/view_helpers').buildUuid,
    sys = require('sys');

function uniqId(req, res) {
  // Gets or sets a unique ID for the user.
  // Side effects: sets a cookie if the user doesn't already have an ID.
  var id = req.getCookie('uid');
  if (!id) {
    id = buildUuid(15);
    res.setCookie('uid', id);
    sys.log("New user with IP " + (req.headers['x-forwarded-for']||req.connection.remoteAddress) + " has new cookie " + id);

    // Bad form, but we need to set the cookie in the *request* also, as this
    // function may be called multiple times per page, but getCookie won't be
    // seen.
    req.cookies.uid = id;
  }
  // Some sneakster *could* set his cookie to somebody else's, so we'll
  // concatenate his IP to the cookie just in case.
  return id + (req.headers['x-forwarded-for']||req.connection.remoteAddress);
}

exports.uniqId = uniqId;
