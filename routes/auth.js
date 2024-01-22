const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

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

router.post(
  "/",
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

      const user = new User(req.body);
      await user.save();
      res.send(req.body);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", err: error });
    }
  }
);

module.exports = router;
