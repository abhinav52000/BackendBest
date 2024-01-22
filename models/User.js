const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    dob: { type: Date, default: Date.now },

    //   author: String,
    //   body: String,
    //   comments: [{ body: String, date: Date }],
    //   hidden: Boolean,
    //   meta: {
    //     votes: Number,
    //     favs: Number,
    //   },
  },
  {
    timestamps: true,
    versionKey: false, // Here You have to add.
  }
);

const User = mongoose.model("user", userSchema);
User.createIndexes();
module.exports = User;
