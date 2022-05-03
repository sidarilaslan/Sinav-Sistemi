const express = require('express');
const { userController } = require('../controllers/index');
const router = express.Router();

router.get('/', (req, res) => {
    userController.getUsers.then(result => {
        res.send(result);
        res.end();
    });



});


// router.get('/:id', (req, res) => {

//     userController.getUser(req.params.id).then(result => {
//         res.send(result);
//         res.end();
//     });
// });

router.get('/:key/:value', (req, res) => {
    userController.getUser(req.params.key, req.params.value).then(result => {
        res.send(result);
        res.end();
    });

});


// router.get('/ID/:id', (req, res) => {

// });


module.exports = router;
