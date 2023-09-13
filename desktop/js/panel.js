base_url = "http://127.0.0.1:8000/api/";
const burgermenu = document.getElementById("burgermenu");
const closeleftnavbar = document.getElementById("closeleftnavbar");
const leftnavbar = document.getElementById("leftnavbar");
const ichallengerlogo = document.getElementById("ichallengerlogo-leftnavbar");
const logout = document.getElementById("logout-button");
const websiteButton = document.getElementById("website-button");
const dashboardButton = document.getElementById("dashboard-button");
const emailsButton = document.getElementById("emails-button");
const tournamentsButton = document.getElementById("tournaments-button");
const gamesButton = document.getElementById("games-button");
const usersButton = document.getElementById("users-button");
const renderedpage = document.getElementById("renderedpage");
const loadingScreen = document.getElementById("loading");
const websitesvg = document.getElementsByClassName("website-svg")[0];
const dashboardsvg = document.getElementsByClassName("dashboard-svg")[0];
const emailssvg = document.getElementsByClassName("emails-svg")[0];
const tournamentssvg = document.getElementsByClassName("tournaments-svg")[0];
const gamessvg = document.getElementsByClassName("games-svg")[0];
const userssvg = document.getElementsByClassName("users-svg")[0];
const searchnavbar = document.getElementById("searchnavbar");
const searchResultsContainer = document.getElementById("searchResults");
let user;
let currentPage = "dashboard";

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
    renderedpage.style.marginLeft = "220px";
  } else {
    document.querySelector(".searchbar").style.marginLeft = "5px";
    renderedpage.style.marginLeft = "0px";
  }
}

window.addEventListener("resize", handleWindowResize);

//Loading Functions
function showLoadingScreen() {
  loadingScreen.style.display = "block";
}

function hideLoadingScreen() {
  loadingScreen.style.display = "none";
}

//Selected Page
function ButtonsvgSelected(button, svg) {
  button.style.backgroundColor = "#9e9e9e11";
  button.style.color = "#269c55";
  const paths = svg.querySelectorAll("path");
  paths.forEach((path) => {
    path.style.fill = "#269c55";
  });
}
function ButtonsvgnotSelected(button, svg) {
  button.style.backgroundColor = "";
  button.style.color = "#9e9e9e";
  const paths = svg.querySelectorAll("path");
  paths.forEach((path) => {
    path.style.fill = "#9E9E9E";
  });
}
function ButtonnotselectedAll() {
  ButtonsvgnotSelected(websiteButton, websitesvg);
  ButtonsvgnotSelected(dashboardButton, dashboardsvg);
  ButtonsvgnotSelected(gamesButton, gamessvg);
  ButtonsvgnotSelected(tournamentsButton, tournamentssvg);
  ButtonsvgnotSelected(emailsButton, emailssvg);
  ButtonsvgnotSelected(usersButton, userssvg);
}
//Burgermenu Button
burgermenu.addEventListener("click", function () {
  leftnavbar.style.left = "0%";
  renderedpage.style.marginLeft = "220px";
  if (window.innerWidth <= 400) {
    renderedpage.style.marginLeft = "0px";
  }

  ichallengerlogo.style.display = "block";
  if (window.innerWidth > 400) {
    document.querySelector(".searchbar").style.marginLeft = "180px";
  }
});

