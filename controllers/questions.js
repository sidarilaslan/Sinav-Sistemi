const { connectDB } = require("../loaders/db");

async function getQuestions() {
  let x = await connectDB();
  return (
    await x.query(
      "SELECT * FROM tblQuestions Q INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID"
    )
  ).recordset;
}

async function getQuestion(questionID) {
  let x = await connectDB();
  return (
    await x.query(
      `SELECT * FROM tblQuestions Q INNER JOIN tblAnswers A on Q.questionID = A.questionID INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID where Q.questionID='${questionID}'`
    )
  ).recordset;
}
async function insertQuestion(question) {
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
  answers.forEach((answer) => {
    x.query(
      `Insert into tblAnswers values('${answer.answerText}', ${result[0].questionID}, ${answer.answerIndex})`
    );
  });
}
async function updateQuestion(question, answers) {
  let x = await connectDB();
  question = JSON.parse(question);
  answers = JSON.parse(answers);
  await x.query(
    `Update tblQuestions set questionText='${question.questionText}' , sectionID=${question.sectionID}, unitID=${question.unitID},picturePath='resim yolu' ,rightAnswerIndex=${question.rightAnswerIndex} where questionID=${question.questionID}`
  );
  answers.forEach((answer) => {
    x.query(
      `Update tblAnswers set answerText='${answer.answerText}' where answerIndex= ${answer.answerIndex} and questionID=${question.questionID}`
    );
  });
}
async function deleteQuestion(questionID) {
  let x = await connectDB();
  x.query(`Delete from tblAnswers where questionID = ${questionID}`);
  return (
    await x.query(`Delete from tblQuestions where questionID = ${questionID}`)
  ).recordset;
}
module.exports = {
  getQuestions,
  getQuestion,
  insertQuestion,
  insertAnswers,
  deleteQuestion,
  updateQuestion,
};
