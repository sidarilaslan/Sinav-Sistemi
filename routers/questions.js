const express = require('express');
const { questionController } = require('../controllers/index');
const router = express.Router();

router.get('/', (req, res) => {
    questionController.getQuestions.then(result => {
        res.send(result);
        res.end();
    });



});

router.get('/:key/:value', (req, res) => {
    questionController.getQuestion(req.params.key, req.params.value).then(result => {
        console.log(result);
        res.send(result);
        res.end();
    });

});



module.exports = router;
