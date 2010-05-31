// A list of 'poll-like' objects to make it easy for the client to set things.
var fs = require('fs'),
    sys = require('sys');

function PollList(filename) {
  // This is a list of polls read from a file.
  // I guess each poll is not a real Poll object, but an object that contains
  // a Title and a list of Questions.
  this.filename = filename;
  //this.polls = [];
  var buffer=fs.readFileSync(filename);
  this.polls = JSON.parse(buffer);
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

PollList.prototype.add = function(title, questions) {
  if (typeof title == 'string' && questions instanceof Array) {
    this.polls.push({title: title, questions: questions});
    return true;
  } else {
    return false;
  }
};

PollList.prototype.commit = function() {
  fs.writeFileSync(this.filename, JSON.stringify(this.polls));
};

exports.PollList = PollList;
