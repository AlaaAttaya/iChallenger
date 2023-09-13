const avatarimg = document.getElementById("avatarimg");
const username = document.getElementById("username");

function refreshToken() {
  fetch("http://localhost:8000/api/user/refresh", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        window.location.href = "../views/login.html";
      }
    })
    .then((data) => {
      const token = data.data.token;
      localStorage.setItem("token", token);
    })
    .catch((error) => {
      console.error("Token refresh failed:", error);
      window.location.href = "../views/login.html";
    })
    .finally(() => {
      setTimeout(refreshToken, 360000);
    });
}

setTimeout(refreshToken, 360000);

async function verifyToken() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch("http://localhost:8000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        const user = data.data;
        avatarimg.src = "http://127.0.0.1:8000" + user.profileimage;
        username.innerText = user.username;
        const user_role = user.user_role_id;
        if (user_role === 2) {
          window.location.href = "../views/login.html";
        }
      } else {
        window.location.href = "../views/login.html";
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      window.location.href = "../views/login.html";
    }
  } else {
    window.location.href = "../views/login.html";
  }
}

window.addEventListener("load", verifyToken);
