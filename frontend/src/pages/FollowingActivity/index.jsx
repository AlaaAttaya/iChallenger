import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const FollowingActivityPage = () => {
  return (
    <div className="ForumsPage">
      <div className="navcommunity">
        <Link to="/Activity">
          <button className="thispage">Following Activity</button>
        </Link>
        <Link to="/Forums">
          <button>Game Forums</button>
        </Link>
      </div>
      test
    </div>
  );
};
export default FollowingActivityPage;
