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

function generateInitialBrackets(teams) {
  const brackets = [];
  const numTeams = teams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));

  for (let round = 1; round <= numRounds; round++) {
    const bracket = {
      round: round,
      matches: [],
    };

    if (round === 1) {
      for (let i = 0; i < numTeams; i += 2) {
        const team1 = teams[i];
        const team2 = i + 1 < numTeams ? teams[i + 1] : null;

        const match = {
          team1_id: team1.id,
          team2_id: team2 ? team2.id : team1.id,
          team1_name: team1.name,
          team2_name: team2 ? team2.name : team1.name,
          match_date: null,
          nextmatchid: null,
          is_completed: 0,
          winner_id: null,
          round_number: round,
        };

        bracket.matches.push(match);
      }
    } else {
      const numMatches = Math.pow(2, numRounds - round);

      for (let i = 0; i < numMatches; i++) {
        const match = {
          team1_id: null,
          team2_id: null,
          team1_name: null,
          team2_name: null,
          match_date: null,
          nextmatchid: null,
          is_completed: 0,
          winner_id: null,
          round_number: round,
        };

        bracket.matches.push(match);
      }
    }

    brackets.push(bracket);
  }
  console.log("BBBBB", brackets);
  return brackets;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createTournamentWinner(tournamentId, teamId) {
  const apiUrl = base_url + `admin/createtournamentwinner`;

  const requestData = {
    tournament_id: tournamentId,
    team_id: teamId,
  };

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  axios
    .post(apiUrl, requestData, { headers: headers })
    .then((response) => {
      console.log("Create Tournament Winner Response:", response);
    })
    .catch((error) => {
      console.error("Error creating tournament winner:", error);
    });
}
function manageMatches(tournamentId, generatedmatches) {
  const apiUrl = base_url + "admin/managematches";
  console.log("asasdasda", generatedmatches);
  const requestData = {
    tournament_id: tournamentId,
    generatedmatches: generatedmatches,
  };

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return axios
    .post(apiUrl, requestData, { headers: headers })
    .then((response) => {
      console.log("Manage Matches Response:", response.data);
      return response.data;
    })
    .catch((error) => {
      document.getElementById("generatedmatcheserror").innerHTML =
        "Matches date cannot be null.";
      throw error;
    });
}

