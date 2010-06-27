// Client functions
//
/*global polling: true, templates: true*/

var student = (function($) {
  function getCurrentPage(wp) {
    if (wp.length) {
      return wp.pop() || getCurrentPage(wp);
    }
  }
  var currentPage = getCurrentPage(window.location.pathname.split("/"));

  var watchedPoll = new polling.Poll(
    function noPoll() {
      console.log("No poll");
    },

    function closedPoll(poll) {
      console.log("Closed poll");
    },

    function openPoll(poll) {
      console.log("Open poll");
    }
  );

  ///////////////
  function poll() {
    watchedPoll.poll();
  }

  return {
    poll: poll,
    watchedPoll: watchedPoll
  };
})(jQuery);
