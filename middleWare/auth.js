const jwt = require("jsonwebtoken");
require("dotenv").config();

// Isko tum sifhe wha bhi dal skte the par ye middileware ka concept bhi smjha rha hai ki kese kisi request ke bich mai kuch aur ko chlana ho to kar skte ho
const fetchUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ error: "Please provide a valid token" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET_KEY
    );
    // decode have all the things in same order jo ki tumne use bheja tha at the server in bearer token aur kya bheja tha wo dekh skte hai jwt.io ke website se
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = fetchUser;
