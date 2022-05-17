const express = require("express");
const router = express.Router();
const path = require("path");
const nodemailer = require("nodemailer");
const { randomNumController, userController } = require("../controllers/index");

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get("/", (res, req) => {
  req.sendFile(path.resolve(__dirname, "../public/pages/loginPage/login.html"));
});

router.post("/login", (req, res) => {
  userController.searchUser(req.body.mail, req.body.password).then((result) => {
    res.send(result);
    res.end();
  });
});
router.post("/setPassword", (req, res) => {
  userController
    .updatePassword(req.body.mail, req.body.password)
    .then((result) => {
      res.send(result);
      res.end();
    });
});
router.post("/mailControl", (req, res) => {
  userController.mailControl(req.body.mail).then((result) => {
    res.send(result);
    res.end();
  });

});
router.post("/forget", (res, req) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sinavsistemi2022@gmail.com",
      pass: "fecgebwrzlwyjtmv",
    },
  });
  const code = randomNumController.randNum();
  const mailOptions = {
    from: "sinavsistemi2022@gmail.com",
    to: res.body.mail,
    subject: "Sınav Sistemi tarafından gönderildi",
    text: `Şifremi unuttum Kodu: ${code}`,
  };

  transpoter.sendMail(mailOptions, (err, info) => {
    if (err) {
      req.send(false);
    } else {
      req.send(`${code}`);
    }
    req.end();

  });
});

module.exports = router;
