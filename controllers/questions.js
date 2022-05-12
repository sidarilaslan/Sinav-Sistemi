const { connectDB } = require("../loaders/db");

async function getQuestions() {
  let x = await connectDB();
  return await x
    .query(
      "SELECT * FROM tblQuestions Q INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID"
    )
    .then((result) => {
      return x.query(`SELECT * FROM tblAnswers`).then((answers) => {
        result.recordset.forEach((question) => {
          question.answers = answers.recordset.filter(
            (answer) => answer.questionID == question.questionID
          );
          if (question.image != null)
            question.image = `data:${
              question.imageMimeType
            };base64,${question.image.toString("base64")}`;
        });
        return result.recordset;
      });
    });
}

async function getQuestion(questionID) {
  let x = await connectDB();
  return (
    await x
      .query(
        `SELECT * FROM tblQuestions Q INNER JOIN tblAnswers A on Q.questionID = A.questionID INNER JOIN tblSections S on Q.sectionID = S.sectionID INNER JOIN tblUnits U on Q.unitID = U.unitID where Q.questionID='${questionID}'`
      )
      .then((result) => {
        if (result.recordset[0].image != null)
          result.recordset[0].image = `data:${
            result.recordset[0].imageMimeType
          };base64,${result.recordset[0].image.toString("base64")}`;
        return result;
      })
  ).recordset;
}
async function insertQuestion(question, img) {
  return await connectDB().then(async (db) => {
    let isThereUploadedImg = img != undefined;
    return await (isThereUploadedImg
      ? db.input("img", Buffer.from(img.data, "binary"))
      : db
    )
      .query(
        `Insert into tblQuestions OUTPUT Inserted.questionID values('${question.question.questionText}', ${question.question.sectionID}, ${question.question.unitID},${question.question.rightAnswerIndex}` +
          (isThereUploadedImg ? `,@img,'${img?.mimetype}'` : ",NULL,NULL ") +
          ")"
      )
      .then((result) => {
        question.answers.forEach((answer) => {
          db.query(
            `Insert into tblAnswers values('${answer.answerText}', ${result.recordset[0].questionID}, ${answer.answerIndex})`
          );
        });
        return result.recordset[0].questionID;
      });
  });
}

async function updateQuestion(question, img) {
  return await connectDB().then(async (db) => {
    let isThereUploadedImg = img != undefined;

    return await (img != undefined
      ? db.input("img", Buffer.from(img.data, "binary"))
      : db
    )
      .query(
        `Update tblQuestions set questionText='${question.question.questionText}', sectionID=${question.question.sectionID}, unitID=${question.question.unitID}, rightAnswerIndex = ${question.question.rightAnswerIndex} ` +
          (isThereUploadedImg
            ? `,image=@img, imageMimeType='${img.mimetype}' `
            : "") +
          `where questionID=${question.question.questionID}; Select * from tblQuestions where questionID=${question.question.questionID}`
      )
      .then(async (result) => {
        question.answers.forEach((answer) => {
          db.query(
            `Update tblAnswers set answerText='${answer.answerText}' where answerIndex= ${answer.answerIndex} and questionID=${question.question.questionID}`
          );
        });
        return result.recordset;
      });
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
  deleteQuestion,
  updateQuestion,
};
