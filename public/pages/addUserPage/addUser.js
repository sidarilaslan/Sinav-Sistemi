redirectUser([1, 3]);

function submit() {
  if ($("#userName").val().trim() != "") {
    if ($("#userSurname").val().trim() != "") {
      if ($("#userMail").val().trim() != "") {
        if ($("#userPassword").val().trim() != "") {
          if ($("#userType").children(".active").attr("id") !== undefined) {
            if (TCNOKontrol($("#userTC").val())) {
              let defaultFrequencies = [3, 7, 21, 60, 120, 360];
              let user = {
                name: $("#userName").val(),
                surName: $("#userSurname").val(),
                mail: $("#userMail").val(),
                password: $("#userPassword").val(),
                tcNO: $("#userTC").val(),
                userTypeID: parseInt(
                  $("#userType").children(".active").attr("id").slice(8)
                ),
                settings: { frequencies: defaultFrequencies },
              };
              addUser(user);
              clean();
            } else alert("Lütfen TC Numarasını doğru giriniz.");
          } else alert("Lütfen kullanıcı tipi seçiniz.");
        } else alert("Lütfen şifre giriniz.");
      } else alert("Lütfen mail adresi giriniz.");
    } else alert("Lütfen soyad giriniz.");
  } else alert("Lütfen isim giriniz.");
}
function TCNOKontrol(TCNO) {
  var tek = 0,
    cift = 0,
    sonuc = 0,
    TCToplam = 0,
    i = 0;

  if (TCNO.length != 11) return false;
  if (isNaN(TCNO)) return false;
  if (TCNO[0] == 0) return false;

  tek =
    parseInt(TCNO[0]) +
    parseInt(TCNO[2]) +
    parseInt(TCNO[4]) +
    parseInt(TCNO[6]) +
    parseInt(TCNO[8]);
  cift =
    parseInt(TCNO[1]) +
    parseInt(TCNO[3]) +
    parseInt(TCNO[5]) +
    parseInt(TCNO[7]);

  tek = tek * 7;
  sonuc = Math.abs(tek - cift);
  if (sonuc % 10 != TCNO[9]) return false;

  for (var i = 0; i < 10; i++) {
    TCToplam += parseInt(TCNO[i]);
  }

  if (TCToplam % 10 != TCNO[10]) return false;

  return true;
}
function addUser(user) {
  let formData = new FormData();
  let file_data = $("#file")[0].files[0];
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
