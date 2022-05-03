const { connectDB } = require('../loaders/db');

let getUsers = connectDB().then(async result => {
    return (await (result.query('SELECT * FROM tblUsers'))).recordset;

});

async function getUser(key, value) {
    let x = await connectDB();
    return (await x.query(`SELECT * FROM tblUsers where ${key}='${value}'`)).recordset;

}

// let getUser = (userID) => {

//     console.log(userID);
//     connectDB().then(async result => {
//         return (await result.input('input_parameter', sql.Int, userID).query('SELECT * FROM tblUsers where userID = @input_parameter')).recordset;

//     });
// }


module.exports = {
    getUsers,
    getUser

}
