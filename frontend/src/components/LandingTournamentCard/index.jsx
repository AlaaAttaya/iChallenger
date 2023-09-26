import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const LandingTournamentCard = ({
  title,
  Completed,
  startDate,
  image,
  width,
  height,
  alt,
  cardlink,
}) => {
  return (
    <div className="carousel-card-content">
      <div
        className="card"
        style={{
          width: width,
          height: height,
        }}
      >
        {" "}
        <Link to={cardlink} className="cardlink">
          <img src={image} alt={alt} className="card-image" />
          <div className="tournament-card-content">
            <div className="tournament-name">{title}</div>
            <div className="tournament-completed">{Completed}</div>
            <div className="tournament-startdate">{startDate}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingTournamentCard;
