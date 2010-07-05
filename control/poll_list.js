// Controller for the poll list
var renderJson = require('./../view/view_helpers').renderJson,
    redirect = require('./../view/view_helpers').redirect,
    sys = require('sys');

// Please curry me!
function get(plist, req, res, choice) {
  // Get the list of polls
  return renderJson(req, res, plist.get(choice));
}

// Please curry me!
function del(plist, req, res, n) {
  renderJson(req, res, plist.del(n)?"success":"fail");
  plist.commit();
}

// Please curry me!
function add(plist, req, res, ignore, title, answers) {
  answers = answers.map(function(x) {
      return typeof x == 'string'? x.trim() : '';
    }).filter(function(x) {
      return x.length;
    });
  if (typeof title != 'string' || title.length === 0) {
    return renderJson(req, res, "You must set a title.");
  }
  if (!answers instanceof Array || answers.length === 0) {
    return renderJson(req, res, "You must have one or more answers.");
  }
  if (plist && typeof title == 'string' && answers instanceof Array) {
    renderJson(req, res, plist.add(title, answers)?"success":"fail");
    plist.commit();
  } else {
    // stupid client!
    return redirect(req, res, "http://cdn.wolfire.com/legacy/whaleman.jpg");
  }
}

exports.get = get;
exports.add = add;
exports.del = del;
