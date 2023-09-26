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
const gameSelect = document.getElementById("tournamentgame");
const gameModeSelect = document.getElementById("tournamentgamemode");
const createtournamentButton = document.getElementById(
  "createtournamentbutton"
);
const tournamenterrormsg = document.getElementById("tournamenterrormsg");
const searchtournaments = document.getElementById("searchtournaments");
const updatemodalContainer = document.getElementById("modal-update-container");
const closeModalUpdate = document.getElementById("closemodal-update");
let activePage;
let searchTimeout;

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

closeModalUpdate.addEventListener("click", () => {
  updatemodalContainer.style.display = "none";
});

function populateUpdateModal(Tournament) {
  //   const updateGameNameInput = document.getElementById("game-name-update");
  //   const updatepreviewimage = document.getElementById("preview-image-update");
  //   updateGameNameInput.value = game.name;
  //   updatepreviewimage.src = "http://localhost:8000" + game.gameimage;
  //   updategameModesContainer.innerHTML = "";
  //   const gamemodesfetched = game.game_modes;
  //   gamemodesfetched.forEach((gamemode) => {
  //     const gameModeInput = document.createElement("div");
  //     gameModeInput.classList.add("gamemodeinputs");
  //     gameModeInput.innerHTML = `
  //           <div class="gamemode-labels">Name & Team Count</div>
  //           <input type="text" class="game-mode-name" placeholder="Name" value="${gamemode.name}" />
  //           <input type="number" class="team-count" placeholder="Team Count" value="${gamemode.max_players_per_team}" />
  //           <button class="remove-game-mode">Remove</button>
  //         `;
  //     updategameModesContainer.appendChild(gameModeInput);
  //     const removeGameModeButton =
  //       gameModeInput.querySelector(".remove-game-mode");
  //     removeGameModeButton.addEventListener("click", () => {
  //       updategameModesContainer.removeChild(gameModeInput);
  //     });
  //   });
}
function createTournamentCard(Tournament) {
  const card = document.createElement("div");
  card.classList.add("tournament-card");

  const image = document.createElement("img");
  image.src = "http://127.0.0.1:8000" + Tournament.game.gameimage;
  image.alt = Tournament.game.name;
  image.classList.add("tournament-image");

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const TournamentName = document.createElement("div");
  TournamentName.textContent = Tournament.name;
  TournamentName.classList.add("tournament-name");

  const TournamentCompleted = document.createElement("div");
  if (Tournament.is_completed === 1) {
    TournamentCompleted.textContent = "Completed";
  } else {
    TournamentCompleted.textContent = "Open";
  }
  TournamentCompleted.classList.add("tournament-completed");

  const TournamentDate = document.createElement("div");
  TournamentDate.textContent = Tournament.start_date;
  TournamentDate.classList.add("tournament-startdate");

  infoContainer.appendChild(TournamentName);
  infoContainer.appendChild(TournamentCompleted);
  infoContainer.appendChild(TournamentDate);

  card.appendChild(image);
  card.appendChild(infoContainer);

  card.addEventListener("click", () => {
    const Tournamenttoupdate = card.dataset.Tournament;

    populateUpdateModal(Tournamenttoupdate);
    updatemodalContainer.style.display = "flex";
  });

  return card;
}

searchtournaments.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const searchQuery = searchtournaments.value.trim();

    if (searchQuery) {
      fetchTournaments(searchQuery);
    } else {
      fetchTournaments();
    }
  }, 300);
});

function fetchTournaments(searchQuery = null) {
  const apiUrl = base_url + "guest/gettournaments";

  const queryParams = new URLSearchParams();
  if (searchQuery) {
    queryParams.append("searchQuery", searchQuery);
  }

  const urlWithParams = `${apiUrl}?${queryParams.toString()}`;

  return axios
    .get(urlWithParams)
    .then((response) => {
      const data = response.data;
      if (data.status === "Success") {
        const tournaments = data.data;
        ResultsFetchedTournament.innerHTML = "";
        tournaments.forEach((tournament) => {
          const cardtournament = createTournamentCard(tournament);
          ResultsFetchedTournament.appendChild(cardtournament);
        });
      } else {
        console.error("Error:", data.message);
      }
    })
    .catch((error) => {
      console.error("Axios error:", error);
    });
}

function populateSelect(selectId, data) {
  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = "";
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.text = item.name;
    selectElement.appendChild(option);
  });
}

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

      populateSelect("tournamenttype", tournamentTypes);
      populateSelect("tournamentregion", regions);
      populateSelect("tournamentgame", games);
      const initialSelectedGameId = parseInt(gameSelect.value);
      populateSelect(
        "tournamentgamemode",
        games.find((game) => game.id === initialSelectedGameId).game_modes
      );

      gameSelect.addEventListener("change", function () {
        const selectedGameId = parseInt(gameSelect.value);

        const selectedGame = games.find((game) => game.id === selectedGameId);
        console.log(selectedGameId);
        gameModeSelect.innerHTML = "";

        if (selectedGame) {
          selectedGame.game_modes.forEach((gameMode) => {
            const option = document.createElement("option");
            option.value = gameMode.id;
            option.text = gameMode.name;
            gameModeSelect.appendChild(option);
          });
        }
      });
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
    fetchTournaments();
  }
}

createtournamentButton.addEventListener("click", function () {
  const tournamentName = document.getElementById("tournamentname").value;
  const tournamentSize = document.getElementById("tournamentsize").value;
  const tournamentPoints = document.getElementById("tournamentpoints").value;
  const tournamentType = document.getElementById("tournamenttype").value;
  const tournamentRegion = document.getElementById("tournamentregion").value;
  const tournamentGame = document.getElementById("tournamentgame").value;
  const tournamentGameMode =
    document.getElementById("tournamentgamemode").value;
  const tournamentStartDate = document.getElementById(
    "tournamentstartdate"
  ).value;
  const tournamentEndDate = document.getElementById("tournamentenddate").value;
  const tournamentRules = document.getElementById("tournamentrules").value;
  const tournamentErrorMsg = document.getElementById("tournamenterrormsg");

  tournamentErrorMsg.innerText = "";

  if (
    !tournamentName ||
    !tournamentSize ||
    !tournamentType ||
    !tournamentRegion ||
    !tournamentGame ||
    !tournamentGameMode ||
    !tournamentStartDate ||
    !tournamentEndDate ||
    !tournamentRules ||
    !tournamentPoints
  ) {
    tournamentErrorMsg.innerText = "Please fill in all fields.";
  } else if (tournamentStartDate >= tournamentEndDate) {
    tournamentErrorMsg.innerText = "End date must be after the start date.";
  } else if (tournamentSize < 2 || tournamentSize > 128) {
    tournamentErrorMsg.innerText = "Tournament size must be between 2 and 128.";
  } else {
    const apiUrl = base_url + "admin/createtournament";
    const requestData = {
      method: "POST",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        name: tournamentName,
        tournament_size: tournamentSize,
        tournament_type_id: tournamentType,
        region_id: tournamentRegion,
        game_id: tournamentGame,
        game_mode_id: tournamentGameMode,
        start_date: tournamentStartDate,
        end_date: tournamentEndDate,
        rules: tournamentRules,
        tournament_points: tournamentPoints,
      },
    };

    axios(requestData)
      .then((response) => {
        tournamentErrorMsg.innerText = "Tournament created successfully.";
        console.log("Tournament created successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error creating tournament:", error);
      });
  }
});

ListTournaments.addEventListener("click", function () {
  ChangePage("listtournament");
});

CreateTournament.addEventListener("click", function () {
  ChangePage("createtournament");
});

ChangePage("listtournament");
