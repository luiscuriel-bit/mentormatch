// Require statements
const express = require("express");
const router = express.Router();

// Importing models
const User = require("../models/User.js");

router.get("/", async (req, res) => {
    const query = req.query.query.trim();
    if (query) {
        try {
            const mentors = await User.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                    { "profile.bio": { $regex: query, $options: 'i' } },
                    { "profile.experience": { $regex: query, $options: 'i' } },
                    { "profile.interests": { $regex: query, $options: 'i' } },
                ],
                role: "mentor",
            });

            res.render("search-results.ejs", { title: "Mentorship Sessions", cssFiles: [], jsFiles: [], query, mentors });
        }
        catch (error) {
            console.error(error);
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
});

module.exports = router;