import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./styles.css";

const HeroCarousel = ({ images, showArrows, showIndicators }) => {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      swipeable={true}
      showStatus={false}
      showThumbs={false}
      interval={6000}
      emulateTouch={true}
      showArrows={showArrows}
      showIndicators={showIndicators}
    >
      {images.map((imageData, index) => (
        <div key={index}>
          <img
            src={imageData.src}
            alt={imageData.alt || `Hero ${index + 1}`}
            style={{
              width: imageData.width,
              height: imageData.height,
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
