var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the constructor, create a CommentSchema object
var CommentSchema = new Schema({
    // title of comment
    title: String,
    // body of string
    body: String
});

// This creates our model from the schema above, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;