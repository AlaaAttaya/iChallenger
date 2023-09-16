import React from "react";
import "./styles.css";
import Logo from "../../assets/images/iChallenger-Black.svg";
import DefaultProfilepic from "../../assets/images/profilepic.png";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-leftelements">
        <div className="nav-burgermenu">
          <svg
            width="35"
            height="30"
            viewBox="0 0 35 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.68164 22.5H28.4089"
              stroke="#2FD671"
              stroke-width="5"
              stroke-linecap="round"
            />
            <path
              d="M5.68164 15H28.4089"
              stroke="#2FD671"
              stroke-width="5"
              stroke-linecap="round"
            />
            <path
              d="M5.68164 7.5H28.4089"
              stroke="#2FD671"
              stroke-width="5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div className="nav-logo">
          <img src={Logo}></img>
        </div>
      </div>
      <div className="nav-rightelements">
        <div className="nav-searchbar">
          <svg
            width="24"
            height="24"
            viewBox="0 0 35 35"
            fill="none"
            class="search-iconsvg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
              class="search-icon"
              id="search-icon"
            />
          </svg>
        </div>
        <div className="nav-buttons">
          <button id="Home">Home</button>
          <button id="Tournaments">Tournaments</button>
          <button id="Community">Community</button>
          <button id="About">About</button>
          <button id="Notifications">Notifications</button>
          <button id="Messages">Messages</button>
          <button id="Following">Following</button>
        </div>
        <div className="nav-login">
          {" "}
          <img
            className="nav-circle-img"
            id="profilepic"
            src={DefaultProfilepic}
            alt="profilepic"
          ></img>
          <button id="Signin">Signin</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
