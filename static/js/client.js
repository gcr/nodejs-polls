// Client functions
//
/*global polling: true, templates: true*/

var client = (function($) {
  var watchedPoll = new polling.Poll(
    function noPoll() {
      templates.render("nopoll");
    },

    function closedPoll(poll) {
      var answers=[];
      for (var k in poll.votes) {
          if (poll.votes.hasOwnProperty(k)) {
              answers.push({text:k,votes:poll.votes[k]});
          }
      }
      var view = {
        title: poll.title,
        answers: answers
      };
      templates.render("closed_poll",view);
    },

    function openPoll(poll) {
      var answers=[];
      for (var k in poll.votes) {
          if (poll.votes.hasOwnProperty(k)) {
              answers.push({text:k,my_vote:poll.my_vote==k});
          }
      }
      var view = {
        title: poll.title,
        answers: answers
      };
      templates.render("open_poll",view);
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
