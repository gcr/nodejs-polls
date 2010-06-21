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
  sys.log(json);
  res.writeHead(status||200, {"Content-Type": "text/plain; charset=utf-8",
                                        // todo: change to text/json
                        'Cache-Control': 'no-cache',
                        "Content-Length": json.length});
  res.end(json);
}

// Want to just plug something into your switchboard and be off straightaway?
function curryJsonRender(obj) {
  return function(req, res) {
    renderJson(req, res, obj);
  };
}

function booleanize(m) {
  if (typeof m == 'string') {
    return (["", "n", "nil", "null", "undefined", "no", "f", "false"].indexOf(m.toLowerCase()) != -1);
  } else {
    return Boolean(m);
  }
}

function curry(func, opt) {
  return function() {
    var args=[opt];
    for (var i=0,l=arguments.length; i<l; i++) {
        args.push(arguments[i]);
    }
    return func.apply(this, args);
  };
}

function redirect(req, res, url) {
  // Redirects client to a new happy place with a 302. Also returns false.
  var body = '<!DOCTYPE HTML><html lang="en"><head><meta charset="UTF-8"><title>Redirect</title></head><body>Please see <a href="'+url+'">'+url+'</a></body></html>';
  res.writeHead(302, {"Location": url,
                      'Cache-Control': 'no-cache',
                      "Content-Length": body.length});
  res.end(body);
  return false;
}

function curryRedirect(url) {
  return function(req, res) {
    redirect(req, res, url);
  };
}

exports.renderJson       = renderJson;
exports.curryJsonRender  = curryJsonRender;
exports.booleanize       = booleanize;
exports.curry            = curry;
exports.redirect         = redirect;
exports.curryRedirect    = curryRedirect;
