const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes")
const submitQuizRoute = require("./routes/submitQuizRoutes")

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running",
    });
});

// Routes Head
app.use("/api", authRoutes);
app.use("/api", quizRoutes);
app.use("/api", submitQuizRoute);

//Error handler middleware
app.use((err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to MongoDB")
        }).catch(err => {
            console.error('Failed to connect to MongoDB:', err);
        });
});

