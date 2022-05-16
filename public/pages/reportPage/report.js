$(document).ready(function () {
  redirectUser();
  $.get("/quiz/get/quizzes/" + USERLOGDATA().userID, async function (quizzes) {
    let quizIDs = quizzes.map((quiz) => quiz.quizID);
    console.log(quizIDs);
    let questions = [];
    for (let quizID of quizIDs) {
      questions = [
        ...questions,
        ...(await $.get("/quiz/get/quizQuestions/" + quizID).then(
          async (questionIDs) => {
            questionIDs = questionIDs
              .filter((quiz) => quiz.quizID == quizID)
              .map((re) => {
                return {
                  questionID: re.questionID,
                  answerIndex: re.answerIndex,
                };
              });
            return questionIDs;
          }
        )),
      ];
    }
    let noDuplicateQuestions = questions.map((questionInfo) => {
      return [questionInfo.questionID, questionInfo];
    });
    noDuplicateQuestions = [...new Map(noDuplicateQuestions).values()];
    noDuplicateQuestions = await getQuestionsWithIDs(noDuplicateQuestions);
    console.log(noDuplicateQuestions);
    noDuplicateQuestions = noDuplicateQuestions.map((question) => {
      return {
        sectionName: question.sectionName,
        unitName: question.unitName,
        isCorrect:
          question.userAnswerIndex != null
            ? question.rightAnswerIndex == question.userAnswerIndex
            : null,
      };
    });
    console.log(noDuplicateQuestions);

    let questionsWithCategories = noDuplicateQuestions.reduce((r, a) => {
      r[a.sectionName] = [
        ...(r[a.sectionName] || []),
        { unitName: a.unitName, isCorrect: a.isCorrect },
      ];
      return r;
    }, {});
    console.log(questionsWithCategories);

    for (const [key, values] of Object.entries(questionsWithCategories)) {
      questionsWithCategories[key] = values.reduce((r, a) => {
        console.log(a);
        console.log(r);
        r = {
          units: r.units || {},
        };
        r.units[a.unitName] = [...(r.units[a.unitName] || []), a.isCorrect];
        return r;
      }, {});
    }
    console.log(questionsWithCategories);
    let result = [];
    for (const [section, values] of Object.entries(questionsWithCategories)) {
      result[section] = {
        ...values,
        ...{ correctCount: 0, uncorrectCount: 0, nullCount: 0 },
      };
      for (const [unit, values1] of Object.entries(
        questionsWithCategories[section].units
      )) {
        result[section].units[unit] = {
          ...{ answers: values1 },
          ...{ correctCount: 0, uncorrectCount: 0, nullCount: 0 },
        };
        for (let isCorrect of questionsWithCategories[section].units[unit]
          .answers) {
          switch (isCorrect) {
            case true:
              result[section].units[unit].correctCount++;
              result[section].correctCount++;
              break;
            case false:
              result[section].units[unit].uncorrectCount++;
              result[section].uncorrectCount++;
              break;
            case null:
              result[section].units[unit].nullCount++;
              result[section].nullCount++;
              break;
          }
        }
      }
    }
    console.log(result);
    appendReportHTML(result);
    getProgress();
  });

  async function getQuestionsWithIDs(quizQuestions) {
    let questions = [];
    for (let [i, quizQuestion] of quizQuestions.entries())
      questions.push(
        await $.get("/questions/getv2/" + quizQuestion.questionID).then(
          (question) => {
            question.userAnswerIndex = quizQuestions[i].answerIndex;
            return question;
          }
        )
      );
    return questions;
  }
  function getPercent(obj) {
    return (
      (obj.correctCount * 100) /
      (obj.correctCount + obj.uncorrectCount + obj.nullCount)
    );
  }
  function appendReportHTML(report) {
    let unitsHTMLS = "";
    for (let [section] of Object.entries(report)) {
      unitsHTMLS = "";
      console.log(report[section]);
      for (let [unit] of Object.entries(report[section].units)) {
        unitsHTMLS += `
        <div class="col-12 table-item border-right">
          <div class="unit text-start">${unit}</div>
          <div>${report[section].units[unit].correctCount}</div>
          <div>${report[section].units[unit].uncorrectCount}</div>
          <div>${report[section].units[unit].nullCount}</div>
          <div class="h4 font-weight-bold mb-0">${getPercent(
            report[section].units[unit]
          )}%
          </div>
        </div>`;
      }

      $("#reports").append(
        `<div class="row report-item">
            <div class=" border shadow">
            <div class="col-md-4">
              <h2 class="h6 font-weight-bold text-center mb-4">
                ${section}
              </h2>

              <!-- Progress bar 1 -->
              <div class="progress mx-auto" data-value="${getPercent(
                report[section]
              )}">
                <span class="progress-left">
                  <span class="progress-bar border-primary"></span>
                </span>
                <span class="progress-right">
                  <span class="progress-bar border-primary"></span>
                </span>
                <div
                  class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                >
                  <div class="h2 font-weight-bold">
                  ${getPercent(report[section])}<sup class="small">%</sup>
                  </div>
                </div>
              </div>
              </div>
              <div class="col-md-8 report-table">
              <div class="table-head">
                <div class="text-start">Ünite</div>
                <div>Doğru</div>
                <div>Yanlış</div>
                <div>Boş</div>
                <div>Oran</div>
              </div>
              ${unitsHTMLS}
              </div>
            </div>
          </div>`
      );
    }
  }
  function percentageToDegrees(percentage) {
    return (percentage / 100) * 360;
  }
  function getProgress() {
    $(".progress").each(function () {
      var value = $(this).attr("data-value");
      var left = $(this).find(".progress-left .progress-bar");
      var right = $(this).find(".progress-right .progress-bar");

      if (value > 0) {
        if (value <= 50) {
          right.css(
            "transform",
            "rotate(" + percentageToDegrees(value) + "deg)"
          );
        } else {
          right.css("transform", "rotate(180deg)");
          left.css(
            "transform",
            "rotate(" + percentageToDegrees(value - 50) + "deg)"
          );
        }
      }
    });
  }
});
