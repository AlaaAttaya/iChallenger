import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import "./styles.css";
import HeroCarousel from "../../components/HeroCarousel";
import CardCarousel from "../../components/CardCarousel";
import Image from "../../assets/images/UploadImage.png";
import Card from "../../components/Card";
import config from "../../services/config";
import axios from "axios";
import Loading from "../../components/Loading";

const LandingPage = () => {
  const heroImages = [
    {
      src: Image,
      width: "600px",
      height: "500px",
      alt: "Image",
    },
    {
      src: Image,
      width: "100%",
      height: "500px",
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

  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGameData = async () => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getgames`,
        {
          params: { search: "" },
        }
      );

      if (response.status === 200) {
        setGameData(response.data.data);
        setLoading(false);
      } else {
        console.error("Error fetching game data:", response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const cardComponents = gameData.map((game) => (
    <Card
      key={game.id}
      title={game.name}
      image={`${config.base_url}${game.gameimage}`}
      alt={game.name}
      cardlink={`/Forums/${game.name}`}
    />
  ));

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
          {loading ? (
            <Loading />
          ) : (
            <>
              <CardCarousel
                cards={cardComponents}
                carouseltitle={"Game Forums"}
              />
              <hr />
              <CardCarousel
                cards={cardComponents}
                carouseltitle={"Tournaments"}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
