import React from "react";
import "../../styles/global.css";
import "./styles.css";
import ContentCarousel from "../../components/Carousel";
import Image from "../../assets/images/UploadImage.png";
const LandingPage = () => {
  const images = [Image, Image, Image, Image];
  return (
    <div className="LandingPage">
      <div className="hero-section">
        <ContentCarousel
          images={images}
          showArrows={false}
          showIndicators={true}
        />
      </div>
    </div>
  );
};

export default LandingPage;
