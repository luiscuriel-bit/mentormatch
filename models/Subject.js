const mongoose = require("mongoose");
const User = require("./User.js");

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    mentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;