const express = require("express");
const fileUpload = require("express-fileupload");
const { userController } = require("../controllers/index");
const router = express.Router();
router.use(fileUpload());

router.get("/get", (req, res) => {
  userController.getUsers().then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/insert", (req, res) => {
  userController
    .insertUser(JSON.parse(req.body.user), req.files?.image)
    .then((result) => {
      res.send(result);
      res.end();
    });
});
router.post("/update", (req, res) => {
  userController
    .updateUser(JSON.parse(req.body.user), req.files?.image)
    .then((result) => {
      res.send(result);
      res.end();
    });
});
router.post("/updateProfile", (req, res) => {
  userController
    .updateUserProfile(JSON.parse(req.body.user), req.files?.image)
    .then((result) => {
      res.send(result);
      res.end();
    });
});
router.post("/updateSettings", (req, res) => {
  userController.updateUserSettings(req.body).then((result) => {
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
