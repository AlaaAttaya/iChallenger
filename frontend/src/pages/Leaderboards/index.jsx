import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const LeaderboardsPage = () => {
  const [isInputFocused, setInputFocused] = useState(false);

  const handleSearchResultsFocus = () => {
    setInputFocused(true);
  };

  const handleSearchResultsBlur = () => {
    setInputFocused(false);
  };

  return (
    <div className="ForumsPage">
      <div className="navcommunity">
        <Link to="/Tournaments">
          <button>Find Tournaments</button>
        </Link>
        <Link to="/Leaderboards">
          <button className="thispage">Leaderboards</button>
        </Link>
      </div>
      <div className="searchleaderboards-container">
        <div
          className={`searchgamesbar ${isInputFocused ? "focused" : ""}`}
          id="searchgamesbar"
        >
          <svg
            width="25"
            height="34"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="searchleaderboards-iconsvg"
          >
            <path
              d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
              className={`searchleaderboards-icon ${
                isInputFocused ? "focused" : ""
              }`}
            />
          </svg>

          <input
            type="text"
            id="searchleaderboards"
            name="searchleaderboards"
            placeholder="Search..."
            className={`searchgamesinput ${isInputFocused ? "focused" : ""}`}
            onFocus={handleSearchResultsFocus}
            onBlur={handleSearchResultsBlur}
            required
          />
        </div>
      </div>
      <div className="searchleaderboards-results">asds</div>
    </div>
  );
};
export default LeaderboardsPage;