//CloseLeftNavbar Button
closeleftnavbar.addEventListener("click", function () {
  leftnavbar.style.left = "-100%";
  ichallengerlogo.style.display = "none";
  renderedpage.style.marginLeft = "0px";
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
ipcRenderer.on("set-websitebutton-background-color", () => {
  ButtonsvgSelected(websiteButton, websitesvg);
});
ipcRenderer.on("remove-websitebutton-background-color", () => {
  ButtonsvgnotSelected(websiteButton, websitesvg);
});

//Dashboard Page
function LoadDashboardPage() {
  showLoadingScreen();
  ButtonnotselectedAll();
  ButtonsvgSelected(dashboardButton, dashboardsvg);

  localStorage.setItem("currentpage", "dashboard");
  renderedpage.innerHTML = "";
  const pageIframe = document.createElement("iframe");
  pageIframe.style.width = "100%";
  pageIframe.style.height = "100%";
  pageIframe.style.border = "none";
  pageIframe.style.overflow = "hidden";
  pageIframe.src = "../views/dashboard.html";
  renderedpage.appendChild(pageIframe);

  hideLoadingScreen();
}
//Dashboard Button
dashboardButton.addEventListener("click", function () {
  LoadDashboardPage();
});

//Emails Page

function LoadEmailPage() {
  showLoadingScreen();
  ButtonnotselectedAll();
  ButtonsvgSelected(emailsButton, emailssvg);

  localStorage.setItem("currentpage", "email");
  renderedpage.innerHTML = "";
  const pageIframe = document.createElement("iframe");
  pageIframe.style.width = "100%";
  pageIframe.style.height = "100%";
  pageIframe.style.border = "none";
  pageIframe.style.overflow = "hidden";
  pageIframe.src = "../views/email.html";
  renderedpage.appendChild(pageIframe);

  hideLoadingScreen();
}

emailsButton.addEventListener("click", () => {
  LoadEmailPage();
});

//Users Page
function LoadUsersPage() {
  showLoadingScreen();
  ButtonnotselectedAll();
  ButtonsvgSelected(usersButton, userssvg);

  localStorage.setItem("currentpage", "users");

  renderedpage.innerHTML = "";
  const pageIframe = document.createElement("iframe");
  pageIframe.style.width = "100%";
  pageIframe.style.height = "100%";
  pageIframe.style.border = "none";
  pageIframe.style.overflow = "hidden";
  pageIframe.src = "../views/users.html";
  renderedpage.appendChild(pageIframe);

  hideLoadingScreen();
}
usersButton.addEventListener("click", () => {
  LoadUsersPage();
});

//Games Page
function LoadGamesPage() {
  showLoadingScreen();
  ButtonnotselectedAll();
  ButtonsvgSelected(gamesButton, gamessvg);

  localStorage.setItem("currentpage", "games");
  renderedpage.innerHTML = "";
  const pageIframe = document.createElement("iframe");
  pageIframe.style.width = "100%";
  pageIframe.style.height = "100%";
  pageIframe.style.border = "none";
  pageIframe.style.overflow = "hidden";
  pageIframe.src = "../views/games.html";
  renderedpage.appendChild(pageIframe);

  hideLoadingScreen();
}
gamesButton.addEventListener("click", () => {
  LoadGamesPage();
});

//Tournaments Page
function LoadTournamentsPage() {
  showLoadingScreen();
  ButtonnotselectedAll();
  ButtonsvgSelected(tournamentsButton, tournamentssvg);

  hideLoadingScreen();
  localStorage.setItem("currentpage", "tournaments");
  renderedpage.innerHTML = "";
  const pageIframe = document.createElement("iframe");
  pageIframe.style.width = "100%";
  pageIframe.style.height = "100%";
  pageIframe.style.border = "none";
  pageIframe.style.overflow = "hidden";
  pageIframe.src = "../views/tournaments.html";
  renderedpage.appendChild(pageIframe);

  hideLoadingScreen();
}
tournamentsButton.addEventListener("click", () => {
  LoadTournamentsPage();
});

function LoadCurrentPage() {
  if (localStorage.getItem("currentpage")) {
    currentPage = localStorage.getItem("currentpage");
  }

  ButtonnotselectedAll();

  switch (currentPage) {
    case "dashboard":
      LoadDashboardPage();
      break;
    case "email":
      LoadEmailPage();
      break;
    case "users":
      LoadUsersPage();
      break;
    case "games":
      LoadGamesPage();
      break;
    case "tournaments":
      LoadTournamentsPage();
      break;
    default:
      LoadDashboardPage();
      break;
  }
}
window.addEventListener("load", LoadCurrentPage);

//Navbar Search Results
function performSearch(query) {
  return ["Result 1", "Result 2", "Result 3"];
}
function showSearchResults(results) {
  searchResultsContainer.innerHTML = "";

  if (results.length > 0) {
    results.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.classList.add("results");
      resultElement.textContent = result;

      searchResultsContainer.appendChild(resultElement);
    });

    searchResultsContainer.style.display = " flex";
  }
}

searchnavbar.addEventListener("input", () => {
  const searchQuery = searchnavbar.value.trim();
  if (searchQuery == "") {
    searchResultsContainer.style.display = "none";
  } else {
    const results = performSearch(searchQuery);

    showSearchResults(results);
  }
});
