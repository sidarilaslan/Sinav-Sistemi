$(document).ready(function () {
  redirectUser();
  $("#userName").val(getUser().name);
  $("#userSurname").val(getUser().surname);
  $("#userMail").val(getUser().mail);
  $("#userPassword").val(getUser().password);
  $("#userTC").val(getUser().tcNO);
  $("#userType" + getUser().userTypeID).addClass("active");
  if (getUser().image != null)
    $("#userImg").css("background-image", "url(" + getUser().image + ")");
});
function submit() {
  let user = {
    userID: getUser().userID,
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
