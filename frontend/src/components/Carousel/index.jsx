import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./styles.css";

const ContentCarousel = ({ images, showArrows, showIndicators }) => {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showStatus={false}
      showThumbs={false}
      interval={10000}
      emulateTouch={true}
      showArrows={showArrows}
      showIndicators={showIndicators}
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Image ${index + 1}`} />
        </div>
      ))}
    </Carousel>
  );
};

export default ContentCarousel;
