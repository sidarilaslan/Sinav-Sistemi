$(document).ready(function () {
  let konular = [
    {
      sectionID: 0,
      sectionName: "Matematik",
    },
    {
      sectionID: 1,
      sectionName: "Kimya",
    },
  ];
  let uniteler = [
    {
      unitID: 4,
      unitName: "Carpma",
      sectionID: 0,
    },
    {
      unitID: 5,
      unitName: "Bolme",
      sectionID: 0,
    },
    {
      unitID: 6,
      unitName: "Organik kimya",
      sectionID: 1,
    },
  ];
  konular.forEach((konu) => {
    $("#section").append(
      '<option value="' + konu.sectionID + '">' + konu.sectionName + "</option>"
    );
  });
  $("#section").on("change", function (event) {
    $("#unit").children().remove();
    uniteler
      .filter((x) => x.sectionID == event.target.value)
      .forEach((unite) => {
        $("#unit").append(
          '<option value="' + unite.unitID + '">' + unite.unitName + "</option>"
        );
      });
  });
});
function addQuestion() {
  let question = {
    questionText: $("#questionText").val(),
    questionSectionID: parseInt($("#section").val()),
    questionUnitID: parseInt($("#unit").val()),
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
  console.log(question);
  console.log(answers);
}
