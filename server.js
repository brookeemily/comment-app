// Dependencies
var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// Requiring Comment and Article models
var db = require("./models")

// Requiring routing controllers
var htmlRouter = require("./controllers/html-routes.js");
var articleRouter = require("./controllers/article-routes.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;

// Initialize Express
var port = process.env.PORT || 3000;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routing
app.use("/", htmlRouter);
app.use("/", articleRouter);

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
var URI = process.env.MONGODB_URI || "mongodb://localhost/comment-app"; 
mongoose.connect(URI);
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port 3000!");
});