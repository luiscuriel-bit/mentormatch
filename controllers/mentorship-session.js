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
            const formattedTime = date.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                second: undefined // Omite los segundos
            });

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

        const formattedSession = {
            ...session.toObject(),
            formattedDate: session.date.toLocaleDateString("en-US"),
            formattedTime: session.date.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                second: undefined // Omite los segundos
            }),
        }
        res.render("mentorship-session/show.ejs", { title: `Session with ${req.session.user.role === "student" ? session.mentor.name : session.student.name}`, cssFiles: [], jsFiles: ["session-views.js"], session: formattedSession });
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
        res.render("mentorship-session/new.ejs", { title: `Session with ${mentor.username}`, cssFiles: [], jsFiles: ["session-views.js"], mentor, occupiedSlots, subjectList });
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

// Session edit view
router.get("/:sessionId/edit", async (req, res) => {
    try {
        const session = await MentorshipSession.findById(req.params.sessionId)
            .populate("mentor student");
        if (session.mentor._id.equals(req.session.user._id)) {
            res.render("mentorship-session/edit.ejs", { title: `Session with ${session.student.name}`, cssFiles: [], jsFiles: [], session });
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Session edit
router.put("/:sessionId", async (req, res) => {
    try {
        const session = await MentorshipSession.findById(req.params.sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        session.set(req.body);
        await session.save();
        res.redirect(`/session/${req.params.sessionId}`);
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Session delete
router.delete("/:sessionId", async (req, res) => {
    try {
        const session = await MentorshipSession.findById(req.params.sessionId);
        if (session.mentor.equals(req.session.user._id) || session.student.equals(req.session.user._id)) {
            await session.deleteOne();
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