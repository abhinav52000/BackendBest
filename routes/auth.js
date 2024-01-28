const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
var fetchUser = require("../middleWare/auth");

router.get("/", (req, res) => {
  const query = {};
  for (const key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      query[key] = { $regex: req.query[key], $options: "i" };
    }
  }
  User.find(query).then((data) => {
    res.send(data);
  });
});

// Route 1: Used to Create A User and no login required i.e. no jwt token required
router.post(
  "/createUser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 5 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // Check if the email already exists and to avoid this use a function in model itself that is like User.createIndexes() at the end of User model as done in User.js
      //   const existingUser = await User.findOne({ email: req.body.email });
      //   if (existingUser) {
      //     return res
      //       .status(400)
      //       .json({ error: "User with this email already exists." });
      //   }

      // If email is unique, proceed to save the user
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Custom error format
        const formattedErrors = errors.array().map((error) => ({
          field: error.path,
          value: error.value,
          msg: error.msg,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;

      const user = new User(req.body);
      await user.save().then(() => {
        const secretKey = process.env.JWT_SECRET_KEY;
        const authToken = jwt.sign({ id: user._id }, secretKey);
        res.json({ authToken });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", err: error });
    }
  }
);

// Route 2: It is used to make login no login required no jwt token required
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Custom error format
        const formattedErrors = errors.array().map((error) => ({
          field: error.path,
          value: error.value,
          msg: error.msg,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }

      const query = { email: req.body.email };

      const user = await User.findOne(query);

      if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" });
      }

      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (err || !result) {
          return res.status(404).json({ error: "Invalid Credentials" });
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        const authToken = jwt.sign({ id: user._id }, secretKey);
        res.json({ authToken });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", err: error });
    }
  }
);

// Route 3: It is used to to getUserDetail pf logged in user and login Required here.
router.get("/getUserDetail", fetchUser, async (req, res) => {
  try {
    const userID = req.id;
    const userDetail = await User.findById(userID).select("-password");

    if (!userDetail) {
      return res.status(404).json({ error: "User not found" });
    }

    res.send(userDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
});

module.exports = router;
