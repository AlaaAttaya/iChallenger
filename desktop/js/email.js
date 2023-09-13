const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const sendbutton = document.getElementById("sendbutton");
const messagePopup = document.getElementById("messages-popup");

base_url = "http://127.0.0.1:8000/api/";

function showMessage(message) {
  messagePopup.innerText = message;
  messagePopup.style.display = "block";
  messagePopup.style.opacity = 1;

  setTimeout(() => {
    messagePopup.style.opacity = 0;
    setTimeout(() => {
      messagePopup.style.display = "none";
    }, 400);
  }, 2000);
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
sendbutton.addEventListener("click", () => {
  let emailValue = email.value;
  let subjectValue = subject.value;
  let messageValue = message.value;
  if (!isValidEmail(emailValue)) {
    showMessage("Please enter a valid email address.");
    return;
  }
  if (
    emailValue.trim() === "" ||
    messageValue.trim() === "" ||
    subjectValue.trim() === ""
  ) {
    showMessage("Please fill email, subject and message fields.");
    return;
  }
  axios
    .post(
      `${base_url}admin/sendemail`,
      {
        to: emailValue,
        subject: subjectValue,
        body: messageValue,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(function (response) {
      console.log("Email sent successfully:", response);
      showMessage("Email sent successfully.");
    })
    .catch(function (error) {
      console.error("Error sending email:", error);
      showMessage("Error sending email.");
    });
});
