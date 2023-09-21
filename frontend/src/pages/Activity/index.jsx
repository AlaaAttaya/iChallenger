import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const ActivityPage = () => {
  return (
    <div className="ForumsPage">
      <div className="navcommunity">
        <Link to="/Activity">
          <button className="thispage">Activity</button>
        </Link>
        <Link to="/Forums">
          <button>Forums</button>
        </Link>
      </div>
      test
    </div>
  );
};
export default ActivityPage;
