// How to render templates

var Mustache = require('./mustache'),
    fs = require('fs'),
    sys = require('sys');


var cached = {};
function loadCached(tplName, cb) {
  if (tplName in cached) {
    cb(cached[tplName]);
  } else {
    fs.readFile('static/'+tplName+'.mustache', function(err,data) {
      cached[tplName] = ""+data;
      cb(cached[tplName]);
    });
  }
}

function render(tplName, view_mixin, req, res) {
  return loadCached('base', function(baseTemplate) {
      var view = {
        title: 'Welcome',
        scripts: ["http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js", 
          "js/mustache.js",
          "js/templating.js",
          "js/polling.js",
          "js/client.js"]
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
                              "Content-Length": text.length});
        res.end(text);
      });
    });
}

exports.render = render;
