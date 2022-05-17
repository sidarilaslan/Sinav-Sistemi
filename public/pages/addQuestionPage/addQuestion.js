$(document).ready(function () {
  redirectUser([1]);

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
  if (parseInt($("#section").val()) != 0) {
    if (
      $("#answers").children(".active").children("input").attr("id") !==
      undefined
    ) {
      let question = {
        questionText: $("#questionText").val(),
        sectionID: parseInt($("#section").val()),
        unitID: parseInt($("#unit").val()),
        rightAnswerIndex: parseInt(
          $("#answers")
            .children(".active")
            .children("input")
            .attr("id")
            .slice(6)
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
        url: "/questions/insert",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function () {
          alert("Soru eklendi.");
          location.reload();
        },
      });
    } else alert("Lütfen doğru olan şıkkı seçiniz.");
  } else alert("Lütfen konu seçiniz.");
}
