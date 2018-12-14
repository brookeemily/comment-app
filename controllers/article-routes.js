var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");
// Require all models
var db = require("../models");
var Comment = require("../models/Comment");
// Initialize Express
var router = express.Router();



// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from NPR website and save to mongodb
router.get("/scrape", function(req, res) {
  // Use axios to get the body of the html of thehardtimes.net
  axios.get("https://thehardtimes.net/").then(function(response) {
      // Load that data into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      console.log(response.data);
      // Now grab article elements
      $('article').each(function(i, element) {
          // Save an empty result objet
          var result = {};

          result.title = $(element)
          .find('.post-header')
          .text();      
          result.link = $(element)
          .find( 'a')
          .attr('href');
          result.summary = $(element)
          .find('.post-content')
          .text();

          // Create a new Article using the "result" object built from scraping
      db.Article.create(result)
          .then(function(dbArticle){
              console.log(dbArticle);
          })
          .catch(function(err){
              // if an error occured, send it to client
              return res.json(err);
          });
      });
    });
    // Reload the page so that newly scraped articles will be shown on the page
    res.redirect("/");
  });  



// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  db.Article.find({})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Save an article
router.post("/save/:id", function(req, res) {
  // Use the article id to find and update it's saved property to true
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("doc: ", doc);
    }
  });
});


// ============= ROUTES FOR SAVED ARTICLES PAGE =============//

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ "_id": req.params.id })
  // ..and populate all of the comments associated with it
  .populate("comments")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Create a new comment
router.post("/comment/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  var newComment = new Comment(req.body);
  // And save the new comment the db
  newComment.save(function(error, newComment) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comment
      db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

// Remove a saved article
router.post("/unsave/:id", function(req, res) {
  // Use the article id to find and update it's saved property to false
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;
