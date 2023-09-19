import React from "react";
import "./styles.css";

const CommunityDropdown = ({ onActivity, onForums, onStreams }) => {
  return (
    <div className="TournamentsDropdown">
      <button className="dropdown-button" onClick={onActivity}>
        Activity
      </button>
      <button className="dropdown-button" onClick={onForums}>
        Forums
      </button>
      <button className="dropdown-button" onClick={onStreams}>
        Streams
      </button>
    </div>
  );
};

export default CommunityDropdown;
