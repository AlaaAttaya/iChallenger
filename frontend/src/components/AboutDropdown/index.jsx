import React from "react";
import "./styles.css";

const AboutDropdown = ({ onContactus }) => {
  return (
    <div className="AboutDropdown">
      <button className="dropdown-button" onClick={onContactus}>
        Contact us
      </button>
      <button className="dropdown-button">FAQS</button>
      <button className="dropdown-button">Privacy Policy</button>
      <button className="dropdown-button">User Agreement</button>
    </div>
  );
};

export default AboutDropdown;
