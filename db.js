const mongoose = require("mongoose");

const mongoUri = "mongodb://localhost:27017";

const connectToMongo = () => {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected To Mongo Successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = connectToMongo;
