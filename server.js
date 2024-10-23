// Require statements
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path")
const methodOverride = require("method-override");

// Importing models
const User = require("./models/User.js");
const MentorshipSession = require("./models/MentorshipSession.js");
const Review = require("./models/Review.js");

// Importing controllers
const authController = require("./controllers/auth.js");
const searchController = require("./controllers/search.js")
const userController = require("./controllers/user.js");
const mentorshipSessionController = require("./controllers/mentorship-session.js");
const reviewController = require("./controllers/review.js");

// Importing middleware
const addUserToLocals = require("./middleware/add-user-to-locals.js");
const requireLogin = require("./middleware/require-login.js")

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
    .catch(error => console.log(error));

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")));
app.use(addUserToLocals);

app.set("view engine", "ejs");

// Routers
app.use("/auth", authController);
app.use("/search", searchController);

app.get('/', (req, res) => {
    res.render("index.ejs", { title: "MentorMatch", cssFiles: [], jsFiles: [] });
});

app.use("/user", userController);

app.get("/about", (req, res) => {
    res.render("about.ejs", { title: "About", cssFiles: [], jsFiles: [] });
});

app.use(requireLogin);
app.get("/dashboard", async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);

        const upcomingSessions = await MentorshipSession.find({
            $or: [
                { mentor: req.session.user._id },
                { student: req.session.user._id },
            ],
            date: { $gte: new Date() }
        })
            .populate("mentor student")
            .sort("date");

        const formattedSessions = upcomingSessions.map(session => ({
            ...session.toObject(),
            formattedDate: session.date.toLocaleDateString("en-US"),
            formattedTime: session.date.toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
            }),
        })
        );

        res.render("dashboard.ejs", { title: `${user.username}'s Dashboard`, cssFiles: [], jsFiles: [], upcomingSessions: formattedSessions });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

app.use("/session", mentorshipSessionController);
app.use("/review", reviewController)

const port = process.env.PORT ||3100;
app.listen(port, (req, res) => console.log(`Server listening on port ${port}`));