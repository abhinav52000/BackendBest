const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
    data: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false, // Here You have to add.
  }
);

const Notes = mongoose.model("notes", notesSchema);
Notes.createIndexes();
module.exports = Notes;
