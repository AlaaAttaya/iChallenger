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
        <div>
          <h1>{tournament.name}</h1>
        </div>
      ) : null}
    </div>
  );
};

export default TournamentPage;
