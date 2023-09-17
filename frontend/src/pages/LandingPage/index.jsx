import React from "react";
import "../../styles/global.css";
import "./styles.css";
import HeroCarousel from "../../components/HeroCarousel";
import CardCarousel from "../../components/CardCarousel";
import Image from "../../assets/images/UploadImage.png";

const LandingPage = () => {
  const heroImages = [
    {
      src: Image,
      width: "200px",
      height: "200px",
      alt: "Image",
    },
    {
      src: Image,
      width: "200px",
      height: "200px",
      alt: "Image",
    },
    {
      src: Image,
      width: "200px",
      height: "200px",
      alt: "Image",
    },
    {
      src: Image,
      width: "200px",
      height: "200px",
      alt: "Image",
    },
  ];

  const cardData = [
    {
      title: "Card 1",
      description: "This is card 1.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 2",
      description: "This is card 2.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 3",
      description: "This is card 3.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 4",
      description: "This is card 4.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 4",
      description: "This is card 4.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 4",
      description: "This is card 4.",
      image: Image,
      width: "200px",
      height: "200px",
      alt: "Hello",
    },
    {
      title: "Card 4",
      description: "This is card 4.",
      image: Image,
      width: "200px",
      height: "200px",
    },
    {
      title: "Card 8",
      description: "This is card 4.",
      image: Image,
      width: "200px",
      height: "200px",
    },
    {
      title: "Card 9",
      description: "This is card 4.",
      image: Image,
      width: "250px",
      height: "250px",
    },
  ];

  return (
    <div className="LandingPage">
      <section className="hero-section">
        <HeroCarousel
          images={heroImages}
          showArrows={false}
          showIndicators={true}
        />
      </section>
      <section className="content-section">
        <div className="forumscarousel">
          <CardCarousel cards={cardData} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
