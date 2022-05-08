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
            alert("Giriş başarılı");
            location.replace('./public/pages/usersPage/users.html');

        }
        else {
            alert("Mail veya şifre yanlış");
            clean();

        }
    });
}
function resetPassSubmit() {

    let data = {
        mail: $("#resetMail").val(),
    };

    resetPassword(data);

}

function resetPassword(data) {
    $.post("/forget", data, function (result) {
        if (result) {
            alert(`Sıfırlama kodu gönderildi `);
            alert(`test: code-> ${result}`);


        }
        else {
            alert('Yanlıs formatta mail girdiniz ');
        }
    });
}
function clean() {

    $("#loginMail").val("");
    $("#loginPassword").val("");
}
