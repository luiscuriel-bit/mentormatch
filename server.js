// Require statements
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path")

// Importing models
const User = require("./models/User.js");
const Subject = require("./models/Subject.js");
const MentorshipSession = require("./models/MentorshipSession.js");
const Review = require("./models/Review.js");

// Importing controllers
const authController = require("./controllers/auth.js");

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
    cookie: {
        secure: process.env.NODE_ENV === "production",
    },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(addUserToLocals);

// Routers
app.use("/auth", authController);

app.get('/', (req, res) => {
    res.render("index.ejs", { title: "MentorMatch", cssFiles: [], jsFiles: [], user: req.session.user });
});

app.use(requireLogin);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log(`Server listening on port ${port}`));