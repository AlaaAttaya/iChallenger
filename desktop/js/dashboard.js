const base_url = "http://127.0.0.1:8000/api/";
const usersnumber = document.getElementById("usersnumber");
const tournamentsnumber = document.getElementById("tournamentsnumber");
const uploadsnumber = document.getElementById("uploadsnumber");
const ColumnChart = document.getElementById("ColumnChart");

const PieChart = document.getElementById("PieChart");
let myPieChart;
let myColumnChart;

//Random Color Generator(Pastel)
function getRandomColor() {
  const min = 200;
  const max = 255;

  const r = Math.floor(Math.random() * (max - min + 1) + min);
  const g = Math.floor(Math.random() * (max - min + 1) + min);
  const b = Math.floor(Math.random() * (max - min + 1) + min);

  return `rgb(${r}, ${g}, ${b})`;
}

//Fetch Total Users, Uploads & Tournaments
function fetchDataForDataCards() {
  axios
    .get(`${base_url}admin/getdatacards`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 201 && response.data) {
        const data = response.data.data;
        const totalUsers = data.totalusers;
        const totalTournaments = data.totaltournaments;
        const totalPosts = data.totalposts;

        usersnumber.innerText = totalUsers;
        tournamentsnumber.innerText = totalTournaments;
        uploadsnumber.innerText = totalPosts;
      } else {
        console.error("Failed to fetch data:", response);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//Fetch Count Of Users By Country
function fetchUsersByCountry() {
  axios
    .get(`${base_url}admin/usersbycountry`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 200 && response.data) {
        const data = response.data;

        const backgroundColors = data.data.map(() => getRandomColor());

        const labels = data.data.map((item) => item.country);
        const userCounts = data.data.map((item) => item.user_count);

        const columnChartData = {
          labels: labels,
          datasets: [
            {
              label: "Number of Users",
              data: userCounts,
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        };

        if (myColumnChart) {
          myColumnChart.destroy();
        }

        const ctxcolumn = ColumnChart.getContext("2d");
        myColumnChart = new Chart(ctxcolumn, {
          type: "bar",
          data: columnChartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.error("Failed to fetch users by country data:", response);
      }
    })
    .catch((error) => {
      console.error("Error fetching users by country data:", error);
    });
}
//Fetch Count of Tournaments for Each Game
function fetchTournamentsByGame() {
  axios
    .get(`${base_url}admin/tournamentsbygame`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.status === 200 && response.data) {
        const data = response.data;

        const backgroundColors = data.data.map(() => getRandomColor());

        const labels = data.data.map((item) => item.name);
        const tournamentCounts = data.data.map(
          (item) => item.tournaments_count
        );

        const pieChartData = {
          labels: labels,
          datasets: [
            {
              data: tournamentCounts,
              backgroundColor: backgroundColors,
            },
          ],
        };

        if (myPieChart) {
          myPieChart.destroy();
        }

        const ctxpie = PieChart.getContext("2d");
        myPieChart = new Chart(ctxpie, {
          type: "pie",
          data: pieChartData,
        });
      } else {
        console.error("Failed to fetch tournaments by game data:", response);
      }
    })
    .catch((error) => {
      console.error("Error fetching tournaments by game data:", error);
    });
}

fetchDataForDataCards();
fetchUsersByCountry();
fetchTournamentsByGame();
