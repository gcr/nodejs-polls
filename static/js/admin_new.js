// Handle admin. form handling, poll list, etc.
/*global polling: true*/

$(document).ready(function() {
    var savedPollsJq = $(".saved_polls");

    function usePoll(poll) {
      // Callback for clicking the "Use poll" link on a poll in the poll list.
      $("input[name='title']").attr('value', poll.title);
      var answers = $("input[name='answers[]']");
      answers.attr('value', "");
      for (var i=0,l=poll.answers.length; i<l; i++) {
        answers[i].value = poll.answers[i];
      }
      console.log(poll);
    }

    var deleting = false;
    function deletePoll(elt) {
      // Will remove this element from the poll list.
      if (deleting) {return;}
      deleting=true;
      // elt is now an <a>. We need to find the closest li (assuming it exists)
      var li = $(elt).closest("li")[0];
      // Now, find ourselves
      $(".saved_polls li").each(function(index) {
          if (this == li) {
            // Delete ourselves
            polling.list.del(index, function(result) {
                deleting=false;
                if (result=="success") {
                  $(li).slideUp(function(){$(li).remove();});
                }
              });
          }
        });
    }

    function renderPoll(poll) {
      // Draw a poll and return a jQuery object.
      console.log(poll);
      return $("<li class='poll_question'>").append(
        $("<a>", {href: "#"}).text("Use").click(function() { usePoll(poll); })
      ).append(
        $("<a>", {href: "#"}).text("Delete").click(function() {deletePoll(this); })
      ).append(
        $("<div>").text(poll.title + " (" + poll.answers.join(", ") + ")")
      );
    }

    function reloadPolls(){
      polling.list.get(function(pollList) {
          savedPollsJq.text("");
          for (var i=0,l=pollList.length; i<l; i++) {
            savedPollsJq.append(renderPoll(pollList[i]));
          }
        });
    }
    reloadPolls();

    $(".save_poll").click(function() {
        var title=$("input[name='title']").attr('value'),
            answers=[];
        $("input[name='answers[]']").each(function() {
            if (this.value.length) {
              answers.push(this.value);
            }
          });
        savedPollsJq.append($("<span>").text("Saving..."));
        polling.list.save(title, answers, function(result) {
            if (result!=="success") {
              alert(result);
            } else {
              reloadPolls();
            }
          }
        );
      });

  });
