var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping Tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all of the models created
var db = require("./models");

var PORT = 3000;

// Initialize express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/commentapp", {useNewUrlParser: true});

// Routes

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
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
            
            // result.summary = $(this)
            // .children("a");

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

        

        // If we were able to scrape and save Article, send message to client
        res.send("Scrape Complete");
    });
});

// A GET Route for getting all Articles from db
app.get("/articles", function(req, res) {
    // Find all items in the Article collection
    db.Article.find({})
    .then(function(dbArticle) {
        // If able to find Article, send all of the items back to the client
        res.json(dbArticle);
    })
    // Log any errors
    .catch(function(err){
        res.json(err)
    });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  