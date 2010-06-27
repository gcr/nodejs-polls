// Client functions
//
/*global polling: true, templates: true*/

$(document).ready(function() {

  function getCurrentPage(wp) {
    if (wp.length) {
      return wp.pop() || getCurrentPage(wp);
    }
  }

  var POLL_FREQUENCY=1000,
      // Hacks, sorry
      currentPage = getCurrentPage(window.location.pathname.split("/")),
      pollId=0;

  if (currentPage=="poll" || currentPage=="results") {
    pollId = parseInt($("#pollId").text(),10);
  }

  var watchedPoll = new polling.Poll(
    function noPoll() {
      if (currentPage !== "nopoll") {
        window.location = "/nopoll";
      }
    },

    function closedPoll(poll) {
      if (currentPage !== "results" || poll.uid != pollId) {
        window.location = "/results";
      }
    },

    function openPoll(poll) {
      if (currentPage !== "poll" || poll.uid != pollId) {
        window.location = "/poll";
      }
    }
  );

  ///////////////
  function poll() {
    watchedPoll.poll();
  }

  setInterval(poll, POLL_FREQUENCY);

});
