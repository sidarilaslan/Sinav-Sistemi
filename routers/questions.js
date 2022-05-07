const express = require("express");
const { questionController } = require("../controllers/index");
const router = express.Router();
router.post("/insert", (req, res) => {
  questionController.insertQuestion(req.body.question).then((result) => {
    questionController.insertAnswers(result, req.body.answers);
  });
});
router.get("/get", (req, res) => {
  questionController.getQuestions().then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/get/:questionID", (req, res) => {
  questionController.getQuestion(req.params.questionID).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/delete", (req, res) => {
  questionController.deleteQuestion(req.body.questionID).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/update", (req, res) => {
  questionController
    .updateQuestion(req.body.question, req.body.answers)
    .then((result) => {
      res.send(result);
      res.end();
    });
});

module.exports = router;
