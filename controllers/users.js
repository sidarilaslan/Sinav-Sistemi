const { connectDB } = require('../loaders/db');


let getUsers = connectDB().then(async result => {
    return (await result.query('SELECT * FROM tblUser')).recordset;

});


module.exports = {
    getUsers
}
