// Require statements
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Importing models
const User = require("../models/User.js");

// Routes

// Sign up
router.get("/sign-up", async (req, res) => {
    const subjectList = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Psychology", "Philosophy", "Economics", "Political Science", "Sociology", "Computer Science", "Software Engineering", "Web Development", "Graphic Design", "Business Administration", "Marketing", "Accounting", "Statistics", "Communication", "Education", "Medicine", "Nursing", "Architecture", "Law", "Linguistics", "Anthropology", "Music", "Fine Arts", "Social Work"];

    res.render("auth/sign-up.ejs", { title: "Sign Up", cssFiles: ["sign-up.css"], jsFiles: ["user-views.js"], subjectList });
});

router.post("/sign-up", async (req, res) => {
    try {
        req.body.username = req.body.username.toLowerCase();
        req.body.email = req.body.email.toLowerCase();
        const userInDatabase = await User.findOne({ username: req.body.username });

        if (userInDatabase) {
            return res.send("Username already taken");
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Passwords must match")
        }

        if (req.body.password.length < 8) {
            return res.send("Password is too short")
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        newUser = await User.create(req.body);

        req.session.user = {
            username: newUser.username,
            _id: newUser._id,
            role: newUser.role,
        };
        req.session.save(() => res.redirect('/'));
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Sign in
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs", { title: "Sign In", cssFiles: [], jsFiles: [] });
});

router.post("/sign-in", async (req, res) => {
    try {
        req.body.username = req.body.username.toLowerCase();

        const userInDatabase = await User.findOne({ username: req.body.username });

        if (!userInDatabase) {
            return res.status(401).send(`Sorry, username with ${req.body.username} does not exist`);
        }

        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);

        if (!validPassword) {
            return res.status(401).redirect("/sign-in/invalid");
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id,
            role: userInDatabase.role,
        };

        req.session.save(() => res.redirect('/'));
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Sign out
router.get("/sign-out", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;