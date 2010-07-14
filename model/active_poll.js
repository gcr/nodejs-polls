// Contains a simple container for setting and getting the active poll. Also
// employs a simple timer for expiring a poll if nobody's touched it for a
// while.
//

var sys = require('sys'),
    POLL_TIMEOUT = 1000 * 60 * 60 * 5; // 5hr

function Container() {
  this.item = null;
  this.timer = null;
}

Container.prototype.clear = function() {
  // TODO! Get some kind of log framework
  sys.log("Clearing poll (inactivity)");
  this.item = null;
  clearTimeout(this.timer);
  this.timer = null;
};

Container.prototype.set = function(newObj) {
  this.item = newObj;
  this.poke();
};

Container.prototype.poke = function() {
  var self = this;
  clearTimeout(this.timer);
  this.timer = setTimeout(function(){self.clear();}, POLL_TIMEOUT);
};

Container.prototype.get = function() {
  this.poke();
  return this.item;
};

Container.prototype.curryGet = function(func) {
  // Return a function that passes the contained object into the given
  // function.
  var self = this;
  return function() {
    var args=[self.get()];
    for (var i=0,l=arguments.length; i<l; i++) {
        args.push(arguments[i]);
    }
    return func.apply(this, args);
  };
};

Container.prototype.currySet = function(func) {
  // First: Runs func()
  // Then: Sets this.item to the return value.
  var self = this;
  return function() {
    var result = func.apply(this, arguments);
    self.set(result);
    return result;
  };
};

exports.Container = Container;