function populateUpdateTournamentModal(Tournament) {
  console.log("tournament", Tournament);
  const showTeamsButton = document.getElementById("showteams");
  const showBracketsButton = document.getElementById("showbrackets");
  const showWinnersButton = document.getElementById("showwinners");
  const listTeamsWrapper = document.getElementById("listteams");
  const listMatchesContainer = document.getElementById("listmatches-container");
  const listMatchesWrapper = document.getElementById("listmatches");
  const listWinnersWrapper = document.getElementById("listwinners");
  const saveMatchesButton = document.getElementById("save-matches");

  listTeamsWrapper.style.display = "block";
  listMatchesContainer.style.display = "none";
  listWinnersWrapper.style.display = "none";

  showTeamsButton.addEventListener("click", () => {
    listTeamsWrapper.style.display = "block";
    listMatchesContainer.style.display = "none";
    listWinnersWrapper.style.display = "none";
  });

  showBracketsButton.addEventListener("click", () => {
    listTeamsWrapper.style.display = "none";
    listMatchesContainer.style.display = "block";
    listWinnersWrapper.style.display = "none";
  });

  showWinnersButton.addEventListener("click", () => {
    listTeamsWrapper.style.display = "none";
    listMatchesContainer.style.display = "none";
    listWinnersWrapper.style.display = "block";
  });

  const generateBracketButton = document.getElementById("generate-brackets");

  const teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = "";
  Tournament.teams.forEach((team) => {
    const teamOption = document.createElement("option");
    teamOption.value = team.id;
    teamOption.text = team.name;
    teamSelect.appendChild(teamOption);
  });

  generateBracketButton.addEventListener("click", () => {
    const generatedMatches = generateInitialBrackets(Tournament.teams);

    listMatchesWrapper.innerHTML = "";
    console.log(generatedMatches);

    generatedMatches.forEach((bracket, roundIndex) => {
      const roundDiv = document.createElement("div");
      roundDiv.classList.add("round-wrapper");

      const roundHeader = document.createElement("h2");
      roundHeader.textContent = `Round ${roundIndex + 1}`;
      roundDiv.appendChild(roundHeader);

      bracket.matches.forEach((match, matchIndex) => {
        console.log(roundIndex, matchIndex);
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match-wrapper");

        const matchNumber = document.createElement("span");
        matchNumber.textContent = `Match ${roundIndex + 1}.${matchIndex + 1}`;
        matchDiv.appendChild(matchNumber);

        const dateLabel = document.createElement("label");
        dateLabel.textContent = "Date:";
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = `match_date_${roundIndex}_${matchIndex}`;
        dateInput.required = true;
        dateInput.setAttribute("data-round", match.round_number);
        dateLabel.appendChild(dateInput);
        matchDiv.appendChild(dateLabel);

        const team1Label = document.createElement("label");
        team1Label.textContent = "Team 1:";
        const team1Select = document.createElement("select");
        team1Select.name = `team1_${roundIndex}_${matchIndex}`;
        team1Select.required = true;

        Tournament.teams.forEach((team) => {
          const teamOption = document.createElement("option");
          teamOption.value = team.id;
          teamOption.textContent = team.name;
          team1Select.appendChild(teamOption);
        });

        team1Label.appendChild(team1Select);
        matchDiv.appendChild(team1Label);

        const team2Label = document.createElement("label");
        team2Label.textContent = "Team 2:";
        const team2Select = document.createElement("select");
        team2Select.name = `team2_${roundIndex}_${matchIndex}`;
        team2Select.required = true;

        Tournament.teams.forEach((team) => {
          const teamOption = document.createElement("option");
          teamOption.value = team.id;
          teamOption.textContent = team.name;
          team2Select.appendChild(teamOption);
        });

        team2Label.appendChild(team2Select);
        matchDiv.appendChild(team2Label);

        const winnerLabel = document.createElement("label");
        winnerLabel.textContent = "Winner:";
        const winnerSelect = document.createElement("select");
        winnerSelect.name = `winner_${roundIndex}_${matchIndex}`;

        const noWinnerOption = document.createElement("option");
        noWinnerOption.value = "";
        noWinnerOption.textContent = "No Winner";
        winnerSelect.appendChild(noWinnerOption);

        Tournament.teams.forEach((team) => {
          const teamOption = document.createElement("option");
          teamOption.value = team.id;
          teamOption.textContent = team.name;
          winnerSelect.appendChild(teamOption);
        });

        winnerLabel.appendChild(winnerSelect);
        matchDiv.appendChild(winnerLabel);

        const completedLabel = document.createElement("label");
        completedLabel.textContent = "Completed:";
        const isCompletedRadioYes = document.createElement("input");
        isCompletedRadioYes.type = "radio";
        isCompletedRadioYes.name = `completed_${roundIndex}_${matchIndex}`;
        isCompletedRadioYes.value = "1";
        isCompletedRadioYes.required = true;
        const yesLabel = document.createElement("span");
        yesLabel.textContent = "Yes";
        completedLabel.appendChild(isCompletedRadioYes);
        completedLabel.appendChild(yesLabel);

        const isCompletedRadioNo = document.createElement("input");
        isCompletedRadioNo.type = "radio";
        isCompletedRadioNo.name = `completed_${roundIndex}_${matchIndex}`;
        isCompletedRadioNo.value = "0";
        isCompletedRadioNo.required = true;
        const noLabel = document.createElement("span");
        noLabel.textContent = "No";
        completedLabel.appendChild(isCompletedRadioNo);
        completedLabel.appendChild(noLabel);
        matchDiv.appendChild(completedLabel);

        roundDiv.appendChild(matchDiv);

        team1Select.addEventListener("change", (event) => {
          console.log("Team 1 selected:", event.target.value);
        });

        team2Select.addEventListener("change", (event) => {
          console.log("Team 2 selected:", event.target.value);
        });
      });

      listMatchesWrapper.appendChild(roundDiv);
    });

    window.generatedMatches = generatedMatches;
  });

  const announceWinnersButton = document.getElementById(
    "announcewinners-matches"
  );
  announceWinnersButton.addEventListener("click", () => {
    const selectedTeamId = teamSelect.value;
    const tournamentId = Tournament.id;
    console.log("selectteam", selectedTeamId);
    createTournamentWinner(tournamentId, selectedTeamId);
  });
  saveMatchesButton.addEventListener("click", () => {
    const generatedMatches = window.generatedMatches;
    const tournamentId = Tournament.id;

    console.log("save", generatedMatches);
    const teamIdToName = {};
    Tournament.teams.forEach((team) => {
      teamIdToName[team.id] = team.name;
    });
    generatedMatches.forEach((round, roundIndex) => {
      round.matches.forEach((match, matchIndex) => {
        console.log(roundIndex, matchIndex);
        const dateInput = document.querySelector(
          `input[name=match_date_${roundIndex}_${matchIndex}]`
        );
        const completedRadio = document.querySelector(
          `input[name=completed_${roundIndex}_${matchIndex}]:checked`
        );
        const winnerSelect = document.querySelector(
          `select[name=winner_${roundIndex}_${matchIndex}]`
        );
        match.round_number = roundIndex + 1;
        const team1SelectValue = document.querySelector(
          `select[name=team1_${roundIndex}_${matchIndex}]`
        ).value;

        const team2SelectValue = document.querySelector(
          `select[name=team2_${roundIndex}_${matchIndex}]`
        ).value;

        console.log("Team 1 selected value:", team1SelectValue);
        console.log("Team 2 selected value:", team2SelectValue);
        match.team1_id = team1SelectValue;
        match.team2_id = team2SelectValue;
        const team1Name = teamIdToName[team1SelectValue];
        const team2Name = teamIdToName[team2SelectValue];
        console.log("team1name", team1Name);
        console.log("team2name", team2Name);
        match.team1_name = team1Name;
        match.team2_name = team2Name;

        console.log("mmm", roundIndex);
        console.log("mmm", roundIndex);
        match.match_date = dateInput ? dateInput.value : null;
        match.is_completed = completedRadio
          ? parseInt(completedRadio.value)
          : 0;
        match.winner_id = winnerSelect ? winnerSelect.value : null;
      });
    });

    console.log("generated", generatedMatches);

    manageMatches(tournamentId, generatedMatches)
      .then((response) => {
        console.log("Matches managed successfully:", response);
      })
      .catch((error) => {
        console.error("Error managing matches:", error);
      });
  });

  listTeamsWrapper.innerHTML = "";

  Tournament.teams.forEach((team) => {
    const teamDiv = document.createElement("div");
    teamDiv.classList.add("team-wrapper");

    const teamName = document.createElement("span");
    teamName.textContent = `Team Name: ${team.name}`;
    teamDiv.appendChild(teamName);

    team.members.forEach((member) => {
      const memberName = document.createElement("span");
      memberName.textContent = `Member: ${member.user.username}`;
      teamDiv.appendChild(memberName);
    });

    listTeamsWrapper.appendChild(teamDiv);
  });
  listMatchesWrapper.innerHTML = "";
}

function createTournamentCard(Tournament) {
  const card1 = document.createElement("div");
  card1.classList.add("tournament-card");

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

  card1.appendChild(image);
  card1.appendChild(infoContainer);
  card1.setAttribute("data-Tournament", JSON.stringify(Tournament));
  card1.addEventListener("click", () => {
    const Tournamenttoupdate = JSON.parse(
      card1.getAttribute("data-Tournament")
    );
    populateUpdateTournamentModal(Tournamenttoupdate);
    updatemodalContainer.style.display = "flex";
  });

  return card1;
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
    option.setAttribute("data-name", item.name);
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
  const selectElement = document.getElementById("tournamentregion");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const tournamentRegion = selectedOption.getAttribute("data-name");

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
        tournament_region: tournamentRegion,
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
