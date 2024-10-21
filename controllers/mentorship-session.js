// Require statements
const express = require("express");
const router = express.Router();

// Importing models
const User = require("../models/User.js")
const MentorshipSession = require("../models/MentorshipSession.js");

// Routes

// Sessions index
router.get("/", async (req, res) => {
    try {

        const currentUser = await User.findById(req.session.user._id);
        const sessions = await MentorshipSession.find({
            $or: [
                { mentor: currentUser },
                { student: currentUser },
            ]
        })
            .populate("mentor student");
        const formattedSessions = sessions.map(session => {
            const date = session.date;

            const formattedDate = date.toLocaleDateString("en-US");
            const formattedTime = date.toLocaleTimeString("en-US");

            return {
                ...session.toObject(),
                formattedDate,
                formattedTime,
            }
        })
        res.render("mentorship-session/index.ejs", { title: "Mentorship Sessions", cssFiles: [], jsFiles: [], sessions, formattedSessions, currentUser });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// New session form
router.get("/new/:mentorId", async (req, res) => {
    try {
        const mentor = await User.findById(req.params.mentorId).populate("sessions");

        const occupiedSlots = mentor.sessions.map(session => {
            return {
                date: session.date.toISOString().split("T")[0],
                time: session.date.toTimeString().split(" ")[0].slice(0, 5),
            }
        });

        const subjectList = mentor.profile.interests;
        res.render("mentorship-session/new.ejs", { title: `Session with ${mentor.username}`, cssFiles: [], jsFiles: ["new-session.js"], mentor, occupiedSlots, subjectList });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// New session form
router.post("/:mentorId", async (req, res) => {
    try {
        const mentor = await User.findById(req.params.mentorId);
        const student = await User.findById(req.session.user._id);

        if (!mentor || !student) {
            throw new Error('Mentor or student not found');
        }
        const selectedDate = new Date(req.body.date);

        const [hours, minutes] = req.body.time.split(':').map(Number);
        selectedDate.setHours(hours);
        selectedDate.setMinutes(minutes);

        const newSession = await MentorshipSession.create({
            mentor: mentor._id,
            student: student._id,
            subject: req.body.subject,
            date: selectedDate,
        });
        mentor.sessions.push(newSession._id);
        student.sessions.push(newSession._id);
        await mentor.save();
        await student.save();

        res.redirect(`/user/${mentorId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


//Missing put method and delete

module.exports = router;