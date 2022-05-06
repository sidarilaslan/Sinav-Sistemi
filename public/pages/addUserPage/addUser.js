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
  editUser(user);
  clean();
}
function editUser(user) {
  //DATABASE'e user'i gönder.
  console.log("Bu kullanici eklendi: ");
  console.log(user);
}
function clean() {
  $("#userName").val("");
  $("#userSurname").val("");
  $("#userMail").val("");
  $("#userPassword").val("");
  $("#userTC").val("");
  $("#userType").children().removeClass("active");
}
