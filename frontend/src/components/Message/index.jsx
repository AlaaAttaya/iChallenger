import React, { useState, useEffect } from "react";
import "./styles.css";
import config from "../../services/config";
import chatgptbotimage from "../../assets/images/chatgptbot.png";
import UserCard from "../UserCard";
import axios from "axios";
const Message = ({ onCloseMessages, userProfile }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState("MainMessages");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
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
  useEffect(() => {
    if (isInputFocused) {
      if (searchQuery.trim() !== "") {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }
  }, [searchQuery, isInputFocused]);
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const setActive = (section) => {
    setActiveSection(section);
  };
  const backbutton = () => {
    if (setActive !== "MainMessages") {
      setActive("MainMessages");
    }
  };
  return (
    <div className="message-container">
      <div className={`message-card ${isMinimized ? "minimized" : ""}`}>
        <div className="messages-nav">
          <div className="messages-back-container">
            <div className="messages-back-button" onClick={backbutton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="messages-svg-icon"
              >
                <path
                  d="M5.25 11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H5.25C5.05109 12.75 4.86032 12.671 4.71967 12.5303C4.57902 12.3897 4.5 12.1989 4.5 12C4.5 11.8011 4.57902 11.6103 4.71967 11.4697C4.86032 11.329 5.05109 11.25 5.25 11.25Z"
                  fill="#2FD671"
                />
                <path
                  d="M5.5605 12L11.781 18.219C11.9218 18.3598 12.0009 18.5508 12.0009 18.75C12.0009 18.9491 11.9218 19.1401 11.781 19.281C11.6402 19.4218 11.4492 19.5009 11.25 19.5009C11.0508 19.5009 10.8598 19.4218 10.719 19.281L3.969 12.531C3.89915 12.4613 3.84374 12.3785 3.80593 12.2874C3.76812 12.1963 3.74866 12.0986 3.74866 12C3.74866 11.9013 3.76812 11.8036 3.80593 11.7125C3.84374 11.6214 3.89915 11.5386 3.969 11.469L10.719 4.71897C10.8598 4.57814 11.0508 4.49902 11.25 4.49902C11.4492 4.49902 11.6402 4.57814 11.781 4.71897C11.9218 4.8598 12.0009 5.05081 12.0009 5.24997C12.0009 5.44913 11.9218 5.64014 11.781 5.78097L5.5605 12Z"
                  fill="#2FD671"
                />
              </svg>
            </div>
          </div>
          <div className="messages-title">Messages</div>
          <div className="close-minimize-settings">
            <div className="minimize-toggle" onClick={toggleMinimize}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 36 6"
                fill="none"
                className="messages-svg-icon"
              >
                <path
                  d="M3 3H33"
                  stroke="#2FD671"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="messages-settings-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 21 21"
                fill="none"
                className="messages-svg-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.86747 1.25866C9.21347 0.621822 9.77492 0 10.4997 0C11.2247 0 11.7863 0.622245 12.1322 1.25939C12.1699 1.32872 12.2107 1.39651 12.2547 1.46255C12.5431 1.89578 12.9532 2.23401 13.4334 2.43469L14.1291 2.72344C14.6106 2.92102 15.1398 2.97174 15.6501 2.86921C15.7281 2.85354 15.8052 2.83439 15.881 2.81189C16.5757 2.60574 17.4124 2.56278 17.9248 3.07519C18.4372 3.5876 18.3943 4.4243 18.1881 5.11901C18.1656 5.19485 18.1465 5.27187 18.1308 5.34986C18.0283 5.86016 18.079 6.38939 18.2766 6.87094L18.5653 7.56656C18.766 8.04678 19.1042 8.45691 19.5374 8.74534C19.6036 8.78936 19.6715 8.83026 19.7409 8.86794C20.3779 9.21374 21 9.77517 21 10.5C21 11.2248 20.3779 11.7863 19.7409 12.1321C19.6715 12.1697 19.6036 12.2106 19.5374 12.2547C19.1042 12.5431 18.766 12.9532 18.5653 13.4334L18.2766 14.1291C18.0791 14.6107 18.0286 15.14 18.1314 15.6503C18.147 15.7279 18.1661 15.8045 18.1885 15.88C18.3948 16.5753 18.4378 17.4128 17.9248 17.9255C17.4123 18.4376 16.5759 18.3946 15.8813 18.1885C15.8056 18.166 15.7286 18.1469 15.6507 18.1312C15.1407 18.0287 14.6117 18.0793 14.1304 18.2766L13.4334 18.5653C12.9532 18.766 12.5431 19.1042 12.2547 19.5374C12.2107 19.6035 12.1699 19.6713 12.1322 19.7406C11.7863 20.3778 11.2247 21 10.4997 21C9.77492 21 9.21347 20.3782 8.86747 19.7413C8.82981 19.672 8.78896 19.6042 8.74497 19.5382C8.45656 19.1052 8.04657 18.7672 7.56656 18.5666L6.87094 18.2779C6.38955 18.08 5.86035 18.0289 5.35002 18.1312C5.27208 18.1469 5.19511 18.166 5.11932 18.1884C4.42441 18.3943 3.58758 18.4372 3.07509 17.9247C2.56268 17.4123 2.60554 16.5756 2.81129 15.8808C2.83369 15.8052 2.85274 15.7284 2.86834 15.6506C2.97063 15.1405 2.91976 14.6116 2.72212 14.1304L2.43338 13.4334C2.23279 12.9534 1.89475 12.5434 1.46178 12.255C1.3958 12.2111 1.32805 12.1702 1.25878 12.1326C0.621894 11.7865 0 11.225 0 10.5002C0 9.77521 0.622053 9.21336 1.25931 8.86767C1.77794 8.58634 2.19914 8.13359 2.43338 7.56656L2.72212 6.87094C2.92004 6.38955 2.97107 5.86035 2.86876 5.35002C2.85315 5.2721 2.83406 5.19516 2.81162 5.1194C2.60577 4.42444 2.56282 3.58755 3.07534 3.07503C3.58774 2.56263 4.42435 2.60542 5.11914 2.81127C5.195 2.83375 5.27205 2.85287 5.35007 2.86851C5.86037 2.9708 6.38952 2.91987 6.87094 2.72212L7.56656 2.43338C8.04657 2.23279 8.45656 1.89475 8.74497 1.46178C8.78896 1.39576 8.82981 1.32797 8.86747 1.25866ZM4.7294 8.58732C4.22234 9.81203 4.22234 11.188 4.7294 12.4127L5.06638 13.2266C5.57387 14.4523 6.54767 15.4261 7.7734 15.9336L8.58705 16.2705C9.81192 16.7776 11.1881 16.7775 12.4129 16.2703L13.2263 15.9334C14.4514 15.426 15.4248 14.4528 15.9324 13.2277L16.2696 12.4138C16.7773 11.1884 16.7773 9.81156 16.2696 8.5862L15.9324 7.77229C15.4248 6.54723 14.4514 5.57396 13.2263 5.06658L12.4129 4.72971C11.1881 4.22245 9.81192 4.22238 8.58705 4.72951L7.7734 5.06639C6.54767 5.57387 5.57387 6.54767 5.06638 7.7734L4.7294 8.58732Z"
                  fill="#2FD671"
                />
              </svg>
            </div>
            <div className="messages-close-button" onClick={onCloseMessages}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 15 18"
                fill="none"
                className="messages-svg-icon"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.95321 8.88868L0.164062 15.7353L1.71086 17.5647L7.50006 10.7181L13.2892 17.5647L14.8361 15.7353L9.04692 8.88868L14.8359 2.04223L13.2891 0.212891L7.50006 7.05927L1.71103 0.212891L0.164237 2.04223L5.95321 8.88868Z"
                  fill="#2FD671"
                />
              </svg>
            </div>
          </div>
        </div>
        {!isMinimized && (
          <>
            {activeSection === "MainMessages" && (
              <div className="message-content">
                <div
                  className="findplayers-section"
                  onClick={() => setActive("FindPlayers")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M9.97067 0C4.4584 0 0 4.3562 0 9.74212C0 15.128 4.4584 19.4842 9.97067 19.4842C11.9387 19.4842 13.7601 18.9201 15.3043 17.962L22.5073 25L25 22.5645L17.8886 15.634C19.167 13.9953 19.9413 11.965 19.9413 9.74212C19.9413 4.3562 15.483 0 9.97067 0ZM9.97067 2.29226C14.1931 2.29226 17.5953 5.61649 17.5953 9.74212C17.5953 13.8677 14.1931 17.192 9.97067 17.192C5.74826 17.192 2.34604 13.8677 2.34604 9.74212C2.34604 5.61649 5.74826 2.29226 9.97067 2.29226Z"
                      fill="white"
                    />
                  </svg>
                  <div>Find Players</div>
                </div>
                <div
                  className="chatgptbot-section"
                  onClick={() => setActive("ChatGPTBot")}
                >
                  <img src={chatgptbotimage} className="chatgptbot-img" />
                  <div>ChatGPT Bot</div>
                </div>
                <div
                  className="mymessages-section"
                  onClick={() => setActive("MyMessages")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M7.90827 23.7238C6.06065 24.6678 4.01408 25.1004 1.96267 24.9804C1.61516 24.9804 1.25057 24.9727 0.881101 24.9574C0.712994 24.952 0.549668 24.8973 0.409598 24.7996C0.269529 24.7018 0.158307 24.5647 0.0885166 24.404C0.0158514 24.2449 -0.0129529 24.0675 0.00536457 23.8921C0.0236821 23.7167 0.0883898 23.5501 0.192162 23.4113C1.32601 21.9819 2.18414 20.3343 2.71868 18.5605C1.4506 16.165 0.967823 13.3979 1.34478 10.6857C1.72173 7.97358 2.93748 5.46698 4.80459 3.55238C6.67171 1.63779 9.0865 0.421526 11.6767 0.091106C14.2668 -0.239314 16.8886 0.33446 19.1376 1.72397C21.3867 3.11347 23.1382 5.24155 24.1222 7.78011C25.1061 10.3187 25.2678 13.1267 24.5824 15.7714C23.897 18.416 22.4024 20.7504 20.3292 22.4146C18.256 24.0788 15.7193 24.9804 13.1101 24.9804C11.3074 24.9852 9.52784 24.5553 7.90827 23.7238ZM8.30213 21.7781C10.4413 23.0005 12.93 23.366 15.3062 22.8067C17.6824 22.2473 19.7847 20.8012 21.2228 18.7369C22.6608 16.6725 23.3369 14.1301 23.1256 11.5816C22.9142 9.03323 21.8297 6.65195 20.0735 4.87992C18.3172 3.1079 16.0085 2.06552 13.576 1.94633C11.1435 1.82713 8.75249 2.63921 6.84684 4.23179C4.94118 5.82437 3.65039 8.08926 3.2141 10.6059C2.77782 13.1226 3.22569 15.7201 4.47455 17.9162C4.59209 18.1219 4.63211 18.3663 4.58674 18.6015C4.22357 20.1955 3.57784 21.7033 2.68331 23.0462C4.31143 23.1032 5.92253 22.6832 7.33639 21.8332C7.49018 21.7194 7.67381 21.6585 7.86194 21.659C8.01583 21.6595 8.16716 21.7004 8.30213 21.7781ZM8.23262 16.014C7.99008 16.014 7.75746 15.9128 7.58596 15.7326C7.41445 15.5525 7.3181 15.3081 7.3181 15.0533C7.3181 14.7985 7.41445 14.5542 7.58596 14.374C7.75746 14.1939 7.99008 14.0926 8.23262 14.0926H16.7681C17.0107 14.0926 17.2433 14.1939 17.4148 14.374C17.5863 14.5542 17.6827 14.7985 17.6827 15.0533C17.6827 15.3081 17.5863 15.5525 17.4148 15.7326C17.2433 15.9128 17.0107 16.014 16.7681 16.014H8.23262ZM8.23262 10.8904C7.99008 10.8904 7.75746 10.7891 7.58596 10.609C7.41445 10.4288 7.3181 10.1845 7.3181 9.92967C7.3181 9.67488 7.41445 9.43052 7.58596 9.25036C7.75746 9.07019 7.99008 8.96898 8.23262 8.96898H14.3294C14.572 8.96898 14.8046 9.07019 14.9761 9.25036C15.1476 9.43052 15.2439 9.67488 15.2439 9.92967C15.2439 10.1845 15.1476 10.4288 14.9761 10.609C14.8046 10.7891 14.572 10.8904 14.3294 10.8904H8.23262Z"
                      fill="white"
                    />
                  </svg>

                  <div>My Messages</div>
                </div>
                <div
                  className="blockedusers-section"
                  onClick={() => setActive("BlockedUsers")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_178_2132)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 0C10.0277 0 7.61099 0.733112 5.55538 2.10663C3.49976 3.48015 1.89761 5.43238 0.951511 7.71646C0.00541608 10.0005 -0.242126 12.5139 0.24019 14.9386C0.722505 17.3634 1.91301 19.5907 3.66117 21.3388C5.40933 23.087 7.63661 24.2775 10.0614 24.7598C12.4861 25.2421 14.9995 24.9946 17.2835 24.0485C19.5676 23.1024 21.5199 21.5002 22.8934 19.4446C24.2669 17.389 25 14.9723 25 12.5C25 9.18479 23.683 6.00537 21.3388 3.66116C18.9946 1.31696 15.8152 0 12.5 0ZM12.5 2.08333C14.8913 2.08005 17.21 2.90449 19.0625 4.41667L4.41667 19.0625C3.17489 17.535 2.39159 15.6869 2.15761 13.7323C1.92363 11.7777 2.24858 9.79684 3.09474 8.01945C3.94091 6.24206 5.27363 4.74098 6.93833 3.69031C8.60302 2.63964 10.5315 2.08244 12.5 2.08333ZM12.5 22.9167C10.0828 22.9189 7.74027 22.0791 5.87501 20.5417L20.5417 5.875C21.798 7.39933 22.595 9.24946 22.8397 11.2096C23.0844 13.1697 22.7667 15.1589 21.9237 16.9454C21.0808 18.7318 19.7472 20.2417 18.0787 21.299C16.4101 22.3562 14.4753 22.9173 12.5 22.9167Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_178_2132">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <div>Blocked Users</div>
                </div>
              </div>
            )}

            {activeSection === "FindPlayers" && (
              <div className="findplayers-page">
                <div className="navbarsearch-wrapper">
                  <div
                    className={`navbarsearch ${
                      isInputFocused ? "focused" : ""
                    }`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 35 35"
                      fill="none"
                      className="messages-navbarsearch-iconsvg"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
                        className="messages-navbarsearch-icon"
                        id="navbarsearch-icon"
                        fill="#fff"
                      />
                    </svg>

                    <input
                      type="text"
                      id="searchinput"
                      name="searchinput"
                      className={`messages-navbarsearchinput ${
                        isInputFocused ? "focused" : ""
                      }`}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Find Players"
                      value={searchQuery}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                  {isInputFocused && (
                    <>
                      {searchResults.map((user) => (
                        <a
                          key={user.id}
                          className="messageslinkusercardsearchinputnavbar"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <UserCard key={user.id} user={user} />
                        </a>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {activeSection === "ChatGPTBot" && (
              <div className="message-content">
                <div className="chatgptbot-page">{/* ... */}</div>
              </div>
            )}

            {activeSection === "BlockedUsers" && (
              <div className="message-content">
                <div className="blockedusers-page">{/* ... */}</div>
              </div>
            )}

            {activeSection === "MyMessages" && (
              <div className="message-content">
                <div className="mymessages-page">{/* ... */}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
