$(document).ready(async function () {
  let QUESTIONCOUNT = 5;
  let QUESTIONTIME = 60; //seconds
  if (location.pathname.replace("/quiz/", "").includes("view")) {
    let quizID = location.pathname.replace("/quiz/view/", "");
    $.get("/quiz/get/quizzes/" + USERLOGDATA().userID, function (result) {
      let quizInfo = result.filter((x) => x.quizID == quizID)[0];
      let date = {
        year: quizInfo.date.split("-")[0],
        month: quizInfo.date.split("-")[1],
        day: quizInfo.date.split("-")[2].split("T")[0],
        hour: quizInfo.date.split("-")[2].split("T")[1].split(":")[0],
        minute: quizInfo.date.split("-")[2].split("T")[1].split(":")[1],
      };
      $("#headerText").text("Sınav Sonuçları");
      $("#headerSubText").remove();
      $("#submitButton").remove();
      $("#timer").remove();
      $("#footer").append(
        `<div class="quiz-result">
          <table class="table">
            <thead class="head">
              <tr>
                <th class="text-center">Doğru</th>
                <th class="text-center">Yanlış</th>
                <th class="text-center">Boş</th>
                <th class="text-center">Tarih</th>
              </tr>
            </thead>
            <tbody class="body">
              <tr>
                <td class="text-center correct">${quizInfo.correctCount}</td>
                <td class="text-center uncorrect">${
                  quizInfo.uncorrectCount
                }</td>
                <td class="text-center null">${quizInfo.nullCount}</td>
                <td class="text-center date">${
                  date.year +
                  "-" +
                  date.month +
                  "-" +
                  date.day +
                  " " +
                  date.hour +
                  ":" +
                  date.minute
                }</td>
              </tr>
            </tbody>
          </table>
        </div>`
      );
    });
    $.get("/quiz/get/quizQuestions/" + quizID, async function (result) {
      result = result.filter((quiz) => quiz.quizID == quizID);
      let questions = await getQuestionsWithIDs(
        result.map((question) => question.questionID)
      );
      questions.forEach((question, index) => {
        question.userAnswer = result[index].answerIndex;
        addToHTMLList(question, index, question.answers);
      });
    });
  } else {
    let questions = [];
    if (location.pathname.replace("/quiz/", "").includes("section")) {
      let quizSectionID = location.pathname.replace("/quiz/section/", "");
      await $.get("/questions/get", (dbQuestions) => {
        questions = selectRandomItems(
          dbQuestions.filter(
            (question) =>
              question.sectionID[0] == quizSectionID &&
              question.isConfirmed == 1
          ),
          QUESTIONCOUNT
        );
      });
    } else if (location.pathname.replace("/quiz/", "").includes("quiz")) {
      await $.get("/quiz/get/userAnalysis/" + USERLOGDATA().userID).then(
        async (dbRequiredQuestionIDs) => {
          questions = dbRequiredQuestionIDs
            .filter((question) => {
              question.dateToAsk = new Date(
                question.lastAskedDate.split(".")[0]
              );
              question.dateToAsk.setDate(
                question.dateToAsk.getDate() +
                  USERLOGDATA().settings.frequencies[question.correctCount - 1]
              );
              return question.dateToAsk <= new Date();
            })
            .sort(function (a, b) {
              return (
                new Date(a.lastAskedDate).setDate(
                  new Date(a.lastAskedDate).getDate() +
                    USERLOGDATA().settings.frequencies[a.correctCount - 1]
                ) -
                new Date(b.lastAskedDate).setDate(
                  new Date(b.lastAskedDate).getDate() +
                    USERLOGDATA().settings.frequencies[b.correctCount - 1]
                )
              );
            })
            .slice(0, QUESTIONCOUNT);
          sessionStorage.setItem("userAnalysis", JSON.stringify(questions));
          questions = questions.map((question) => question.questionID);
          questions = await getQuestionsWithIDs(questions);
          if (QUESTIONCOUNT - questions.length > 0) {
            await $.get("/questions/get", (dbQuestions) => {
              dbQuestions = selectRandomItems(
                dbQuestions.filter(
                  (dbQuestion) =>
                    !dbRequiredQuestionIDs
                      .map((question) => question.questionID)
                      .includes(dbQuestion.questionID) &&
                    dbQuestion.isConfirmed == 1
                ),
                QUESTIONCOUNT - questions.length
              );
              questions = [...questions, ...dbQuestions];
            });
          }
          return questions;
        }
      );
    }
    QUESTIONCOUNT = questions.length;
    if (QUESTIONCOUNT == 0) {
      alert("Şu anda çözebileceğiniz uygun soru bulunmamaktadır.");
      window.close();
    } else {
      questions.forEach((question, index) =>
        addToHTMLList(
          question,
          index,
          selectRandomItems(question.answers, question.answers.length)
        )
      );
      $("#timer")
        .data("seconds-left", QUESTIONTIME * questions.length)
        .startTimer({
          onComplete: function () {
            submit();
            alert("Süreniz doldu. Cevaplarınız gönderiliyor.");
          },
        });
      sessionStorage.setItem("questions", JSON.stringify(questions));
      sessionStorage.setItem(
        "quiz",
        JSON.stringify({
          quizTypeID: location.pathname
            .replace("/quiz/", "")
            .includes("section")
            ? 1
            : 2,
        })
      );

      $(".btn-group-vertical").on("click", ".btn", function () {
        $(this).addClass("active").siblings().removeClass("active");
      });
    }
  }
});
async function getQuestionsWithIDs(idList) {
  let questions = [];
  for (let id of idList)
    questions.push(
      await $.get("/questions/getv2/" + id, function (question) {
        return question;
      })
    );
  return questions;
}
function addToHTMLList(question, index, answers) {
  let stylishHTMLElement = "";
  answers.forEach((answer, i) => {
    stylishHTMLElement += `<button ${
      question?.userAnswer !== undefined ? "disabled" : ""
    } type="button" class="btn ${
      question?.userAnswer !== undefined
        ? (question.rightAnswerIndex == answer.answerIndex
            ? "rightAnswer "
            : "") +
          (question?.userAnswer == answer.answerIndex
            ? "active " +
              (question?.userAnswer != question.rightAnswerIndex
                ? "false "
                : "")
            : "")
        : ""
    } " value="${answer.answerIndex}">${String.fromCharCode(65 + i)}) ${
      answer.answerText
    }</button>`;
  });

  $("#quizContainer").append(`<div class="container question-item">
        <span class="question-number">${index + 1}</span>
        <div class="question-subject">
              <span>${question.sectionName} </span>|<span> ${
    question.unitName
  }</span>
            </div>
        <div class="question-head">
          ${
            question.image != null
              ? "<div class='question-img'> <img src='" +
                question.image +
                "'> </div>"
              : ""
          }
          <div class="question-text-area">
            <div class="question-text">${question.questionText}</div>
          </div>
        </div>
        <div class="question-stylish ${
          question?.userAnswer == null ? "null" : ""
        } btn-group-vertical">
            ${stylishHTMLElement}
        </div>
      </div>`);
}

