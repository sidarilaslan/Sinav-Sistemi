$(document).ready(function () {
  $.getJSON("/users", function (users) {
    console.log(users);
    $(users).each(function (index) {
      $("#usersList").append(
        `<tr class="candidates-list">
                    <td class="title">
                        <div class="thumb">
                            <img class="img-fluid" src="https://i.hizliresim.com/ii8tvbv.png" alt="">
                        </div>
                        <div class="candidate-list-details">
                            <div class="candidate-list-info">
                                <div class="candidate-list-title">
                                    <h5 class="mb-0"><a href="#">${
                                      this.name + " " + this.surname
                                    }</a></h5>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="candidate-list-favourite-time text-center">
                        <span class="candidate-list-time order-1">${
                          this.userTypeID
                        }</span>
                    </td>
                    <td>
                        <ul class="list-unstyled mb-0 d-flex justify-content-end">
                            <li><a href="#" onclick="openViewModal('${
                              this.userID
                            }','view')" class="text-primary" data-toggle="tooltip" title=""
                                    data-original-title="view"><i class="bi bi-eye-fill"></i></a>
                            </li>
                            <li><a href="#" onclick="openViewModal('${
                              this.userID
                            }', 'edit')" class="text-info" data-toggle="tooltip" title=""
                                    data-original-title="Edit"><i class="bi bi-pencil-fill"></i></a>
                            </li>
                            <li><a href="#" onclick="openViewModal('${
                              this.userID
                            }', 'remove')" class="text-danger" data-toggle="tooltip" title=""
                                    data-original-title="Delete"><i class="bi bi-trash3-fill"></i></a>
                            </li>
                        </ul>
                    </td>
                </tr>`
      );
    });
  });
});
function openViewModal(userID, modalType) {
  toggleUserViewModal();
  $.getJSON("/users/userID/" + userID, function (user) {
    setViewModal(user[0], modalType);
    $("#btnSubmitViewModal").attr(
      "onClick",
      'submitViewModal("' +
        (modalType == "edit" ? "edit" : "view") +
        '",' +
        userID +
        ")"
    );
    $("#btnDeleteValidationModal").attr(
      "onClick",
      "removeAlert(" + userID + ")"
    );
  });
}
function setViewModal(user, modalType) {
  let isDisabled = modalType == "view" || modalType == "remove" ? true : false;
  $("#userName").val(user.name).attr("disabled", isDisabled);
  $("#userSurname").val(user.surname).attr("disabled", isDisabled);
  $("#userMail").val(user.mail).attr("disabled", isDisabled);
  $("#userTC").val(user.tcNO).attr("disabled", isDisabled);
  $("#userType" + user.userTypeID).addClass("active");
  $("#userType").children().attr("disabled", isDisabled);
  if (modalType == "remove") {
    setTimeout(function () {
      removeAlert(user.userID);
    }, 100);
  }
}
function submitViewModal(modalType, userID) {
  if (modalType == "view") {
    toggleUserViewModal();
  } else if (modalType == "edit") {
    let user = {
      userID: userID,
      name: $("#userName").val(),
      surName: $("#userName").val(),
      mail: $("#userMail").val(),
      tcNO: $("#userTC").val(),
      userTypeID: parseInt(
        $("#userType").children(".active").attr("id").slice(8)
      ),
    };
    console.log(user);
    editUser(user);
    toggleUserViewModal();
  }
  $("#userType").children().removeClass("active");
}
function editUser(user) {
  //DATABASE'e user'i gönder.
  console.log("Bu kullanici editlendi: " + user.userID);
}
function removeAlert(userID) {
  if (confirm("Bu kullanıcıyı silmeye emin misiniz? " + userID)) {
    //DATABASE'den userID olanı sil.
    console.log("Bu kullanici silindi: " + userID);
  }
}

function toggleUserViewModal() {
  $("#userViewModal").toggleClass("show");
  $("#userViewModal").toggleClass("fade");
}