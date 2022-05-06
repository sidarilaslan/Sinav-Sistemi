let konular = [
  {
    sectionID: 1,
    sectionName: "Matematik",
  },
  {
    sectionID: 2,
    sectionName: "Kimya",
  },
];
let uniteler = [
  {
    unitID: 4,
    unitName: "Carpma",
    sectionID: 1,
  },
  {
    unitID: 5,
    unitName: "Bolme",
    sectionID: 1,
  },
  {
    unitID: 6,
    unitName: "Organik kimya",
    sectionID: 2,
  },
];
$(document).ready(function () {
  $.getJSON("/questions", function (users) {
    $(users).each(function (index) {
      $("#questionList").append(
        `
              <tr class="question-item">
                        <td class="question-id">${this.questionID}</td>
                        <td class="question-text">
                            <p class="mb-0">${this.questionText}</p>
                        </td>
                        <td class="question-section text-end">
                            <p>${this.sectionName}</p>
                        </td>
                        <td class="question-unit text-end">
                            <p>${this.unitName}</p>
                        </td>
                        <td class="actions text-end">
                            <a href="#" onclick="openViewModal('${this.questionID}', 'view')" class="text-primary" data-toggle="tooltip" title=""
                                data-original-title="view"><i class="bi bi-eye-fill"></i></a>
                            <a href="#" onclick="openViewModal('${this.questionID}', 'edit')" class="text-info" data-toggle="tooltip" title="" data-original-title="Edit"><i
                                    class="bi bi-pencil-fill"></i></a>
                            <a href="#" onclick="openViewModal('${this.questionID}', 'remove')" class="text-danger" data-toggle="tooltip" title=""
                                data-original-title="Delete"><i class="bi bi-trash3-fill"></i></a>
                        </td>
                    </tr>
              `
      );
    });
  });
});
function openViewModal(questionID, modalType) {
  toggleUserViewModal();
  $.getJSON("/questions/questionID/" + questionID, function (question) {
    setViewModal(question, modalType);
  });
}
function setViewModal(question, modalType) {
  let isDisabled = modalType == "view" || modalType == "remove" ? true : false;
  $("#btnSubmitQuestion").attr(
    "onClick",
    "submitQuestion(" +
      question[0].questionID[0] +
      ",'" +
      (modalType == "edit" ? "edit" : "view") +
      "')"
  );
  $("#btnDeleteQuestion").attr(
    "onClick",
    "removeAlert(" + question[0].questionID[0] + ")"
  );
  $("#questionText").val(question[0].questionText).attr("disabled", isDisabled);
  $("#section").children().remove();
  konular.forEach((konu) => {
    $("#section").append(
      '<option value="' + konu.sectionID + '">' + konu.sectionName + "</option>"
    );
  });
  $("#section")
    .on("change", function (event) {
      $("#unit").children().remove();
      uniteler
        .filter((x) => x.sectionID == event.target.value)
        .forEach((unite) => {
          $("#unit").append(
            '<option value="' +
              unite.unitID +
              '">' +
              unite.unitName +
              "</option>"
          );
        });
    })
    .val(question[0].sectionID[0])
    .change()
    .attr("disabled", isDisabled);
  $("#unit").val(question[0].unitID[0]).attr("disabled", isDisabled);

  question.forEach(function (answer, index) {
    $("#answer" + index)
      .val(answer.answerText)
      .attr("disabled", isDisabled);
  });
  $("#answer" + question[0].rightAnswerID)
    .parent()
    .addClass("active")
    .siblings()
    .removeClass("active");
  if (isDisabled) {
    $(".question-stylish").off("click");
  } else {
    $(".question-stylish").on("click", ".stylish", function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  }

  if (modalType == "remove") {
    setTimeout(function () {
      removeAlert(question[0].questionID[0]);
    }, 100);
  }
}
function submitQuestion(questionID, modalType) {
  if (modalType == "edit") {
    let question = {
      questionID: questionID,
      questionText: $("#questionText").val(),
      sectionID: parseInt($("#section").val()),
      unitID: parseInt($("#unit").val()),
      rightAnswerID: parseInt(
        $("#answers").children(".active").children("input").attr("id").slice(6)
      ),
    };
    let answers = [];
    $("#answers")
      .children()
      .children("input")
      .each(function (index) {
        answers.push({
          answerText: this.value,
          answerIndex: index,
          questionID: questionID,
        });
      });
    console.log(question);
    console.log(answers);
  }
  toggleUserViewModal();
}
function removeAlert(questionID) {
  if (confirm("Bu soruyu silmeye emin misiniz? " + questionID)) {
    //DATABASE'den questionID olanı sil.
    console.log("Bu kullanici silindi: " + questionID);
  }
}
function toggleUserViewModal() {
  $("#questionViewModal").toggleClass("show");
  $("#questionViewModal").toggleClass("fade");
}