function selectRandomItems(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}
function submit() {
  $("#timer").remove();
  $("#submitButton").attr("disabled", true);
  let questions = JSON.parse(sessionStorage.getItem("questions"));
  let userAnswers = [];
  let correctCounter = 0,
    uncorrectCounter = 0,
    nullCounter = 0;
  let activeButton;
  let date = new Date();

  let dateText = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }`;
  let userAnalysis = JSON.parse(sessionStorage.getItem("userAnalysis"));
  let userAnalysisIndex;
  $("#quizContainer")
    .children()
    .children(".question-stylish")
    .each((index, question) => {
      activeButton = Array.from(question.children).filter((chapter) =>
        chapter.classList.contains("active")
      )[0];

      userAnalysisIndex = userAnalysis.findIndex((analysis) => {
        return analysis.questionID === questions[index].questionID;
      });
      if (userAnalysisIndex == -1) {
        userAnalysis.push({
          userID: JSON.parse(localStorage.getItem("user")).userID,
          questionID: questions[index].questionID,
          correctCount: 0,
        });
        userAnalysisIndex = userAnalysis.length - 1;
      }
      userAnalysis[userAnalysisIndex].lastAskedDate = dateText;
      if (activeButton == undefined) {
        nullCounter++;
        userAnalysis[userAnalysisIndex].correctCount = 0;
      } else if (activeButton.value == questions[index].rightAnswerIndex) {
        correctCounter++;
        userAnalysis[userAnalysisIndex].correctCount < 6
          ? userAnalysis[userAnalysisIndex].correctCount++
          : 6;
      } else {
        uncorrectCounter++;
        userAnalysis[userAnalysisIndex].correctCount = 0;
      }
      userAnswers.push({
        questionID: questions[index].questionID,
        answerIndex:
          activeButton != undefined ? parseInt(activeButton.value) : null,
      });
    });
  let quiz = {
    quizTypeID: JSON.parse(sessionStorage.getItem("quiz")).quizTypeID,
    userID: JSON.parse(localStorage.getItem("user")).userID,
    correctCount: correctCounter,
    uncorrectCount: uncorrectCounter,
    nullCount: nullCounter,
    date: dateText,
    answers: JSON.stringify(userAnswers),
  };
  sessionStorage.removeItem("quiz");
  sessionStorage.removeItem("questions");
  $.post("/quiz/insert", quiz, function (result) {
    userAnalysis.forEach((analysis) => {
      $.post("/quiz/updateUserAnalysis", analysis, function (result) {});
    });

    location.replace("/quiz/view/" + result.quizID); //Sınavdan sonra sonuçların hemen gözükmesi için
  });
}
