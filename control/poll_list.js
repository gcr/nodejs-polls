// Controller for the poll list
var renderJson = require('./../view/view_helpers').renderJson,
    redirect = require('./../view/view_helpers').redirect;

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
function add(plist, req, res, title, questions) {
  if (plist && typeof title == 'string' && questions instanceof Array) {
    renderJson(req, res, plist.add(title, questions)?"success":"fail");
    plist.commit();
  } else {
    // stupid client!
    return redirect(req, res, "http://cdn.wolfire.com/legacy/whaleman.jpg");
  }
}

