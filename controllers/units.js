const { connectDB } = require("../loaders/db");

async function getUnits() {
  let x = await connectDB();
  return (await x.query("SELECT * FROM tblUnits")).recordset;
}
module.exports = {
  getUnits,
};
