function refreshToken() {
  fetch("http://localhost:8000/api/user/refresh", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        window.location.href = "../views/login.html";
      }
    })
    .then((data) => {
      const token = data.data.token;
      localStorage.setItem("token", token);

      setTimeout(refreshToken, 3600000);
    })
    .catch((error) => {
      console.error("Token refresh failed:", error);

      window.location.href = "../views/login.html";
    });
}

setTimeout(refreshToken, 3600000);

async function verifyToken() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await axios.get(base_url + "user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      user = response.data.data;
      avatarimg.src = "http://127.0.0.1:8000" + user.profileimage;
      username.innerText = user.username;
      user_role = user.user_role_id;

      if (user_role == 2) {
        window.location.href = "../views/login.html";
      }
    } catch (refreshError) {
      console.log(refreshError);
      window.location.href = "../views/login.html";
    }
  } else {
    window.location.href = "../views/login.html";
  }
}
