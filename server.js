require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
    .catch(error => console.log(error));

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log(`Server listening on port ${port}`));