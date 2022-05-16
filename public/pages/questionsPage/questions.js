let sections = [];
let units = [];
$(document).ready(function () {
  redirectUser([1]);
  $.get("/questions/get", function (questions) {
    $.get("/sections/get", function (_sections) {
      sections = _sections;
    });
    $.get("/units/get", function (_units) {
      units = _units;
    });
    $(questions).each(function (index) {
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
                            <td class="question-confirmed text-center">
                            <input class="form-check-input questionConfirm" type="checkbox" value="${
                              this.questionID
                            }" ${this?.isConfirmed ? "checked" : ""} ${
          USERLOGDATA().userTypeID == 2 ? "" : "disabled"
        }>
                            </td>
                            <td class="actions text-end">
                                <a href="#" onclick="openViewModal('${
                                  this.questionID
                                }', 'view')" class="view" data-toggle="tooltip" title=""
                                    data-original-title="view"><i class="bi bi-eye-fill"></i></a>
                                <a href="#" onclick="openViewModal('${
                                  this.questionID
                                }', 'edit')" class="edit" data-toggle="tooltip" title="" data-original-title="Edit"><i
                                        class="bi bi-pencil-fill"></i></a>
                                <a href="#" onclick="openViewModal('${
                                  this.questionID
                                }', 'remove')" class="text-danger" data-toggle="tooltip" title=""
                                    data-original-title="Delete"><i class="bi bi-trash3-fill"></i></a>
                            </td>
                        </tr>
                  `
      );
    });
    $(".questionConfirm").change(function () {
      let data = {
        questionID: this.value,
        isConfirmed: this.checked,
      };
      $.post(
        "/questions/updateConfirmQuestion",
        {
          questionID: this.value,
          isConfirmed: this.checked,
        },
        function (result) {}
      );
    });
  });
});
function openViewModal(questionID, modalType) {
  toggleUserViewModal();
  $.get("/questions/get/" + questionID, function (question) {
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
  if (question[0].image != null)
    $("#questionImg").css("background-image", "url(" + question[0].image + ")");
  $("#section").children().remove();
  sections.forEach((section) => {
    $("#section").append(
      '<option value="' +
        section.sectionID +
        '">' +
        section.sectionName +
        "</option>"
    );
  });
  $("#section")
    .on("change", function (event) {
      $("#unit").children().remove();
      units
        .filter((x) => x.sectionID == event.target.value)
        .forEach((unit) => {
          $("#unit").append(
            '<option value="' + unit.unitID + '">' + unit.unitName + "</option>"
          );
        });
    })
    .val(question[0].sectionID[0])
    .change()
    .attr("disabled", isDisabled);
  $("#unit").val(question[0].unitID[0]).attr("disabled", isDisabled);

  question.forEach(function (answer) {
    $("#answer" + answer.answerIndex)
      .val(answer.answerText)
      .attr("disabled", isDisabled);
  });
  $("#answer" + question[0].rightAnswerIndex)
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
      rightAnswerIndex: parseInt(
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
    let formData = new FormData();
    let file_data = $("#file")[0].files[0];
    formData.append("image", file_data);
    formData.append(
      "question",
      JSON.stringify({
        question: question,
        answers: answers,
      })
    );

    $.ajax({
      url: "/questions/update",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        location.reload();
      },
    });
  } else toggleUserViewModal();
}
function removeAlert(questionID) {
  if (confirm("Bu soruyu silmeye emin misiniz?")) {
    $.post("/questions/delete", { questionID: questionID }, function (data) {
      location.reload();
    });
  }
}
function toggleUserViewModal() {
  $("#questionViewModal").toggleClass("show");
  $("#questionViewModal").toggleClass("fade");
}
