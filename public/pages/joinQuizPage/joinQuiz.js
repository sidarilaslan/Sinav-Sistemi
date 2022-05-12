$(document).ready(function () {
  redirectUser();
  $.get("/sections/get", function (sections) {
    sections.forEach((section) => {
      $("#sectionsSelect").append(
        `<option value="${section.sectionID}"> ${section.sectionName}</option>`
      );
    });
    $("#sectionsSelect").on("change", function () {
      $("#sectionQuizButton").prop("disabled", this.value == "Konu Seçin");
    });
  });
});
function sectionQuizSubmit() {
  window.open("/quiz/section/" + $("#sectionsSelect").val());
}
