import React from "react";
import "./styles.css";

const CommunityDropdown = ({ onActivity, onForums }) => {
  return (
    <div className="TournamentsDropdown">
      <button className="dropdown-button" onClick={onActivity}>
        Activity
      </button>
      <button className="dropdown-button" onClick={onForums}>
        Forums
      </button>
    </div>
  );
};

export default CommunityDropdown;
