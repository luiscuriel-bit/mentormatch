// Require statements
const express = require("express");
const router = express.Router();

// Importing models
const Review = require("../models/Review.js");
const MentorshipSession = require("../models/MentorshipSession.js");
const User = require("../models/User.js");

router.post("/:sessionId", async (req, res) => {
    const session = await MentorshipSession.findById(req.params.sessionId);
    const mentor = await User.findById(session.mentor);
    const student = await User.findById(session.student);
    try {
        const newReview = await Review.create({
            mentor: mentor._id,
            student: student._id,
            ...req.body,
        });
        mentor.reviews.push(newReview._id);
        student.reviews.push(newReview._id);
        await mentor.save();
        await student.save();
        res.redirect(`/session/${session._id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.delete("/:reviewId", async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (review.student.equals(req.session.user._id)) {
            await review.deleteOne();
            res.redirect("/session");
        } else {
            res.redirect('/');
        }
    }
    catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


module.exports = router;