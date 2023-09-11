const base_url = "http://127.0.0.1:8000/api/";
const burgermenu = document.getElementById("burgermenu");
const closeleftnavbar = document.getElementById("closeleftnavbar");
const leftnavbar = document.getElementById("leftnavbar");
const ichallengerlogo = document.getElementById("ichallengerlogo-leftnavbar");
const avatarimg = document.getElementById("avatarimg");
const username = document.getElementById("username");
const logout = document.getElementById("logout-button");
const websiteButton = document.getElementById("website-button");
const dashboardButton = document.getElementById("dashboard-button");
const emailsButton = document.getElementById("emails-button");
const tournamentsButton = document.getElementById("tournaments-button");
const gamesButton = document.getElementById("games-button");
const usersButton = document.getElementById("users-button");
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

window.addEventListener("load", verifyToken);

document.getElementById("searchnavbar").addEventListener("focus", function () {
  document.getElementById("search-icon").style.fill = "#269c55";
});

document.getElementById("searchnavbar").addEventListener("blur", function () {
  document.getElementById("search-icon").style.fill = "#9e9e9e";
});

//Resize of Left Navbar & Searchbar
function handleWindowResize() {
  if (window.innerWidth > 400 && ichallengerlogo.style.display == "block") {
    document.querySelector(".searchbar").style.marginLeft = "180px";
  } else {
    document.querySelector(".searchbar").style.marginLeft = "5px";
  }
}

window.addEventListener("resize", handleWindowResize);

//Burgermenu Button
burgermenu.addEventListener("click", function () {
  leftnavbar.style.left = "0%";
  ichallengerlogo.style.display = "block";
  if (window.innerWidth > 400) {
    document.querySelector(".searchbar").style.marginLeft = "180px";
  }
});

//CloseLeftNavbar Button
closeleftnavbar.addEventListener("click", function () {
  leftnavbar.style.left = "-100%";
  ichallengerlogo.style.display = "none";
  document.querySelector(".searchbar").style.marginLeft = "5px";
});

//Logout Button
logout.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "../views/login.html";
});

// Website Button
websiteButton.addEventListener("click", function () {
  ipcRenderer.send("open-website-window");
});
