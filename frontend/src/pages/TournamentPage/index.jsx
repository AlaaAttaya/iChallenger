import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../services/config";
import Loading from "../../components/Loading";
import "./styles.css";
const TournamentPage = () => {
  const { tournamentid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToTop();

    axios
      .get(config.base_url + "/api/guest/gettournamentpage", {
        params: {
          tournamentid: tournamentid,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(response);
        if (data.status === "Success") {
          setTournament(data.data);
        } else {
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.error(error);

        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tournamentid]);

  return (
    <div className="TournamentsPageResult">
      {loading ? (
        <Loading />
      ) : notFound ? (
        <h2>Tournament not found.</h2>
      ) : tournament ? (
        <div className="tournamentheader-wrapper">
          <div className="tournamentheader-info">
            <div className="tournamentheader-image-container">
              <img src={config.base_url + tournament.game.gameimage} />
            </div>
            <div className="tournamentheader-info-wrapper">
              <div className="tournamentheader-name">{tournament.name}</div>
              <div className="tournamentheader-game">
                {tournament.game.name}
              </div>
              <div className="tournamentheader-gamemode">
                Game Mode: &nbsp;{tournament.game_mode.name}
              </div>
              <div className="tournamentheader-region">
                Region:&nbsp;{tournament.tournament_region}
              </div>

              <div className="tournamentheader-startdate">
                Start Date:&nbsp;{tournament.start_date}
              </div>
              <div className="tournamentheader-enddate">
                End Date:&nbsp;
                {tournament.end_date}
              </div>
              <div className="tournamentheader-enroll">
                <button>Enroll</button>
              </div>
            </div>
          </div>

          <div className="tournament-navinfo">
            <button className="rulesbutton">Rules</button>
            <button>Brackets</button>
            <button>Teams</button>
          </div>
          <div className="tournament-rules"></div>
          <div className="tournament-brackets"></div>
          <div className="tournament-teams"></div>
        </div>
      ) : null}
    </div>
  );
};

export default TournamentPage;
