base_url = "http://127.0.0.1:8000/api/";
const ContactusButton = document.getElementById("contactus");
const ReportButton = document.getElementById("reportsbutton");
const ResultsFetched = document.getElementById("fetchresults");
const SearchResults = document.getElementById("searchusers");
const messagePopup = document.getElementById("messages-popup");
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
function showMessage(message) {
  messagePopup.innerText = message;
  messagePopup.style.display = "block";
  messagePopup.style.opacity = 1;

  setTimeout(() => {
    messagePopup.style.opacity = 0;
    setTimeout(() => {
      messagePopup.style.display = "none";
    }, 400);
  }, 2000);
}
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
            dropdownButton.textContent = "Hide Message";
            dropdownButton.style.backgroundColor = "#d62f2f";
          } else {
            messageParagraph.style.display = "none";
            dropdownButton.textContent = "Show Message";
            dropdownButton.style.backgroundColor = "#2fd671";
          }
        });

        resultDiv.appendChild(nameParagraph);
        resultDiv.appendChild(emailParagraph);
        resultDiv.appendChild(subjectParagraph);
        resultDiv.appendChild(messageParagraph);
        resultDiv.appendChild(dropdownButton);

        ResultsFetched.appendChild(resultDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching contactus data:", error);
    });
}

//Report List
function FetchReports(searchText) {
  activePage = "reports";
  ReportButton.style.borderBottom = "3px solid #2fd671";
  ContactusButton.style.borderBottom = "3px solid #989898";
  ReportButton.style.color = "#2fd671";
  ContactusButton.style.color = "#000000";

  let apiUrl = `${base_url}admin/getreports`;

  if (searchText && searchText.trim() !== "") {
    apiUrl += `?search=${searchText}`;
  }

  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  axios(apiUrl, requestData)
    .then((response) => {
      const reportsData = response.data.data;

      ResultsFetched.innerHTML = "";

      reportsData.forEach((item) => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("fetchedresults-reports");
        const reportedByEmail = item.user.email;
        const reportedByUsername = item.user.username;
        const reportedEmail = item.reported_user.email;
        const reportedUsername = item.reported_user.username;
        const message = item.message;
        const TotalReports = item.reports_count;
        const FetchedDate = item.created_at;
        const CreatedDate = new Date(FetchedDate).toLocaleString();
        const is_banned = item.reported_user.is_banned;

        const reportedEmailParagraph = document.createElement("p");
        reportedEmailParagraph.textContent = `Email: ${reportedEmail}`;
        const reportedUsernameParagraph = document.createElement("p");
        reportedUsernameParagraph.textContent = `Username: ${reportedUsername}`;

        const reportedByEmailParagraph = document.createElement("p");
        reportedByEmailParagraph.textContent = `Reported By Email: ${reportedByEmail}`;

        const reportedByUsernameParagraph = document.createElement("p");
        reportedByUsernameParagraph.textContent = `Reported By Username: ${reportedByUsername}`;
        const totalreportsParagraph = document.createElement("p");
        totalreportsParagraph.textContent = `User Reported ${TotalReports} Times`;
        const createdDateParagraph = document.createElement("p");
        createdDateParagraph.textContent = `User Reported at ${CreatedDate}`;
        const showMessageButton = document.createElement("button");
        showMessageButton.textContent = "Show Message";

        const messageParagraph = document.createElement("p");
        messageParagraph.textContent = `Message: ${message}`;
        messageParagraph.style.display = "none";

        const banunbanButton = document.createElement("button");
        if (is_banned === 0) {
          banunbanButton.textContent = "Ban";
          banunbanButton.classList.add("ban");
        } else {
          banunbanButton.textContent = "Unban";
          banunbanButton.classList.add("unban");
        }

        showMessageButton.addEventListener("click", () => {
          if (messageParagraph.style.display === "none") {
            messageParagraph.style.display = "block";
            showMessageButton.textContent = "Hide Message";
            showMessageButton.style.backgroundColor = "#d62f2f";
          } else {
            messageParagraph.style.display = "none";
            showMessageButton.textContent = "Show Message";
            showMessageButton.style.backgroundColor = "#2fd671";
          }
        });

        banunbanButton.addEventListener("click", () => {
          const isBanned = is_banned === 1;
          const action = isBanned ? "unban" : "ban";
          const identifier = reportedEmail;
          const Url = `${base_url}admin/${action}user`;
          const requestData = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              identifier: identifier,
            }),
          };

          axios(Url, requestData)
            .then((response) => {
              if (action === "ban") {
                banunbanButton.textContent = "Unban";
                banunbanButton.classList.remove("ban");
                banunbanButton.classList.add("unban");
              } else {
                banunbanButton.textContent = "Ban";
                banunbanButton.classList.remove("unban");
                banunbanButton.classList.add("ban");
              }
              showMessage(response.data.message);
              FetchReports(searchText);
            })
            .catch(() => {
              showMessage(`Error ${action}ning user.`);
            });
        });

        resultDiv.appendChild(reportedUsernameParagraph);
        resultDiv.appendChild(reportedEmailParagraph);

        resultDiv.appendChild(reportedByUsernameParagraph);
        resultDiv.appendChild(reportedByEmailParagraph);

        resultDiv.appendChild(totalreportsParagraph);
        resultDiv.appendChild(createdDateParagraph);
        resultDiv.appendChild(messageParagraph);

        resultDiv.appendChild(showMessageButton);
        resultDiv.appendChild(banunbanButton);

        ResultsFetched.appendChild(resultDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching reports:", error);
    });
}

ContactusButton.addEventListener("click", function () {
  fetchContactUsResults("");
});

ReportButton.addEventListener("click", function () {
  FetchReports("");
});

SearchResults.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const searchText = SearchResults.value;

    if (activePage === "contactus") {
      fetchContactUsResults(searchText);
    } else if (activePage === "reports") {
      FetchReports(searchText);
    }
  }, 300);
});

//ON LOAD
FetchReports("");
