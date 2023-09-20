import React from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";
const ProfilePageSettings = ({ userProfile }) => {
  return (
    <div className="ProfilePage">
      <div className="Profile-navbar">
        <div className="coverPhotoContainer">
          <img
            src={
              userProfile
                ? config.base_url + userProfile.coverimage || DefaultCoverPic
                : DefaultCoverPic
            }
            alt="ProfileCover"
            className="coverPhoto"
          />
        </div>
        <div className="profileImageContainer">
          <img
            src={
              userProfile
                ? config.base_url + userProfile.profileimage ||
                  DefaultProfilePic
                : DefaultProfilePic
            }
            alt="ProfileImage"
            className="profileImage"
          />
        </div>

        <div className="profile-navbar-buttons-container">
          <div className="profile-navbar-buttons-wrapper">
            <div className="user-info">
              <span className="username-profile">Maria</span>
              <span className="followerscount-profile">Followers Count</span>
            </div>

            <div className="profile-navbar-buttons buttons-right">
              <button>Change Pictures</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePageSettings;
