const User = require("../models/user.js");
const Post = require("../models/post.js");

exports.createPost = async (req, res) => {
  try {
    //Validate request
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty" });
      return;
    }

    const userID = req.user._id;
    const post = await new Post({
      title: req.body.title,
      description: req.body.description,
      creator: userID,
    });

    // Save post in the database
    await post
      .save(post)
      .then((data) => {
        res.status(201).send({ Post: data });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating a post",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};

exports.deletePostById = async (req, res) => {
  try {
    const userID = req.user._id;
    const postID = req.params.postID;

    const post = await Post.findById({ _id: postID });
    if (!post) {
      res.status(200).send("Post for given ID is not found");
    }

    console.log(post.creator);
    console.log(userID);
    if (post.creator.equals(userID)) {
      await Post.findByIdAndDelete(postID);
      res.status(201).send("Post deleted Successfully!!");
    } else {
      res.status(401).send("User can`t delete other user post");
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};

exports.likePostById = async (req, res) => {
  try {
    const postID = req.params.postID;
    const userID = req.user._id;

    const post = await Post.findById({ _id: postID });
    if (!post) {
      res.status(400).send("Post for given Id is not found");
    }
    if (post.creator.equals(userID)) {
      res.status(500).send("User can`t like his own post");
    } else {
      const newLike = post.like + 1;

      await Post.findByIdAndUpdate(postID, {
        like: newLike,
      });

      const updatedPost = await Post.findById({ _id: postID }).select(" -__v ");

      res.status(201).send({ updatedPost });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};
exports.unlikePostById = async (req, res) => {
  try {
    const postID = req.params.postID;
    const userID = req.user._id;

    const post = await Post.findById({ _id: postID });
    if (!post) {
      res.status(400).send("Post for given Id is not found");
    }
    if (post.creator.equals(userID)) {
      res.status(500).send("User can`t unlike his own post");
    } else {
      const newLike = post.like - 1;

      await Post.findByIdAndUpdate(postID, {
        like: newLike,
      });

      const updatedPost = await Post.findById({ _id: postID }).select(" -__v ");

      res.status(201).send({ updatedPost });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};
