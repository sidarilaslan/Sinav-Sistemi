function loginSubmit() {

    let loginInfo = {

        mail: $("#loginMail").val(),
        password: $("#loginPassword").val(),

    };
    login(loginInfo);
}
function login(loginInfo) {
    $.post("/login", loginInfo, function (data) {
        if (data) {
            alert("Giriş başarılı");
            location.replace('./public/pages/usersPage/users.html');

        }
        else {
            alert("Mail veya şifre yanlış");
            clean();

        }
    });
}
function clean() {

    $("#loginMail").val("");
    $("#loginPassword").val("");
}
