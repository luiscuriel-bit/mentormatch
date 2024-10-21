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
        const sessions = await MentorshipSession.find({
            $or: [
                { mentor: req.session.user._id },
                { student: req.session.user._id },
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
        res.render("mentorship-session/index.ejs", { title: "Mentorship Sessions", cssFiles: [], jsFiles: [], formattedSessions });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Session show view
router.get("/:sessionId", async (req, res) => {
    try {
        const session = await MentorshipSession.findById(req.params.sessionId)
            .populate("mentor student");
        const date = session.date;
        const formattedSession = {
            ...session.toObject(),
            formattedDate: date.toLocaleDateString("en-US"),
            formattedTime: date.toLocaleTimeString("en-US"),
        }
        res.render("mentorship-session/show.ejs", { title: `Session with ${req.session.user.role === "student" ? session.mentor.name : session.student.name}`, cssFiles: [], jsFiles: [], session: formattedSession });
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

        const subjectList = mentor.profile.experience;
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
        const selectedDate = new Date(`${req.body.date}T${req.body.time}:00Z`);

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

        res.redirect(`/user/${mentor._id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});


//Missing put method and delete

module.exports = router;