// Admin wait
// Redraws the "How many votes do we have" counter
/*global polling: true*/

$(document).ready(function() {
  var POLL_FREQUENCY=1000; // change in student.js too

  var watchedState = new polling.PollState(
    0,
    function noPoll() {
      window.location = "/admin/new";
    },

    function closedPoll() {
      window.location = "/admin/results";
    },

    function openPoll(poll) {
      $(".poll_wait").text("").append(
        $("<span>").text("We have ")
      ).append(
        $("<span>", {'class': 'numvotes'}).text(""+poll.numVotes)
      ).append(
        $("<span>").text(" vote" + (poll.numVotes==1?"":"s"))
      );
    }
  );

  function poll() {
    watchedState.poll();
  }

  setInterval(poll, POLL_FREQUENCY);

  });
