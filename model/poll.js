var
  sys = require('sys'),
  events = require('events'),
  assert = require('assert');

function Poll(title, questions) {
  // This builds a poll.
  //
  // A poll is:
  //    A list of questions
  //    A list of votes that map keys (IP addresses? cookies?) to questions
  this.title = title;
  this.open = true;
  this.questions = questions;
  this.votes = {};
}
sys.inherits(Poll, events.EventEmitter);

Poll.prototype.vote = function(key, choice) {
  assert.ok(this.questions.indexOf(choice) != -1, "Voting for an option that doesn't exist!");
  assert.ok(this.open);
  this.votes[key] = choice;
  this.emit("vote", this, key, choice);
};

Poll.prototype.voted = function(key) {
  return key in this.votes;
};

Poll.prototype.toJson = function() {
  return {
    'title': this.title,
    'open': this.open,
    'votes': this.tally()
  };
};

Poll.prototype.close = function() {
  this.open = false;
  this.emit("closed", this);
};

Poll.prototype.tally = function() {
  var result = {};
  for (var i=0,l=this.questions.length; i<l; i++) {
      result[this.questions[i]] = 0;
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
