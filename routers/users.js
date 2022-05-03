const express = require('express');
const { userController } = require('../controllers/index');
const router = express.Router();

router.get('/', (req, res) => {

    userController.getUsers.then(result => {
        res.send(result);
    });



});




module.exports = router;
