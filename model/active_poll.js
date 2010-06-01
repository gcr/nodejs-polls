// Contains a simple container for setting and getting the active poll.
//

function Container() {
  this.item = null;
}

Container.prototype.set = function(newObj) {
  this.item = newObj;
};

Container.prototype.get = function() {
  return this.item;
};

Container.prototype.curryGet = function(func) {
  // Return a function that passes the contained object into the given
  // function.
  var self = this;
  return function() {
    var args=[self.item];
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
