// Client functions
//
/*global templates: true*/

var polling = (function($) {

  function PollState(noPoll, closedPoll, openPoll) {
    // This ill-named class keeps track of the poll's state.
    this.state=null; // The state of the current poll
    this.uid=0;
    this.noPoll = noPoll;
    this.closedPoll = closedPoll;
    this.openPoll = openPoll;
  }

  PollState.prototype.poll = function() {
    var self = this;
    $.getJSON("/api", {}, function(poll){
      if (poll=="no poll") {
        if (self.state!="nopoll") {
          self.state="nopoll";
          if (typeof self.noPoll == "function") {self.noPoll(poll);}
        }
      } else if (!poll.open) {
        if (self.state!="closed"||self.uid!=poll.uid) {
          self.uid=poll.uid;
          self.state="closed";
          if (typeof self.closedPoll == "function") {self.closedPoll(poll);}
        }
      } else {
        if (self.state!="open"||poll.uid!=self.uid) {
          self.uid=poll.uid;
          self.state="open";
          if (typeof self.openPoll == "function") {self.openPoll(poll);}
        }
      }
    });
  };

  // These are functions that manage the list of saved polls.
  var list = (function() {
    function get(num, cb) {
      // Gets the poll with entry 'num'  or the entire list of polls if there's
      // no 'num'.
      // Returns {title: ..., answers: ["..."] } or a list of such objects.
      if (typeof num == 'function') {
        cb = num;
        num = false;
      }
      $.getJSON("/list", {get: (num !== false)? num : undefined}, cb);
    }

    function del(num, cb) {
      // Deletes the poll with number num. (No sanity checking)
      // Either returns "success" or "fail"
      $.getJSON("/list", {del: num}, cb);
    }

    function save(title, answers, cb) {
      // Adds 'title' and 'answer' to the list.
      // Either returns "success" or "fail"
      $.getJSON("/list", {save: true, title: title, answers: answers}, cb);
    }

    return {
      get: get,
      save: save,
      del: del
    };
  })(); // End list
  return {
    PollState: PollState,
    list: list
  };
})(jQuery);
