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

function performSearch(query) {
  return axios
    .get(`${base_url}admin/searchentities?searchName=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const data = response.data;

      const users = data.users;
      const tournaments = data.tournaments;
      const games = data.games;

      const results = [...users, ...tournaments, ...games];

      return results;
    })
    .catch((error) => {
      console.error("There was a problem with the Axios request:", error);
      return [];
    });
}
function showSearchResults(results) {
  searchResultsContainer.innerHTML = "";

  if (results.length > 0) {
    results.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.classList.add("results");

      if (result.user_role_id !== undefined) {
        resultElement.innerHTML = ` <svg
      width="20"
      height="20"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="users-svg leftnavbar-svg"
    >
      <path
        d="M16.8751 5.46887C16.8751 8.48925 14.9163 10.9377 12.5 10.9377C10.0838 10.9377 8.125 8.48925 8.125 5.46887C8.125 2.44849 10.0838 0 12.5 0C14.9163 0 16.8751 2.44849 16.8751 5.46887Z"
        fill="#9E9E9E"
      />
      <path
        d="M20.0002 19.5314C20.0002 22.5517 16.6423 25.0002 12.5001 25.0002C8.3579 25.0002 5 22.5517 5 19.5314C5 16.511 8.3579 14.0625 12.5001 14.0625C16.6423 14.0625 20.0002 16.511 20.0002 19.5314Z"
        fill="#9E9E9E"
      />
      <path
        d="M6.40249 1.5625C6.62432 1.5625 6.84089 1.5897 7.05 1.6415C6.54055 2.77262 6.24993 4.07831 6.24993 5.46884C6.24993 6.82551 6.52657 8.10143 7.01318 9.21323C6.8155 9.25928 6.61133 9.28339 6.40249 9.28339C4.63445 9.28339 3.20117 7.55501 3.20117 5.42294C3.20117 3.29088 4.63445 1.5625 6.40249 1.5625Z"
        fill="#9E9E9E"
      />
      <path
        d="M4.30922 23.4161C3.59931 22.3553 3.12503 21.0535 3.12503 19.5316C3.12503 18.0563 3.57075 16.7878 4.24477 15.7451C1.8639 15.9761 0 17.6038 0 19.5775C0 21.5698 1.89665 23.2095 4.30922 23.4161Z"
        fill="#9E9E9E"
      />
      <path
        d="M18.7492 5.46884C18.7492 6.82551 18.4726 8.10143 17.986 9.21323C18.1837 9.25928 18.3878 9.28339 18.5967 9.28339C20.3647 9.28339 21.798 7.55501 21.798 5.42294C21.798 3.29088 20.3647 1.5625 18.5967 1.5625C18.3748 1.5625 18.1583 1.5897 17.9492 1.6415C18.4586 2.77262 18.7492 4.07831 18.7492 5.46884Z"
        fill="#9E9E9E"
      />
      <path
        d="M20.6914 23.4161C23.1039 23.2095 25.0006 21.5698 25.0006 19.5775C25.0006 17.6038 23.1367 15.9761 20.7558 15.7451C21.4298 16.7878 21.8755 18.0563 21.8755 19.5316C21.8755 21.0535 21.4013 22.3553 20.6914 23.4161Z"
        fill="#9E9E9E"
      />
    </svg>`;
        resultElement.innerHTML += result.username;
      } else if (result.tournament_type_id !== undefined) {
        resultElement.innerHTML = `  <svg
        width="20"
        height="20"
        viewBox="0 0 25 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="leftnavbar-svg tournaments-svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20.0297 0.152344H5.16732V1.99473L0 1.99473V10.6366C0 13.9765 3.48826 16.7249 6.91161 17.0108C8.03544 18.2975 10.0122 19.2321 11.7715 19.6306V21.8893C10.0891 22.4415 7.08386 23.7388 6.91161 25.1523H18.4578C18.2838 23.7388 14.9724 22.4397 13.2867 21.8893V19.6306C15.0527 19.2321 17.1181 18.2975 18.2436 17.0108C21.6653 16.7249 25 13.9765 25 10.6366V1.99473H20.0297V0.152344ZM1.58677 3.63231H5.04691V11.0762C5.04691 12.5451 5.40145 13.9426 6.02525 15.2006C3.43641 14.3196 1.58677 12.0501 1.58677 9.39467V3.63231ZM15.14 12.7113L12.5573 11.1906L9.97172 12.7113L10.4654 9.49474L8.37493 7.21811L11.2631 6.74813L12.5573 3.82461L13.8486 6.74813L16.7368 7.21811L14.6477 9.49474L15.14 12.7113ZM18.9778 15.4383C19.6049 14.123 19.9645 12.6684 19.9645 11.1298V3.6803H23.433V9.37322C23.433 12.1484 21.575 14.518 18.9778 15.4383Z"
          fill="#9E9E9E"
        />
      </svg>`;
        resultElement.innerHTML += result.name;
      } else {
        resultElement.innerHTML = `  <svg
        width="20"
        height="20"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="games-svg leftnavbar-svg"
      >
        <path
          d="M16.2481 0C21.0817 0 25 5.59644 25 12.5C25 19.2597 21.2432 24.7662 16.549 24.9928L16.2481 25H8.75185C3.91834 25 0 19.4036 0 12.5C0 5.74026 3.75678 0.233752 8.45098 0.00724792L8.75185 0H16.2481ZM15.9382 13.3929C15.0751 13.3929 14.3754 14.3922 14.3754 15.625C14.3754 16.8578 15.0751 17.8571 15.9382 17.8571C16.8014 17.8571 17.5011 16.8578 17.5011 15.625C17.5011 14.3922 16.8014 13.3929 15.9382 13.3929ZM7.49894 7.14286C7.02422 7.14286 6.63189 7.6467 6.5698 8.30041L6.56124 8.48214V11.1571L4.68585 11.1585C4.16797 11.1585 3.74815 11.7581 3.74815 12.4978C3.74815 13.1758 4.10092 13.7361 4.55861 13.8248L4.68585 13.837L6.56124 13.8357V16.5179C6.56124 17.2575 6.98107 17.8571 7.49894 17.8571C7.97366 17.8571 8.36599 17.3533 8.42808 16.6996L8.43664 16.5179V13.8357L10.312 13.837C10.8299 13.837 11.2497 13.2374 11.2497 12.4978C11.2497 11.8197 10.897 11.2594 10.4393 11.1707L10.312 11.1585L8.43664 11.1571V8.48214C8.43664 7.74248 8.01682 7.14286 7.49894 7.14286ZM18.4388 7.14286C17.5756 7.14286 16.8759 8.14222 16.8759 9.375C16.8759 10.6078 17.5756 11.6071 18.4388 11.6071C19.3019 11.6071 20.0016 10.6078 20.0016 9.375C20.0016 8.14222 19.3019 7.14286 18.4388 7.14286Z"
          fill="#9E9E9E"
        />
      </svg>`;
        resultElement.innerHTML += result.name;
      }

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
    performSearch(searchQuery).then((results) => {
      showSearchResults(results);
    });
  }
});
