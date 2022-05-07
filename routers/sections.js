const express = require("express");
const { sectionController } = require("../controllers/index");
const router = express.Router();
router.get("/get", (req, res) => {
  sectionController.getSections().then((result) => {
    res.send(result);
    res.end();
  });
});

module.exports = router;
