const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require("../models/user");

var schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    Comments: [
      {
        type: String,
        default: null,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", schema);

module.exports = Post;
