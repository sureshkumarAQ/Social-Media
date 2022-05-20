const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/user.js");
const User = require("../models/user.js");

//Authenticate and save a user
exports.Register = async (req, res) => {
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
        res.status(201).send({ jwtToken: token, User: user });
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
exports.Login = async (req, res) => {
  //get user data
  try {
    //validate request
    if (!req.body) {
      res.status(400).send({ message: "Fill email and password" });
      return;
    }

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
      return res.status(406).send({ err: "Not all field have been entered" });

    // Check if user is already exist or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(406).send({ err: "No account found with this email" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(406).send({ err: "Invalid Credentials" });

    // zwt create a new tokken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //save user token
    user.token = token;

    //Store jwt-token in cookie we can also store token as a cookie
    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // });

    res.send({ jwtToken: token });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while login",
    });
  }
};
exports.followById = async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.user._id;
    // console.log(id);
    // console.log(userID);

    const userwithId = await User.findById({ _id: id });
    if (!userwithId) {
      res.status(400).send("Please enter a valid ID");
    }

    const newFollower = userwithId.followers + 1;

    const loggedInUser = await User.findById({ _id: userID });
    if (!loggedInUser) {
      res.status(400).send("LoggedIn User Not found");
    }
    const newFollowing = loggedInUser.followings + 1;

    await User.findByIdAndUpdate(id, {
      followers: newFollower,
    });
    await User.findByIdAndUpdate(userID, {
      followings: newFollowing,
    });

    const updatedUserwithId = await User.findById({ _id: id }).select(
      " -__v -password"
    );
    const updatedLoggedInUser = await User.findById({ _id: userID }).select(
      " -__v -password"
    );
    res.status(201).send({ updatedUserwithId, updatedLoggedInUser });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};

exports.UnfollowById = async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.user._id;
    // console.log(id);
    // console.log(userID);

    const userwithId = await User.findById({ _id: id });
    if (!userwithId) {
      res.status(400).send("Please enter a valid ID");
    }

    if (userwithId.followers > 0) {
      var newFollower = userwithId.followers - 1;
    }

    const loggedInUser = await User.findById({ _id: userID });
    if (!loggedInUser) {
      res.status(400).send("LoggedIn User Not found");
    }
    if (loggedInUser.followings > 0) {
      var newFollowing = loggedInUser.followings - 1;
    }

    await User.findByIdAndUpdate(id, {
      followers: newFollower,
    });
    await User.findByIdAndUpdate(userID, {
      followings: newFollowing,
    });

    const updatedUserwithId = await User.findById({ _id: id }).select(
      " -__v -password"
    );
    const updatedLoggedInUser = await User.findById({ _id: userID }).select(
      " -__v -password"
    );
    res.status(201).send({ updatedUserwithId, updatedLoggedInUser });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await User.findById({ _id: userID }).select(
      "-password -_id -__v"
    );

    res.status(201).send({ Profile: user });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred ",
    });
  }
};
