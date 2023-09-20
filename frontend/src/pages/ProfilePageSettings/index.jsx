import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";

const ProfilePageSettings = ({ userProfile, setUserProfile }) => {
  const [isChangePicturesDropdownOpen, setIsChangePicturesDropdownOpen] =
    useState(false);
  const [isInformationOpen, setIsInformationOpen] = useState(true);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLinkAccountOpen, setIsLinkAccountOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  useEffect(() => {
    if (isInformationOpen) {
      axios
        .get(`${config.base_url}/api/guest/countries`)
        .then((response) => {
          setCountries(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    }
  }, [isInformationOpen]);

  const handleInformation = () => {
    setIsLinkAccountOpen(false);
    setIsChangePasswordOpen(false);
    setIsInformationOpen(true);
  };
  const handleChangePassword = () => {
    setIsLinkAccountOpen(false);
    setIsChangePasswordOpen(true);
    setIsInformationOpen(false);
  };
  const handleLinkAccount = () => {
    setIsLinkAccountOpen(true);
    setIsChangePasswordOpen(false);
    setIsInformationOpen(false);
  };

  const toggleChangePicturesDropdown = () => {
    setIsChangePicturesDropdownOpen(!isChangePicturesDropdownOpen);
  };

  const changeProfilePic = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("profileimage", file);

      try {
        const response = await axios.post(
          `${config.base_url}/api/user/changeprofilepic`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserProfile(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const changeCoverPic = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("coverimage", file);

      try {
        const response = await axios.post(
          `${config.base_url}/api/user/changecoverpic`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserProfile(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    changeProfilePic(file);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    changeCoverPic(file);
  };

  const handleProfileImageClick = () => {
    profileImageInputRef.current.click();
  };

  const handleCoverImageClick = () => {
    coverImageInputRef.current.click();
  };

  return (
    <div className="ProfilePage">
      <div className="Profile-navbar">
        <div className="coverPhotoContainer">
          <img
            src={
              userProfile
                ? config.base_url + userProfile.coverimage || DefaultCoverPic
                : DefaultCoverPic
            }
            alt="ProfileCover"
            className="coverPhoto"
          />
        </div>

        <div className="profileImageContainer">
          <img
            src={
              userProfile
                ? config.base_url + userProfile.profileimage ||
                  DefaultProfilePic
                : DefaultProfilePic
            }
            alt="ProfileImage"
            className="profileImage"
          />
        </div>

        <div className="profile-navbar-buttons-container">
          <div className="user-info">
            <span className="username-profile">
              {userProfile ? userProfile.username : "username"}
            </span>
            <span className="followerscount-profile">
              {" "}
              {userProfile
                ? userProfile.followers_count + " Followers"
                : "0 Followers"}
            </span>
          </div>

          <div className="changepictures-buttons-wrapper">
            <div
              onMouseEnter={toggleChangePicturesDropdown}
              onMouseLeave={toggleChangePicturesDropdown}
            >
              <button className="changepictures-button">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M1.6 6.4V14.4H11.2V6.4H1.6ZM3.2 4.8V1.6C3.2 1.17565 3.36857 0.768687 3.66863 0.468629C3.96869 0.168571 4.37565 0 4.8 0L14.4 0C14.8243 0 15.2313 0.168571 15.5314 0.468629C15.8314 0.768687 16 1.17565 16 1.6V9.6C16 10.0243 15.8314 10.4313 15.5314 10.7314C15.2313 11.0314 14.8243 11.2 14.4 11.2H12.8V14.4C12.8 14.8243 12.6314 15.2313 12.3314 15.5314C12.0313 15.8314 11.6243 16 11.2 16H1.6C1.17565 16 0.768687 15.8314 0.468629 15.5314C0.168571 15.2313 0 14.8243 0 14.4V6.4C0 5.97565 0.168571 5.56869 0.468629 5.26863C0.768687 4.96857 1.17565 4.8 1.6 4.8H3.2ZM4.8 4.8H11.2C11.6243 4.8 12.0313 4.96857 12.3314 5.26863C12.6314 5.56869 12.8 5.97565 12.8 6.4V9.6H14.4V1.6H4.8V4.8ZM4.8 12C4.16348 12 3.55303 11.7471 3.10294 11.2971C2.65286 10.847 2.4 10.2365 2.4 9.6C2.4 8.96348 2.65286 8.35303 3.10294 7.90294C3.55303 7.45286 4.16348 7.2 4.8 7.2C5.43652 7.2 6.04697 7.45286 6.49706 7.90294C6.94714 8.35303 7.2 8.96348 7.2 9.6C7.2 10.2365 6.94714 10.847 6.49706 11.2971C6.04697 11.7471 5.43652 12 4.8 12ZM4.8 10.4C5.01217 10.4 5.21566 10.3157 5.36569 10.1657C5.51571 10.0157 5.6 9.81217 5.6 9.6C5.6 9.38783 5.51571 9.18434 5.36569 9.03432C5.21566 8.88429 5.01217 8.8 4.8 8.8C4.58783 8.8 4.38434 8.88429 4.23431 9.03432C4.08429 9.18434 4 9.38783 4 9.6C4 9.81217 4.08429 10.0157 4.23431 10.1657C4.38434 10.3157 4.58783 10.4 4.8 10.4ZM5.6 4.8C5.6 4.16348 5.85286 3.55303 6.30294 3.10294C6.75303 2.65286 7.36348 2.4 8 2.4C8.63652 2.4 9.24697 2.65286 9.69706 3.10294C10.1471 3.55303 10.4 4.16348 10.4 4.8H8.8C8.8 4.58783 8.71571 4.38434 8.56569 4.23431C8.41566 4.08429 8.21217 4 8 4C7.78783 4 7.58434 4.08429 7.43431 4.23431C7.28429 4.38434 7.2 4.58783 7.2 4.8H5.6ZM7.0912 15.6144L5.7088 14.8088L7.8888 11.0704C8.07803 10.7458 8.34085 10.4701 8.65609 10.2656C8.97134 10.0611 9.3302 9.93344 9.70378 9.89297C10.0774 9.8525 10.4552 9.90032 10.807 10.0326C11.1587 10.1648 11.4744 10.3778 11.7288 10.6544L12.5992 11.6016L11.4208 12.6848L10.5512 11.7376C10.4664 11.6454 10.3611 11.5745 10.2438 11.5304C10.1266 11.4864 10.0006 11.4705 9.87606 11.484C9.75153 11.4976 9.63192 11.5402 9.52686 11.6084C9.4218 11.6766 9.33423 11.7685 9.2712 11.8768L7.0912 15.6144ZM12.3008 5.2384C12.75 5.06503 13.241 5.03107 13.7098 5.14096C14.1786 5.25084 14.6034 5.49947 14.9288 5.8544L15.7992 6.8016L14.6208 7.8848L13.7512 6.9376C13.6331 6.8091 13.4762 6.72275 13.3045 6.6917C13.1328 6.66064 12.9556 6.6866 12.8 6.7656V6.4C12.8 5.9432 12.608 5.5296 12.3008 5.2384Z"
                    fill="white"
                  />
                </svg>
                Change Pictures
              </button>

              {isChangePicturesDropdownOpen && (
                <div className="changepictures">
                  <div
                    className="dropdown-button-settings"
                    onClick={handleProfileImageClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <mask
                        id="mask0_127_353"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M20 0.0712891H0V19.357H20V0.0712891Z"
                          fill="white"
                        />
                      </mask>
                      <g mask="url(#mask0_127_353)">
                        <path
                          d="M2.5 6.50042C2.5 6.05663 2.8731 5.69685 3.33333 5.69685H7.08333L7.91667 3.28613H12.0833L12.9167 5.69685H16.6667C17.1269 5.69685 17.5 6.05663 17.5 6.50042V15.3397C17.5 15.7835 17.1269 16.1433 16.6667 16.1433H3.33333C2.8731 16.1433 2.5 15.7835 2.5 15.3397V6.50042Z"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12.9289C11.3807 12.9289 12.5 11.8495 12.5 10.5181C12.5 9.18674 11.3807 8.10742 10 8.10742C8.61929 8.10742 7.5 9.18674 7.5 10.5181C7.5 11.8495 8.61929 12.9289 10 12.9289Z"
                          stroke="white"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    Change Avatar
                  </div>
                  <div
                    className="dropdown-button-settings"
                    onClick={handleCoverImageClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M1.6 6.4V14.4H11.2V6.4H1.6ZM3.2 4.8V1.6C3.2 1.17565 3.36857 0.768687 3.66863 0.468629C3.96869 0.168571 4.37565 0 4.8 0L14.4 0C14.8243 0 15.2313 0.168571 15.5314 0.468629C15.8314 0.768687 16 1.17565 16 1.6V9.6C16 10.0243 15.8314 10.4313 15.5314 10.7314C15.2313 11.0314 14.8243 11.2 14.4 11.2H12.8V14.4C12.8 14.8243 12.6314 15.2313 12.3314 15.5314C12.0313 15.8314 11.6243 16 11.2 16H1.6C1.17565 16 0.768687 15.8314 0.468629 15.5314C0.168571 15.2313 0 14.8243 0 14.4V6.4C0 5.97565 0.168571 5.56869 0.468629 5.26863C0.768687 4.96857 1.17565 4.8 1.6 4.8H3.2ZM4.8 4.8H11.2C11.6243 4.8 12.0313 4.96857 12.3314 5.26863C12.6314 5.56869 12.8 5.97565 12.8 6.4V9.6H14.4V1.6H4.8V4.8ZM4.8 12C4.16348 12 3.55303 11.7471 3.10294 11.2971C2.65286 10.847 2.4 10.2365 2.4 9.6C2.4 8.96348 2.65286 8.35303 3.10294 7.90294C3.55303 7.45286 4.16348 7.2 4.8 7.2C5.43652 7.2 6.04697 7.45286 6.49706 7.90294C6.94714 8.35303 7.2 8.96348 7.2 9.6C7.2 10.2365 6.94714 10.847 6.49706 11.2971C6.04697 11.7471 5.43652 12 4.8 12ZM4.8 10.4C5.01217 10.4 5.21566 10.3157 5.36569 10.1657C5.51571 10.0157 5.6 9.81217 5.6 9.6C5.6 9.38783 5.51571 9.18434 5.36569 9.03432C5.21566 8.88429 5.01217 8.8 4.8 8.8C4.58783 8.8 4.38434 8.88429 4.23431 9.03432C4.08429 9.18434 4 9.38783 4 9.6C4 9.81217 4.08429 10.0157 4.23431 10.1657C4.38434 10.3157 4.58783 10.4 4.8 10.4ZM5.6 4.8C5.6 4.16348 5.85286 3.55303 6.30294 3.10294C6.75303 2.65286 7.36348 2.4 8 2.4C8.63652 2.4 9.24697 2.65286 9.69706 3.10294C10.1471 3.55303 10.4 4.16348 10.4 4.8H8.8C8.8 4.58783 8.71571 4.38434 8.56569 4.23431C8.41566 4.08429 8.21217 4 8 4C7.78783 4 7.58434 4.08429 7.43431 4.23431C7.28429 4.38434 7.2 4.58783 7.2 4.8H5.6ZM7.0912 15.6144L5.7088 14.8088L7.8888 11.0704C8.07803 10.7458 8.34085 10.4701 8.65609 10.2656C8.97134 10.0611 9.3302 9.93344 9.70378 9.89297C10.0774 9.8525 10.4552 9.90032 10.807 10.0326C11.1587 10.1648 11.4744 10.3778 11.7288 10.6544L12.5992 11.6016L11.4208 12.6848L10.5512 11.7376C10.4664 11.6454 10.3611 11.5745 10.2438 11.5304C10.1266 11.4864 10.0006 11.4705 9.87606 11.484C9.75153 11.4976 9.63192 11.5402 9.52686 11.6084C9.4218 11.6766 9.33423 11.7685 9.2712 11.8768L7.0912 15.6144ZM12.3008 5.2384C12.75 5.06503 13.241 5.03107 13.7098 5.14096C14.1786 5.25084 14.6034 5.49947 14.9288 5.8544L15.7992 6.8016L14.6208 7.8848L13.7512 6.9376C13.6331 6.8091 13.4762 6.72275 13.3045 6.6917C13.1328 6.66064 12.9556 6.6866 12.8 6.7656V6.4C12.8 5.9432 12.608 5.5296 12.3008 5.2384Z"
                        fill="white"
                      />
                    </svg>
                    Change Cover
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="inputfile"
                    onChange={handleCoverImageChange}
                    ref={coverImageInputRef}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="inputfile"
                    onChange={handleProfileImageChange}
                    ref={profileImageInputRef}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pages">
        <button
          id="Information"
          className={isInformationOpen ? "pageopen" : ""}
          onClick={handleInformation}
        >
          Information
        </button>
        <button
          id="changepassword"
          className={isChangePasswordOpen ? "pageopen" : ""}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
        <button
          id="LinkAccount"
          className={isLinkAccountOpen ? "pageopen" : ""}
          onClick={handleLinkAccount}
        >
          Link Account
        </button>
      </div>
      <div className="page-container">
        {isInformationOpen && (
          <div>
            <div>
              <span className="info-span">Name</span>
              <input type="text" className="info-textinput" />
            </div>
            <div>
              <span className="info-span">Username</span>
              <input type="text" className="info-textinput" />
            </div>
            <div>
              <span className="info-span">Country</span>
              <br></br>
              <select
                className="info-textinput cursor-pointer"
                style={{ width: "95%" }}
              >
                <option value="">Select a Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="saveinfo-wrapper">
              <button className="saveinfo">Save</button>
            </div>
          </div>
        )}
        {isChangePasswordOpen && (
          <div>
            <div>
              <span className="info-span">Old Password</span>
              <input type="password" className="info-textinput" />
            </div>
            <div>
              <span className="info-span">New Password</span>
              <input type="password" className="info-textinput" />
            </div>
            <div>
              <span className="info-span">Confirm New Password</span>
              <input type="password" className="info-textinput" />
            </div>
            <div className="saveinfo-wrapper">
              <button className="saveinfo">Save</button>
            </div>
          </div>
        )}
        {isLinkAccountOpen && (
          <div>
            <div>
              <span className="info-span">Link...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageSettings;
