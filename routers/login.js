const express = require("express");
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const { randomNumController } = require('../controllers/index');

router.use(express.json());


router.get('/', (res, req) => {
    req.sendFile(path.resolve(__dirname, '../public/pages/loginPage/login.html'));

});



router.post('/', (res, req) => {

    const transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'steamsidar@gmail.com',
            pass: 'npubbeegdmtgkawg'
        }
    });

    const mailOptions = {
        from: 'steamsidar@gmail.com',
        to: res.body.email,
        subject: 'Sidar ilaslan tarafından gönderildi',
        text: `Şifremi unuttum Kodu:${randomNumController.randNum}`
    }
    const requestText = {
        isSucess: true,
        code: randomNumController.randNum

    }
    transpoter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            req.send('error');
        }
        else {
            console.log("email send : " + info.response);
            req.send(requestText);

        }
    });


});



module.exports = router;


