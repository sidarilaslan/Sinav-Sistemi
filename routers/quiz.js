const express = require("express");
const { quizController } = require("../controllers/index");
const router = express.Router();
router.get("/section/:sectionId", (req, res) => {
  let path = require("path");
  res.sendFile(
    path.resolve(__dirname + "/../public/pages/quizModule/quiz.html")
  );
});
router.get("/view/:quizID", (req, res) => {
  let path = require("path");
  res.sendFile(
    path.resolve(__dirname + "/../public/pages/quizModule/quiz.html")
  );
});
router.get("/quiz", (req, res) => {
  let path = require("path");
  res.sendFile(
    path.resolve(__dirname + "/../public/pages/quizModule/quiz.html")
  );
});
router.post("/insert", (req, res) => {
  req.body.answers = JSON.parse(req.body.answers);
  quizController.insertQuiz(req.body).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/updateUserAnalysis", (req, res) => {
  quizController.updateUserAnalysis(req.body).then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/get/quizzes/:userID", (req, res) => {
  quizController.getUserQuizzes(req.params.userID).then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/get/quizQuestions/:quizID", (req, res) => {
  quizController.getQuizQuestions(req.params.quizID).then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/get/userAnalysis/:userID", (req, res) => {
  quizController.getUserAnalysis(req.params.userID).then((result) => {
    res.send(result);
    res.end();
  });
});

module.exports = router;
