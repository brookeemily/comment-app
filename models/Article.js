// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
  },
  // summary is a required string
  summary: {
    type: String,
    required: true,
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // boolean to flag articles as saved
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  // Saves array of associated comment IDs
  comments:[{
        type: Schema.ObjectId,
        ref:'Comment'
    }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
