// Handle admin. form handling, poll list, etc.
/*global polling: true*/

$(document).ready(function() {
    var savedPollsJq = $(".saved_polls");

    function usePoll(poll) {
      // Callback for clicking the "Use poll" link on a poll in the poll list.
      $("input[name='title']").attr('value', poll.title);
      var answers = $("input[name='answers']");
      answers.attr('value', "");
      for (var i=0,l=poll.answers.length; i<l; i++) {
        answers[i].value = poll.answers[i];
      }
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
      return $("<li class='poll_question'>").append(
        $("<input>", {type: "button"}).addClass('delete').val("Delete").click(function() {deletePoll(this); })
      ).append(
        $("<a>", {href: "#"}).text(poll.title + " (" + poll.answers.join(", ") + ")").click(function() { usePoll(poll); })
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
        $("input[name='answers']").each(function() {
            if (this.value.length) {
              answers.push(this.value);
            }
          });
        var savingJq = $("<span>").text("Saving...");
        savedPollsJq.append(savingJq);
        polling.list.save(title, answers, function(result) {
            if (result!=="success") {
              alert(result);
              savingJq.remove();
            } else {
              reloadPolls();
            }
          }
        );
      });

  });
