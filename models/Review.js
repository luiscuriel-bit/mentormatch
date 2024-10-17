const mongoose = require("mongoose");
const User = require("./User.js");

const reviewSchema = new mongoose.Schema({
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
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;