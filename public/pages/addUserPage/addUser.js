redirectUser([1, 3]);

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
  let formData = new FormData();
  let file_data = $("#file")[0].files[0];
  console.log(file_data);
  formData.append("image", file_data);
  formData.append("user", JSON.stringify(user));

  $.ajax({
    url: "/users/insert",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      alert("Kullanıcı eklendi.");
    },
  });
}
function clean() {
  $("#userName").val("");
  $("#userSurname").val("");
  $("#userMail").val("");
  $("#userPassword").val("");
  $("#userTC").val("");
  $("#userType").children().removeClass("active");
  $("#file").val("");
  $("#userImg").css("background-image", "none");
}
