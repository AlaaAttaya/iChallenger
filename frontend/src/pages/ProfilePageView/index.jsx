import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
const ProfilePageView = ({ userProfile }) => {
  const { username } = useParams();
  const [userProfileView, setUserProfileView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (userProfile && userProfile.username === username) {
      navigate("/Profile");
    } else {
      setLoading(false);
    }
  }, [userProfile, username, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/search?username=${username}`
      );
      console.log(response);

      if (response.data.data[0] !== undefined) {
        setUserProfileView(response.data.data[0]);
      } else {
        setError("Username not found.");
      }
      setLoading(false);
    } catch (error) {
      setError("Username not found.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!username) {
      setError("Username not found.");
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [username]);

  return (
    <div className="ProfilePage">
      {loading ? (
        <Loading />
      ) : error ? (
        <span className="errorloadinguser">Error: {error}</span>
      ) : (
        <div className="Profile-navbar">
          <div className="coverPhotoContainer">
            <img
              src={
                userProfileView
                  ? config.base_url + userProfileView.coverimage
                  : DefaultCoverPic
              }
              alt="ProfileCover"
              className="coverPhoto"
            />
          </div>
          <div className="profileImageContainer">
            {" "}
            <img
              src={
                userProfileView
                  ? config.base_url + userProfileView.profileimage
                  : DefaultProfilePic
              }
              alt="ProfileImage"
              className="profileImage"
            />
          </div>

          <div className="profile-navbar-buttons-container">
            <div className="user-info">
              <span className="username-profile">
                {" "}
                {userProfileView ? userProfileView.username : "username"}
              </span>
              <span className="followerscount-profile">
                {" "}
                {userProfileView
                  ? userProfileView.followers_count + " Followers"
                  : "0 Followers"}
              </span>
            </div>
            <div className="profile-navbar-buttons buttons-middle">
              <button>Overview</button>
              <button>Activity</button> <button>Stream</button>
            </div>
            <div className="profile-navbar-buttons buttons-right">
              <button className="viewbuttons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M16.8167 2C20.515 2 23 5.81347 23 9.371C23 16.5756 12.6867 22.475 12.5 22.475C12.3133 22.475 2 16.5756 2 9.371C2 5.81347 4.485 2 8.18333 2C10.3067 2 11.695 3.16452 12.5 4.18827C13.305 3.16452 14.6933 2 16.8167 2Z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Follow
              </button>
              <button className="viewbuttons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    d="M7.90827 23.7238C6.06065 24.6678 4.01408 25.1004 1.96267 24.9804C1.61516 24.9804 1.25057 24.9727 0.881101 24.9574C0.712994 24.952 0.549668 24.8973 0.409598 24.7996C0.269529 24.7018 0.158307 24.5647 0.0885166 24.404C0.0158514 24.2449 -0.0129529 24.0675 0.00536457 23.8921C0.0236821 23.7167 0.0883898 23.5501 0.192162 23.4113C1.32601 21.9819 2.18414 20.3343 2.71868 18.5605C1.4506 16.165 0.967823 13.3979 1.34478 10.6857C1.72173 7.97358 2.93748 5.46698 4.80459 3.55238C6.67171 1.63779 9.0865 0.421526 11.6767 0.091106C14.2668 -0.239314 16.8886 0.33446 19.1376 1.72397C21.3867 3.11347 23.1382 5.24155 24.1222 7.78011C25.1061 10.3187 25.2678 13.1267 24.5824 15.7714C23.897 18.416 22.4024 20.7504 20.3292 22.4146C18.256 24.0788 15.7193 24.9804 13.1101 24.9804C11.3074 24.9852 9.52784 24.5553 7.90827 23.7238ZM8.30213 21.7781C10.4413 23.0005 12.93 23.366 15.3062 22.8067C17.6824 22.2473 19.7847 20.8012 21.2228 18.7369C22.6608 16.6725 23.3369 14.1301 23.1256 11.5816C22.9142 9.03323 21.8297 6.65195 20.0735 4.87992C18.3172 3.1079 16.0085 2.06552 13.576 1.94633C11.1435 1.82713 8.75249 2.63921 6.84684 4.23179C4.94118 5.82437 3.65039 8.08926 3.2141 10.6059C2.77782 13.1226 3.22569 15.7201 4.47455 17.9162C4.59209 18.1219 4.63211 18.3663 4.58674 18.6015C4.22357 20.1955 3.57784 21.7033 2.68331 23.0462C4.31143 23.1032 5.92253 22.6832 7.33639 21.8332C7.49018 21.7194 7.67381 21.6585 7.86194 21.659C8.01583 21.6595 8.16716 21.7004 8.30213 21.7781ZM8.23262 16.014C7.99008 16.014 7.75746 15.9128 7.58596 15.7326C7.41445 15.5525 7.3181 15.3081 7.3181 15.0533C7.3181 14.7985 7.41445 14.5542 7.58596 14.374C7.75746 14.1939 7.99008 14.0926 8.23262 14.0926H16.7681C17.0107 14.0926 17.2433 14.1939 17.4148 14.374C17.5863 14.5542 17.6827 14.7985 17.6827 15.0533C17.6827 15.3081 17.5863 15.5525 17.4148 15.7326C17.2433 15.9128 17.0107 16.014 16.7681 16.014H8.23262ZM8.23262 10.8904C7.99008 10.8904 7.75746 10.7891 7.58596 10.609C7.41445 10.4288 7.3181 10.1845 7.3181 9.92967C7.3181 9.67488 7.41445 9.43052 7.58596 9.25036C7.75746 9.07019 7.99008 8.96898 8.23262 8.96898H14.3294C14.572 8.96898 14.8046 9.07019 14.9761 9.25036C15.1476 9.43052 15.2439 9.67488 15.2439 9.92967C15.2439 10.1845 15.1476 10.4288 14.9761 10.609C14.8046 10.7891 14.572 10.8904 14.3294 10.8904H8.23262Z"
                    fill="white"
                  />
                </svg>
                Message
              </button>
              <button className="report-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.7487 3.01192C10.4441 2.38882 9.55606 2.38882 9.25139 3.01192L2.75474 16.3006C2.48408 16.8542 2.88715 17.4999 3.50339 17.4999H16.4967C17.113 17.4999 17.5161 16.8542 17.2454 16.3006L10.7487 3.01192ZM7.7541 2.2799C8.66797 0.410608 11.3321 0.410601 12.2461 2.2799L18.7427 15.5686C19.5546 17.2294 18.3455 19.1666 16.4967 19.1666H3.50339C1.65468 19.1666 0.445454 17.2294 1.25743 15.5686L7.7541 2.2799Z"
                    fill="#FAFF0E"
                  />
                  <path
                    d="M9.16663 7.08333C9.16663 6.6231 9.53971 6.25 9.99996 6.25C10.4602 6.25 10.8333 6.6231 10.8333 7.08333V11.6667C10.8333 12.1269 10.4602 12.5 9.99996 12.5C9.53971 12.5 9.16663 12.1269 9.16663 11.6667V7.08333Z"
                    fill="#FAFF0E"
                  />
                  <path
                    d="M11.25 15C11.25 15.6903 10.6904 16.25 10 16.25C9.30967 16.25 8.75 15.6903 8.75 15C8.75 14.3097 9.30967 13.75 10 13.75C10.6904 13.75 11.25 14.3097 11.25 15Z"
                    fill="#FAFF0E"
                  />
                </svg>
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfilePageView;
