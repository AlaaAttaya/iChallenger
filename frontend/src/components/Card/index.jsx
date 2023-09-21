import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const Card = ({ title, description, image, width, height, alt, cardlink }) => {
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
          <div className="card-content">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
