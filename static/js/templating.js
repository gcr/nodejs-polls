// How to render templates
/*global Mustache: true*/

var templates = (function() {

  var cached = {};

  function render(tplName, view, cb) {
    function reallyRender(template) {
      console.log(view);
      $("body").html(Mustache.to_html(template, view));
      return typeof cb == 'function'?cb():null;
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
