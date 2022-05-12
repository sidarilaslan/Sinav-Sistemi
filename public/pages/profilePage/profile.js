$(document).ready(function () {
  redirectUser();
  $("#userName").val(USERLOGDATA().name);
  $("#userSurname").val(USERLOGDATA().surname);
  $("#userMail").val(USERLOGDATA().mail);
  $("#userPassword").val(USERLOGDATA().password);
  $("#userTC").val(USERLOGDATA().tcNO);
  $("#userType" + USERLOGDATA().userTypeID).addClass("active");
  if (USERLOGDATA().image != null)
    $("#userImg").css("background-image", "url(" + USERLOGDATA().image + ")");
});
function submit() {
  let user = {
    userID: USERLOGDATA().userID,
    password: $("#userPassword").val(),
  };
  let formData = new FormData();
  let file_data = $("#file")[0].files[0];
  formData.append("image", file_data);
  formData.append("user", JSON.stringify(user));

  $.ajax({
    url: "/users/updateProfile",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      resetUserStorage();
      alert("Profil düzenleme başarılı.");
      location.reload();
    },
  });
}
