// Functions of interest to drawing the client.
/*global Mustache: true*/

var client = (function() {

  var openPollTemplate="";
  function renderOpenPoll(poll) {
    function reallyRender() {
      $("body").html(Mustache.to_html(openPollTemplate, poll));
    }

    if (openPollTemplate) {
      reallyRender();
    } else {
      $.get("js/open_poll.mustache", {}, function(data) {
        openPollTemplate = data;
        reallyRender();
      }, "text");
    }
  }

  return {
    renderOpenPoll: renderOpenPoll
  };

})();
