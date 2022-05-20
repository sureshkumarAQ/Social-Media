const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

//Authenticate and save a user
exports.Authentication = async (req, res) => {
  try {
    //Validate request
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty" });
      return;
    }

    // Store all data in user object
    const user = await new User({
      email: req.body.email,
      password: req.body.password,
    });

    // zwt create a new tokken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //save user token
    user.token = token;

    // we can also store token as a cookie but here we will not
    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // });

    // Save user in the database
    await user
      .save(user)
      .then((data) => {
        res.status(201).send({ jwtToken: token });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while authenticating a user",
        });
      });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authenticating a user",
    });
  }
};
