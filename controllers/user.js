// Require statements
const express = require("express");
const router = express.Router();

const User = require("../models/User.js")

// Show
router.get("/:userId", async (req, res) => {
    try {
        const userProfile = await User.findById(req.params.userId)
            .populate({
                path: "reviews",
                populate: {
                    path: "student",
                    select: "username",
                }
            });

        if (!userProfile) {
            throw new Error('User not found');
        }

        res.render("user/show.ejs", { title: "Mentorship Sessions", cssFiles: [], jsFiles: [], userProfile });
    }
    catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Edit

module.exports = router;