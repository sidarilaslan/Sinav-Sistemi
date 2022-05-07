const express = require("express");
const { unitController } = require("../controllers/index");
const router = express.Router();
router.get("/get", (req, res) => {
  unitController.getUnits().then((result) => {
    res.send(result);
    res.end();
  });
});

module.exports = router;
