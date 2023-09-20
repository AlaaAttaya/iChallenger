import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
const ReportUser = ({ onClose, userProfileView }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const handleReportClick = () => {
    setShowConfirmation(true);
  };

  const handleYesClick = async () => {
    if (userProfileView) {
      try {
        const response = await axios.post(
          `${config.base_url}/api/user/report`,
          {
            reported_user: userProfileView.username,
            message: reportMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setApiResponse({
          status: "Success",
          message: "User reported successfully",
          data: response.data,
        });
        setTimeout(() => {
          setShowConfirmation(false);
          onClose();
        }, 1000);
      } catch (error) {
        setApiResponse({
          status: "Error",
          message: "An error occurred while reporting the user",
          error: error.response.data,
        });
      }
    } else {
      setApiResponse({
        status: "Error",
        message: "Please Login.",
      });
    }
  };

  const handleNoClick = () => {
    setShowConfirmation(false);
  };

  const handleCloseClick = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div className="report-container">
      <div className="closeclick-button-container">
        <button className="closeclick-button" onClick={handleCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.52399 6.99991L0 12.524L1.47595 14L7 8.47594L12.524 14L14 12.524L8.47601 6.99991L13.9999 1.47597L12.5239 0L7 5.52388L1.47612 0L0.000166548 1.47597L5.52399 6.99991Z"
              fill="#2FD671"
            />
          </svg>
        </button>
      </div>
      {showConfirmation && (
        <div className="close-button-container">
          <div className="confirmation">
            <p>Are you sure?</p>
            {apiResponse && (
              <span>
                {apiResponse.status}: {apiResponse.message}
              </span>
            )}
            <div className="confirmation-button-container">
              <button className="yes-button" onClick={handleYesClick}>
                Yes
              </button>
              <button className="no-button" onClick={handleNoClick}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {!showConfirmation && (
        <div className="report-form">
          <h2>Report User</h2>
          <div className="reason">
            <label>Reason:</label>
            <textarea
              className="report-reason"
              placeholder="Enter your reason for reporting..."
              rows="4"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
            ></textarea>
          </div>
          <button className="reportuser-button" onClick={handleReportClick}>
            Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportUser;
