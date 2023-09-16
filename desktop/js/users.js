base_url = "http://127.0.0.1:8000/api/";
const ContactusButton = document.getElementById("contactus");
const ReportButton = document.getElementById("reportsbutton");
const ResultsFetched = document.getElementById("fetchresults");
const SearchResults = document.getElementById("searchusers");
let activePage;
let searchTimeout;
document.getElementById("searchusers").addEventListener("focus", function () {
  document.getElementById("searchusers-icon").style.fill = "#269c55";
  document.getElementById("searchusersbar").style.border = "3px solid #269c55 ";
});

document.getElementById("searchusers").addEventListener("blur", function () {
  document.getElementById("searchusers-icon").style.fill = "#9e9e9e";
  document.getElementById("searchusersbar").style.border = "3px solid #9e9e9e ";
});
//Contactus List
function fetchContactUsResults(searchText) {
  activePage = "contactus";
  ContactusButton.style.borderBottom = "3px solid #2fd671";
  ReportButton.style.borderBottom = "3px solid #989898";
  ContactusButton.style.color = " #2fd671";
  ReportButton.style.color = "#000000";
  const apiUrl = `${base_url}admin/contactus`;

  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  if (searchText && searchText.trim() !== "") {
    requestData.params = {
      search: searchText,
    };
  }

  axios(apiUrl, requestData)
    .then((response) => {
      const contactUsData = response.data.data;
      ResultsFetched.innerHTML = "";

      contactUsData.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("fetchedresults");

        const nameParagraph = document.createElement("p");
        nameParagraph.textContent = `Name: ${item.name}`;

        const emailParagraph = document.createElement("p");
        emailParagraph.textContent = `Email: ${item.email}`;

        const subjectParagraph = document.createElement("p");
        subjectParagraph.textContent = `Subject: ${item.subject}`;

        const dropdownButton = document.createElement("button");
        dropdownButton.textContent = "Show Message";

        const messageParagraph = document.createElement("p");
        messageParagraph.classList.add("message");
        messageParagraph.style.display = "none";
        messageParagraph.textContent = `Message: ${item.message}`;

        dropdownButton.addEventListener("click", () => {
          if (messageParagraph.style.display === "none") {
            messageParagraph.style.display = "block";
          } else {
            messageParagraph.style.display = "none";
          }
        });

        resultDiv.appendChild(nameParagraph);
        resultDiv.appendChild(emailParagraph);
        resultDiv.appendChild(subjectParagraph);
        resultDiv.appendChild(dropdownButton);
        resultDiv.appendChild(messageParagraph);

        ResultsFetched.appendChild(resultDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching contactus data:", error);
    });
}

fetchContactUsResults();

//Report List
function FetchReports() {}
ContactusButton.addEventListener("click", fetchContactUsResults);
ReportButton.addEventListener("click", function () {
  activePage = "reports";
  ReportButton.style.borderBottom = "3px solid #2fd671";
  ContactusButton.style.borderBottom = "3px solid #989898";
  ReportButton.style.color = "#2fd671";
  ContactusButton.style.color = "#000000";
});

SearchResults.addEventListener("keydown", () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const searchText = SearchResults.value;

    if (activePage === "contactus") {
      fetchContactUsResults(searchText);
    } else if (activePage === "reports") {
    }
  }, 300);
});
