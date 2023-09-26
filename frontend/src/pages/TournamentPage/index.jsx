import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../services/config";
import Loading from "../../components/Loading";
import "./styles.css";
import {
  SingleEliminationBracket,
  Match,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";

const TournamentPage = () => {
  const { tournamentid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("rules");
  const [enrollActive, setEnrollActive] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const dummyMatches = [
    {
      id: 1,
      name: "Round 1 - Match 1",
      nextMatchId: 2,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "DONE",
      participants: [
        {
          id: "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc",
          resultText: "WON",
          isWinner: false,
          status: "PLAYED",
          name: "Team A",
        },
        {
          id: "9ea9ce1a-4794-4553-856c-9a3620c0531b",
          resultText: null,
          isWinner: true,
          status: "PLAYED",
          name: "Team B",
        },
      ],
    },
    {
      id: 2,
      name: "Round 1 - Match 2",
      nextMatchId: 3,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "DONE",
      participants: [
        {
          id: "9ea9ce1a-4794-4553-856c-9a3620c0531b",
          resultText: "WON",
          isWinner: false,
          status: "PLAYED",
          name: "Team C",
        },
        {
          id: "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc",
          resultText: null,
          isWinner: true,
          status: "PLAYED",
          name: "Team D",
        },
      ],
    },
    {
      id: 3,
      name: "Round 2 - Match 1",
      nextMatchId: null,
      tournamentRoundText: "2",
      startTime: "2021-06-01",
      state: "DONE",
      participants: [
        {
          id: "9ea9ce1a-4794-4553-856c-9a3620c0531b",
          resultText: "WON",
          isWinner: false,
          status: "PLAYED",
          name: "Team C",
        },
        {
          id: "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc",
          resultText: null,
          isWinner: true,
          status: "PLAYED",
          name: "Team A",
        },
      ],
    },
  ];

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
  const handlePageClick = (page) => {
    setActivePage(page);
  };
  const handleEnrollActive = () => {
    setEnrollActive(!enrollActive);
  };

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
                <button onClick={() => handleEnrollActive()}>Enroll</button>
              </div>
            </div>
          </div>

          <div className="tournament-navinfo">
            <button
              className={activePage === "rules" ? "navinfoactive" : ""}
              onClick={() => handlePageClick("rules")}
            >
              Rules
            </button>
            <button
              className={activePage === "brackets" ? "navinfoactive" : ""}
              onClick={() => handlePageClick("brackets")}
            >
              Brackets
            </button>
            <button
              className={activePage === "teams" ? "navinfoactive" : ""}
              onClick={() => handlePageClick("teams")}
            >
              Teams
            </button>
          </div>
          {activePage === "rules" && (
            <div className="tournament-rules">rule</div>
          )}
          {activePage === "brackets" && (
            <div className="tournament-brackets">
              <SingleEliminationBracket
                options={{
                  style: {
                    roundHeader: { backgroundColor: "#AAA" },
                    connectorColor: "green",
                    connectorColorHighlight: "#000",
                  },
                }}
                matches={dummyMatches}
                matchComponent={Match}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer width={1000} height={1000} {...props}>
                    {children}
                  </SVGViewer>
                )}
              />
            </div>
          )}
          {activePage === "teams" && (
            <div className="tournament-teams">team</div>
          )}
          {enrollActive && (
            <div className="tournament-enroll">
              <div className="tournament-enroll-close-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  className="tournament-enroll-close"
                  onClick={() => handleEnrollActive()}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.68056 10.9999L0 19.6805L2.31935 22L11 13.3193L19.6806 22L22 19.6805L13.3194 10.9999L21.9998 2.31938L19.6803 0L11 8.68039L2.31961 0L0.000261718 2.31938L8.68056 10.9999Z"
                    fill="#2FD671"
                  />
                </svg>
              </div>
              <div className="tournament-invitations">inv</div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TournamentPage;
