var
  sys = require('sys'),
  events = require('events'),
  assert = require('assert');

function Poll(title, answers) {
  // This builds a poll.
  //
  // A poll is:
  //    A list of answers
  //    A list of votes that map keys (IP addresses? cookies?) to answers
  this.title = title;
  this.open = true;
  this.answers = answers;
  this.uid = Math.floor(Math.random()*32767);
  this.votes = {};
}
sys.inherits(Poll, events.EventEmitter);

Poll.prototype.vote = function(key, choice) {
  assert.ok(this.answers.indexOf(choice) != -1, "Voting for an option that doesn't exist!");
  if (!this.open) {
    return false;
  }
  this.votes[key] = choice;
  this.emit("vote", this, key, choice);
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

exports.Poll = Poll;
