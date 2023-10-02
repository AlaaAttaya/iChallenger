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
  const [errormessage, setErrorMessage] = useState("");
  const [editedData, setEditedData] = useState({
    name: userProfile ? userProfile.name : "",
    username: userProfile ? userProfile.username : "",
    country: userProfile ? userProfile.country : "",
  });
  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  const [userStats, setUserStats] = useState(null);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const [pastTournaments, setPastTournaments] = useState([]);
  const [activeTournaments, setActiveTournaments] = useState([]);

  useEffect(() => {
    scrollToTop();
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

  const handleOldPasswordChange = (e) => {
    const { value } = e.target;
    setPasswordData({ ...passwordData, oldpassword: value });
  };
  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setPasswordData({ ...passwordData, newpassword: value });
  };
  const handleConfirmNewPasswordChange = (e) => {
    const { value } = e.target;
    setPasswordData({ ...passwordData, confirmnewpassword: value });
  };
  const handleSavePasswordKeyPress = (e) => {
    if (e.key === "Enter") {
      document.getElementById("savepassword").click();
    }
  };
  const handleSaveInfoKeyPress = (e) => {
    if (e.key === "Enter") {
      document.getElementById("saveinfo").click();
    }
  };

  const handleSavePassword = () => {
    if (passwordData.newpassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newpassword !== passwordData.confirmnewpassword) {
      setErrorMessage("Password & Confirm Password do not match.");
      return;
    }

    if (
      !passwordData.oldpassword ||
      !passwordData.newpassword ||
      !passwordData.confirmnewpassword
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    axios
      .post(`${config.base_url}/api/user/changepassword`, passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === "Incorrect old password") {
          setErrorMessage("Wrong Old Password.");
        } else {
          setErrorMessage("Success.");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Wrong Old Password.");
      });
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setEditedData({ ...editedData, name: value });
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setEditedData({ ...editedData, username: value });
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    setEditedData({ ...editedData, country: value });
  };

  const handleSaveInfo = () => {
    axios
      .post(`${config.base_url}/api/user/editprofile`, editedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserProfile(response.data.data);
        setErrorMessage("Changes saved.");
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        setErrorMessage("Error updating changes.");
      });
  };

  const handleInformation = () => {
    setIsLinkAccountOpen(false);
    setIsChangePasswordOpen(false);
    setIsInformationOpen(true);
    setErrorMessage("");
  };
  const handleChangePassword = () => {
    setIsLinkAccountOpen(false);
    setIsChangePasswordOpen(true);
    setIsInformationOpen(false);
    setErrorMessage("");
  };
  const handleLinkAccount = () => {
    setIsLinkAccountOpen(true);
    setIsChangePasswordOpen(false);
    setIsInformationOpen(false);
    setErrorMessage("");
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
  const fetchUserStats = async (username) => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getusersstats?username=${username}`
      );

      setUserStats(response.data.data[0]);
      const teams = response.data.data[0].teams;
      const active = [];
      const past = [];

      teams.forEach((team) => {
        if (team.tournament && team.tournament.is_completed === 1) {
          past.push(team.tournament);
        } else if (team.tournament) {
          active.push(team.tournament);
        }
      });

      setPastTournaments(past);
      setActiveTournaments(active);
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };
  useEffect(() => {
    if (userProfile) {
      fetchUserStats(userProfile.username);
    }
  }, [userProfile]);
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
          />{" "}
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
          <div className="profileimagestats">
            <div className="user-info">
              <div className="profileimagestatsusername-info">
                <span className="username-profile">
                  {userProfile ? userProfile.username : ""}
                </span>
              </div>
              <div className="profileimagestats-info-wrapper">
                <div className="profileimagestats-info">
                  <span className="label-profilepage">Followers</span>
                  <span className="greycolor-profilepage">
                    {userProfile ? userProfile.followers_count : "0"}
                  </span>
                </div>

                <div className="profileimagestats-info">
                  <span className="label-profilepage"> Tournaments Played</span>
                  <span className="greycolor-profilepage">
                    {userStats ? userStats.tournaments_count : "0"}
                  </span>
                </div>
              </div>
              <div className="profileimagestats-info-wrapper">
                <div className="profileimagestats-info">
                  <span className="label-profilepage">Matches Played</span>
                  <span className="greycolor-profilepage">
                    {userStats ? userStats.matches_count : "0"}
                  </span>
                </div>
                <div className="profileimagestats-info">
                  <span className="label-profilepage">Win Rate</span>
                  <span className="greycolor-profilepage">
                    {userStats && userStats.leaderboard
                      ? userStats.tournaments_count === 0
                        ? "0%"
                        : `${
                            (parseInt(userStats.leaderboard.won) /
                              parseInt(userStats.tournaments_count)) *
                            100
                          }%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="coverimageuserstats">
            <div className="overview-stats-wins">
              <span>
                {" "}
                {userStats && userStats.leaderboard
                  ? userStats.leaderboard.won
                  : "0"}{" "}
              </span>
              <span className="green win">WON</span>
            </div>
            <div className="overview-stats-wins">
              <span>
                {" "}
                {userStats && userStats.leaderboard
                  ? userStats.leaderboard.lost
                  : "0"}{" "}
              </span>
              <span className="red loss">LOST</span>
            </div>
            <div className="overview-stats-points">
              <span className="points-span">
                {userStats && userStats.leaderboard
                  ? userStats.leaderboard.points
                  : "0"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <path
                    d="M17.9473 32.9995C26.2025 33.0632 32.9416 26.425 32.9996 18.1727C33.0576 9.92036 26.4126 3.17893 18.1575 3.11527C9.90232 3.05162 3.16318 9.68983 3.10515 17.9421C3.04713 26.1945 9.69219 32.9359 17.9473 32.9995Z"
                    fill="#EFB832"
                  />
                  <path
                    d="M21.6137 23.1942C21.1819 23.6431 20.6648 24.0013 20.0927 24.2477C19.5206 24.4942 18.9049 24.6241 18.2818 24.6296C15.3422 24.607 12.9881 21.6168 13.0139 17.9477C13.0397 14.2786 15.4356 11.3251 18.3752 11.3477C19.0454 11.3684 19.704 11.5293 20.3084 11.8199C20.9128 12.1106 21.4497 12.5245 21.8844 13.0351"
                    fill="#EFB832"
                  />
                  <path
                    d="M9.73073 5.45461C12.2003 3.8317 15.0964 2.97765 18.0527 3.00044C22.0169 3.03102 25.8077 4.63459 28.5912 7.4584C31.3746 10.2822 32.9227 14.0949 32.8948 18.0578C32.8741 21.0131 31.9771 23.8953 30.3174 26.3398C28.6577 28.7844 26.3098 30.6815 23.5706 31.7914C20.8314 32.9013 17.8239 33.174 14.9285 32.5751C12.0331 31.9762 9.37974 30.5326 7.30403 28.4268C5.22831 26.3209 3.82345 23.6475 3.26709 20.7446C2.71072 17.8417 3.02786 14.8396 4.17837 12.118C5.32889 9.39639 7.26113 7.07752 9.73073 5.45461Z"
                    fill="#EFB832"
                  />
                  <path
                    d="M32.9996 18.1727L35.4996 18.1903L32.9996 18.1727ZM3.10515 17.9421L5.60509 17.9597L3.10515 17.9421ZM23.4154 24.9274C24.3726 23.9323 24.3419 22.3497 23.3468 21.3925C22.3517 20.4353 20.7691 20.466 19.8119 21.4611L23.4154 24.9274ZM18.2818 24.6296L18.2625 27.1296C18.2764 27.1297 18.2903 27.1297 18.3042 27.1295L18.2818 24.6296ZM18.3752 11.3477L18.4524 8.84893C18.4331 8.84833 18.4138 8.84796 18.3945 8.84781L18.3752 11.3477ZM19.9809 14.6558C20.876 15.7071 22.4539 15.8337 23.5051 14.9386C24.5564 14.0435 24.683 12.4657 23.7879 11.4144L19.9809 14.6558ZM18.0527 3.00044L18.0334 5.50037L18.0527 3.00044ZM9.73073 5.45461L8.35777 3.36536V3.36536L9.73073 5.45461ZM4.17837 12.118L1.87568 11.1445L4.17837 12.118ZM3.26709 20.7446L5.7224 20.274L3.26709 20.7446ZM14.9285 32.5751L14.4221 35.0233H14.4221L14.9285 32.5751ZM30.3174 26.3398L28.2491 24.9356L28.2491 24.9356L30.3174 26.3398ZM32.8948 18.0578L35.3948 18.0754L32.8948 18.0578ZM28.5912 7.4584L30.3716 5.7034V5.7034L28.5912 7.4584ZM30.4997 18.1551C30.4514 25.0253 24.8412 30.5526 17.9666 30.4996L17.928 35.4995C27.5637 35.5738 35.4318 27.8247 35.4996 18.1903L30.4997 18.1551ZM17.9666 30.4996C11.0907 30.4466 5.55677 24.8312 5.60509 17.9597L0.605215 17.9246C0.537479 27.5577 8.29372 35.4252 17.928 35.4995L17.9666 30.4996ZM5.60509 17.9597C5.6534 11.0896 11.2636 5.56219 18.1382 5.6152L18.1767 0.615349C8.54108 0.541044 0.67296 8.29009 0.605215 17.9246L5.60509 17.9597ZM18.1382 5.6152C25.0141 5.66822 30.548 11.2836 30.4997 18.1551L35.4996 18.1903C35.5673 8.55711 27.8111 0.689644 18.1767 0.615349L18.1382 5.6152ZM19.8119 21.4611C19.6109 21.6701 19.3701 21.8369 19.1036 21.9517L21.0818 26.5437C21.9595 26.1656 22.7529 25.6161 23.4154 24.9274L19.8119 21.4611ZM19.1036 21.9517C18.837 22.0666 18.55 22.1271 18.2594 22.1297L18.3042 27.1295C19.2598 27.121 20.2041 26.9219 21.0818 26.5437L19.1036 21.9517ZM18.3011 22.1297C17.2329 22.1215 15.4939 20.8035 15.5139 17.9653L10.514 17.9301C10.4824 22.4302 13.4515 27.0925 18.2625 27.1296L18.3011 22.1297ZM15.5139 17.9653C15.5338 15.1273 17.29 13.8394 18.3559 13.8477L18.3945 8.84781C13.5811 8.81069 10.5456 13.4298 10.514 17.9301L15.5139 17.9653ZM18.298 13.8465C18.6193 13.8565 18.9351 13.9336 19.225 14.073L21.3917 9.56686C20.4728 9.12501 19.4716 8.88042 18.4524 8.84893L18.298 13.8465ZM19.225 14.073C19.5149 14.2124 19.7724 14.411 19.9809 14.6558L23.7879 11.4144C23.1269 10.6381 22.3107 10.0087 21.3917 9.56686L19.225 14.073ZM18.072 0.500519C14.6214 0.47391 11.2408 1.47076 8.35777 3.36536L11.1037 7.54387C13.1599 6.19265 15.5714 5.48138 18.0334 5.50037L18.072 0.500519ZM8.35777 3.36536C5.47471 5.25997 3.21888 7.96715 1.87568 11.1445L6.48107 13.0914C7.4389 10.8256 9.04754 8.89507 11.1037 7.54387L8.35777 3.36536ZM1.87568 11.1445C0.532473 14.3219 0.162333 17.8266 0.811773 21.2152L5.7224 20.274C5.25912 17.8567 5.52324 15.3572 6.48107 13.0914L1.87568 11.1445ZM0.811773 21.2152C1.46121 24.6037 3.10102 27.7241 5.52358 30.1818L9.08447 26.6718C7.3556 24.9178 6.18569 22.6913 5.7224 20.274L0.811773 21.2152ZM5.52358 30.1818C7.94613 32.6394 11.0428 34.3243 14.4221 35.0233L15.4349 30.1269C13.0234 29.6281 10.8134 28.4257 9.08447 26.6718L5.52358 30.1818ZM14.4221 35.0233C17.8014 35.7223 21.3118 35.404 24.5094 34.1085L22.6318 29.4744C20.351 30.3985 17.8464 30.6258 15.4349 30.1269L14.4221 35.0233ZM24.5094 34.1085C27.707 32.8128 30.4481 30.5981 32.3857 27.7441L28.2491 24.9356C26.8673 26.9707 24.9126 28.5503 22.6318 29.4744L24.5094 34.1085ZM32.3857 27.7441C34.3234 24.8901 35.3705 21.5253 35.3948 18.0754L30.3949 18.0403C30.3776 20.5009 29.6308 22.9004 28.2491 24.9356L32.3857 27.7441ZM35.3948 18.0754C35.4273 13.4493 33.6202 8.99904 30.3716 5.7034L26.8107 9.2134C29.1291 11.5654 30.4181 14.7406 30.3949 18.0403L35.3948 18.0754ZM30.3716 5.7034C27.1231 2.4078 22.6989 0.5362 18.072 0.500519L18.0334 5.50037C21.3349 5.52583 24.4924 6.86138 26.8107 9.2134L30.3716 5.7034Z"
                    fill="#CC9322"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="profile-navbar-buttons-container-settings">
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
                    fill="black"
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
              <input
                type="text"
                className="info-textinput"
                value={editedData.name}
                onChange={handleNameChange}
                placeholder="Name"
                onKeyDown={handleSaveInfoKeyPress}
              />
            </div>
            <div>
              <span className="info-span">Username</span>
              <input
                type="text"
                className="info-textinput"
                placeholder="Username"
                value={editedData.username}
                onChange={handleUsernameChange}
                onKeyDown={handleSaveInfoKeyPress}
              />
            </div>
            <div>
              <span className="info-span">Country</span>
              <br></br>
              <select
                className="info-textinput cursor-pointer"
                style={{ width: "95%" }}
                value={editedData.country}
                onChange={handleCountryChange}
              >
                <option value="">Select a Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="errormsg">{errormessage}</span>
            <div className="saveinfo-wrapper">
              <button
                className="saveinfo"
                id="saveinfo"
                onClick={handleSaveInfo}
              >
                Save
              </button>
            </div>
          </div>
        )}
        {isChangePasswordOpen && (
          <div>
            <div>
              <span className="info-span">Old Password</span>
              <input
                type="password"
                className="info-textinput"
                value={passwordData.oldpassword}
                onChange={handleOldPasswordChange}
                onKeyDown={handleSavePasswordKeyPress}
              />
            </div>
            <div>
              <span className="info-span">New Password</span>
              <input
                type="password"
                className="info-textinput"
                value={passwordData.newpassword}
                onChange={handleNewPasswordChange}
                onKeyDown={handleSavePasswordKeyPress}
              />
            </div>
            <div>
              <span className="info-span">Confirm New Password</span>
              <input
                type="password"
                className="info-textinput"
                value={passwordData.confirmnewpassword}
                onChange={handleConfirmNewPasswordChange}
                onKeyDown={handleSavePasswordKeyPress}
              />
            </div>
            <span className="errormsg">{errormessage}</span>
            <div className="saveinfo-wrapper">
              <button
                className="saveinfo"
                id="savepassword"
                onClick={handleSavePassword}
              >
                Save
              </button>
            </div>
          </div>
        )}
        {isLinkAccountOpen && (
          <div>
            <div>
              <span className="info-span"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageSettings;
