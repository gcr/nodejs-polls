// How to render templates
/*global Mustache: true*/

var templates = (function() {

  var cached = {};

  function render(tplName, view) {
    function reallyRender(template) {
      $("body").html(Mustache.to_html(template, view));
    }

    if (tplName in cached) {
      reallyRender(cached[tplName]);
    } else {
      $.get("js/"+tplName+".mustache", {}, function(data) {
        cached[tplName] = data;
        reallyRender(cached[tplName]);
      }, "text");
    }
  }

  return {
    render: render
  };

})();
