const express = require("express");

const userController = require("../controller/userController");
const authorization = require("../middleware/authorization");

const route = express.Router();

// These routes for user
route.post("/authenticate/register", userController.Register);
route.post("/authenticate/login", userController.Login);

route.post("/follow/:id", authorization, userController.followById);
route.post("/unfollow/:id", authorization, userController.UnfollowById);
route.get("/user", authorization, userController.userProfile);

module.exports = route;
