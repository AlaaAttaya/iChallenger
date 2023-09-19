import React from "react";
import "./styles.css";

const TournamentsDropdown = ({ onFindTournaments, onLeaderboard }) => {
  return (
    <div className="TournamentsDropdown">
      <button className="dropdown-button" onClick={onFindTournaments}>
        Find Tournaments
      </button>
      <button className="dropdown-button" onClick={onLeaderboard}>
        Leaderboard
      </button>
    </div>
  );
};

export default TournamentsDropdown;
