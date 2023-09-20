import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";
const ProfilePageView = () => {
  const [userProfileView, setUserProfileView] = useState(null);
  return (
    <div className="ProfilePage">
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
            <span className="username-profile">Maria</span>
            <span className="followerscount-profile">Followers Count</span>
          </div>
          <div className="profile-navbar-buttons buttons-middle">
            <button>Overview</button>
            <button>Activity</button> <button>Stream</button>
          </div>
          <div className="profile-navbar-buttons buttons-right">
            <button>Follow</button>
            <button>Message</button>
            <button>Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePageView;
