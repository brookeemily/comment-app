var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Save reference to the Schema constructor
var ArticleSchema = new Schema({
    // Title of article
    title: {
        type: String,
        required: true
    },
    // Link to article
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    // Comment is an object that stores the comment id
    // Ref propery links to the ObjectID to the Comment model
    // This populates the article with the associated comment
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// This creates our model from the schema above, using mogngoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;