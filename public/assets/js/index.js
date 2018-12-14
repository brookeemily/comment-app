$(document).ready(function() {

  // Grab the articles as a json when page loads, append to the page
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
      $("#scrape-results").prepend(
        "<div class='result-div'><h4 class='result-title'>" +
          data[i].title +
          "</h4><h6 class='result-summary'>" +
          data[i].summary +
          "</h6> <a target='_blank' class='result-link' href='"+ data[i].link + "'>" +
          "Click to read story" +
          "</a><button class='save-article button is-info is-medium' data-id='" +
          data[i]._id +
          "'><span class='icon'><i class='fa fa-bookmark'></i></span>Save Article</button></div>"
      );
    }
  });

  // Save article button changes the saved property of the article model from false to true
  $(document).on("click", ".save-article", function() {
    // change icon to check mark
    $(this)
      .children("span.icon")
      .children("i.fa-bookmark")
      .removeClass("fa-bookmark")
      .addClass("fa-check-circle");
    // Get article id
    var articleID = $(this).attr("data-id");
    console.log(articleID);
    // Run a POST request to update the article to be saved
    $.ajax({
      method: "POST",
      url: "/save/" + articleID,
      data: {
        saved: true
      }
    }).done(function(data) {
      // Log the response
      console.log("data: ", data);
    });
  });
});
