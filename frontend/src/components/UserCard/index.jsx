import React from "react";
import "./styles.css";
import config from "../../services/config";
const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img
        src={config.base_url + user.profileimage}
        alt={`${user.username}'s Profile`}
        className="user-avatar"
      />
      <h2 className="user-username">{user.username}</h2>
    </div>
  );
};

export default UserCard;
