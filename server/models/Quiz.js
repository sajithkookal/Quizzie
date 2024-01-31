const mongoose = require("mongoose");

//options model
const optionSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    isAnswer: {
        type: Boolean,
    },
    imgUrl: {
        type: String,
        default: "",
    },
    votes: {
        type: Number,
        default: 0,
    },
});

//Question Model
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    optionType: {
        type: String,
        enum: ["txt", "img", "txtimg"],
        required: true,
    },
    attempted: {
        type: Number,
        default: 0,
    },
    correct: {
        type: Number,
        default: 0,
    },
    incorrect: {
        type: Number,
        default: 0,
    },
    options: [optionSchema],
});

//Quiz model
const quizSchema = new mongoose.Schema(
    {
        quizName: {
            type: String,
        },
        quizType: {
            type: String,
            enum: ["qna", "poll"],
            required: true,
        },
        questions: [questionSchema],
        impressions: {
            type: Number,
            default: 0,
        },
        userId: {
            type: mongoose.Types.ObjectId,
        },
        timer: {
            type: String,
            enum: ["5", "10", "off"],
            default: "off",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);
const Quiz = new mongoose.model("Quiz", quizSchema);
module.exports = Quiz;