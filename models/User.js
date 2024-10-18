const mongoose = require("mongoose");
const MentorshipSession = require("./MentorshipSession.js");
const Review = require("./Review.js");

const profileSchema = new mongoose.Schema({
    bio: { type: String },
    experience: [{ type: String }],
    interests: [{ type: String }],
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true, trim: true, unique: true, match: /.+\@.+\..+/ },
    role: { type: String, enum: ["student", "mentor"], required: true },
    profile: profileSchema,
    joinedAt: { type: Date, default: Date.now },
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentorshipSession",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;