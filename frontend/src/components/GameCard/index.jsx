import React from "react";
import "./styles.css";

const GameCard = ({ title, image, alt }) => {
  return (
    <div className="game-card">
      <div className="game-name">
        <span>{title}</span>
      </div>
      <img src={image} alt={alt} className="game-image" />
    </div>
  );
};

export default GameCard;
