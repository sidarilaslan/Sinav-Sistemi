function USERLOGDATA() {
  return JSON.parse(localStorage.getItem("user"));
}
function isLoggedIn() {
  return USERLOGDATA()?.userTypeID != null;
}
function redirectUser(notPermission = [], defLocation = "/") {
  if (!isLoggedIn()) {
    location.replace(defLocation);
  } else if (notPermission.includes(USERLOGDATA().userTypeID)) {
    location.replace("/public/pages/profilePage/profile.html");
  }
}
function resetUserStorage() {
  $.get("/users/get/userID/" + USERLOGDATA().userID, function (user) {
    user.settings = JSON.parse(user.settings);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
}
