function getUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}
function isLoggedIn() {
  return getUser()?.userTypeID != null;
}
function redirectUser(defLocation = "/") {
  if (!isLoggedIn()) {
    location.replace(defLocation);
  }
}
