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
import TeamShowcase from "../../components/TeamShowcase";
import UserCard from "../../components/UserCard";
import Pusher from "pusher-js";
const TournamentPage = ({ userProfile }) => {
  const { tournamentid } = useParams();
  const [tournament, setTournament] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("teams");
  const [enrollActive, setEnrollActive] = useState(false);
  const [bracketMatches, setBracketMatches] = useState(null);
  const [Teams, setTeams] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
  const [invitedError, setInviteError] = useState(null);
  const [enrollPage, setEnrollPage] = useState("errorPage");
  const [errorMsg, setErrorMsg] = useState("");
  const [teamNameInput, setTeamNameInput] = useState("");
  const [teamCreated, setteamCreated] = useState(null);
  const [MembersInvited, setMembersInvited] = useState([]);
  const [memberinvited, setMemberInvited] = useState("");
  const [maxPlayersPerTeam, setmaxPlayersPerTeam] = useState(null);
  const [maxTeams, setmaxTeams] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    console.log("test");
    if (userProfile) {
      const pusher = new Pusher("52c459eed956d1bac55e", {
        cluster: "eu",
      });

      const channel = pusher.subscribe("invitations." + userProfile.id);

      channel.bind("App\\Events\\AcceptedInvitation", function (data) {
        const acceptedMember = data.data;

        const isAlreadyInvited = MembersInvited.some(
          (member) => member.id === acceptedMember.invited_user.id
        );

        if (!isAlreadyInvited && MembersInvited.length <= maxPlayersPerTeam) {
          setMembersInvited((prevMembers) => [
            ...prevMembers,
            acceptedMember.invited_user,
          ]);
          setInviteError("");
        } else {
          setInviteError("Team size reached.");
        }
      });

      return () => {
        channel.unbind();
        pusher.unsubscribe("invitations." + userProfile.id);
        pusher.disconnect();
      };
    }
  }, [userProfile]);

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

        if (data.status === "Success") {
          const matches = data.data.brackets.reduce((accumulator, bracket) => {
            accumulator.push(...bracket.matches);
            return accumulator;
          }, []);

          const teams = data.data.teams.map((team) => ({
            id: team.id,
            name: team.name,
          }));

          const teamMembers = data.data.teams.reduce((accumulator, team) => {
            accumulator.push(
              ...team.members.map((member) => ({
                id: member.id,
                name: member.user.username,
                teamId: team.id,
              }))
            );
            return accumulator;
          }, []);

          const bracketStructure = data.data.brackets;
          const ResultMatches = matches.map((match, index) => {
            const matchId = match.id;
            const currentBracketIndex = bracketStructure.findIndex(
              (bracket) => bracket.id === match.bracket_id
            );
            const nextBracketIndex =
              currentBracketIndex < bracketStructure.length - 1
                ? currentBracketIndex + 1
                : -1;
            const nextMatchId =
              nextBracketIndex !== -1
                ? bracketStructure[nextBracketIndex].matches[0].id
                : null;

            return {
              id: matchId,
              name: `Round ${index}`,
              nextMatchId: nextMatchId,
              tournamentRoundText: `${index}`,
              startTime: match.match_date,
              state: match.is_completed === 1 ? "DONE" : "PENDING",
              participants: [
                {
                  id: match.team1_id,
                  resultText:
                    match.winner_id === match.team1_id &&
                    match.team1_id !== null &&
                    match.team1.id !== null
                      ? "WON"
                      : null,
                  isWinner:
                    match.winner_id === match.team1_id &&
                    match.team1_id !== null &&
                    match.team1.id !== null,
                  status: match.is_completed === 1 ? "PLAYED" : "UPCOMING",
                  name: match.team1 ? match.team1.name : "TBD",
                },
                {
                  id: match.team2_id,
                  resultText:
                    match.winner_id === match.team2_id &&
                    match.team2_id !== null &&
                    match.team2.id !== null
                      ? "WON"
                      : null,
                  isWinner:
                    match.winner_id === match.team2_id &&
                    match.team2_id !== null &&
                    match.team2.id !== null,
                  status: match.is_completed === 1 ? "PLAYED" : "UPCOMING",
                  name: match.team2 ? match.team2.name : "TBD",
                },
              ],
            };
          });

          console.log("tournaments", data.data);
          console.log("teams", teams);
          console.log("teamMembers", teamMembers);
          console.log("matches", matches);
          console.log("ResultMatches", ResultMatches);
          setTournament(data.data);
          setTeams(teams);
          setTeamMembers(teamMembers);
          setBracketMatches(ResultMatches);
          setmaxPlayersPerTeam(data.data.game_mode.max_players_per_team);
          setmaxTeams(data.data.tournament_size);
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
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
    } else {
      setInviteError("");
      if (!enrollActive) {
        setEnrollActive(!enrollActive);

        const token = localStorage.getItem("token");
        const currentDate = new Date().toLocaleString();
        const tournamentData = {
          tournament_id: tournament.id,
          datenow: currentDate,
        };
        axios
          .post(config.base_url + "/api/user/checktournament", tournamentData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response);
            setMembersInvited([]);
            setMembersInvited((prevMembers) => [...prevMembers, userProfile]);
            setEnrollPage("teamcreation");
          })
          .catch((error) => {
            console.log(error.response.data.message);
            setEnrollPage("errorPage");
            if (
              error.response.data.message ===
              "Tournament is full or has started."
            ) {
              setErrorMsg("Tournament is full or has started.");
            } else if (
              error.response.data.message ===
              "You are already a member of another team in this tournament."
            ) {
              setErrorMsg(
                "You are already a member of another team in this tournament."
              );
            } else {
              setErrorMsg("Error: unable to join tournament.");
            }
          });
      } else {
        setEnrollActive(!enrollActive);
      }
    }
  };
  const handleTeamCreation = () => {
    const token = localStorage.getItem("token");
    const currentDate = new Date().toLocaleString();

    if (teamNameInput.trim() === "") {
      return setErrorMsg("Team name cannot be empty.");
    }

    if (MembersInvited.length !== maxPlayersPerTeam) {
      return setInviteError(
        "Number of invited members does not match the team size."
      );
    }

    const teamData = {
      name: teamNameInput,
      tournament_id: tournament.id,
      datenow: currentDate,
      teammembers: MembersInvited,
    };

    axios
      .post(config.base_url + "/api/user/createteam", teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.message === "Tournament is full or has ended.") {
          setErrorMsg("Tournament is full or has ended.");
        } else if (
          response.data.message === "You are already a member of another team."
        ) {
          setErrorMsg("You are already a member of another team.");
        } else {
          console.log(response.data);
          setteamCreated(response.data);
          handleEnrollActive();

          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
        if (
          error.response.data.message === "Tournament is full or has started."
        ) {
          setErrorMsg("Tournament is full or has started.");
        } else if (
          error.response.data.message ===
          "You are already a member of another team in this tournament."
        ) {
          setErrorMsg(
            "You are already a member of another team in this tournament."
          );
        } else {
          setErrorMsg("Error: unable to create team.");
        }
      });
  };

  const handleInvite = () => {
    if (!teamNameInput || !memberinvited) {
      setInviteError("Team name and invited username are required.");
      return;
    }
    if (memberinvited === userProfile.username) {
      setInviteError("You can't invite yourself.");
      return;
    }
    if (MembersInvited === maxPlayersPerTeam) {
      setInviteError("Team size reached.");
      return;
    }

    if (tournament && tournament.teams) {
      for (const team of tournament.teams) {
        if (team.members) {
          for (const member of team.members) {
            if (member.user.username === memberinvited) {
              setInviteError(
                "User is already a member of a team in this tournament."
              );
              return;
            }
          }
        }
      }
    }

    axios
      .post(
        config.base_url + "/api/user/sendinvitation",
        {
          tournament_id: tournament.id,
          team_name: teamNameInput,
          invitedUsername: memberinvited,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setInviteError("Pending...");
      })
      .catch((error) => {
        if (error.response) {
          setInviteError(error.response.data.message);
        } else {
          console.error("Error sending invitation:", error);
          setInviteError("An error occurred while sending the invitation.");
        }
      });
  };

  return (
    <div className="TournamentsPageResult">
      {loading ? (
        <Loading />
      ) : notFound ? (
        <h2>Tournament not found.</h2>
      ) : tournament ? (
        <div className="tournamentheader-wrapper">
          <div className="tournament-leftsection">
            <div className="blackbackground">
              <div className="leftsection-imageabsolute">
                {" "}
                <div className="tournamentheader-image-container">
                  <img
                    src={config.base_url + tournament.game.gameimage}
                    alt=""
                  />
                </div>
                <div className="tournamentheader-enroll">
                  <button onClick={() => handleEnrollActive()}>ENROLL</button>
                </div>
              </div>
            </div>
          </div>
          <div className="tournament-rightsection">
            <div className="blackbackground">
              <div className="tournamentheader-info">
                <div className="tournamentheader-info-wrapper">
                  <div className="tournamentheader-name">{tournament.name}</div>
                  <div className="tournamentgamegamemode">
                    <div className="tournamentheader-game">
                      <span className="label-tournament">Game Name</span>
                      <span className="greycolor-tournament">
                        {" "}
                        {tournament.game.name}
                      </span>
                    </div>

                    <div className="tournamentheader-gamemode">
                      <span className="label-tournament"> Game Mode </span>
                      <span className="greycolor-tournament">
                        {" "}
                        {tournament.game_mode ? tournament.game_mode.name : ""}
                      </span>
                    </div>
                  </div>
                  <div className="tournamentregion-startdate">
                    <div className="tournamentheader-region">
                      <span className="label-tournament"> Region</span>
                      <span className="greycolor-tournament">
                        {tournament.tournament_region}
                      </span>
                    </div>

                    <div className="tournamentheader-startdate">
                      <span className="label-tournament"> Start Date</span>
                      <span className="greycolor-tournament">
                        {tournament.start_date}
                      </span>
                    </div>
                  </div>
                  <div className="tournamentheader-pointsystem">
                    <div className="tournamentheader-points">
                      <span className="label-tournament"> Points</span>
                      <span className="greencolor-tournament">
                        {tournament.tournament_points} C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tournament-navinfo">
              <button
                className={activePage === "rules" ? "navinfoactive" : ""}
                onClick={() => handlePageClick("rules")}
              >
                RULES
              </button>
              <button
                className={activePage === "brackets" ? "navinfoactive" : ""}
                onClick={() => handlePageClick("brackets")}
              >
                BRACKETS
              </button>
              <button
                className={activePage === "teams" ? "navinfoactive" : ""}
                onClick={() => handlePageClick("teams")}
              >
                TEAMS
              </button>
            </div>
            {activePage === "rules" && (
              <div className="tournament-rules">
                <div className="rules">
                  <h3 className="rules-title">Rules </h3>
                  <pre>{tournament.rules}</pre>
                </div>
              </div>
            )}
            {activePage === "brackets" && (
              <div className="tournament-brackets">
                {Array.isArray(bracketMatches) && bracketMatches.length > 0 ? (
                  <SingleEliminationBracket
                    options={{
                      style: {
                        roundHeader: { backgroundColor: "#AAA" },
                        connectorColor: "green",
                        connectorColorHighlight: "#000",
                      },
                    }}
                    matches={bracketMatches}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }) => (
                      <SVGViewer width={600} height={500} {...props}>
                        {children}
                      </SVGViewer>
                    )}
                  />
                ) : (
                  <p className="nothingavailable">
                    No bracket matches available.
                  </p>
                )}
              </div>
            )}
            {activePage === "teams" && (
              <div className="tournament-teams">
                {Teams.length > 0 ? (
                  <TeamShowcase teams={Teams} teamMembers={teamMembers} />
                ) : (
                  <p className="nothingavailable">No teams available.</p>
                )}
              </div>
            )}
            {enrollActive && (
              <div className="popup-container">
                <div className="tournament-enroll">
                  <div className="tournament-enroll-close-wrapper">
                    <div className="tournament-enroll-svg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 22 22"
                        fill="none"
                        className="tournament-enroll-close"
                        onClick={() => {
                          handleEnrollActive();
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.68056 10.9999L0 19.6805L2.31935 22L11 13.3193L19.6806 22L22 19.6805L13.3194 10.9999L21.9998 2.31938L19.6803 0L11 8.68039L2.31961 0L0.000261718 2.31938L8.68056 10.9999Z"
                          fill="#2FD671"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="tournament-invitations">
                    <div className="header-invite">
                      <span>Form Team</span>
                      <span className="teammax-span">
                        Max Team Size: {maxPlayersPerTeam}
                      </span>
                    </div>
                    {enrollPage === "errorPage" && (
                      <div className="tournament-error-page">
                        <div className="errorpage-wrapper">
                          <span className="errormsg-createteam">
                            {errorMsg}
                          </span>
                        </div>
                      </div>
                    )}
                    {enrollPage === "teamcreation" && (
                      <div className="tournament-team-creation">
                        <div className="tournament-teamname-creation-wrapper">
                          {" "}
                          <div className="enroll-left">
                            <span className="teamname-span">
                              Team Name: &nbsp;
                              <input
                                type="text"
                                placeholder="Team Name"
                                className="teamname-creation"
                                onChange={(e) =>
                                  setTeamNameInput(e.target.value)
                                }
                              />
                            </span>
                          </div>
                          <div classname="enroll-right">
                            {maxPlayersPerTeam && maxPlayersPerTeam !== 1 && (
                              <div className="send-invitation">
                                <input
                                  type="text"
                                  placeholder="Send Invite.."
                                  className="send-invitation-input"
                                  onChange={(e) =>
                                    setMemberInvited(e.target.value)
                                  }
                                />
                                <button
                                  className="button-invite"
                                  onClick={() => handleInvite()}
                                >
                                  Invite
                                </button>
                              </div>
                            )}
                            <div className="team-members-list">
                              {MembersInvited ? (
                                MembersInvited.map((member) => (
                                  <div
                                    className="team-members-usercard"
                                    key={member.id}
                                  >
                                    <UserCard user={member} />
                                  </div>
                                ))
                              ) : (
                                <p></p>
                              )}
                              <span className="invited-error">
                                {invitedError}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="errormsg-createteam">{errorMsg}</span>
                        <button
                          className="CreateTeam"
                          onClick={() => handleTeamCreation()}
                        >
                          Create Team
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TournamentPage;
