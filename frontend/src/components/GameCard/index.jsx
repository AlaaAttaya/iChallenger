import React from "react";
import "./styles.css";

const GameCard = ({ title, image, alt }) => {
  return (
    <div className="game-card">
      <img src={image} alt={alt} className="game-image" />
      <div className="game-name">
        <span>{title}</span>
      </div>
    </div>
  );
};

export default GameCard;
