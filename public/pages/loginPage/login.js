
const forgetPassForm = document.querySelector("#forgetPasswordForm");
const email = document.querySelector("#emailControl");

function sendMail() {

    let formData = {
        email: email.value
    }

    let xhr = new XMLHttpRequest();
    let resTxt;
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.status == 200) {
            resTxt = JSON.parse(xhr.responseText).code;
        }
        console.log("kod degeri ->", resTxt);

    }


    xhr.send(JSON.stringify(formData));
    return resTxt;

};


