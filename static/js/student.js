// Client functions
//
/*global polling: true, templates: true*/

var student = (function($) {

  var POLL_FREQUENCY = 1000;

  function getCurrentPage(wp) {
    if (wp.length) {
      return wp.pop() || getCurrentPage(wp);
    }
  }
  var currentPage = getCurrentPage(window.location.pathname.split("/"));
  console.log(currentPage);

  var watchedPoll = new polling.Poll(
    function noPoll() {
      if (currentPage !== "nopoll") {
        window.location = "/nopoll";
      }
    },

    function closedPoll(poll) {
      if (currentPage !== "results") {
        window.location = "/results";
      }
    },

    function openPoll(poll) {
      if (currentPage !== "poll") {
        window.location = "/poll";
      }
    }
  );

  ///////////////
  function poll() {
    watchedPoll.poll();
  }

  setInterval(poll, POLL_FREQUENCY);

  return {
    poll: poll,
    watchedPoll: watchedPoll
  };
})(jQuery);
