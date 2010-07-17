var
  sys = require('sys'),
  events = require('events'),
  assert = require('assert');

// Poor man's logging. This should be done much better.
var LOGGING = true,
    log = LOGGING? sys.log : function(n){};

function Poll(title, answers) {
  // This builds a poll.
  //
  // A poll is:
  //    A list of answers
  //    A list of votes that map keys (IP addresses? cookies?) to answers
  log("New poll: " + title + " -- " + sys.inspect(answers));
  this.title = title;
  this.open = true;
  this.answers = answers;
  this.uid = Math.floor(Math.random()*32767);
  this.votes = {};
}
sys.inherits(Poll, events.EventEmitter);

Poll.prototype.vote = function(key, choice) {
  assert.ok(this.answers.indexOf(choice) != -1, "Voting for " + choice + " but that isn't an option.");
  if (!this.open) {
    return false;
  }
  this.votes[key] = choice;
  this.emit("vote", this, key, choice);
  log(key + " just voted for " + choice);
  return true;
};

Poll.prototype.voted = function(key) {
  return key in this.votes;
};

Poll.prototype.toJson = function() {
  return {
    'title': this.title,
    'open': this.open,
    'uid': this.uid,
    'votes': this.tally()
  };
};

Poll.prototype.close = function() {
  this.open = false;
  this.emit("closed", this);
  log("Poll closed: " + this.title);
  return true;
};

Poll.prototype.tally = function() {
  var result = {};
  for (var i=0,l=this.answers.length; i<l; i++) {
      result[this.answers[i]] = 0;
  }
  for (var key in this.votes) {
    if (this.votes.hasOwnProperty(key)) {
      result[this.votes[key]] = result[this.votes[key]]+1;
    }
  }
  return result;
};

Poll.prototype.myVote = function(key) {
  return this.votes[key];
};

Poll.prototype.numVotes = function() {
  var count=0;
  for (var k in this.votes) {
    if (this.votes.hasOwnProperty(k)) {
      count++;
    }
  }
  return count;
};

exports.Poll = Poll;
