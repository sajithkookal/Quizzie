const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// submit quiz
router.post("/:quizId/submit", async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const bodyReceived = req.body;
    const quizDb = await Quiz.findOne({ _id: quizId });
    if (!quizDb) {
      return res.status(404).json({error: "Quiz Not found"});
    }
    let score = 0;
    if (quizDb.quizType === "qna") {
      // qna logic
      const questionsArray = quizDb.questions;
         console.log(questionsArray);
         bodyReceived.forEach((q, index) => {
        const qId = q.questionId;
        const ansId = q.ansSelectedId;
        if (ansId) {
          const qFound = questionsArray.find((que) => {
            // console.log(que);
            return que._id.toString() === qId;
          });
          //  console.log(qFound);
          const optFound = qFound.options.find((op) => {
            return op._id.toString() === ansId.toString();
          });
          if (optFound.isAnswer) {
            score = score + 1;
            quizDb.questions[index].correct =
              quizDb.questions[index].correct + 1;
            quizDb.questions[index].attempted =
              quizDb.questions[index].attempted + 1;
          } else {
            quizDb.questions[index].attempted =
              quizDb.questions[index].attempted + 1;
            quizDb.questions[index].incorrect =
              quizDb.questions[index].incorrect + 1;
          }
        } else {
          quizDb.questions[index].incorrect =
            quizDb.questions[index].incorrect + 1;
        }
      });
      await quizDb.save();
      res.status(200).json({
        status: "OK",
        score: score,
      });
    } else {
      // poll logic
      bodyReceived.forEach((q, index) => {
        const qId = q.questionId;
        const ansId = q.ansSelectedId;
        // console.log(qId, ansId);
        if (ansId) {
          const ansIdx = quizDb.questions[index].options.findIndex((op) => {
            return op._id.toString() === ansId.toString();
          });
          // console.log(ansIdx);
          quizDb.questions[index].options[ansIdx].votes =
            quizDb.questions[index].options[ansIdx].votes + 1;
        }
      });
      await quizDb.save();
      res.status(200).json({
        status: "OK",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
