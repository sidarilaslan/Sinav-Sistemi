function submit() {
  let user = {
    name: $("#userName").val(),
    surName: $("#userSurname").val(),
    mail: $("#userMail").val(),
    password: $("#userPassword").val(),
    tcNO: $("#userTC").val(),
    userTypeID: parseInt(
      $("#userType").children(".active").attr("id").slice(8)
    ),
  };
  addUser(user);
  clean();
}
function addUser(user) {
  $.post("/users/insert", user, function (data) {
    alert("Bu kullanıcı eklendi.");
    location.reload();
  });
}
function clean() {
  $("#userName").val("");
  $("#userSurname").val("");
  $("#userMail").val("");
  $("#userPassword").val("");
  $("#userTC").val("");
  $("#userType").children().removeClass("active");
}
