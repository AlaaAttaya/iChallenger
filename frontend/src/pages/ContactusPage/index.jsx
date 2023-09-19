import React, { useState, useRef } from "react";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
const ContactusPage = () => {
  const messagePopupRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const showMessage = (message) => {
    if (messagePopupRef.current) {
      messagePopupRef.current.innerText = message;
      messagePopupRef.current.style.display = "block";
      messagePopupRef.current.style.opacity = 1;

      setTimeout(() => {
        if (messagePopupRef.current) {
          messagePopupRef.current.style.opacity = 0;
          setTimeout(() => {
            if (messagePopupRef.current) {
              messagePopupRef.current.style.display = "none";
            }
          }, 400);
        }
      }, 2000);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      showMessage("Please fill out all fields.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(
        `${config.base_url}/api/guest/submitcontactus`,
        formData
      );

      showMessage(`Message Submitted.`);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      showMessage("An error occurred. Please try again later.");
    }
  };

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
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <span className="contactus-span">Email</span>
          <input
            className="contactus-input"
            type="text"
            id="contactusemail"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <span className="contactus-span">Subject</span>
          <input
            className="contactus-input"
            type="text"
            id="contactussubject"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <span className="contactus-span">Message</span>
          <textarea
            className="contactus-input"
            id="contactusmessage"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="button-wrapper">
          <button
            className="contactus-button"
            id="sendcontactus"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
        <div
          id="messages-popup"
          className="message-popup"
          ref={messagePopupRef}
        ></div>
      </div>
    </div>
  );
};
export default ContactusPage;
