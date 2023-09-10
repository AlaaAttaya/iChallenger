const burgermenu = document.getElementById("burgermenu");
const closeleftnavbar = document.getElementById("closeleftnavbar");
const leftnavbar = document.getElementById("leftnavbar");
const ichallengerlogo = document.getElementById("ichallengerlogo-leftnavbar");
const logout = document.getElementById("logout-button");

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
