// A list of 'poll-like' objects to make it easy for the client to set things.
var fs = require('fs'),
    sys = require('sys');

function PollList(filename) {
  // This is a list of polls read from a file.
  // I guess each poll is not a real Poll object, but an object that contains
  // a Title and a list of answers.
  this.filename = filename;
  //this.polls = [];
  try {
    var buffer=fs.readFileSync(filename);
    this.polls = JSON.parse(buffer.toString()).polls;
  } catch (err) {
    this.polls = [];
  }
}

PollList.prototype.get = function(n) {
  if (typeof n == 'undefined') {
    return this.polls;
  } else {
    return this.polls[n];
  }
};

PollList.prototype.del = function(n) {
  if (n in this.polls) {
    this.polls.splice(n, 1);
    return true;
  } else {
    return false;
  }
};

PollList.prototype.add = function(title, answers) {
  if (typeof title == 'string' && answers instanceof Array) {
    this.polls.push({title: title, answers: answers});
    return true;
  } else {
    return false;
  }
};

PollList.prototype.commit = function() {
  fs.writeFileSync(this.filename, JSON.stringify({polls:this.polls}));
};

exports.PollList = PollList;
