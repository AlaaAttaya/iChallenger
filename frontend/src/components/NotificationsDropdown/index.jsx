import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";

const NotificationsDropdown = ({ userProfile }) => {
  const [accepted, setAccepted] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const handleAccept = (invitation) => {
    axios
      .post(
        `${config.base_url}/api/user/acceptinvitation`,
        {
          tournament_id: invitation.tournament_id,
          sender_id: invitation.sender_id,
          team_name: invitation.team_name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setAccepted(true);
          console.log("Accepted notification:", invitation);
        } else {
          console.error("Error accepting invitation:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error accepting invitation:", error);
      });
  };

  const handleCancel = (invitation) => {
    console.log(invitation);
    axios
      .post(
        `${config.base_url}/api/user/cancelinvitation`,
        {
          tournament_id: invitation.tournament_id,
          sender_id: invitation.sender_id,
          team_name: invitation.team_name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setCancelled(true);
          console.log("Cancelled notification:", invitation);
        } else {
          console.error("Error cancelling invitation:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error cancelling invitation:", error);
      });
  };

  useEffect(() => {
    if (userProfile) {
      axios
        .get(`${config.base_url}/api/user/getinvitations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("asd", response);
          const data = response.data;
          if (data.status === "Success") {
            setPendingInvitations(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching pending invitations:", error);
        });
    }
  }, [userProfile]);

  return (
    <div className="NotificationsDropdown">
      {pendingInvitations.length === 0 ? (
        <div className="no-notifications">No new notifications</div>
      ) : (
        pendingInvitations.map((invitation) => (
          <div key={invitation.id} className="notification-item">
            <div className="dropdown-title">
              {invitation
                ? `${invitation.sender.username} invited you to play in the tournament.`
                : ""}
            </div>
            {!accepted && !cancelled && (
              <div className="buttons-acceptcancel">
                <button
                  className="dropdown-button accept-button"
                  onClick={() => handleAccept(invitation)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C-1.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S24.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M0 0h24v24H0z" fill="green" />
                    <path d="M15.59 7.59L10 13.17 8.59 11.76 7.17 13.17 10 16l7-7z" />
                  </svg>{" "}
                  Accept
                </button>
                <button
                  className="dropdown-button cancel-button"
                  onClick={() => handleCancel(invitation)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C-1.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S24.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M0 0h24v24H0z" fill="red" />
                    <path d="M7 7h10v10H7z" />
                  </svg>{" "}
                  Cancel
                </button>
              </div>
            )}
            {accepted && (
              <div className="message-invitation-accepted">
                Invitation Accepted
              </div>
            )}
            {cancelled && (
              <div className="message-invitation-cancelled">
                Invitation Cancelled
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsDropdown;
