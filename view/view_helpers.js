var 
  switchboard = require('./switchboard'),
  url         = require('url'),
  sys         = require('sys');

// Auxilary functions
function renderJson(req, res, obj, status) {
  var json;
  var query = url.parse(req.url, true).query || {};
  if (typeof obj == 'undefined') {
    json = JSON.stringify(null);
  } else {
    json = JSON.stringify(obj);
  }
  if ('jsonp' in query || 'callback' in query) {
      json = (query.jsonp || query.callback) + "(" + json + ")\n";
  } else {
    json = json + "\n";
  }
  sys.puts(json);
  res.writeHead(status||200, {"Content-Type": "text/plain; charset=utf-8",
                                        // todo: change to text/json
                        "Content-Length": json.length});
  res.end(json);
}

// Want to just plug something into your switchboard and be off straightaway?
function makeJsonRenderer(obj) {
  return function(req, res) {
    renderJson(req, res, obj);
  };
}

function randChoice(arr) {
  // Return something random out of us
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildUuid(size) {
  // Builds a unique string of length size
  var result = [];
  for (var i=0; i<size; i++) {
    result.push(randChoice("bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789"));
  }
  return result.join("");
}

function booleanize(m) {
  if (typeof m == 'string') {
    return (["", "n", "nil", "null", "undefined", "no", "f", "false"].indexOf(m.toLowerCase()) != -1);
  } else {
    return Boolean(m);
  }
}

function curry(opt, func) {
  return function() {
    return func.apply(this, [opt]+arguments);
  };
}

function redirect(req, res, url) {
  var body = '<!DOCTYPE HTML><html lang="en"><head><meta charset="UTF-8"><title>Redirect</title></head><body><a href="'+url+'">'+url+'</a></body></html>';
  res.writeHead(302, {"Location": url,
                      "Content-Length": body.length});
  res.end(body);
}

exports.renderJson       = renderJson;
exports.makeJsonRenderer = makeJsonRenderer;
exports.buildUuid        = buildUuid;
exports.randChoice       = randChoice;
exports.booleanize       = booleanize;
exports.curry            = curry;
exports.redirect         = redirect;
