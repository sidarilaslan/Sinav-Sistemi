
const forgetPassForm = document.querySelector("#forgetPasswordForm");
const loginForm = document.querySelector("#loginForm");
const mail = document.querySelector(".mailControl");
const password = document.querySelector(".passwordControl");

forgetPassForm.addEventListener("submit", (e) => {

    let formData = {
        mail: mail.value
    }
    let resTxt;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/forget');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.status == 200) {
            // resTxt = JSON.parse(xhr.responseText).code;
        }
        // console.log("kod degeri ->", resTxt);

    }


    xhr.send(JSON.stringify(formData));

});



