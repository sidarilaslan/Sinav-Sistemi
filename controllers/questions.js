const { connectDB } = require("../loaders/db");

async function getQuestions() {
  let x = await connectDB();
  return (
    await x.query(
      "SELECT * FROM tblQuestions Q INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID"
    )
  ).recordset;
}
async function getQuestions31() {
  let x = await connectDB();
  return (
    await x.query(
      "SELECT * FROM tblQuestions Q INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID"
    )
  ).recordset;
}

async function getQuestion(key, value) {
  let x = await connectDB();
  return (
    await x.query(
      `SELECT * FROM tblQuestions Q INNER JOIN tblAnswers A on Q.questionID = A.questionID INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID where Q.${key}='${value}'`
    )
  ).recordset;
}
async function insertQuestion(question, answers) {
  let x = await connectDB();
  question = JSON.parse(question);
  return (
    await x.query(
      `Insert into tblQuestions OUTPUT Inserted.questionID values('${question.questionText}', ${question.sectionID}, ${question.unitID},'resim yolu',${question.rightAnswerIndex})`
    )
  ).recordset;
}
async function insertAnswers(result, answers) {
  let x = await connectDB();
  answers = JSON.parse(answers);
  console.log(result[0].questionID);
  answers.forEach((answer) => {
    console.log(
      `Insert tblAnswers values('${answer.answerText}', ${result[0].questionID}, ${answer.answerIndex})`
    );
    x.query(
      `Insert tblAnswers values('${answer.answerText}', ${result[0].questionID}, ${answer.answerIndex})`
    );
  });
}
module.exports = {
  getQuestions,
  getQuestion,
  insertQuestion,
  insertAnswers,
  getQuestions31,
};
