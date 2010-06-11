// How to render templates

var Mustache = require('./mustache'),
    fs = require('fs');


var cached = {};

function sendTemplate(tplName, view, req, res) {
  function reallyRender(template) {
    var text = Mustache.to_html(template, view);

    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8",
                                          // todo: change to text/json
                          "Content-Length": text.length});
    res.end(text);
  }

  if (tplName in cached) {
    reallyRender(cached[tplName]);
  } else {
    fs.readFile('static/'+tplName+'.mustache', function(data) {
      cached[tplName] = data;
      reallyRender(cached[tplName]);
    });
  }
}

exports.sendTemplate = sendTemplate;
