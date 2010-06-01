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
      console.log("Poll closed!", poll);
    }
  }

  function openPoll(poll) {
    if (state!="open"||poll.uid!=uid) {
      uid=poll.uid;
      state="open";

      var questions=[];
      for (var k in poll.votes) {
          if (poll.votes.hasOwnProperty(k)) {
              questions.push({q:k});
          }
      }
      var view = {
        title: poll.title,
        open: poll.open,
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
