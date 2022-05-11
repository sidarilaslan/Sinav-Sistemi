function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
function isLoggedIn() {
  return getUser()?.userTypeID != null;
}
function redirectUser(notPermission = [], defLocation = "/") {
  if (!isLoggedIn()) {
    location.replace(defLocation);
  } else if (notPermission.includes(getUser().userTypeID)) {
    location.replace("/public/pages/profilePage/profile.html");
  }
}
