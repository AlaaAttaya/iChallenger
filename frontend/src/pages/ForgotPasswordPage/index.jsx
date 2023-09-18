import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
const ForgotPasswordPage = () => {
  return (
    <div className="ForgotPasswordPage">
      <div className="forgotpassword-container">
        <div className="header">
          <div className="backbutton">
            <Link to="/Login">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 45 45"
                fill="none"
              >
                <path
                  d="M9.84375 21.0938H37.9688C38.3417 21.0938 38.6994 21.2419 38.9631 21.5056C39.2268 21.7694 39.375 22.127 39.375 22.5C39.375 22.873 39.2268 23.2306 38.9631 23.4944C38.6994 23.7581 38.3417 23.9062 37.9688 23.9062H9.84375C9.47079 23.9062 9.1131 23.7581 8.84938 23.4944C8.58566 23.2306 8.4375 22.873 8.4375 22.5C8.4375 22.127 8.58566 21.7694 8.84938 21.5056C9.1131 21.2419 9.47079 21.0938 9.84375 21.0938Z"
                  fill="#2FD671"
                />
                <path
                  d="M10.4259 22.5001L22.0894 34.1607C22.3534 34.4247 22.5018 34.7829 22.5018 35.1563C22.5018 35.5297 22.3534 35.8879 22.0894 36.1519C21.8253 36.416 21.4672 36.5643 21.0937 36.5643C20.7203 36.5643 20.3622 36.416 20.0981 36.1519L7.44187 23.4957C7.31091 23.3651 7.20701 23.2099 7.13612 23.039C7.06522 22.8682 7.02873 22.685 7.02873 22.5001C7.02873 22.3151 7.06522 22.1319 7.13612 21.9611C7.20701 21.7903 7.31091 21.6351 7.44187 21.5044L20.0981 8.84819C20.3622 8.58414 20.7203 8.43579 21.0937 8.43579C21.4672 8.43579 21.8253 8.58414 22.0894 8.84819C22.3534 9.11225 22.5018 9.47039 22.5018 9.84382C22.5018 10.2172 22.3534 10.5754 22.0894 10.8394L10.4259 22.5001Z"
                  fill="#2FD671"
                />
              </svg>
            </Link>
          </div>

          <div className="forgotpassword-title-wrapper">
            <div className="forgotpassword-title">Forgot Password</div>
          </div>
        </div>
        <div className="forgotpassword-form" id="forgotpasswordform">
          <span className="forgotpassword-span">Email</span>
          <input
            className="forgotpassword-input"
            type="text"
            id="email"
            name="email"
            placeholder="Email"
          />
          <div className="button-wrapper">
            <button className="forgotpassword-button" id="sendcode">
              Send Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
