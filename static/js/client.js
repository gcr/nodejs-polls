// Client functions
//

var client = (function() {
  var state=null, // The state of the current poll
      uid=0;

  function noPoll() {
    if (state!="nopoll") {
      state="nopoll";
      console.log("No poll!");
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
      console.log("Poll open!", poll);
    }
    if (poll.my_vote) {
      console.log("I voted", poll);
    } else {
      console.log("I didn't vote");
    }
  }

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
