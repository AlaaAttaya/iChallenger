base_url = "http://127.0.0.1:8000/api/";
const searchInput = document.getElementById("searchgames");
const gamesContainer = document.getElementById("games-container");
const addGameButton = document.getElementById("addgame");
const modalContainer = document.getElementById("modal-container");
const closeModal = document.getElementById("closemodal");
const gameModesContainer = document.getElementById("game-modes-container");
const addGameModeButton = document.getElementById("add-game-mode");
const previewImage = document.getElementById("preview-image");
const gameImageInput = document.getElementById("game-image");
let allGames = [];
document.getElementById("searchgames").addEventListener("focus", function () {
  document.getElementById("searchgames-icon").style.fill = "#269c55";
});

document.getElementById("searchgames").addEventListener("blur", function () {
  document.getElementById("searchgames-icon").style.fill = "#9e9e9e";
});

function createGameCard(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");

  const image = document.createElement("img");
  image.src = "http://127.0.0.1:8000" + game.gameimage;
  image.alt = game.name;
  image.classList.add("game-image");

  const gameName = document.createElement("div");
  gameName.textContent = game.name;
  gameName.classList.add("game-name");

  card.appendChild(image);
  card.appendChild(gameName);

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

  gamesContainer.innerHTML = "";

  if (searchQuery === "") {
    allGames.forEach((game) => {
      const gameCard = createGameCard(game);
      gamesContainer.appendChild(gameCard);
    });
  } else {
    const filteredGames = allGames.filter((game) =>
      game.name.toLowerCase().includes(searchQuery)
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

///
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
  gameModesContainer.appendChild(gameModeInput);

  const removeGameModeButton = gameModeInput.querySelector(".remove-game-mode");
  removeGameModeButton.addEventListener("click", () => {
    gameModesContainer.removeChild(gameModeInput);
  });
});
