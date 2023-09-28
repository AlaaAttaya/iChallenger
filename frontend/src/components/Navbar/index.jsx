import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import "../../styles/global.css";
import config from "../../services/config.js";
import Logo from "../../assets/images/iChallenger-Black.svg";
import DefaultProfilepic from "../../assets/images/profilepic.png";
import ProfileDropdown from "../ProfileDropdown";
import TournamentsDropdown from "../TournamentsDropdown";
import AboutDropdown from "../AboutDropdown";
import CommunityDropdown from "../CommunityDropdown";
import NotificationsDropdown from "../NotificationsDropdown";
import MessagesDropdown from "../MessagesDropdown";
import FollowingDropdown from "../FollowingDropdown";
import UserCard from "../../components/UserCard";
import Message from "../../components/Message";
import axios from "axios";
import Pusher from "pusher-js";
const Navbar = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isLeftNavbarInputFocused, setLeftNavbarInputFocused] = useState(false);
  //topnavbar
  const [profilepic, setProfilePic] = useState(DefaultProfilepic);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTournamentsDropdownOpen, setIsTournamentsDropdownOpen] =
    useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isMessagesDropdownOpen, setIsMessagesDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] =
    useState(false);
  const [isFollowingDropdownOpen, setIsFollowingDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryLeftNavbar, setSearchQueryLeftNavbar] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isMessageOpen, setMessageOpen] = useState(false);
  //leftnavbar
  const [isTournamentsleftnavbarOpen, setIsTournamentsleftnavbarOpen] =
    useState(false);
  const [isCommunityleftnavbarOpen, setIsCommunityleftnavbarOpen] =
    useState(false);
  const [isAboutleftnavbarOpen, setIsAboutleftnavbarOpen] = useState(false);
  const [isNotificationsleftnavbarOpen, setIsNotificationsleftnavbarOpen] =
    useState(false);
  const [isMessagesleftnavbarOpen, setIsMessagesleftnavbarOpen] =
    useState(false);
  const [isFollowingleftnavbarOpen, setIsFollowingleftnavbarOpen] =
    useState(false);
  const isActive = (path) => {
    return location.pathname === path;
  };
  const [newNotification, setNewNotification] = useState(false);
  const [notificationdata, setNotificationData] = useState(null);

  useEffect(() => {
    if (userProfile) {
      const pusher = new Pusher("52c459eed956d1bac55e", {
        cluster: "eu",
      });

      const channel = pusher.subscribe("notifications." + userProfile.id);

      channel.bind("App\\Events\\NotificationSentEvent", function (data) {
        setNewNotification(true);

        const notificationfetched = data.data;

        setNotificationData((prevData) => ({
          ...prevData,
          ...notificationfetched,
        }));
      });

      return () => {
        channel.unbind();
        pusher.unsubscribe("notifications." + userProfile.id);
        pusher.disconnect();
      };
    }
  }, [userProfile]);

  //topnavbar

  useEffect(() => {
    if (userProfile) {
      setProfilePic(config.base_url + userProfile.profileimage);
    }
  }, [userProfile]);
  useEffect(() => {
    if (isInputFocused) {
      if (searchQuery.trim() !== "") {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }
  }, [searchQuery, isInputFocused]);

  const handleKeyPressLeftNavbar = (event) => {
    if (event.key === "Enter") {
      window.location.href = `/Profile/${searchQueryLeftNavbar}`;
    }
  };

  const searchUsers = async (query) => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/search?username=${query}`
      );
      const users = response.data.data;

      setSearchResults(users);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const toggleTournamentDropdown = () => {
    setIsTournamentsDropdownOpen(!isTournamentsDropdownOpen);
  };
  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
  };
  const toggleMessagesDropdown = () => {
    setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
  };
  const toggleNotificationsDropdown = () => {
    setNewNotification(false);
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
  };
  const toggleFollowingDropdown = () => {
    setIsFollowingDropdownOpen(!isFollowingDropdownOpen);
  };
  const toggleCommunityDropdown = () => {
    setIsCommunityDropdownOpen(!isCommunityDropdownOpen);
  };
  //leftnavbar

  const toggleTournamentleftnavbar = () => {
    setIsTournamentsleftnavbarOpen(!isTournamentsleftnavbarOpen);
  };
  const toggleAboutleftnavbar = () => {
    setIsAboutleftnavbarOpen(!isAboutleftnavbarOpen);
  };
  const toggleMessagesleftnavbar = () => {
    setIsMessagesleftnavbarOpen(!isMessagesleftnavbarOpen);
  };
  const toggleNotificationsleftnavbar = () => {
    setNewNotification(false);
    setIsNotificationsleftnavbarOpen(!isNotificationsleftnavbarOpen);
  };
  const toggleFollowingleftnavbar = () => {
    setIsFollowingleftnavbarOpen(!isFollowingleftnavbarOpen);
  };
  const toggleCommunityleftnavbar = () => {
    setIsCommunityleftnavbarOpen(!isCommunityleftnavbarOpen);
  };

  //

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };
  const handleLeftNavbarInputFocus = () => {
    setLeftNavbarInputFocused(true);
  };

  const handleLeftNavbarInputBlur = () => {
    setLeftNavbarInputFocused(false);
  };
  const handleSearchClick = () => {
    setSearchOpen(true);
  };
  const handleCloseClick = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleLeftNavbarInputChange = (e) => {
    setSearchQueryLeftNavbar(e.target.value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    setUserProfile(null);
    localStorage.clear();

    navigate("/Login");
  };

  const handleSettings = () => {
    navigate("/Settings");
  };

  const handleProfilePage = () => {
    navigate("/Profile");
  };

  const handleFindTournaments = () => {
    navigate("/Tournaments");
  };
  const handleLeaderboard = () => {
    navigate("/Leaderboards");
  };
  const handleActivity = () => {
    navigate("/Activity");
  };
  const handleForums = () => {
    navigate("/Forums");
  };

  const handleContactus = () => {
    navigate("/Contactus");
  };
  const handleChatgptBot = () => {
    setMessageOpen(!isMessageOpen);
  };
  const handleMyMessages = () => {
    setMessageOpen(!isMessageOpen);
  };
  return (
    <div className="navbar">
      <div className="nav-leftelements">
        <div className="nav-burgermenu" onClick={toggleSidebar}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 35 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.68164 22.5H28.4089"
              stroke="#2FD671"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M5.68164 15H28.4089"
              stroke="#2FD671"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M5.68164 7.5H28.4089"
              stroke="#2FD671"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="nav-logo">
          <Link to="/Home">
            <img src={Logo} alt="ichallenger-logo"></img>
          </Link>
        </div>
      </div>
      <div className="nav-rightelements">
        <div className="nav-searchbar">
          {!isSearchOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 35 35"
              fill="none"
              className="search-iconsvg cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleSearchClick}
            >
              <path
                d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
                className="search-icon"
                id="search-icon"
              />
            </svg>
          ) : (
            <div className="navbarsearch-wrapper">
              <div
                className={`navbarsearch ${isInputFocused ? "focused" : ""}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 35 35"
                  fill="none"
                  className="navbarsearch-iconsvg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
                    className="navbarsearch-icon"
                    id="navbarsearch-icon"
                    fill="#fff"
                  />
                </svg>

                <input
                  type="text"
                  id="searchinput"
                  name="searchinput"
                  className={`navbarsearchinput ${
                    isInputFocused ? "focused" : ""
                  }`}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Find Players"
                  value={searchQuery}
                  onChange={handleInputChange}
                  autoComplete="off"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="cursor-pointer"
                  onClick={handleCloseClick}
                  style={{ marginTop: "2px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.8371 14.9998L0 26.8371L3.16275 30L15 18.1627L26.8371 30L30 26.8371L18.1629 14.9998L29.9997 3.16279L26.8368 0L15 11.8369L3.16311 0L0.000356889 3.16279L11.8371 14.9998Z"
                    fill="#2FD671"
                  />
                </svg>
              </div>
              {isInputFocused && (
                <div className="search-results">
                  {searchResults.map((user) => (
                    <a
                      key={user.id}
                      href={`/Profile/${user.username}`}
                      className="linkusercardsearchinputnavbar"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <UserCard key={user.id} user={user} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="nav-buttons">
          <div className="buttondropdown-wrapper">
            <Link to="/Home">
              <button
                id="Home"
                className={
                  isActive("/Home") || isActive("/") ? "clicked-navbar" : ""
                }
              >
                Home
              </button>
            </Link>
          </div>
          <div
            className="buttondropdown-wrapper"
            onMouseEnter={toggleTournamentDropdown}
            onMouseLeave={toggleTournamentDropdown}
          >
            <Link to="/Tournaments">
              <button
                id="Tournaments"
                className={
                  isActive("/Tournaments") || isActive("/Leaderboards")
                    ? "clicked-navbar"
                    : ""
                }
              >
                Tournaments
              </button>
            </Link>
            {isTournamentsDropdownOpen && (
              <TournamentsDropdown
                onFindTournaments={handleFindTournaments}
                onLeaderboard={handleLeaderboard}
              />
            )}
          </div>
          <div
            className="buttondropdown-wrapper"
            onMouseEnter={toggleCommunityDropdown}
            onMouseLeave={toggleCommunityDropdown}
          >
            <Link to="/Forums">
              <button
                id="Community"
                className={
                  isActive("/Activity") ||
                  isActive("/Forums") ||
                  isActive("/Streams")
                    ? "clicked-navbar"
                    : ""
                }
              >
                Community
              </button>
            </Link>
            {isCommunityDropdownOpen && (
              <CommunityDropdown
                onActivity={handleActivity}
                onForums={handleForums}
              />
            )}
          </div>
          <div
            className="buttondropdown-wrapper"
            onMouseEnter={toggleAboutDropdown}
            onMouseLeave={toggleAboutDropdown}
          >
            {" "}
            <Link to="/Contactus">
              <button
                id="About"
                className={
                  isActive("/Contactus") ||
                  isActive("/FAQS") ||
                  isActive("/PrivacyPolicy") ||
                  isActive("/UserAgreement")
                    ? "clicked-navbar"
                    : ""
                }
              >
                About
              </button>
            </Link>
            {isAboutDropdownOpen && (
              <AboutDropdown onContactus={handleContactus} />
            )}
          </div>
          {userProfile && (
            <>
              {" "}
              <div
                className="buttondropdown-wrapper"
                onMouseEnter={toggleNotificationsDropdown}
                onMouseLeave={toggleNotificationsDropdown}
              >
                <button id="Notifications">
                  Notifications{" "}
                  {newNotification && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="7"
                      viewBox="0 0 7 7"
                      fill="none"
                      style={{ paddingBottom: "7px" }}
                    >
                      <path
                        d="M7 3.5C7 5.433 5.433 7 3.5 7C1.567 7 0 5.433 0 3.5C0 1.567 1.567 0 3.5 0C5.433 0 7 1.567 7 3.5Z"
                        fill="#FF0000"
                        fill-opacity="0.72"
                      />
                    </svg>
                  )}
                </button>
                {isNotificationsDropdownOpen && (
                  <NotificationsDropdown
                    userProfile={userProfile}
                    NotificationData={notificationdata}
                  />
                )}
              </div>{" "}
              <div
                className="buttondropdown-wrapper"
                onMouseEnter={toggleMessagesDropdown}
                onMouseLeave={toggleMessagesDropdown}
              >
                <button id="Messages">Messages</button>
                {isMessagesDropdownOpen && (
                  <MessagesDropdown
                    onChatgptBot={handleChatgptBot}
                    onMyMessages={handleMyMessages}
                  />
                )}
              </div>{" "}
              <div
                className="buttondropdown-wrapper"
                onMouseEnter={toggleFollowingDropdown}
                onMouseLeave={toggleFollowingDropdown}
              >
                <button id="Following">Following</button>
                {isFollowingDropdownOpen && (
                  <FollowingDropdown
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div className="nav-login">
          {userProfile ? (
            <div
              className="profilepic-wrapper"
              onMouseEnter={toggleProfileDropdown}
              onMouseLeave={toggleProfileDropdown}
            >
              <Link to="/Profile">
                <img
                  className="nav-circle-img"
                  id="profilepic"
                  src={profilepic}
                  alt="profilepic"
                />
              </Link>
              {isProfileDropdownOpen && (
                <ProfileDropdown
                  onLogout={handleLogout}
                  onSettings={handleSettings}
                  onProfilePage={handleProfilePage}
                />
              )}
            </div>
          ) : (
            <Link to="/login">
              <button id="Signin">Signin</button>
            </Link>
          )}
        </div>
      </div>

      <div className={`navbar-burgermenu${isSidebarOpen ? " show" : ""}`}>
        <div className="close-leftnavbar" id="closeleftnavbar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 30 30"
            fill="none"
            onClick={toggleSidebar}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8371 14.9998L0 26.8371L3.16275 30L15 18.1627L26.8371 30L30 26.8371L18.1629 14.9998L29.9997 3.16279L26.8368 0L15 11.8369L3.16311 0L0.000356889 3.16279L11.8371 14.9998Z"
              fill="#2FD671"
            />
          </svg>
        </div>
        <div className="leftnavbar-logo">
          <Link to="/Home">
            {" "}
            <img src={Logo} alt="ichallenger-logo"></img>
          </Link>
        </div>
        <div className="search-leftnavbar-wrapper">
          <div
            className={`search-leftnavbar ${
              isLeftNavbarInputFocused ? "focused" : ""
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 35 35"
              fill="none"
              className="search-iconsvg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
                className="search-icon"
                id="search-icon"
                fill="#fff"
              />
            </svg>

            <input
              type="text"
              id="leftnavbar-searchinput"
              name="leftnavbar-searchinput"
              className={`searchinput ${
                isLeftNavbarInputFocused ? "focused" : ""
              }`}
              onFocus={handleLeftNavbarInputFocus}
              onBlur={handleLeftNavbarInputBlur}
              placeholder="Find Players"
              value={searchQueryLeftNavbar}
              onChange={handleLeftNavbarInputChange}
              onKeyDown={handleKeyPressLeftNavbar}
              autoComplete="off"
            />
          </div>
        </div>
        <Link to="/Home" style={{ color: "white" }}>
          <div className="dropdowns-leftnavbar" id="home-dropdown">
            <div>Home</div>
          </div>
        </Link>
        <div
          className="dropdowns-leftnavbar"
          id="tournaments-dropdown"
          onClick={toggleTournamentleftnavbar}
        >
          <div>Tournaments</div>{" "}
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              style={{
                transform: isTournamentsleftnavbarOpen ? "scaleY(-1)" : "none",
              }}
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        {isTournamentsleftnavbarOpen && (
          <div className="dropdowns-leftnavbar-items">
            <div className="dropdown-item" onClick={handleFindTournaments}>
              Tournaments
            </div>
            <div className="dropdown-item" onClick={handleLeaderboard}>
              Leaderboards
            </div>
          </div>
        )}
        <div
          className="dropdowns-leftnavbar"
          id="community-dropdown"
          onClick={toggleCommunityleftnavbar}
        >
          <div>Community </div>
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              style={{
                transform: isCommunityleftnavbarOpen ? "scaleY(-1)" : "none",
              }}
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        {isCommunityleftnavbarOpen && (
          <div className="dropdowns-leftnavbar-items">
            <div className="dropdown-item" onClick={handleActivity}>
              Activity
            </div>
            <div className="dropdown-item" onClick={handleForums}>
              Forums
            </div>
          </div>
        )}
        <div
          className="dropdowns-leftnavbar"
          id="about-dropdown"
          onClick={toggleAboutleftnavbar}
        >
          <div>About </div>
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
              style={{
                transform: isAboutleftnavbarOpen ? "scaleY(-1)" : "none",
              }}
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        {isAboutleftnavbarOpen && (
          <div className="dropdowns-leftnavbar-items">
            <div className="dropdown-item" onClick={handleContactus}>
              Contact us
            </div>
            <div className="dropdown-item">FAQS</div>
            <div className="dropdown-item">Privacy Policy</div>
            <div className="dropdown-item">User Agreement</div>
          </div>
        )}
        {userProfile && (
          <>
            <div
              className="dropdowns-leftnavbar"
              id="notifications-dropdown"
              onClick={toggleNotificationsleftnavbar}
            >
              <div>
                {" "}
                Notifications{" "}
                {newNotification && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                    style={{ paddingBottom: "7px" }}
                  >
                    <path
                      d="M7 3.5C7 5.433 5.433 7 3.5 7C1.567 7 0 5.433 0 3.5C0 1.567 1.567 0 3.5 0C5.433 0 7 1.567 7 3.5Z"
                      fill="#FF0000"
                      fill-opacity="0.72"
                    />
                  </svg>
                )}{" "}
              </div>
              <div className="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  style={{
                    transform: isNotificationsleftnavbarOpen
                      ? "scaleY(-1)"
                      : "none",
                  }}
                >
                  <path
                    d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isNotificationsleftnavbarOpen && (
              <div className="dropdowns-leftnavbar-items">
                <div className="dropdown-item">
                  <div className="noposition-absolute">
                    <NotificationsDropdown
                      userProfile={userProfile}
                      NotificationData={notificationdata}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}{" "}
        {userProfile && (
          <>
            <div
              className="dropdowns-leftnavbar"
              id="messages-dropdown"
              onClick={toggleMessagesleftnavbar}
            >
              <div> Messages </div>
              <div className="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  style={{
                    transform: isMessagesleftnavbarOpen ? "scaleY(-1)" : "none",
                  }}
                >
                  <path
                    d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isMessagesleftnavbarOpen && (
              <div className="dropdowns-leftnavbar-items">
                <div className="dropdown-item" onClick={handleChatgptBot}>
                  Chatgpt Bot
                </div>
                <div className="dropdown-item" onClick={handleMyMessages}>
                  My Messages
                </div>
              </div>
            )}
          </>
        )}
        {userProfile && (
          <>
            <div
              className="dropdowns-leftnavbar"
              id="following-dropdown"
              onClick={toggleFollowingleftnavbar}
            >
              <div>Following</div>
              <div className="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  style={{
                    transform: isFollowingleftnavbarOpen
                      ? "scaleY(-1)"
                      : "none",
                  }}
                >
                  <path
                    d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {isFollowingleftnavbarOpen && (
              <div className="dropdowns-leftnavbar-items">
                {" "}
                {userProfile.following.map((user) => (
                  <div
                    key={user.id}
                    className="dropdown-items leftnavbar-followinguser-wrapper"
                  >
                    <a key={user.id} href={`/Profile/${user.username}`}>
                      <div className="leftnavbar-imgusername-container">
                        <img
                          src={config.base_url + user.profileimage}
                          alt={`${user.username}'s Profile`}
                          className="leftnavbar-following-user-avatar"
                        />
                        <h2 className="leftnavbar-following-user-username">
                          {user.username}
                        </h2>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {isMessageOpen && (
        <Message onCloseMessages={handleMyMessages} userProfile={userProfile} />
      )}
    </div>
  );
};

export default Navbar;
