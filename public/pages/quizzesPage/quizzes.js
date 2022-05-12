$(document).ready(function () {
  redirectUser();
  $.get("/quiz/get/" + USERLOGDATA().userID, function (result) {
    console.log(result);
    let date;
    result.forEach((quiz) => {
      console.log(quiz.date.split("-")[2].split("T")[1].split(":")[0]);
      date = {
        year: quiz.date.split("-")[0],
        month: quiz.date.split("-")[1],
        day: quiz.date.split("-")[2].split("T")[0],
        hour: quiz.date.split("-")[2].split("T")[1].split(":")[0],
        minute: quiz.date.split("-")[2].split("T")[1].split(":")[1],
      };
      console.log(date);

      $("#quizList").append(
        `<tr>
                        <td>${quiz.quizID}</td>
                        <td>${
                          quiz.quizTypeID == 1 ? "Konu Tarama Testi" : "Sınav"
                        }</td>
                        <td class="text-end">${quiz.correctCount}</td>
                        <td class="text-end">${quiz.uncorrectCount}</td>
                        <td class="text-end">${quiz.nullCount}</td>
                        <td class="text-center">${
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
                        <td class="actions text-end">
                            <a href="#" onclick="getQuiz('${
                              quiz.quizID
                            }', 'view')" class="text-primary" data-toggle="tooltip" title=""
                                data-original-title="view"><i class="bi bi-eye-fill"></i></a>
                        </td>
                    </tr>`
      );
    });
  });
});
function getQuiz(quizID) {
  console.log(quizID);
}
