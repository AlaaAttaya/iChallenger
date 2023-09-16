base_url = "http://127.0.0.1:8000/api/";
const ContactusButton = document.getElementById("contactus");
const ReportButton = document.getElementById("reportsbutton");
const ResultsFetched = document.getElementById("fetchresults");
document.getElementById("searchusers").addEventListener("focus", function () {
  document.getElementById("searchusers-icon").style.fill = "#269c55";
  document.getElementById("searchusersbar").style.border = "3px solid #269c55 ";
});

document.getElementById("searchusers").addEventListener("blur", function () {
  document.getElementById("searchusers-icon").style.fill = "#9e9e9e";
  document.getElementById("searchusersbar").style.border = "3px solid #9e9e9e ";
});
//Contactus List
function FetchContactus() {
  ContactusButton.style.borderBottom = "3px solid #2fd671";
  ReportButton.style.borderBottom = "3px solid #989898";
  ContactusButton.style.color = "#2fd671";
  ReportButton.style.color = "#000000";
}
FetchContactus();
//Report List
function FetchReports() {}
ContactusButton.addEventListener("click", FetchContactus);
ReportButton.addEventListener("click", function () {
  ReportButton.style.borderBottom = "3px solid #2fd671";
  ContactusButton.style.borderBottom = "3px solid #989898";
  ReportButton.style.color = " #2fd671";
  ContactusButton.style.color = "#000000";
});
