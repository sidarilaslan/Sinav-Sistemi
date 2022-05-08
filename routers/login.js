const express = require("express");
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const { randomNumController, userController } = require('../controllers/index');

router.use(express.urlencoded({ extended: false }));
router.use(express.json());


router.get('/', (res, req) => {
    req.sendFile(path.resolve(__dirname, '../public/pages/loginPage/login.html'));

});

router.post('/login', (req, res) => {
    userController.searchUser(req.body.mail, req.body.password).then(result => {
        if (result.length > 0) {
            res.send(true);
            res.end();
        }
        else {
            res.send(false);
            res.end();
        }
    });

});




router.post('/forget', (res, req) => {

    const transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'steamsidar@gmail.com',
            pass: 'npubbeegdmtgkawg'
        }
    });
    const code = randomNumController.randNum();
    const mailOptions = {
        from: 'steamsidar@gmail.com',
        to: res.body.mail,
        subject: 'Sidar ilaslan tarafından gönderildi',
        text: `Şifremi unuttum Kodu: ${code}`
    }

    transpoter.sendMail(mailOptions, (err, info) => {
        if (err) {
            req.send(false);
            req.end();
        }
        else {
            req.send(`${code}`);
            req.end();

        }
    });


});



module.exports = router;


