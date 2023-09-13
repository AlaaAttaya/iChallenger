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
