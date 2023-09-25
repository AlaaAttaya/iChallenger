base_url = "http://127.0.0.1:8000/api/";

const ListTournaments = document.getElementById("listtournaments");
const CreateTournament = document.getElementById("createtournament");
const ResultsFetchedTournament = document.getElementById(
  "fetchresultstournaments"
);
const CreateTournamentContainer = document.getElementById(
  "createtournamentcontainer"
);
const ListTournamentContainer = document.getElementById(
  "listtournamentcontainer"
);

let activePage;

document
  .getElementById("searchtournaments")
  .addEventListener("focus", function () {
    document.getElementById("searchtournaments-icon").style.fill = "#269c55";
    document.getElementById("searchtournamentsbar").style.border =
      "3px solid #269c55 ";
  });

document
  .getElementById("searchtournaments")
  .addEventListener("blur", function () {
    document.getElementById("searchtournaments-icon").style.fill = "#9e9e9e";
    document.getElementById("searchtournamentsbar").style.border =
      "3px solid #9e9e9e ";
  });

function fetchDataFromAPI() {
  const apiUrl = base_url + "admin/fetchtournamentdata";
  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  axios(apiUrl, requestData)
    .then((response) => {
      const data = response.data;

      const tournamentTypes = data.tournamentTypes;
      const regions = data.regions;
      const games = data.games;

      console.log("Tournament Types:", tournamentTypes);
      console.log("Regions:", regions);
      console.log("Games:", games);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function ChangePage(activatingPage) {
  if (activatingPage == "createtournament") {
    activePage = "createtournament";
    CreateTournament.style.borderBottom = "3px solid #2fd671";
    ListTournaments.style.borderBottom = "3px solid #989898";
    CreateTournament.style.color = " #2fd671";
    ListTournaments.style.color = "#000000";
    ListTournamentContainer.style.display = "none";
    CreateTournamentContainer.style.display = "flex";
    fetchDataFromAPI();
  } else {
    activePage = "listtournaments";
    ListTournaments.style.borderBottom = "3px solid #2fd671";
    CreateTournament.style.borderBottom = "3px solid #989898";
    ListTournaments.style.color = " #2fd671";
    CreateTournament.style.color = "#000000";
    CreateTournamentContainer.style.display = "none";
    ListTournamentContainer.style.display = "flex";
  }
}

ListTournaments.addEventListener("click", function () {
  ChangePage("listtournament");
});

CreateTournament.addEventListener("click", function () {
  ChangePage("createtournament");
});

ChangePage("listtournament");
