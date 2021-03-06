const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Title is required"
    },
    abstract: {
      type: String,
      required: "Abstract is required"
    },
    keyword: [String],
    postedBy: { type: ObjectId, ref: "User" },
    pdf: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    reviewer: [{ type: ObjectId, ref: "User", default: null }],
    volume: { type: ObjectId, ref: "Volume" }
  },
  /* don't want to create our indices every time (nice for development, but can result in a performance hit) */
  { autoIndex: false }
);

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulatePostedBy = function(next) {
  this.populate("volume", "_id start end volume svolume");

  this.populate("reviewer", "_id email end volume svolume");

  next();
};

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
postSchema
  .pre("findOne", autoPopulatePostedBy)
  .pre("find", autoPopulatePostedBy);
/* Create index on keys for more performant querying/post sorting */
postSchema.index({ postedBy: 1, createdAt: 1 });

module.exports = mongoose.model("Paper", postSchema);
