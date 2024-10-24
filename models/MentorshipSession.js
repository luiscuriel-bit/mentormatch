const mongoose = require("mongoose");
const User = require("./User.js");

const mentorshipSessionSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: { type: String, required: true },
    date: { type: Date, default: Date.now },
    resources: { type: String, trim: true, maxlength: 500 },
});

const MentorshipSession = mongoose.model("MentorshipSession", mentorshipSessionSchema);

module.exports = MentorshipSession;