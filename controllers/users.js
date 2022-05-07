const { connectDB } = require("../loaders/db");

async function getUsers() {
  let x = await connectDB();
  return (await x.query("SELECT * FROM tblUsers")).recordset;
}

async function getUser(key, value) {
  let x = await connectDB();
  return (await x.query(`SELECT * FROM tblUsers where ${key}='${value}'`))
    .recordset;
}
async function searchUser(mail, password) {
  let x = await connectDB();
  return (
    await x.query(
      `SELECT * FROM tblUsers WHERE mail = '${mail}' AND password = '${password}'`
    )
  ).recordset;
}
async function insertUser(user) {
  let x = await connectDB();
  return (
    await x.query(
      `Insert into tblUsers values('${user.name}','${user.surName}', '${user.mail}','${user.password}',${user.userTypeID},'${user.tcNO}')`
    )
  ).recordset;
}
async function updateUser(user) {
  let x = await connectDB();
  return (
    await x.query(
      `Update tblUsers set name='${user.name}',surname='${user.surName}', mail='${user.mail}', password='${user.password}', userTypeID=${user.userTypeID},tcNO='${user.tcNO}' where userID=${user.userID}`
    )
  ).recordset;
}
async function deleteUser(userID) {
  let x = await connectDB();
  return (await x.query(`Delete from tblUsers where userID = ${userID}`))
    .recordset;
}

module.exports = {
  getUsers,
  getUser,
  searchUser,
  insertUser,
  updateUser,
  deleteUser,
};
