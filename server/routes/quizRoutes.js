const express = require("express");
const isLoggedIn = require("../middleware/requireAuth");
const Quiz = require("../models/Quiz");
const router = express.Router();

//  Create Quizz
router.post("/create-quizz", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.userId;
    const quizData = req.body;
    quizData.userId = userId;
    const createdQuiz = await Quiz.create(quizData);
    res.status(200).json({
      status: "OK",
      message: "Quiz Created Succesfully",
      quizId: createdQuiz._id,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});


// Delete Quizz
router.delete("/delete-quizz/:quizId", isLoggedIn, async (req, res, next) => {
  try {
    const radminId = req.userId;
    const { quizId } = req.params;
 
    const query = {
      $and: [
        { userId: { $eq: radminId } },
        { _id: { $eq: quizId.toString() } },
      ],
    };
    const deletedQuiz = await Quiz.findOneAndDelete(query);
    if (!deletedQuiz) {
      return next(errorHandler(404, "Quiz not found"));
    }
    res.status(200).json({
      status: "OK",
      message: "Quiz Deleted",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});


//  View Quizz 
router.get("/quizz/:quizId", async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId });

    if (!quiz) {
      return next(errorHandler(404, "quiz Not Found"));
    }
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();
    const questions = quiz.questions;
    const modifiedQuestions = [];
    questions.forEach((question) => {
      const modifiedOptions = [];
      question.options.forEach((op) => {
        const { isAnswer, votes, ...rest } = op._doc;
        modifiedOptions.push({ ...rest });
      });
      question.options = modifiedOptions;
      const { attempted, correct, incorrect, ...restQues } = question._doc;
      modifiedQuestions.push(restQues);
    });
    const data = {
      quizName: quiz.quizName,
      timer: quiz.timer,
      quizType: quiz.quizType,
      questions: modifiedQuestions,
    };
    // console.log(modifiedQuestions);
    return res.status(200).json({
      status: "OK",
      data: data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//  Update Quizz 
router.put("/update-quizz/:quizId", isLoggedIn, async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const payload = req.body;
    const radminId = req.userId;
    const query = {
      $and: [{ userId: { $eq: radminId } }, { _id: { $eq: quizId } }],
    };
  
    const quiz = await Quiz.findOne(query);
    if (!quiz) {
      return next(errorHandler(404, "Quiz Not Found"));
    }
    quiz.questions = payload.qArr;
    quiz.timer = payload.timer;
    await quiz.save();
    return res.status(200).json({
      status: "OK",
      message: "Quiz Updated Succssfully",
      quizId: quizId,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
//  All quizs
router.get("/quizs", isLoggedIn, async (req, res, next) => {
  try {
    
    const userId = req.userId;
    const quizs = await Quiz.find({ userId: userId });
    if(!quizs){
      return;
    }
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const data = quizs.map((quiz) => ({
      quizName: quiz.quizName,
      impressions: quiz.impressions,
      createdOn: quiz.createdAt.toLocaleDateString("en-US", options),
      questions: quiz.questions.length,
      quizId: quiz._id,
    }));

    res.status(200).json({
      status: "OK",
      data: data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Fetch for edit 
router.get("/fetch/:quizId", isLoggedIn, async (req, res, next) => {
  try {
    // console.log("fetch exec");
    const radminId = req.userId;
    const { quizId } = req.params;
    const query = {
      $and: [
        { userId: { $eq: radminId } },
        { _id: { $eq: quizId.toString() } },
      ],
    };
    const quizData = await Quiz.find(query);
    if (!quizData) {
      return next(errorHandler(404, "Quiz Not Found"));
    }
  
    res.status(200).json({
      status: "OK",
      quizData: quizData,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
