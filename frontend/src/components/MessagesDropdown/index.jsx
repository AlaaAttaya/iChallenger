import React from "react";
import "./styles.css";

const MessagesDropdown = ({ onChatgptBot, onMyMessages }) => {
  return (
    <div className="MessagesDropdown">
      <button className="dropdown-button" onClick={onChatgptBot}>
        Chatgpt Bot
      </button>
      <button className="dropdown-button" onClick={onMyMessages}>
        My Messages
      </button>
    </div>
  );
};

export default MessagesDropdown;
