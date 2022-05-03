const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (res, req) => {
    req.sendFile(path.resolve(__dirname, '../public/pages/loginPage/login.html'));

});


router.get('/users.html', (res, req) => { //kaldirilacak
    req.sendFile(path.resolve(__dirname, '../public/pages/usersPage/users.html'));

});




module.exports = router;