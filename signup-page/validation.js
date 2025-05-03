const form = document.getElementById("form");
const firstname_input = document.getElementById("firstname_input");
const email_input = document.getElementById("email_input_input");
const password_input = document.getElementById("password_input_input");
const repeat_password_input = document.getElementById(
  "repeat_password_input_input"
);
form.addEventListener("submit", (e) => {
  //e.preventDefault();
  let errors = {};

  if (firstname_input) {
    errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      repeat_password_input.value
    );
  } else {
    errors = getLoginFormErrors(email_input.value, password_input.value);
  }
  if (errors.length > 0) {
    e.preventDefault();
  }
});

function getSignupFormErrors(firstname, email, password, repeatpassword) {
  let errors = [];
  if (firstname === "" || firstname == null) {
    errors.push("Firstname is required");
    firstname_input.parentElement.classList.add("Incorrect");
  }
  if (email === "" || email == null) {
    errors.push("email is required");
    email_input.parentElement.classList.add("Incorrect");
  }
  if (password === "" || password == null) {
    errors.push("Password is required");
    password_input.parentElement.classList.add("Incorrect");
  }
  if (repeatpassword != password) {
    errors.push("Passwords do not match");
    firstname_input.parentElement.classList.add("Incorrect");
  }
  return errors;
}
