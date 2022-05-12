$(document).ready(function () {
  let QUESTIONCOUNT = 2;
  let QUESTIONTIME = 5; //seconds
  let isSectionQuiz = location.pathname
    .replace("/quiz/", "")
    .includes("section");
  if (isSectionQuiz) {
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

      questions.forEach((question, index) => {
        let stylishHTMLElement = "";
        let answers = selectRandomItems(
          question.answers,
          question.answers.length
        );
        answers.forEach((answer, i) => {
          stylishHTMLElement += `<button type="button" class="btn" value="${
            answer.answerIndex
          }">${String.fromCharCode(65 + i)}) ${answer.answerText}</button>`;
        });

        $("#quizContainer").append(`<div class="container question-item">
        <span class="question-number">${index + 1}</span>
        <div class="question-head">
          <div class="question-img">
          ${question.image != null ? "<img src='" + question.image + "'>" : ""}
          </div>
          <div class="question-text-area">
            <div class="question-subject">
              <span>${question.sectionName} </span>|<span> ${
          question.unitName
        }</span>
            </div>
            <div class="question-text">
            ${question.questionText}
            </div>
          </div>
        </div>
        <div class="question-stylish btn-group-vertical">
          
            ${stylishHTMLElement}
         
        </div>
      </div>`);
      });
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
      sessionStorage.setItem(
        "quiz",
        JSON.stringify({ quizTypeID: isSectionQuiz ? 1 : 2 })
      );

      $(".btn-group-vertical").on("click", ".btn", function () {
        $(this).addClass("active").siblings().removeClass("active");
      });
    });
  }
});
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
      Array.from(question.children).filter((chapter) => {
        if (chapter.value == questions[index].rightAnswerIndex)
          chapter.classList.add("rightAnswer");
        else if (chapter.classList.contains("active"))
          chapter.classList.add("false");
      });

      let activeButton = Array.from(question.children).filter((chapter) =>
        chapter.classList.contains("active")
      )[0];
      if (activeButton == undefined) {
        question.classList.add("null");
        nullCounter++;
      } else if (activeButton.value == questions[index].rightAnswerIndex)
        correctCounter++;
      else uncorrectCounter++;

      answers.push({
        questionID: questions[index].questionID,
        answerIndex:
          activeButton != undefined ? parseInt(activeButton.value) : null,
      });
    });
  let date = new Date();
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
  $.post("/quiz/insert", quiz, function (result) {
    console.log(result);
  });
  console.log(quiz);
}
