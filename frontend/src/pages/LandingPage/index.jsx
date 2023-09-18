import React from "react";
import "../../styles/global.css";
import "./styles.css";
import HeroCarousel from "../../components/HeroCarousel";
import CardCarousel from "../../components/CardCarousel";
import Image from "../../assets/images/UploadImage.png";
import GameCard from "../../components/GameCard";
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
    <GameCard
      key="1"
      title="Card 1"
      description="This is card 1."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="2"
      title="Card 2"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="3"
      title="Card 2"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="4"
      title="Card 4"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="5"
      title="Card 4"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="6"
      title="Card 4"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
    <GameCard
      key="7"
      title="Card 7"
      description="This is card 2."
      image={Image}
      width="200px"
      height="200px"
      alt="Hello"
    />,
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
          <CardCarousel cards={cardData} carouseltitle={"Game Forums"} />
          <hr></hr>
          <CardCarousel cards={cardData} carouseltitle={"Tournaments"} />
          <hr></hr>
          <CardCarousel cards={cardData} carouseltitle={"Live Streams"} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
