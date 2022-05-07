const express = require("express");
const { questionController } = require("../controllers/index");
const router = express.Router();

router.get("/", (req, res) => {
  questionController.getQuestions().then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/insert", (req, res) => {
  questionController
    .insertQuestion(req.body.question, req.body.answers)
    .then((result) => {
      questionController.insertAnswers(result, req.body.answers);
      res.redirect("/questions");
    });
});
router.get("/get", (req, res) => {
  questionController.getQuestions31().then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/select/:key/:value", (req, res) => {
  questionController
    .getQuestion(req.params.key, req.params.value)
    .then((result) => {
      console.log(result);
      res.send(result);
      res.end();
    });
});

module.exports = router;
