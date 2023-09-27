import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";
import { useParams, useNavigate } from "react-router-dom";
import ReportUser from "../../components/ReportUser";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import Message from "../../components/Message";
const ProfilePageView = ({ userProfile, setUserProfile }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userProfileView, setUserProfileView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isreportopen, setIsReportOpen] = useState(false);
  const [isUserSignedinView, setIsUserSignedinView] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeButton, setActiveButton] = useState("Overview");
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageComponent, setShowMessageComponent] = useState(false);
  const [isactiveTournament, setActiveTournament] =
    useState("activeTournament");
  const [pastTournaments, setPastTournaments] = useState([]);
  const [activeTournaments, setActiveTournaments] = useState([]);
  const handleOpenMessage = () => {
    setShowMessageComponent(!showMessageComponent);
  };
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "Activity" && userPosts.length === 0) {
      fetchUserPosts();
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchUserStats = async (username) => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getusersstats?username=${username}`
      );

      setUserStats(response.data.data[0]);
      const teams = response.data.data[0].teams;
      const active = [];
      const past = [];
      console.log(response.data.data[0]);
      teams.forEach((team) => {
        if (team.tournament && team.tournament.is_completed === 1) {
          past.push(team.tournament);
        } else if (team.tournament) {
          active.push(team.tournament);
        }
      });

      setPastTournaments(past);
      setActiveTournaments(active);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  useEffect(() => {
    if (!username) {
      setError("Username not found.");
      setLoading(false);
    } else {
      fetchUserProfile();
      fetchUserStats(username);
    }
  }, [username]);

  useEffect(() => {
    if (userProfile && userProfile.username === username) {
      navigate("/Profile");
    } else {
      setLoading(false);
    }
  }, [userProfile, username, navigate]);
  useEffect(() => {
    scrollToTop();
    if (userProfile && userProfile.username === username) {
      navigate("/Profile");
    } else {
      setLoading(false);
    }
    if (userProfile) {
      setIsUserSignedinView(true);

      const isFollowingUser = userProfile.following.some((user) => {
        return user.username === username;
      });

      setIsFollowing(isFollowingUser);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/search?username=${username}`
      );

      if (response.data.data[0] !== undefined) {
        setUserProfileView(response.data.data[0]);
      } else {
        setError("Username not found.");
      }
      setLoading(false);
    } catch (error) {
      setError("Username not found.");
      setLoading(false);
    }
  };

  const HandleReportDiv = () => {
    setIsReportOpen(true);
  };
  const handleCloseReportUser = () => {
    setIsReportOpen(false);
  };

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        const response = await axios.post(
          `${config.base_url}/api/user/unfollow`,
          { username: userProfileView.username },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setIsFollowing(!isFollowing);
          const updatedUserProfileView = { ...userProfileView };
          updatedUserProfileView.followers_count -= 1;
          setUserProfileView(updatedUserProfileView);
          setUserProfile(response.data.user);
        } else {
          console.error("Error toggling follow:", response.data.message);
        }
      } else {
        const response = await axios.post(
          `${config.base_url}/api/user/follow`,
          { username: userProfileView.username },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setIsFollowing(!isFollowing);
          const updatedUserProfileView = { ...userProfileView };
          updatedUserProfileView.followers_count += 1;
          setUserProfileView(updatedUserProfileView);
          setUserProfile(response.data.user);
        } else {
          console.error("Error toggling follow:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${config.base_url}/api/guest/getuserposts`,
        {
          params: {
            username: username,
          },
        }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        setUserPosts(response.data.data);
      } else {
        console.error("Error fetching user posts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleactiveTournament = async (tournamentactive) => {
    setActiveTournament(tournamentactive);
  };
  return (
    <div className="ProfilePage">
      {loading ? (
        <Loading />
      ) : error ? (
        <h1 className="errorloadinguser">{error}</h1>
      ) : (
        <>
          <div className="Profile-navbar">
            <div className="coverPhotoContainer">
              <img
                src={
                  userProfileView
                    ? config.base_url + userProfileView.coverimage
                    : DefaultCoverPic
                }
                alt="ProfileCover"
                className="coverPhoto"
              />
            </div>
            <div className="profileImageContainer">
              {" "}
              <img
                src={
                  userProfileView
                    ? config.base_url + userProfileView.profileimage
                    : DefaultProfilePic
                }
                alt="ProfileImage"
                className="profileImage"
              />
            </div>

            <div className="profile-navbar-buttons-container">
              <div className="user-info">
                <span className="username-profile">
                  {" "}
                  {userProfileView ? userProfileView.username : "username"}
                </span>
                <span className="followerscount-profile">
                  {" "}
                  {userProfileView
                    ? userProfileView.followers_count + " Followers"
                    : "0 Followers"}
                </span>
              </div>
              <div className="profile-navbar-buttons buttons-middle">
                <button
                  className={
                    activeButton === "Overview" ? "profilepageactive" : ""
                  }
                  onClick={() => handleButtonClick("Overview")}
                >
                  Overview
                </button>
                <button
                  className={
                    activeButton === "Activity" ? "profilepageactive" : ""
                  }
                  onClick={() => handleButtonClick("Activity")}
                >
                  Activity
                </button>
              </div>
              {isUserSignedinView ? (
                <div className="profile-navbar-buttons buttons-right">
                  <button className="viewbuttons" onClick={toggleFollow}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill={`${isFollowing ? "red" : "none"}`}
                    >
                      <path
                        d="M16.8167 2C20.515 2 23 5.81347 23 9.371C23 16.5756 12.6867 22.475 12.5 22.475C12.3133 22.475 2 16.5756 2 9.371C2 5.81347 4.485 2 8.18333 2C10.3067 2 11.695 3.16452 12.5 4.18827C13.305 3.16452 14.6933 2 16.8167 2Z"
                        stroke={`${isFollowing ? "red" : "black"}`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                  <button className="viewbuttons" onClick={handleOpenMessage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M7.90827 23.7238C6.06065 24.6678 4.01408 25.1004 1.96267 24.9804C1.61516 24.9804 1.25057 24.9727 0.881101 24.9574C0.712994 24.952 0.549668 24.8973 0.409598 24.7996C0.269529 24.7018 0.158307 24.5647 0.0885166 24.404C0.0158514 24.2449 -0.0129529 24.0675 0.00536457 23.8921C0.0236821 23.7167 0.0883898 23.5501 0.192162 23.4113C1.32601 21.9819 2.18414 20.3343 2.71868 18.5605C1.4506 16.165 0.967823 13.3979 1.34478 10.6857C1.72173 7.97358 2.93748 5.46698 4.80459 3.55238C6.67171 1.63779 9.0865 0.421526 11.6767 0.091106C14.2668 -0.239314 16.8886 0.33446 19.1376 1.72397C21.3867 3.11347 23.1382 5.24155 24.1222 7.78011C25.1061 10.3187 25.2678 13.1267 24.5824 15.7714C23.897 18.416 22.4024 20.7504 20.3292 22.4146C18.256 24.0788 15.7193 24.9804 13.1101 24.9804C11.3074 24.9852 9.52784 24.5553 7.90827 23.7238ZM8.30213 21.7781C10.4413 23.0005 12.93 23.366 15.3062 22.8067C17.6824 22.2473 19.7847 20.8012 21.2228 18.7369C22.6608 16.6725 23.3369 14.1301 23.1256 11.5816C22.9142 9.03323 21.8297 6.65195 20.0735 4.87992C18.3172 3.1079 16.0085 2.06552 13.576 1.94633C11.1435 1.82713 8.75249 2.63921 6.84684 4.23179C4.94118 5.82437 3.65039 8.08926 3.2141 10.6059C2.77782 13.1226 3.22569 15.7201 4.47455 17.9162C4.59209 18.1219 4.63211 18.3663 4.58674 18.6015C4.22357 20.1955 3.57784 21.7033 2.68331 23.0462C4.31143 23.1032 5.92253 22.6832 7.33639 21.8332C7.49018 21.7194 7.67381 21.6585 7.86194 21.659C8.01583 21.6595 8.16716 21.7004 8.30213 21.7781ZM8.23262 16.014C7.99008 16.014 7.75746 15.9128 7.58596 15.7326C7.41445 15.5525 7.3181 15.3081 7.3181 15.0533C7.3181 14.7985 7.41445 14.5542 7.58596 14.374C7.75746 14.1939 7.99008 14.0926 8.23262 14.0926H16.7681C17.0107 14.0926 17.2433 14.1939 17.4148 14.374C17.5863 14.5542 17.6827 14.7985 17.6827 15.0533C17.6827 15.3081 17.5863 15.5525 17.4148 15.7326C17.2433 15.9128 17.0107 16.014 16.7681 16.014H8.23262ZM8.23262 10.8904C7.99008 10.8904 7.75746 10.7891 7.58596 10.609C7.41445 10.4288 7.3181 10.1845 7.3181 9.92967C7.3181 9.67488 7.41445 9.43052 7.58596 9.25036C7.75746 9.07019 7.99008 8.96898 8.23262 8.96898H14.3294C14.572 8.96898 14.8046 9.07019 14.9761 9.25036C15.1476 9.43052 15.2439 9.67488 15.2439 9.92967C15.2439 10.1845 15.1476 10.4288 14.9761 10.609C14.8046 10.7891 14.572 10.8904 14.3294 10.8904H8.23262Z"
                        fill="black"
                      />
                    </svg>
                    Message
                  </button>
                  <button className="report-button" onClick={HandleReportDiv}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.7487 3.01192C10.4441 2.38882 9.55606 2.38882 9.25139 3.01192L2.75474 16.3006C2.48408 16.8542 2.88715 17.4999 3.50339 17.4999H16.4967C17.113 17.4999 17.5161 16.8542 17.2454 16.3006L10.7487 3.01192ZM7.7541 2.2799C8.66797 0.410608 11.3321 0.410601 12.2461 2.2799L18.7427 15.5686C19.5546 17.2294 18.3455 19.1666 16.4967 19.1666H3.50339C1.65468 19.1666 0.445454 17.2294 1.25743 15.5686L7.7541 2.2799Z"
                        fill="#FAFF0E"
                      />
                      <path
                        d="M9.16663 7.08333C9.16663 6.6231 9.53971 6.25 9.99996 6.25C10.4602 6.25 10.8333 6.6231 10.8333 7.08333V11.6667C10.8333 12.1269 10.4602 12.5 9.99996 12.5C9.53971 12.5 9.16663 12.1269 9.16663 11.6667V7.08333Z"
                        fill="#FAFF0E"
                      />
                      <path
                        d="M11.25 15C11.25 15.6903 10.6904 16.25 10 16.25C9.30967 16.25 8.75 15.6903 8.75 15C8.75 14.3097 9.30967 13.75 10 13.75C10.6904 13.75 11.25 14.3097 11.25 15Z"
                        fill="#FAFF0E"
                      />
                    </svg>
                    Report
                  </button>
                </div>
              ) : (
                <>
                  <div className="shifter"></div>
                </>
              )}
            </div>
          </div>{" "}
          <div
            className={activeButton === "Activity" ? "profile-pages-info" : ""}
          >
            {activeButton === "Overview" && (
              <div className="overview-container">
                <div className="overview-content-container">
                  <div className="overview-content-wrapper">
                    <div className="overview-content-gap">
                      <div className="overview-stats">
                        <span className="points-span">
                          {userStats && userStats.leaderboard
                            ? userStats.leaderboard.points
                            : "0"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
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
                        </span>
                        <span className="green"> Total Points</span>
                      </div>
                    </div>
                  </div>
                  <div className="overview-content-wrapper">
                    <div className="overview-content-gap">
                      <div className="overview-stats">
                        {userStats ? userStats.tournaments_count : "0"}
                        <span className="green"> Tournaments Played</span>
                      </div>
                    </div>
                  </div>
                  <div className="overview-content-wrapper">
                    <div className="overview-content-gap">
                      <div className="overview-stats">
                        {userStats ? userStats.matches_count : "0"}{" "}
                        <span className="green">Matches Played</span>
                      </div>
                    </div>
                  </div>
                  <div className="overview-content-wrapper">
                    <div className="overview-content-gap">
                      <div className="overview-stats-winrate">
                        <span>
                          {" "}
                          {userStats && userStats.leaderboard
                            ? userStats.tournaments_count === 0
                              ? "0%"
                              : `${
                                  (parseInt(userStats.leaderboard.won) /
                                    parseInt(userStats.tournaments_count)) *
                                  100
                                }%`
                            : "0%"}
                        </span>
                        <span className="green winrate">Win/Rate</span>
                      </div>
                      <div className="overview-stats-winrate">
                        <span>
                          {" "}
                          {userStats && userStats.leaderboard
                            ? userStats.leaderboard.won
                            : "0"}{" "}
                        </span>
                        <span className="green win">Wins</span>
                      </div>
                      <div className="overview-stats-winrate">
                        <span>
                          {" "}
                          {userStats && userStats.leaderboard
                            ? userStats.leaderboard.lost
                            : "0"}{" "}
                        </span>
                        <span className="red loss">Losses</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tournament-content-container">
                  <div className="tournament-content-wrapper">
                    <div className="pages-overview">
                      <button
                        className={
                          isactiveTournament === "activeTournament"
                            ? "tournamentactive"
                            : ""
                        }
                        onClick={() =>
                          handleactiveTournament("activeTournament")
                        }
                      >
                        Active Tournaments
                      </button>
                      <button
                        className={
                          isactiveTournament === "pastTournament"
                            ? "tournamentactive"
                            : ""
                        }
                        onClick={() => handleactiveTournament("pastTournament")}
                      >
                        Past Tournaments
                      </button>
                    </div>
                    <div className="tournaments-results-wrapper">
                      {isactiveTournament === "activeTournament" ? (
                        activeTournaments.length === 0 ? (
                          <div className="notournaments">No Tournaments</div>
                        ) : (
                          activeTournaments.map((tournament) => (
                            <a
                              href={`/Tournaments/${tournament.id}`}
                              key={tournament.id}
                            >
                              <div
                                key={tournament.id}
                                className="tournament-profilecard"
                              >
                                <span className="tournament-profilecard-name">
                                  {" "}
                                  {tournament.name}
                                </span>{" "}
                                <span className="tournament-profilecard-startdate">
                                  {" "}
                                  Start Date: &nbsp;{tournament.start_date}
                                </span>
                                <span className="tournament-profilecard-enddate">
                                  {" "}
                                  End Date: &nbsp; {tournament.end_date}
                                </span>
                                <span className="tournament-profilecard-points">
                                  Points: &nbsp;
                                  {tournament.tournament_points}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
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
                                </span>
                                <span className="tournament-profilecard-teamstatus">
                                  {" "}
                                  {tournament.team_status}
                                </span>
                              </div>
                            </a>
                          ))
                        )
                      ) : isactiveTournament === "pastTournament" ? (
                        pastTournaments.length === 0 ? (
                          <div className="notournaments">No Tournaments</div>
                        ) : (
                          pastTournaments.map((tournament) => (
                            <a
                              href={`/Tournaments/${tournament.id}`}
                              key={tournament.id}
                            >
                              <div
                                key={tournament.id}
                                className="tournament-profilecard"
                              >
                                <span className="tournament-profilecard-name">
                                  {" "}
                                  {tournament.name}
                                </span>{" "}
                                <span className="tournament-profilecard-startdate">
                                  {" "}
                                  Start Date: &nbsp;{tournament.start_date}
                                </span>
                                <span className="tournament-profilecard-enddate">
                                  {" "}
                                  End Date: &nbsp; {tournament.end_date}
                                </span>
                                <span className="tournament-profilecard-points">
                                  Points: &nbsp;
                                  {tournament.tournament_points}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
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
                                </span>
                                <span
                                  className={`tournament-profilecard-teamstatus ${
                                    tournament.team_status === "Lost"
                                      ? "red"
                                      : tournament.team_status === "Won"
                                      ? "green"
                                      : ""
                                  }`}
                                >
                                  {" "}
                                  {tournament.team_status}
                                </span>
                              </div>
                            </a>
                          ))
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeButton === "Activity" && (
              <div className="profile-activity">
                {isLoading ? (
                  <Loading />
                ) : userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      gameforum={post.game_forum}
                      userProfile={userProfile}
                    />
                  ))
                ) : (
                  <h3>No posts found.</h3>
                )}
              </div>
            )}
          </div>
          {isreportopen && (
            <div className="Reportuser-wrapper">
              <ReportUser
                onClose={handleCloseReportUser}
                userProfileView={userProfileView}
              />
            </div>
          )}
          {showMessageComponent && (
            <Message
              userProfile={userProfile}
              onCloseMessages={handleOpenMessage}
            />
          )}
        </>
      )}
    </div>
  );
};
export default ProfilePageView;
