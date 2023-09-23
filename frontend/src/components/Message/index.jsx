import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import config from "../../services/config";
import chatgptbotimage from "../../assets/images/chatgptbot.png";
import UserCard from "../UserCard";
import axios from "axios";
import Pusher from "pusher-js";
const Message = ({ onCloseMessages, userProfile }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState("MainMessages");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [activeuser, setActiveUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [latestMessagesUsers, setLatestMessagesUsers] = useState([]);

  if (!localStorage.getItem("token")) {
    onCloseMessages();
  }
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    setMessages([]);
  }, [activeuser]);
  const pusher = new Pusher("527edb0870fce1976587", {
    cluster: "eu",
    encrypted: true,
  });
  const channelName = `private-chat.${userProfile.id}`;
  const channel = pusher.subscribe(channelName);

  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("New message received:", data);
    };

    channel.bind("client-new-message", handleNewMessage);

    return () => {
      channel.unbind("client-new-message", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, pusher]);

  const getMessages = (user) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${config.base_url}/api/user/getmessages`, {
        params: {
          username: user.username,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        const sentMessages = data.sentMessages;
        const receivedMessages = data.receivedMessages;

        const allMessages = [...sentMessages, ...receivedMessages];
        allMessages.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const updatedMessages = allMessages.map((message) => ({
          content: message.content,
          messageowner:
            message.sender_id === user.id
              ? user.username
              : userProfile.username,
        }));

        setMessages(updatedMessages);

        console.log("getmessages", response);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  const getLatestMessagesUsers = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${config.base_url}/api/user/getlatestmessagesusers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        const latestUsers = data.sendersWithLatestMessages;

        setLatestMessagesUsers(latestUsers);
      })
      .catch((error) => {
        console.error("Error fetching latest messages users:", error);
      });
  };
  const sendMessage = () => {
    const token = localStorage.getItem("token");
    const messageData = {
      recipient_id: activeuser.id,
      content: newMessage,
    };

    const temporaryMessage = {
      content: newMessage,
      messageowner: userProfile.username,
    };

    setMessages((prevMessages) => [...prevMessages, temporaryMessage]);

    axios
      .post(`${config.base_url}/api/user/storemessage`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("stored", response);

        const newMessage = response.data.data;

        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message === temporaryMessage
              ? {
                  content: newMessage.content,
                  messageowner: userProfile.username,
                }
              : message
          )
        );
      })
      .catch((error) => {
        console.error("Error sending message:", error);

        setMessages((prevMessages) =>
          prevMessages.filter((message) => message !== temporaryMessage)
        );
      });

    channel.trigger("client-new-message", { message: temporaryMessage });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      sendMessage();
    }
  };

  //////////////////

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
    if (section === "ChatGPTBot") {
      const chatgpt = {
        chatgptimage: chatgptbotimage,
        username: "ChatGPT",
      };

      setActiveUser(chatgpt);
    } else if (section === "MyMessages") {
      getLatestMessagesUsers();
    }
  };
  const backbutton = () => {
    if (
      activeSection !== "MainMessages" &&
      activeSection !== "Chat" &&
      activeSection !== "ChatGPTBot"
    ) {
      setActiveSection("MainMessages");
    } else if (activeSection === "Chat") {
      setActiveSection("MyMessages");
      setActiveUser("");
    } else if (activeSection === "ChatGPTBot") {
      setActiveSection("MainMessages");
      setActiveUser("");
    }
  };
  const handleUserChat = (user) => {
    setActiveUser(user);
    setActive("Chat");
    getMessages(user);
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
          <div
            className={activeuser ? "activeuser-title" : "messages-title"}
            onClick={toggleMinimize}
          >
            {" "}
            {activeuser ? (
              <>
                <img
                  className="titleimage"
                  src={
                    activeuser.profileimage !== undefined &&
                    activeuser.profileimage !== null
                      ? config.base_url + activeuser.profileimage
                      : activeuser.chatgptimage
                  }
                  alt={activeuser.username}
                />
                <span>{activeuser.username}</span>
              </>
            ) : (
              "Messages"
            )}
          </div>
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
              </div>
            )}

            {activeSection === "FindPlayers" && (
              <div className="findplayers-page">
                <div className="messages-navbarsearch-wrapper">
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleUserChat(user);
                          }}
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
              <div className="chat-content">
                <div className="chat-page"></div>
                <div className="chat-text-input">
                  <input type="text" className="chat-input" />
                </div>
              </div>
            )}

            {activeSection === "MyMessages" && (
              <div className="mymessages-page">
                {latestMessagesUsers.map((info, index) => (
                  <div
                    key={index}
                    className="latestuser-message"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUserChat(info.sender);
                    }}
                  >
                    <div className="latestuser-message-container">
                      <img
                        src={config.base_url + info.sender.profileimage}
                        alt={info.sender.username}
                        className="latestuser-img"
                      />

                      <div className="latestuser-details">
                        <div className="usernamelatestmessage">
                          {info.sender.username}
                        </div>
                        <div className="infolatestmessage">
                          {info.latestMessage.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSection === "Chat" && (
              <div className="chat-content">
                <div className="chat-page" ref={chatContainerRef}>
                  {" "}
                  {messages.map((message, index) => (
                    <div key={index} className="Message-sentreceived">
                      <span className="messageowner">
                        {message.messageowner}:
                      </span>
                      {message.content}
                    </div>
                  ))}
                </div>
                <div className="chat-text-input">
                  <input
                    type="text"
                    className="chat-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
