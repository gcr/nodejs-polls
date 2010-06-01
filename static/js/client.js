// Client functions
//
/*global templates: true*/

var client = (function() {
  var state=null, // The state of the current poll
      uid=0;

  function noPoll() {
    if (state!="nopoll") {
      state="nopoll";
      templates.render("nopoll");
    }
  }

  function closedPoll(poll) {
    if (state!="closed"||poll.uid!=uid) {
      uid=poll.uid;
      state="closed";
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
    }
  }

  function openPoll(poll) {
    if (state!="open"||poll.uid!=uid) {
      uid=poll.uid;
      state="open";

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
    if (poll.my_vote) {
      console.log("I voted", poll);
    } else {
      console.log("I didn't vote");
    }
  }

  ///////////////
  function poll() {
    // poll for polls! ha!
    $.getJSON("poll", {}, function(poll){
      if (poll=="no poll") {
        noPoll();
      } else if (!poll.open) {
        closedPoll(poll);
      } else {
        openPoll(poll);
      }
    });
  }

  return {
    poll: poll
  };
})();
