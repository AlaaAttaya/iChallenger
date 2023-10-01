import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const Card = ({ title, image, width, height, alt, cardlink }) => {
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
        <Link to={cardlink} className="gcardlink">
          <div className="gcard-content">
            <div className="gcard-title">{title}</div>
          </div>
          <img src={image} alt={alt} className="gcard-image" />
        </Link>
      </div>
    </div>
  );
};

export default Card;
