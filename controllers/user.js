// Require statements
const express = require("express");
const router = express.Router();

// Importing middleware
const requireLogin = require("../middleware/require-login.js")

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

        res.render("user/show.ejs", { title: `${userProfile.username}'s Profile`, cssFiles: [], jsFiles: [], userProfile });
    }
    catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Edit
router.get("/:userId/edit", requireLogin, async (req, res) => {
    if (req.session.user._id === req.params.userId) {
        try {
            const userProfile = await User.findById(req.params.userId);
            const subjectList = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Psychology", "Philosophy", "Economics", "Political Science", "Sociology", "Computer Science", "Software Engineering", "Web Development", "Graphic Design", "Business Administration", "Marketing", "Accounting", "Statistics", "Communication", "Education", "Medicine", "Nursing", "Architecture", "Law", "Linguistics", "Anthropology", "Music", "Fine Arts", "Social Work"];

            if (!userProfile) {
                throw new Error('User not found');
            }

            res.render("user/edit.ejs", { title: `Edit ${userProfile.username}'s Profile`, cssFiles: [], jsFiles: ["user-views.js"], userProfile, subjectList });
        }
        catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
    else {
        res.redirect('/');
    }
});

// Post
router.put("/:userId", async (req, res) => {
    if (req.session.user._id === req.params.userId) {
        try {
            const user = await User.findById(req.params.userId);

            if (!user) {
                throw new Error('User not found');
            }
            user.set(req.body);
            await user.save();
            res.redirect(`/user/${req.params.userId}`);
        }
        catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
});

router.delete("/:userId", async (req, res) => {
    if (req.session.user._id === req.params.userId) {
        try {
            await User.findByIdAndDelete(req.params.userId);
            req.session.destroy();
            res.redirect("/")
        }
        catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
});

module.exports = router;