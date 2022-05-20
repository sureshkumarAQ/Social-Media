const express = require("express");

const userController = require("../controller/userController");
const postController = require("../controller/postController");
const authorization = require("../middleware/authorization");

const route = express.Router();

// These routes for user
route.post("/authenticate/register", userController.Register);
route.post("/authenticate/login", userController.Login);

route.post("/follow/:id", authorization, userController.followById);
route.post("/unfollow/:id", authorization, userController.UnfollowById);
route.get("/user", authorization, userController.userProfile);

// These routes for post;
route.post("/posts", authorization, postController.createPost);

route.delete("/post/:postID", authorization, postController.deletePostById);

route.post("/like/:postID", authorization, postController.likePostById);

route.post("/unlike/:postID", authorization, postController.unlikePostById);

module.exports = route;
