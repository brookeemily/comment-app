$(document).ready(function() {
  // get json /articles
  $.getJSON("/articles", function(data) {
    // for each result.....
    for (var i = 0; i < data.length; i++) {
      // if article has been marked as saved
      if (data[i].saved === true) {
        // show info
        $("#saved-results").append(
          "<div class='result-div'><h4 class='result-title'>" +
          data[i].title +
          "</h4><h6 class='result-summary'>" +
          data[i].summary +
          "</h6> <a target='_blank' class='result-link' href='"+ data[i].link + "'>" +
          "Click to read story" +
          "</a><button class='btn save-article' data-id='" +
          data[i]._id +
          "'><span class='icon'><i class='fa fa-bookmark'></i></span> Save Article</button></div>"
        );
      }
    }
  });

  // Comment button opens the comments modal & displays any comments
  $(document).on("click", ".comments-button", function() {
    // Open the comments modal
    $(".modal").toggleClass("is-active");
    // Get article by article ID
    var articleID = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + articleID
    }).done(function(data) {
      // Update modal header
			$("#comments-header").html(data.title);
			console.log(data.comments);
			console.log(data.comments.body);
      // If the article has comments
      if (data.comments.length !== 0) {
        // Clear out the comment div
        $("#comments-list").empty();
        for (i = 0; i < data.comments.length; i++) {
          // Append all article comments
          $("#comments-list").append(
            "<div class='comment-div'><p class='comment'>" +
              data.comments[i].body +
              "</p></div>"
          );
        }
      }
      // Append save comment button with article's ID saved as data-id attribute
      $(".modal-card-foot").html(
				

        "<button id='save-comment' class='button is-success' data-id='" +
          data._id +
          "'>Save Comment</button>"
      );
    });
  });

  // Saving Comments
  $(document).on("click", "#save-comment", function() {
    // Grab the id associated with the article from the submit button
    var articleID = $(this).attr("data-id");
    // Run a POST request to add a comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/comment/" + articleID,
      data: {
        // Value taken from body input
        body: $("#new-comment").val()
      }
    }).done(function(data) {
      // Log the response
      console.log("data: ", data);
      
    });
    
    // clear inputs for comment input
    $("#new-comment").val("");
    // Reload the page when new comment is added
    // location.reload();
    $('#comment-modal').modal('show');
  });

  // Deleting Comments
  $(document).on("click", ".delete-comment", function() {
    // delete comment
  });

  // Removing Saved Articles
  $(document).on("click", ".unsave-button", function() {
    // Get article id
    var articleID = $(this).attr("data-id");
    console.log(articleID);
    // Run a POST request to update the article to be saved
    $.ajax({
      method: "POST",
      url: "/unsave/" + articleID,
      data: {
        saved: false
      }
    });
  });
});
