const base_url = "http://127.0.0.1:8000/api/";
const login = document.getElementById("login");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const error = document.getElementById("error");

localStorage.clear();
login.addEventListener("click", async (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  if (!username.trim() || !password.trim()) {
    error.innerText = "Please enter a username and password.";
    return;
  } else {
    if (password.length < 8) {
      error.innerText = "Password must be at least 8 characters.";
      return;
    }
  }
  try {
    const response = await axios.post(base_url + "guest/login", {
      identifier: username,
      password: password,
    });

    if (response.data.data.user_role_id === 1) {
      localStorage.setItem("token", response.data.data.token);
      window.location.href = "./panel.html";
    } else {
      error.innerText = "Unauthorized.";
    }
  } catch (response_error) {
    error.innerText = "Invalid email or password.";
  }
});
