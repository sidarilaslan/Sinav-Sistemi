let mailCode;
$(document).ready(function () {
  if (isLoggedIn()) location.replace("./public/pages/profilePage/profile.html");

  $("#btnForgetPassword").click(function () {
    toggleClass("#validationModal", "show", "fade");
  });
  $("#btnCloseValidationModal").click(function () {
    toggleClass("#validationModal", "fade", "show");
  });
  $("#btnCloseSetPasswordModal").click(function () {
    toggleClass("#setPasswordModal", "fade", "show");
  });
});
function toggleClass(id, addClass, removeClass) {
  $(id).addClass(addClass).removeClass(removeClass);
}
function loginSubmit() {
  let data = {
    mail: $("#loginMail").val(),
    password: $("#loginPassword").val(),
  };
  login(data);
}
function login(data) {
  $.post("/login", data, function (result) {
    if (result) {
      result.settings = JSON.parse(result.settings);
      localStorage.setItem("user", JSON.stringify(result));
      location.replace("./public/pages/profilePage/profile.html");
    } else {

      alert("Mail veya şifre yanlış");
      clean();
    }
  });
}
function sendMailSubmit() {
  let data = {
    mail: $("#resetMail").val(),
  };
  $.post("/mailControl", data, function (result) {
    if (result) {
      sendMail(data);
    } else {
      alert("Girilen mail kayıtlı değil");
      clean();
    }

  });
}

function sendMail(data) {
  $("#sendMailCodeButton").prop("disabled", true);
  $.post("/forget", data, function (result) {
    if (result) {
      $("#emailCode").prop("disabled", false);
      $("#resetMail").prop("disabled", false);
      $("#checkMailCodeButton").removeClass("d-none");
      // alert(`test: code-> ${result}`); //test
      mailCode = result;
    } else {
      $("#sendMailCodeButton").prop("disabled", false);

      alert("mail gönderilemedi");
    }
  });
}
function checkMailCode() {
  if ($("#emailCode").val() == mailCode) {
    toggleClass("#validationModal", "fade", "show");
    toggleClass("#setPasswordModal", "show", "fade");
  } else {
    alert("Kod hatalı.");
  }
}
function changePassword() {
  if ($("#resetPassword1").val() == $("#resetPassword1").val()) {
    $("#btnCloseSetPasswordModal").click();
    $.post(
      "/setPassword",
      { mail: $("#resetMail").val(), password: $("#resetPassword1").val() },
      function (result) {
        alert("Şifre güncelleme başarılı.");
      }
    );
  }
}
function clean() {
  $("#loginMail").val("");
  $("#loginPassword").val("");
}
