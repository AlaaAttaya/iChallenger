import React from "react";
import "./styles.css";

const TournamentCard = ({ title, image, alt, Completed, startDate }) => {
  return (
    <div className="tournament-card">
      <img src={image} alt={alt} className="tournament-image" />
      <div className="info-container">
        <div className="tournament-name">{title}</div>
        <div className="tournament-completed">{Completed}</div>
        <div className="tournament-startdate">{startDate}</div>
      </div>
    </div>
  );
};

export default TournamentCard;
