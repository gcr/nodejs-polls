// Client functions
//
/*global templates: true*/

var polling = (function($) {

  function Poll(noPoll, closedPoll, openPoll) {
    this.state=null; // The state of the current poll
    this.uid=0;
    this.noPoll = noPoll;
    this.closedPoll = closedPoll;
    this.openPoll = openPoll;
  }

  Poll.prototype.poll = function() {
    // poll for polls! ha!
    var self = this;
    $.getJSON("poll", {}, function(poll){
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

  return {
    Poll: Poll
  };
})(jQuery);
