const { connectDB } = require('../loaders/db');


let getQuestions = connectDB().then(async result => {
    return (await (result.query('SELECT * FROM tblQuestions Q INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID'))).recordset;

});

async function getQuestion(key, value) {
    let x = await connectDB();
    return (await x.query(`SELECT * FROM tblQuestions Q INNER JOIN tblAnswers A on Q.questionID = A.questionID INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID where Q.${key}='${value}'`)).recordset;

}

module.exports = {
    getQuestions,
    getQuestion,


}
