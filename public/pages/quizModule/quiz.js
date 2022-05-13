$(document).ready(function () {
  let QUESTIONCOUNT = 5;
  let QUESTIONTIME = 2; //seconds
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
    $.get("/quiz/get/quiz/" + quizID, async function (result) {
      let quizQuestionsID = result.filter((quiz) => quiz.quizID == quizID);
      let index = 0;
      for (let quizQuestion of quizQuestionsID) {
        await $.get(
          "/questions/getv2/" + quizQuestion.questionID,
          function (question) {
            question.userAnswer = quizQuestion.answerIndex;
            addToHTMLList(question, index, false);
            index++;
          }
        );
      }
    });
  } else if (location.pathname.replace("/quiz/", "").includes("section")) {
    let quizSectionID = location.pathname.replace("/quiz/section/", "");
    $.get("/questions/get", (result) => {
      result = result.filter(
        (question) => question.sectionID[0] == quizSectionID
      );
      let questions = selectRandomItems(
        result,
        result.length < QUESTIONCOUNT ? result.length : QUESTIONCOUNT
      );
      console.log(result);
      console.log(questions);

      questions.forEach((question, index) => addToHTMLList(question, index));
      $("#timer")
        .data("seconds-left", QUESTIONTIME * questions.length)
        .startTimer({
          onComplete: function () {
            submit();
            alert("Süreniz doldu. Cevaplarınız gönderiliyor.");
          },
        });
      // end of the question foreach
      sessionStorage.setItem("questions", JSON.stringify(questions));
      sessionStorage.setItem("quiz", JSON.stringify({ quizTypeID: 1 }));

      $(".btn-group-vertical").on("click", ".btn", function () {
        $(this).addClass("active").siblings().removeClass("active");
      });
    });
  }
});
function addToHTMLList(question, index, isAnswerRandom = true) {
  if (index == 1) console.log(question.questionText);
  let stylishHTMLElement = "";
  let answers = isAnswerRandom
    ? selectRandomItems(question.answers, question.answers.length)
    : question.answers;
  answers.forEach((answer, i) => {
    stylishHTMLElement += `<button ${
      question?.userAnswer != undefined ? "disabled" : ""
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
function selectRandomItems(array, count) {
  let randomArray = [];
  let alreadyIndexes = [];
  let randomIndex;
  for (let i = 0; i < count; i++) {
    randomIndex = Math.floor(Math.random() * array.length);
    while (alreadyIndexes.includes(randomIndex))
      randomIndex = Math.floor(Math.random() * array.length);
    alreadyIndexes.push(randomIndex);
    randomArray.push(array[randomIndex]);
  }
  return randomArray;
}
function submit() {
  $("#timer").remove();
  let questions = JSON.parse(sessionStorage.getItem("questions"));
  let answers = [];
  let correctCounter = 0,
    uncorrectCounter = 0,
    nullCounter = 0;
  $("#quizContainer")
    .children()
    .children(".question-stylish")
    .each((index, question) => {
      let activeButton = Array.from(question.children).filter((chapter) =>
        chapter.classList.contains("active")
      )[0];
      if (activeButton == undefined) nullCounter++;
      else if (activeButton.value == questions[index].rightAnswerIndex)
        correctCounter++;
      else uncorrectCounter++;

      answers.push({
        questionID: questions[index].questionID,
        answerIndex:
          activeButton != undefined ? parseInt(activeButton.value) : null,
      });
    });
  let date = new Date();
  console.log(date);
  let quiz = {
    quizTypeID: JSON.parse(sessionStorage.getItem("quiz")).quizTypeID,
    userID: JSON.parse(localStorage.getItem("user")).userID,
    correctCount: correctCounter,
    uncorrectCount: uncorrectCounter,
    nullCount: nullCounter,
    date: `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
    answers: JSON.stringify(answers),
  };
  sessionStorage.removeItem("quiz");
  sessionStorage.removeItem("questions");
  $.post("/quiz/insert", quiz, function (result) {
    location.replace("/quiz/view/" + result.quizID); //Sınavdan sonra sonuçların hemen gözükmesi için
  });
}
