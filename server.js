// Require statements
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Importing models
const User = require("./models/User.js");
const Subject = require("./models/Subject.js");
const MentorshipSession = require("./models/MentorshipSession.js");
const Review = require("./models/Review.js");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
    .catch(error => console.log(error));

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log(`Server listening on port ${port}`));