base_url = "http://127.0.0.1:8000/api/";
const searchInput = document.getElementById("searchgames");
const gamesContainer = document.getElementById("games-container");
const addGameButton = document.getElementById("addgame");
const modalContainer = document.getElementById("modal-container");
const updatemodalContainer = document.getElementById("modal-update-container");
const closeModal = document.getElementById("closemodal");
const closeModalUpdate = document.getElementById("closemodal-update");
const gameModesContainer = document.getElementById("game-modes-container");
const updategameModesContainer = document.getElementById(
  "game-modes-update-container"
);
const addGameModeButton = document.getElementById("add-game-mode");
const updateGameModeButton = document.getElementById("add-game-mode-update");
const previewImage = document.getElementById("preview-image");
const gameImageInput = document.getElementById("game-image");
let allGames = [];
let currentGameId = null;

document.getElementById("searchgames").addEventListener("focus", function () {
  document.getElementById("searchgames-icon").style.fill = "#269c55";
  document.getElementById("searchgamesbar").style.border = "3px solid #269c55 ";
});

document.getElementById("searchgames").addEventListener("blur", function () {
  document.getElementById("searchgames-icon").style.fill = "#9e9e9e";
  document.getElementById("searchgamesbar").style.border = "3px solid #9e9e9e ";
});

function createGameCard(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");
  card.dataset.gameId = game.id;
  const image = document.createElement("img");
  image.src = "http://127.0.0.1:8000" + game.gameimage;
  image.alt = game.name;
  image.classList.add("game-image");

  const gameName = document.createElement("div");
  gameName.textContent = game.name;
  gameName.classList.add("game-name");

  card.appendChild(image);
  card.appendChild(gameName);
  card.addEventListener("click", () => {
    const gameId = card.dataset.gameId;
    currentGameId = card.dataset.gameId;
    const gamefetched = allGames.find((g) => {
      return parseInt(g.id) === parseInt(gameId);
    });

    populateUpdateModal(gamefetched);

    updatemodalContainer.style.display = "flex";
  });
  return card;
}

async function fetchAndDisplayGames() {
  try {
    const response = await axios.get(`${base_url}user/getgames`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const games = response.data.data;

    allGames = games;

    games.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

fetchAndDisplayGames();

searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const addGameElement = document.getElementById("addgame");

  const childrenArray = Array.from(gamesContainer.children);

  childrenArray.forEach((childElement) => {
    if (childElement !== addGameElement) {
      gamesContainer.removeChild(childElement);
    }
  });

  if (searchQuery === "") {
    allGames.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  } else {
    const filteredGames = allGames.filter((game) =>
      game.name.toLowerCase().startsWith(searchQuery)
    );

    filteredGames.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  }
});
previewImage.addEventListener("click", () => {
  gameImageInput.click();
});

gameImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
});

//Create Game
addGameButton.addEventListener("click", () => {
  modalContainer.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  modalContainer.style.display = "none";
});

addGameModeButton.addEventListener("click", () => {
  const gameModeInput = document.createElement("div");
  gameModeInput.classList.add("gamemodeinputs");
  gameModeInput.innerHTML = `
        
        <input type="text" class="game-mode-name" placeholder="Name" />
        <input type="number" class="team-count" placeholder="Team Count" />
        <button class="remove-game-mode">Remove</button>
      `;

  gameModesContainer.insertBefore(gameModeInput, gameModesContainer.firstChild);

  const removeGameModeButton = gameModeInput.querySelector(".remove-game-mode");
  removeGameModeButton.addEventListener("click", () => {
    gameModesContainer.removeChild(gameModeInput);
  });
});

document.getElementById("create-game").addEventListener("click", () => {
  const name = document.getElementById("game-name").value;
  const gameModes = [];

  const gameModeInputs = document.querySelectorAll(".gamemodeinputs");
  gameModeInputs.forEach((input) => {
    const gameModeName = input.querySelector(".game-mode-name").value;
    const teamCount = input.querySelector(".team-count").value;

    if (gameModeName.trim() !== "" && teamCount.trim() !== "") {
      gameModes.push({
        name: gameModeName,
        max_players_per_team: parseInt(teamCount),
      });
    }
  });

  document.getElementById("errormessage").innerText = "";

  const gameImageInput = document.getElementById("game-image");

  if (gameImageInput.files.length > 0 && gameModes.length != 0) {
    const gameImageFile = gameImageInput.files[0];

    const formData = new FormData();
    formData.append("gameimage", gameImageFile);

    formData.append("name", name);
    formData.append("game_modes", JSON.stringify(gameModes));

    axios
      .post(base_url + "admin/creategame", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        if (
          error.response.data.message &&
          error.response.data.message.includes("already been taken")
        ) {
          document.getElementById("errormessage").innerText =
            "Game name is already taken.";
        } else {
          document.getElementById("errormessage").innerText =
            "Error creating the game. ";
        }
      });
  } else {
    document.getElementById("errormessage").innerText =
      "Must select a game image and provide a name & at least 1 game mode. ";
  }
});

