const { connectDB } = require("../loaders/db");

async function getSections() {
  let x = await connectDB();
  return (await x.query("SELECT * FROM tblSections")).recordset;
}
module.exports = {
  getSections,
};
