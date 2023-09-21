import React from "react";

const Card = ({ title, description, image, width, height, alt }) => {
  return (
    <div className="carousel-card-content">
      <div
        className="card"
        style={{
          width: width,
          height: height,
        }}
      >
        <img src={image} alt={alt} className="card-image" />
        <div className="card-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
