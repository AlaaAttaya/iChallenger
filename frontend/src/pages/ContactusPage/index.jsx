import React from "react";
import "./styles.css";
const ContactusPage = () => {
  return (
    <div className="ContactusPage">
      <div className="contactus-container">
        {" "}
        <div className="contactus-title-wrapper">
          <div className="contactus-title">CONTACT US</div>
        </div>
        <div className="contactus-form" id="contactus-form">
          {" "}
          <span className="contactus-span">Name</span>
          <input
            className="contactus-input"
            type="text"
            id="contactusname"
            name="contactusname"
            placeholder="Name"
          />
          <span className="contactus-span">Email</span>
          <input
            className="contactus-input"
            type="text"
            id="contactusemail"
            name="contactusemail"
            placeholder="Email"
          />
          <span className="contactus-span">Subject</span>
          <input
            className="contactus-input"
            type="text"
            id="contactussubject"
            name="contactussubject"
            placeholder="Subject"
          />
          <span className="contactus-span">Message</span>
          <textarea
            className="contactus-input"
            id="contactusmessage"
            name="contactusmessage"
          ></textarea>
        </div>
        <div className="button-wrapper">
          <button className="contactus-button" id="sendcontactus">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContactusPage;
