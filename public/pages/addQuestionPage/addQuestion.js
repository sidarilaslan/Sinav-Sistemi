$(document).ready(function () {
  $.get("/sections/get", function (sections) {
    $.get("/units/get", function (units) {
      sections.forEach((section) => {
        $("#section").append(
          '<option value="' +
            section.sectionID +
            '">' +
            section.sectionName +
            "</option>"
        );
      });
      $("#section").on("change", function (event) {
        $("#unit").children().remove();
        units
          .filter((x) => x.sectionID == event.target.value)
          .forEach((unit) => {
            $("#unit").append(
              '<option value="' +
                unit.unitID +
                '">' +
                unit.unitName +
                "</option>"
            );
          });
      });
    });
  });
});
function addQuestion() {
  let question = {
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
    .each(function (index, value) {
      answers.push({
        answerIndex: index,
        questionID: 99,
        answerText: value.value,
      });
    });

  $.post(
    "/questions/insert",
    { question: JSON.stringify(question), answers: JSON.stringify(answers) },
    function (data) {}
  );
  alert("Soru eklendi.");
  location.reload();
}
