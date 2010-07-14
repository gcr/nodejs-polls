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
      pollId=0; // pollId is used to verify that the poll didn't change.

  if (currentPage=="poll" || currentPage=="results") {
    // How do we get the poll ID? Why, in a hidden <div/> of course!
    // Sorry, but the only other option is AJAX, which has threading issues
    // because we need to ensure the poll won't change between the time when the
    // user gets the page and the teacher changes the question.
    pollId = parseInt($("#pollId").text(),10);
  }

  var watchedPollState = new polling.PollState(
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
    watchedPollState.poll();
  }

  setInterval(poll, POLL_FREQUENCY);

});
