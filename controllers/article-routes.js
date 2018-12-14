var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");
// Require all models
var db = require("../models");
var Comment = require("../models/Comment");
// Initialize Express
var router = express.Router();



// Scrape data from The Hard Times and save to mongodb
router.get("/scrape", function(req, res) {
  // Use axios to get the body of the html of thehardtimes.net
  axios.get("https://thehardtimes.net/").then(function(response) {
      // load cheerio and save as variable
      var $ = cheerio.load(response.data);

      console.log(response.data);
      // grab all article elements
      $('article').each(function(i, element) {
          // Save an empty result object
          var result = {};

          // Save title 
          result.title = $(element)
          .find('.post-header')
          .text();     
          // Save link 
          result.link = $(element)
          .find( 'a')
          .attr('href');
          // Save summary
          result.summary = $(element)
          .find('.post-content')
          .text();

      // Create a new Article
      db.Article.create(result)
          .then(function(dbArticle){
              console.log(dbArticle);
          })
          // catch error and return to client
          .catch(function(err){
              return res.json(err);
          });
      });
    });
    // Reload the page so that newly scraped articles will be shown on the page
    res.redirect("/");
  });  



// Get the articles in database
router.get("/articles", function(req, res) {
  db.Article.find({})
  .exec(function(err, result) {
    // Log errors
    if (err) {
      console.log(error);
    }
    // or send json object to browser
    else {
      res.json(result);
    }
  });
});

// Save article 
router.post("/save/:id", function(req, res) {
  // Find article by ID and update "saved" to true
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, results) {
    // Log errors
    if (err) {
      console.log(err);
    }
    // Log result
    else {
      console.log(results);
    }
  });
});


// Get article by id
router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ "_id": req.params.id })
  // populate article with any comments associated with it
  .populate("comments")
  .exec(function(error, results) {
    // Log errors
    if (error) {
      console.log(error);
    }
    // or send json object to browser
    else {
      res.json(results);
    }
  });
});

// Create a new comment
router.post("/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  // save the new comment the db
  newComment.save(function(error, newComment) {
    // Log errors
    if (error) {
      console.log(error);
    }
    // if there are no errors
    else {
      // find and update article by ID and add new comment to comments array
      db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      .exec(function(err, results) {
        // Log errors
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", results);
          // send the result to the browser
          res.send(results);
        }
      });
    }
  });
});

// Remove saved article
router.post("/unsave/:id", function(req, res) {
  // find and update article by ID, update saved to false
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, results) {
    // Log errors
    if (err) {
      console.log(err);
    }
    // Log removed
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;
