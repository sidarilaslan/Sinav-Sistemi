const express = require("express");
const fileUpload = require("express-fileupload");
const { questionController } = require("../controllers/index");
const router = express.Router();
router.use(fileUpload());

router.post("/insert", (req, res) => {
  questionController
    .insertQuestion(JSON.parse(req.body.question), req.files?.image)
    .then((result) => {
      res.send({ questionID: result });
      res.end();
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
router.get("/getv2/:questionID", (req, res) => {
  questionController.getQuestionV2(req.params.questionID).then((result) => {
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
    .updateQuestion(JSON.parse(req.body.question), req.files?.image)
    .then((result) => {
      res.send(result);
      res.end();
    });
});
// router.post("/update", (req, res) => {
//   questionController
//     .updateQuestion(req.body.question, req.body.answers)
//     .then((result) => {
//       res.send(result);
//       res.end();
//     });
// });
// router.post("/uploadImage", (req, res) => {
//   console.log(JSON.parse(req.body.question));
//   // questionController.uploadImgQuestion(req.files.file).then(async (result) => {
//   //   console.log(result);
//   //   res.send(`data:image/png;base64,${result.toString("base64")}`);
//   //   res.end();
//   // });
// });

module.exports = router;