//Update Game
document
  .getElementById("preview-image-update")
  .addEventListener("click", () => {
    document.getElementById("game-image-update").click();
  });

document
  .getElementById("game-image-update")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        document.getElementById("preview-image-update").src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  });

closeModalUpdate.addEventListener("click", () => {
  updatemodalContainer.style.display = "none";
});

updateGameModeButton.addEventListener("click", () => {
  const gameModeInput = document.createElement("div");
  gameModeInput.classList.add("gamemodeinputs");
  gameModeInput.innerHTML = `
          
          <input type="text" class="game-mode-name" placeholder="Name" />
          <input type="number" class="team-count" placeholder="Team Count" />
          <button class="remove-game-mode">Remove</button>
        `;

  updategameModesContainer.insertBefore(
    gameModeInput,
    updategameModesContainer.firstChild
  );

  const removeGameModeButton = gameModeInput.querySelector(".remove-game-mode");
  removeGameModeButton.addEventListener("click", () => {
    updategameModesContainer.removeChild(gameModeInput);
  });
});
function populateUpdateModal(game) {
  const updateGameNameInput = document.getElementById("game-name-update");

  const updatepreviewimage = document.getElementById("preview-image-update");
  updateGameNameInput.value = game.name;
  updatepreviewimage.src = "http://localhost:8000" + game.gameimage;
  updategameModesContainer.innerHTML = "";
  const gamemodesfetched = game.game_modes;
  gamemodesfetched.forEach((gamemode) => {
    const gameModeInput = document.createElement("div");
    gameModeInput.classList.add("gamemodeinputs");

    gameModeInput.innerHTML = `
        <div class="gamemode-labels">Name & Team Count</div>
        <input type="text" class="game-mode-name" placeholder="Name" value="${gamemode.name}" />
        
        <input type="number" class="team-count" placeholder="Team Count" value="${gamemode.max_players_per_team}" />
        <button class="remove-game-mode">Remove</button>
      `;

    updategameModesContainer.appendChild(gameModeInput);

    const removeGameModeButton =
      gameModeInput.querySelector(".remove-game-mode");
    removeGameModeButton.addEventListener("click", () => {
      updategameModesContainer.removeChild(gameModeInput);
    });
  });
}

document.getElementById("save-game").addEventListener("click", () => {
  const updatedName = document.getElementById("game-name-update").value;
  const gameModes = [];
  const gameId = currentGameId;
  const gameModeInputs = document.querySelectorAll(".gamemodeinputs");
  const updatedImageInput = document.getElementById("game-image-update");

  gameModeInputs.forEach((input) => {
    const gameModeName = input.querySelector(".game-mode-name").value;
    const teamCount = input.querySelector(".team-count").value;

    if (gameModeName.trim() !== "" && teamCount.trim() !== "") {
      gameModes.push({
        name: gameModeName,
        max_players_per_team: parseInt(teamCount),
      });
    }
  });

  const formData = new FormData();
  formData.append("name", updatedName);
  formData.append("game_modes", JSON.stringify(gameModes));

  if (updatedImageInput.files.length > 0) {
    formData.append("gameimage", updatedImageInput.files[0]);
  }

  document.getElementById("errormessage-update").innerText = "";
  if (gameModes.length != 0) {
    axios
      .post(`${base_url}admin/updategame?id=${gameId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Game updated:", response.data);

        updatemodalContainer.style.display = "none";

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating game:", error);

        if (
          error.response.data.message &&
          error.response.data.message.includes("already been taken")
        ) {
          document.getElementById("errormessage-update").innerText =
            "Game name is already taken.";
        } else {
          document.getElementById("errormessage-update").innerText =
            "Error updating the game.";
        }
      });
  } else {
    document.getElementById("errormessage-update").innerText =
      "Must select a game image and provide a name & at least 1 game mode. ";
  }
});
