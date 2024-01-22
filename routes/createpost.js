const express = require("express");
const router = express.Router();

router.get("/api/createPosts", (req, res) => {
  obj = {
    a: "Abhinab",
    Number: 111,
  };
  res.json(obj);
});

module.exports = router;
