const { connectDB } = require('../loaders/db');

let getUsers = connectDB().then(async result => {
    return (await (result.query('SELECT * FROM tblUser'))).recordset;

});

async function getUser(userID) {
    let x = await connectDB();
    return (await x.query('SELECT * FROM tblUser where userID = ' + userID)).recordset;

}

// let getUser = (userID) => {

//     console.log(userID);
//     connectDB().then(async result => {
//         return (await result.input('input_parameter', sql.Int, userID).query('SELECT * FROM tblUser where userID = @input_parameter')).recordset;

//     });
// }


module.exports = {
    getUsers,
    getUser

}
