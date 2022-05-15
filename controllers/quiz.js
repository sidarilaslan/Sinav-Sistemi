const { connectDB } = require("../loaders/db");

async function getUserQuizzes(userID) {
  let x = await connectDB();
  return await x
    .query(`SELECT * FROM tblQuizzes where userID =${userID}`)
    .then((result) => {
      return result.recordset;
    });
}
async function getQuizQuestions(quizID) {
  return await connectDB().then((db) => {
    return db
      .query(`SELECT * FROM tblQuizQuestions where quizID =${quizID}`)
      .then((result) => {
        console.log(result.recordset);
        return result.recordset;
      });
  });
}

async function insertQuiz(quiz) {
  return await connectDB().then(async (db) => {
    return await db
      .query(
        `Insert into tblQuizzes OUTPUT Inserted.quizID values(${quiz.quizTypeID},${quiz.userID},${quiz.correctCount},${quiz.uncorrectCount},${quiz.nullCount},'${quiz.date}')`
      )
      .then((result) => {
        let quizID = result.recordset[0].quizID;
        quiz.answers.forEach((answer) => {
          db.query(
            `Insert into tblQuizQuestions values(${quizID},${answer.questionID},${answer.answerIndex})`
          );
        });
        return result.recordset[0];
      });
  });
}
async function getUserAnalysis(userID) {
  return (await connectDB())
    .query(`SELECT * FROM tblUserAnalysis where userID=${userID}`)
    .then((result) => {
      console.log(result.recordset);
      return result.recordset;
    });
}
async function updateUserAnalysis(analysis) {
  console.log(analysis);
  return (await connectDB())
    .query(
      `IF EXISTS (SELECT * FROM tblUserAnalysis WHERE questionID= ${analysis.questionID} AND userID= ${analysis.userID})
    BEGIN
        IF (${analysis.correctCount} = 0)
	      BEGIN
          DELETE from tblUserAnalysis WHERE questionID = ${analysis.questionID} AND userID= ${analysis.userID}
	      END
	      BEGIN
        UPDATE tblUserAnalysis
            SET correctCount = ${analysis.correctCount} , lastAskedDate = '${analysis.lastAskedDate}'
            WHERE questionID= ${analysis.questionID} AND userID= ${analysis.userID}
        END
    END
    ELSE
    BEGIN
    IF (${analysis.correctCount} != 0)
    BEGIN
      Insert into tblUserAnalysis values(${analysis.userID}, ${analysis.questionID}, ${analysis.correctCount}, '${analysis.lastAskedDate}')
      END
    END`
    )
    .then((result) => {
      console.log(result.recordset);
      return result.recordset;
    });
}

module.exports = {
  insertQuiz,
  getUserQuizzes,
  getQuizQuestions,
  getUserAnalysis,
  updateUserAnalysis,
};
