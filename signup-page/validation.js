document.getElementById("signupForm").addEventListener("submit", function (e) {
  // Get the values of the password and repeat password fields
  var password = document.getElementById("password").value;
  var repeatPassword = document.getElementById("repeat_password").value;

  // Check if the passwords match
  if (password !== repeatPassword) {
    // Prevent form submission if passwords do not match
    e.preventDefault();

    // Display an error message
    alert("Passwords do not match. Please try again.");
  }
});
