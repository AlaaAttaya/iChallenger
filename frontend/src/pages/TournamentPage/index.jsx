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

          const sortedMatches = matches.sort(
            (a, b) => a.bracket_id - b.bracket_id || a.id - b.id
          );

          const ResultMatches = sortedMatches.map((match) => ({
            id: match.id,
            name: `Round ${match.bracket_id} - Match ${match.id}`,
            nextMatchId: null,
            tournamentRoundText: `${match.bracket_id}`,
            startTime: match.match_date,
            state: match.is_completed === 1 ? "DONE" : "PENDING",
            participants: [
              {
                id: match.team1_id,
                resultText: match.winner_id === match.team1_id ? "WON" : null,
                isWinner: match.winner_id === match.team1_id,
                status: match.is_completed === 1 ? "PLAYED" : "UPCOMING",
                name: match.team1.name,
              },
              {
                id: match.team2_id,
                resultText: match.winner_id === match.team2_id ? "WON" : null,
                isWinner: match.winner_id === match.team2_id,
                status: match.is_completed === 1 ? "PLAYED" : "UPCOMING",
                name: match.team2.name,
              },
            ],
          }));

          console.log("tournaments", data.data);
          console.log("teams", teams);
          console.log("teamMembers", teamMembers);
          console.log("matches", matches);
          console.log("dummyMatches", ResultMatches);

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
                Game Mode: &nbsp;{" "}
                {tournament.game_mode ? tournament.game_mode.name : ""}
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
              <div className="tournamentheader-points">
                Points:&nbsp;{tournament.tournament_points}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <path
                    d="M17.9473 32.9995C26.2025 33.0632 32.9416 26.425 32.9996 18.1727C33.0576 9.92036 26.4126 3.17893 18.1575 3.11527C9.90232 3.05162 3.16318 9.68983 3.10515 17.9421C3.04713 26.1945 9.69219 32.9359 17.9473 32.9995Z"
                    fill="#EFB832"
                  />
                  <path
                    d="M21.6137 23.1942C21.1819 23.6431 20.6648 24.0013 20.0927 24.2477C19.5206 24.4942 18.9049 24.6241 18.2818 24.6296C15.3422 24.607 12.9881 21.6168 13.0139 17.9477C13.0397 14.2786 15.4356 11.3251 18.3752 11.3477C19.0454 11.3684 19.704 11.5293 20.3084 11.8199C20.9128 12.1106 21.4497 12.5245 21.8844 13.0351"
                    fill="#EFB832"
                  />
                  <path
                    d="M9.73073 5.45461C12.2003 3.8317 15.0964 2.97765 18.0527 3.00044C22.0169 3.03102 25.8077 4.63459 28.5912 7.4584C31.3746 10.2822 32.9227 14.0949 32.8948 18.0578C32.8741 21.0131 31.9771 23.8953 30.3174 26.3398C28.6577 28.7844 26.3098 30.6815 23.5706 31.7914C20.8314 32.9013 17.8239 33.174 14.9285 32.5751C12.0331 31.9762 9.37974 30.5326 7.30403 28.4268C5.22831 26.3209 3.82345 23.6475 3.26709 20.7446C2.71072 17.8417 3.02786 14.8396 4.17837 12.118C5.32889 9.39639 7.26113 7.07752 9.73073 5.45461Z"
                    fill="#EFB832"
                  />
                  <path
                    d="M32.9996 18.1727L35.4996 18.1903L32.9996 18.1727ZM3.10515 17.9421L5.60509 17.9597L3.10515 17.9421ZM23.4154 24.9274C24.3726 23.9323 24.3419 22.3497 23.3468 21.3925C22.3517 20.4353 20.7691 20.466 19.8119 21.4611L23.4154 24.9274ZM18.2818 24.6296L18.2625 27.1296C18.2764 27.1297 18.2903 27.1297 18.3042 27.1295L18.2818 24.6296ZM18.3752 11.3477L18.4524 8.84893C18.4331 8.84833 18.4138 8.84796 18.3945 8.84781L18.3752 11.3477ZM19.9809 14.6558C20.876 15.7071 22.4539 15.8337 23.5051 14.9386C24.5564 14.0435 24.683 12.4657 23.7879 11.4144L19.9809 14.6558ZM18.0527 3.00044L18.0334 5.50037L18.0527 3.00044ZM9.73073 5.45461L8.35777 3.36536V3.36536L9.73073 5.45461ZM4.17837 12.118L1.87568 11.1445L4.17837 12.118ZM3.26709 20.7446L5.7224 20.274L3.26709 20.7446ZM14.9285 32.5751L14.4221 35.0233H14.4221L14.9285 32.5751ZM30.3174 26.3398L28.2491 24.9356L28.2491 24.9356L30.3174 26.3398ZM32.8948 18.0578L35.3948 18.0754L32.8948 18.0578ZM28.5912 7.4584L30.3716 5.7034V5.7034L28.5912 7.4584ZM30.4997 18.1551C30.4514 25.0253 24.8412 30.5526 17.9666 30.4996L17.928 35.4995C27.5637 35.5738 35.4318 27.8247 35.4996 18.1903L30.4997 18.1551ZM17.9666 30.4996C11.0907 30.4466 5.55677 24.8312 5.60509 17.9597L0.605215 17.9246C0.537479 27.5577 8.29372 35.4252 17.928 35.4995L17.9666 30.4996ZM5.60509 17.9597C5.6534 11.0896 11.2636 5.56219 18.1382 5.6152L18.1767 0.615349C8.54108 0.541044 0.67296 8.29009 0.605215 17.9246L5.60509 17.9597ZM18.1382 5.6152C25.0141 5.66822 30.548 11.2836 30.4997 18.1551L35.4996 18.1903C35.5673 8.55711 27.8111 0.689644 18.1767 0.615349L18.1382 5.6152ZM19.8119 21.4611C19.6109 21.6701 19.3701 21.8369 19.1036 21.9517L21.0818 26.5437C21.9595 26.1656 22.7529 25.6161 23.4154 24.9274L19.8119 21.4611ZM19.1036 21.9517C18.837 22.0666 18.55 22.1271 18.2594 22.1297L18.3042 27.1295C19.2598 27.121 20.2041 26.9219 21.0818 26.5437L19.1036 21.9517ZM18.3011 22.1297C17.2329 22.1215 15.4939 20.8035 15.5139 17.9653L10.514 17.9301C10.4824 22.4302 13.4515 27.0925 18.2625 27.1296L18.3011 22.1297ZM15.5139 17.9653C15.5338 15.1273 17.29 13.8394 18.3559 13.8477L18.3945 8.84781C13.5811 8.81069 10.5456 13.4298 10.514 17.9301L15.5139 17.9653ZM18.298 13.8465C18.6193 13.8565 18.9351 13.9336 19.225 14.073L21.3917 9.56686C20.4728 9.12501 19.4716 8.88042 18.4524 8.84893L18.298 13.8465ZM19.225 14.073C19.5149 14.2124 19.7724 14.411 19.9809 14.6558L23.7879 11.4144C23.1269 10.6381 22.3107 10.0087 21.3917 9.56686L19.225 14.073ZM18.072 0.500519C14.6214 0.47391 11.2408 1.47076 8.35777 3.36536L11.1037 7.54387C13.1599 6.19265 15.5714 5.48138 18.0334 5.50037L18.072 0.500519ZM8.35777 3.36536C5.47471 5.25997 3.21888 7.96715 1.87568 11.1445L6.48107 13.0914C7.4389 10.8256 9.04754 8.89507 11.1037 7.54387L8.35777 3.36536ZM1.87568 11.1445C0.532473 14.3219 0.162333 17.8266 0.811773 21.2152L5.7224 20.274C5.25912 17.8567 5.52324 15.3572 6.48107 13.0914L1.87568 11.1445ZM0.811773 21.2152C1.46121 24.6037 3.10102 27.7241 5.52358 30.1818L9.08447 26.6718C7.3556 24.9178 6.18569 22.6913 5.7224 20.274L0.811773 21.2152ZM5.52358 30.1818C7.94613 32.6394 11.0428 34.3243 14.4221 35.0233L15.4349 30.1269C13.0234 29.6281 10.8134 28.4257 9.08447 26.6718L5.52358 30.1818ZM14.4221 35.0233C17.8014 35.7223 21.3118 35.404 24.5094 34.1085L22.6318 29.4744C20.351 30.3985 17.8464 30.6258 15.4349 30.1269L14.4221 35.0233ZM24.5094 34.1085C27.707 32.8128 30.4481 30.5981 32.3857 27.7441L28.2491 24.9356C26.8673 26.9707 24.9126 28.5503 22.6318 29.4744L24.5094 34.1085ZM32.3857 27.7441C34.3234 24.8901 35.3705 21.5253 35.3948 18.0754L30.3949 18.0403C30.3776 20.5009 29.6308 22.9004 28.2491 24.9356L32.3857 27.7441ZM35.3948 18.0754C35.4273 13.4493 33.6202 8.99904 30.3716 5.7034L26.8107 9.2134C29.1291 11.5654 30.4181 14.7406 30.3949 18.0403L35.3948 18.0754ZM30.3716 5.7034C27.1231 2.4078 22.6989 0.5362 18.072 0.500519L18.0334 5.50037C21.3349 5.52583 24.4924 6.86138 26.8107 9.2134L30.3716 5.7034Z"
                    fill="#CC9322"
                  />
                </svg>
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
            <div className="tournament-rules">
              <div className="rules">
                <h3 className="rules-title">Rules: </h3>
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
                    <SVGViewer width={1000} height={1000} {...props}>
                      {children}
                    </SVGViewer>
                  )}
                />
              ) : (
                <p>No bracket matches available.</p>
              )}
            </div>
          )}
          {activePage === "teams" && (
            <div className="tournament-teams">
              {Teams.length > 0 ? (
                <TeamShowcase teams={Teams} teamMembers={teamMembers} />
              ) : (
                <p>No teams available.</p>
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
                  </div>
                  {enrollPage == "errorPage" && (
                    <div className="tournament-error-page">
                      <div className="errorpage-wrapper">
                        <span className="errormsg-createteam">{errorMsg}</span>
                      </div>
                    </div>
                  )}
                  {enrollPage == "teamcreation" && (
                    <div className="tournament-team-creation">
                      <div className="tournament-teamname-creation-wrapper">
                        {" "}
                        <span className="teammax-span">
                          Max Team Size: {maxPlayersPerTeam}
                        </span>
                        <span className="teamname-span">Team Name</span>
                        <input
                          type="text"
                          placeholder="Team Name"
                          className="teamname-creation"
                          onChange={(e) => setTeamNameInput(e.target.value)}
                        />
                        {maxPlayersPerTeam && maxPlayersPerTeam !== 1 && (
                          <div className="send-invitation">
                            <input
                              type="text"
                              placeholder="Send Invite.."
                              className="send-invitation-input"
                              onChange={(e) => setMemberInvited(e.target.value)}
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
                        </div>
                        <span className="invited-error">{invitedError}</span>
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
      ) : null}
    </div>
  );
};

export default TournamentPage;
