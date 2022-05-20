const express = require("express");

const userController = require("../controller/userController");
const authorization = require("../middleware/authorization");

const route = express.Router();

// These routes for auth
route.post("/authenticate", userController.Authentication);
module.exports = route;
