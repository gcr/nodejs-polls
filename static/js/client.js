// Client functions
//
/*global polling: true, templates: true*/

var client = (function() {
  var watchedPoll = new polling.Poll(
    function noPoll() {
      templates.render("nopoll");
    },

    function closedPoll(poll) {
      var questions=[];
      for (var k in poll.votes) {
          if (poll.votes.hasOwnProperty(k)) {
              questions.push({text:k,votes:poll.votes[k]});
          }
      }
      var view = {
        title: poll.title,
        questions: questions
      };
      templates.render("closed_poll",view);
    },

    function openPoll(poll) {
      var questions=[];
      for (var k in poll.votes) {
          if (poll.votes.hasOwnProperty(k)) {
              questions.push({text:k,my_vote:poll.my_vote==k});
          }
      }
      var view = {
        title: poll.title,
        questions: questions
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
})();
