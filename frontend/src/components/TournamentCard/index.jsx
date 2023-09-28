import React from "react";
import "./styles.css";

const TournamentCard = ({ title, image, alt, GameMode, startDate }) => {
  return (
    <div className="tournament-card">
      <img src={image} alt={alt} className="tournament-image" />
      <div className="info-container">
        <div className="tournament-name">{title}</div>
        <div className="tournament-completed">{GameMode}</div>
        <div className="tournament-startdate">{startDate}</div>
      </div>
    </div>
  );
};

export default TournamentCard;
