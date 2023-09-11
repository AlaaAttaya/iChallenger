const burgermenu = document.getElementById("burgermenu");
const closeleftnavbar = document.getElementById("closeleftnavbar");
const leftnavbar = document.getElementById("leftnavbar");
const ichallengerlogo = document.getElementById("ichallengerlogo-leftnavbar");
const logout = document.getElementById("logout-button");
const base_url = "http://127.0.0.1:8000/api/";
const avatarimg = document.getElementById("avatarimg");
const username = document.getElementById("username");
let user;

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
      console.log(data.data.token);
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

      console.log(user.name);
    } catch (refreshError) {
      console.log(refreshError);
      window.location.href = "../views/login.html";
    }
  } else {
    window.location.href = "../views/login.html";
  }
}

window.addEventListener("load", verifyToken);

window.addEventListener("resize", function () {
  if (window.innerWidth > 400) {
    leftnavbar.style.left = "0%";
    ichallengerlogo.style.display = "block";
  } else {
    leftnavbar.style.left = "-100%";
    ichallengerlogo.style.display = "none";
  }
});

document.getElementById("searchnavbar").addEventListener("focus", function () {
  document.getElementById("search-icon").style.fill = "#269c55";
});

document.getElementById("searchnavbar").addEventListener("blur", function () {
  document.getElementById("search-icon").style.fill = "#9e9e9e";
});

burgermenu.addEventListener("click", function () {
  leftnavbar.style.left = "0%";
  ichallengerlogo.style.display = "block";
});
closeleftnavbar.addEventListener("click", function () {
  leftnavbar.style.left = "-100%";
  ichallengerlogo.style.display = "none";
});

logout.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "../views/login.html";
});
