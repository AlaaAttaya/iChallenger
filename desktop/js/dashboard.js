base_url = "http://127.0.0.1:8000/api/";
const usersnumber = document.getElementById("usersnumber");
const tournamentsnumber = document.getElementById("tournamentsnumber");
const uploadsnumber = document.getElementById("uploadsnumber");
function fetchData() {
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

        console.log("Total Users:", totalUsers);
        console.log("Total Tournaments:", totalTournaments);
        console.log("Total Posts:", totalPosts);
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
fetchData();
const ColumnChart = document.getElementById("ColumnChart");
// Define your data and labels
const data = {
  labels: [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ],
  datasets: [
    {
      label: "Sample Data",
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Create the chart
const ctx = ColumnChart.getContext("2d");
const myColumnChart = new Chart(ctx, {
  type: "bar", // Use 'bar' for column chart
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
