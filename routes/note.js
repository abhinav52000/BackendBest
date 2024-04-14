const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleWare/auth");

// Route 1: It is used to create a new note for the logged-in user (login Required here).
router.post(
  "/createNotes",
  [
    body("name", "Enter a Valid Name").isLength({ min: 5 }),
    body("data", "Enter a Valid Content").isLength({ min: 10 }),
  ],
  fetchUser,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
          field: error.path,
          value: error.value,
          msg: error.msg,
        }));
        return res.status(400).json({ errors: formattedErrors });
      }

      req.body.createdBy = req.id + "p";

      const notes = new Notes(req.body);
      await notes.save().then(() => {
        res.status(200).json({ success: "Post Created", note: notes });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", err: error });
    }
  }
);

// Route 2: It is used to get notes of the logged-in user (login Required here).
router.get("/getNotes", fetchUser, async (req, res) => {
  try {
    const query = {
      createdBy: req.user.id,
    };
    const notes = await Notes.find(query);
    if (!notes.length) {
      return res.status(404).json({ error: "No notes found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
});

module.exports = router;
