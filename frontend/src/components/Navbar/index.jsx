import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
const Navbar = ({ userProfile, setUserProfile }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setProfilePic(config.base_url + userProfile.profileimage);
    }
  }, [userProfile]);

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
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
  };
  const toggleFollowingDropdown = () => {
    setIsFollowingDropdownOpen(!isFollowingDropdownOpen);
  };
  const toggleCommunityDropdown = () => {
    setIsCommunityDropdownOpen(!isCommunityDropdownOpen);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
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
    navigate("/Leaderboard");
  };
  const handleActivity = () => {
    navigate("/Activity");
  };
  const handleForums = () => {
    navigate("/Forums");
  };
  const handleStreams = () => {
    navigate("/Streams");
  };
  const handleFAQS = () => {
    navigate("/Home");
  };
  const handlePrivacyPolicy = () => {
    navigate("/Home");
  };
  const handleUserAgreement = () => {
    navigate("/Home");
  };
  const handleContactus = () => {
    navigate("/Contactus");
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 35 35"
            fill="none"
            className="search-iconsvg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
              className="search-icon"
              id="search-icon"
            />
          </svg>
        </div>
        <div className="nav-buttons">
          <Link to="/Home">
            <button id="Home">Home</button>
          </Link>

          <div
            className="buttondropdown-wrapper"
            onMouseEnter={toggleTournamentDropdown}
            onMouseLeave={toggleTournamentDropdown}
          >
            <Link to="/Tournaments">
              <button id="Tournaments">Tournaments</button>
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
            <Link to="/Community">
              <button id="Community">Community</button>
            </Link>
            {isCommunityDropdownOpen && (
              <CommunityDropdown
                onActivity={handleActivity}
                onForums={handleForums}
                onStreams={handleStreams}
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
              <button id="About">About</button>
            </Link>
            {isAboutDropdownOpen && (
              <AboutDropdown
                onFAQS={handleFAQS}
                onContactus={handleContactus}
                onPrivacyPolicy={handlePrivacyPolicy}
                onUserAgreement={handleUserAgreement}
              />
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
                <button id="Notifications">Notifications</button>
              </div>{" "}
              <div
                className="buttondropdown-wrapper"
                onMouseEnter={toggleMessagesDropdown}
                onMouseLeave={toggleMessagesDropdown}
              >
                <button id="Messages">Messages</button>
              </div>{" "}
              <div
                className="buttondropdown-wrapper"
                onMouseEnter={toggleFollowingDropdown}
                onMouseLeave={toggleFollowingDropdown}
              >
                <button id="Following">Following</button>
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
          <img src={Logo} alt="ichallenger-logo"></img>
        </div>
        <div className="search-leftnavbar-wrapper">
          <div
            className={`search-leftnavbar ${isInputFocused ? "focused" : ""}`}
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
              className={`searchinput ${isInputFocused ? "focused" : ""}`}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Find Players"
            />
          </div>
        </div>
        <div className="dropdowns-leftnavbar" id="home-dropdown">
          <div>Home</div>{" "}
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="dropdowns-leftnavbar" id="tournaments-dropdown">
          <div>Tournaments</div>{" "}
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="dropdowns-leftnavbar" id="community-dropdown">
          <div>Community </div>
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="dropdowns-leftnavbar" id="about-dropdown">
          <div>About </div>
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="9"
              viewBox="0 0 14 9"
              fill="none"
            >
              <path
                d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        {userProfile && (
          <div className="dropdowns-leftnavbar" id="notifications-dropdown">
            <div> Notifications </div>
            <div className="dropdown">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
              >
                <path
                  d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        )}{" "}
        {userProfile && (
          <div className="dropdowns-leftnavbar" id="messages-dropdown">
            <div> Messages </div>
            <div className="dropdown">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
              >
                <path
                  d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        )}
        {userProfile && (
          <div className="dropdowns-leftnavbar" id="following-dropdown">
            <div>Following</div>
            <div className="dropdown">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
              >
                <path
                  d="M7 9L0 2.2496L2.33443 0L7 4.50079L11.6656 0L14 2.2496L7 9Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
