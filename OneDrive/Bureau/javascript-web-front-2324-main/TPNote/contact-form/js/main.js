document.addEventListener("DOMContentLoaded", function () {
  // j'aurais peut etre du décalré directement mes valeurs mais c'est trop tard j'ai pas pensé je n'aurais pas le temps :/
  let button = document.getElementById("submit");
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("email");
  let message = document.getElementById("message");

  function checkForm() {
    if (firstName.value === "") {
      window.alert("Le prénom est requis");
      return false;
    } else if (lastName.value === "") {
      window.alert("Le nom est requis");
      return false;
    } else if (email.value === "") {
      window.alert("L'email est requis");
      return false;
    } else if (message.value === "") {
      window.alert("Le message est requis");
      return false;
    }
    return true;
  }

  function checkEmail() {
    if (!email.value.includes("@") && !email.value.includes(".")) {
      window.alert("L'email n'est pas valide");
      return false;
    }
    return true;
  }

  function sendMessage(firstName, lastName, email, message) {
    let messagesTable = document.getElementById("messages");

    let newRow = messagesTable.insertRow();

    newRow.innerHTML = `
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${email}</td>
            <td>${message}</td>
        `;
  }

  function cleanForm() {
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    message.value = "";
  }

  function showToast(message, backgroundColor) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: backgroundColor,
      stopOnFocus: true,
      className: "toastify-notification",
    }).showToast();
  }

  button.addEventListener("click", function (event) {
    event.preventDefault(); // ce truc la empeche que le formulaire refresh a chaque fois
    if (checkForm() && checkEmail()) {
      sendMessage(firstName.value, lastName.value, email.value, message.value);
      cleanForm();
      showToast("Message envoyé avec succès !", "#00b09b");
    } else {
      showToast("Veuillez remplir tous les champs correctement !", "#ff0000");
    }
  });
});
