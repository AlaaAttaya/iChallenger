import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import "./styles.css";

import HeroCarousel from "../../components/HeroCarousel";
import CardCarousel from "../../components/CardCarousel";

import ReadyToBattle from "../../assets/images/readytobattle.jpg";
import TournamentForEveryone from "../../assets/images/TournamentForEveryone.png";
import GamingTourneyFeat from "../../assets/images/GamingTourneyFeat.jpg";

import Card from "../../components/Card";
import LandingTournamentCard from "../../components/LandingTournamentCard";

import config from "../../services/config";
import axios from "axios";
import Loading from "../../components/Loading";

const LandingPage = () => {
  const heroImages = [
    {
      src: TournamentForEveryone,
      width: "100%",
      height: "640px",
      alt: "Image",
    },
    {
      src: ReadyToBattle,
      width: "100%",
      height: "640px",
      alt: "Image",
    },

    {
      src: GamingTourneyFeat,
      width: "100%",
      height: "640px",
      alt: "Image",
    },
  ];

  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTournaments, setOpenTournaments] = useState([]);

  const fetchOpenTournaments = async () => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getopentournaments`,
        {
          params: { searchQuery: "" },
        }
      );

      if (response.status === 200) {
        setOpenTournaments(response.data.data);
      } else {
        console.error(
          "Error fetching open tournaments data:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching open tournaments data:", error);
    }
  };

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
    fetchOpenTournaments();
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
  const TournamentComponents = openTournaments.map((tournament) => (
    <LandingTournamentCard
      key={tournament.id}
      title={tournament.name}
      image={`${config.base_url}${tournament.game.gameimage}`}
      Completed={tournament.is_completed === 1 ? "Completed" : "Open"}
      startDate={tournament.start_date}
      alt={tournament.game.name}
      cardlink={`/Tournaments/${tournament.id}`}
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
                cards={TournamentComponents}
                carouseltitle={"Tournaments"}
              />
              <hr />
              <CardCarousel
                cards={cardComponents}
                carouseltitle={"Game Forums"}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
