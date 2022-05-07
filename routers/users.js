const express = require("express");
const { userController } = require("../controllers/index");
const router = express.Router();

router.get("/get", (req, res) => {
  userController.getUsers().then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/insert", (req, res) => {
  userController.insertUser(req.body).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/update", (req, res) => {
  userController.updateUser(req.body).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/delete", (req, res) => {
  userController.deleteUser(req.body.userID).then((result) => {
    res.send(result);
    res.end();
  });
});
router.get("/get/:key/:value", (req, res) => {
  userController.getUser(req.params.key, req.params.value).then((result) => {
    res.send(result);
    res.end();
  });
});

module.exports = router;
