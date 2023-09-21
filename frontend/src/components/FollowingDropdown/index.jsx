import React, { useState } from "react";
import "./styles.css";
import config from "../../services/config";
import axios from "axios";
const FollowingDropdown = ({ userProfile, setUserProfile }) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleFilteredInputFocus = () => {
    setInputFocused(true);
  };

  const handleFilteredInputBlur = () => {
    setInputFocused(false);
  };

  const handleFilteredInputChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleFilteredUnfollow = () => {};

  const filteredFollowing = userProfile.following.filter((user) =>
    user.username.toLowerCase().startsWith(searchText.toLowerCase())
  );
  const displayFollowing =
    searchText === "" ? userProfile.following : filteredFollowing;
  return (
    <div className="FollowingDropdown">
      <div className="search-wrapper">
        <div className={`search ${isInputFocused ? "focused" : ""}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 35 35"
            fill="none"
            className="search-iconsvg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
              className="search-icon"
              id="search-icon"
              fill="#fff"
            />
          </svg>

          <input
            type="text"
            id="searchinputfiltered"
            name="searchinputfiltered"
            className={`searchinput ${isInputFocused ? "focused" : ""}`}
            onFocus={handleFilteredInputFocus}
            onBlur={handleFilteredInputBlur}
            placeholder="Find Following"
            value={searchText}
            onChange={handleFilteredInputChange}
            autoComplete="off"
          />
        </div>

        <div className="following-list">
          {filteredFollowing.length > 0 ? (
            <div>
              {filteredFollowing.map((user) => (
                <div key={user.id} className="followinguser-usercard">
                  <div className="filteredusers-container">
                    <img
                      src={config.base_url + user.profileimage}
                      alt={`${user.username}'s Profile`}
                      className="followinguser-avatar"
                    />
                    <h2 className="followinguser-username">{user.username}</h2>
                  </div>
                  <button
                    className="follow-list-button"
                    onClick={handleFilteredUnfollow}
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span className="following-span">No following users found.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingDropdown;
