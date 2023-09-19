import React from "react";
import "./styles.css";

const AboutDropdown = ({
  onFAQS,
  onContactus,
  onPrivacyPolicy,
  onUserAgreement,
}) => {
  return (
    <div className="TournamentsDropdown">
      <button className="dropdown-button" onClick={onFAQS}>
        Contactus
      </button>
      <button className="dropdown-button" onClick={onContactus}>
        FAQS
      </button>
      <button className="dropdown-button" onClick={onPrivacyPolicy}>
        Privacy Policy
      </button>
      <button className="dropdown-button" onClick={onUserAgreement}>
        User Agreement
      </button>
    </div>
  );
};

export default AboutDropdown;
