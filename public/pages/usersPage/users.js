$(document).ready(function () {
  redirectUser([1, 3]);
  let userTypes = ["Öğrenci", "Admin", "Öğretmen"];
  $.get("/users/get", function (users) {
    users.sort((a, b) => {
      if (userTypes[a.userTypeID - 1] < userTypes[b.userTypeID - 1]) {
        return -1;
      }
      if (userTypes[a.userTypeID - 1] > userTypes[b.userTypeID - 1]) {
        return 1;
      }
      return 0;
    });
    $(users).each(function (index) {
      $("#usersList").append(
        `<tr class="candidates-list">
                    <td class="title">
                        <div class="thumb">
                            <img class="img-fluid" src="${this.image != null
          ? this.image
          : "/public/src/img/No_image_available.svg.png"
        }" alt="">
                        </div>
                        <div class="candidate-list-details">
                            <div class="candidate-list-info">
                                <div class="candidate-list-title">
                                    <h5 class="mb-0"><a href="#">${this.name + " " + this.surname
        }</a></h5>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="candidate-list-favourite-time text-center">
                        <span class="candidate-list-time order-1">${userTypes[this.userTypeID - 1]
        }</span>
                    </td>
                    <td>
                        <ul class="list-unstyled mb-0 d-flex justify-content-end">
                            <li><a href="#" onclick="openViewModal('${this.userID
        }','view')" class="text-primary" data-toggle="tooltip" title=""
                                    data-original-title="view"><i class="bi bi-eye-fill"></i></a>
                            </li>
                            <li><a href="#" onclick="openViewModal('${this.userID
        }', 'edit')" class="text-info" data-toggle="tooltip" title=""
                                    data-original-title="Edit"><i class="bi bi-pencil-fill"></i></a>
                            </li>
                            <li><a href="#" onclick="openViewModal('${this.userID
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
  $.get("/users/get/userID/" + userID, function (user) {
    setViewModal(user, modalType);
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
  $("#userPassword").val(user.password).attr("disabled", isDisabled);
  $("#userTC").val(user.tcNO).attr("disabled", isDisabled);
  $("#userType").children().attr("disabled", isDisabled);
  $("#userType").children().removeClass("active");
  $("#userType" + user.userTypeID).addClass("active");

  if (user.image != null)
    $("#userImg").css("background-image", "url(" + user.image + ")");

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
      surName: $("#userSurname").val(),
      mail: $("#userMail").val(),
      password: $("#userPassword").val(),
      tcNO: $("#userTC").val(),
      userTypeID: parseInt(
        $("#userType").children(".active").attr("id").slice(8)
      ),
    };
    editUser(user);
    toggleUserViewModal();
  }
}
function editUser(user) {
  let formData = new FormData();
  let file_data = $("#file")[0].files[0];
  formData.append("image", file_data);
  formData.append("user", JSON.stringify(user));
  $.ajax({
    url: "/users/update",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      resetUserStorage();
      alert("Kullanıcı düzenlendi.");
      location.reload();
    },
  });
}
function removeAlert(userID) {
  if (confirm("Bu kullanıcıyı silmeye emin misiniz?")) {
    $.post("/users/delete", { userID: userID }, function (data) {
      alert("Bu kullanıcı silindi.");
      location.reload();
    });
  }
}

function toggleUserViewModal() {
  $("#userViewModal").toggleClass("show");
  $("#userViewModal").toggleClass("fade");
}
