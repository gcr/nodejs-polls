// How to render templates

var Mustache = require('./mustache'),
    fs = require('fs'),
    sys = require('sys'),
    CACHE_TIMEOUT = 1000 * 60 * 20; // 20min

var cached = {},
    timers = {};

function loadCached(tplName, cb) {
  function expire() {
    sys.log("Expiring '" + tplName + "' from template cache...");
    delete cached[tplName];
    delete timers[tplName];
  }
  if (tplName in cached) {
    // Reset the expiration timer and send
    clearTimeout(timers[tplName]);
    timers[tplName] = setTimeout(expire, CACHE_TIMEOUT);
    cb(cached[tplName]);
  } else {
    fs.readFile('static/'+tplName+'.mustache', function(err,data) {
      cached[tplName] = ""+data;
      cb(cached[tplName]);
      // Set the cache expiration timer
      timers[tplName] = setTimeout(expire, CACHE_TIMEOUT);
    });
  }
}

function render(tplName, view_mixin, req, res) {
  return loadCached('base', function(baseTemplate) {
      var view = {
        title: 'Welcome',
        scripts: []
      };
      for (var k in view_mixin) {
          if (view_mixin.hasOwnProperty(k)) {
              view[k] = view_mixin[k];
          }
      }
      // partials
      view.body = view;

      return loadCached(tplName, function(tplText) {
        var text = Mustache.to_html(baseTemplate,
          view, {'body': tplText});
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8",
                                              // todo: change to text/json
                              'Cache-Control': 'no-cache, must-revalidate',
                              'Expires': 'Mon, 20 Dec 1998 01:00:00 GMT',
                              'Last-Modified': new Date().toUTCString(),
                              'Pragma': 'no-cache',
                              "Content-Length": text.length});
        res.end(text);
      });
    });
}

exports.render = render;
