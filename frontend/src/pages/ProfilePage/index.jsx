import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import axios from "axios";
import config from "../../services/config";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import DefaultCoverPic from "../../assets/images/coverpic.png";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
const ProfilePage = ({ userProfile }) => {
  const [activeButton, setActiveButton] = useState("Overview");
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    if (buttonName === "Activity" && userPosts.length === 0) {
      fetchUserPosts();
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Login";
    }
  }, []);
  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${config.base_url}/api/guest/getuserposts`,
        {
          params: {
            username: userProfile.username,
          },
        }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        setUserPosts(response.data.data);
      } else {
        console.error("Error fetching user posts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoading(false);
    }
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
              {userProfile ? userProfile.username : ""}
            </span>
            <span className="followerscount-profile">
              {" "}
              {userProfile
                ? userProfile.followers_count + " Followers"
                : "0 Followers"}
            </span>
          </div>
          <div
            className="profile-navbar-buttons "
            style={{ marginRight: "80px" }}
          >
            <button
              className={activeButton === "Overview" ? "profilepageactive" : ""}
              onClick={() => handleButtonClick("Overview")}
            >
              Overview
            </button>
            <button
              className={activeButton === "Activity" ? "profilepageactive" : ""}
              onClick={() => handleButtonClick("Activity")}
            >
              Activity
            </button>
          </div>

          <div className="profile-navbar-buttons">
            <Link to="/Settings">
              <button className="hoversettings">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.08776 1.66045C8.42286 1.0888 8.93706 0.516602 9.59969 0.516602C10.2626 0.516602 10.7769 1.0892 11.112 1.66114C11.1408 1.71039 11.1716 1.75872 11.2043 1.80603C11.468 2.18798 11.8429 2.48618 12.282 2.6631L12.918 2.91767C13.3583 3.09187 13.8421 3.13658 14.3087 3.04619C14.3974 3.02901 14.4846 3.00711 14.5702 2.98066C15.1756 2.79343 15.9014 2.75815 16.3576 3.19805C16.8378 3.66115 16.7955 4.43816 16.6142 5.08022C16.6 5.13068 16.5875 5.18171 16.5767 5.23321C16.483 5.68311 16.5294 6.1497 16.71 6.57424L16.974 7.18753C17.1575 7.6109 17.4667 7.97249 17.8628 8.22678C17.9344 8.27274 18.0082 8.31482 18.084 8.35293C18.6549 8.64007 19.2 9.13471 19.2 9.77374C19.2 10.4128 18.6549 10.9074 18.084 11.1946C18.0082 11.2327 17.9344 11.2748 17.8628 11.3207C17.4667 11.575 17.1575 11.9366 16.974 12.36L16.71 12.9732C16.5295 13.3979 16.4833 13.8646 16.5773 14.3145C16.588 14.3656 16.6004 14.4163 16.6145 14.4664C16.796 15.1089 16.8383 15.8867 16.3575 16.35C15.9013 16.7897 15.1758 16.7543 14.5704 16.5671C14.485 16.5407 14.3978 16.5188 14.3093 16.5017C13.8429 16.4113 13.3593 16.4559 12.9192 16.6298L12.282 16.8844C11.8429 17.0613 11.468 17.3595 11.2043 17.7415C11.1716 17.7888 11.1408 17.8371 11.112 17.8863C10.7769 18.4583 10.2626 19.0309 9.59969 19.0309C8.93706 19.0309 8.42286 18.4587 8.08776 17.887C8.05889 17.8378 8.02809 17.7894 7.9954 17.7421C7.73171 17.3604 7.35687 17.0624 6.918 16.8855L6.282 16.631C5.84187 16.4565 5.35804 16.4115 4.89144 16.5017C4.80284 16.5188 4.7156 16.5407 4.63011 16.5671C4.02449 16.7541 3.29861 16.7893 2.84235 16.3494C2.36209 15.8862 2.40427 15.1093 2.58521 14.4671C2.59937 14.4168 2.61181 14.366 2.62248 14.3147C2.71601 13.865 2.66949 13.3987 2.4888 12.9744L2.2248 12.36C2.0414 11.9368 1.73235 11.5753 1.33649 11.321C1.26504 11.2751 1.19133 11.2331 1.11572 11.195C0.544955 10.9076 0 10.4129 0 9.77391C0 9.13474 0.5451 8.63977 1.11616 8.35269C1.60647 8.10621 2.00536 7.69976 2.2248 7.18753L2.4888 6.57424C2.66975 6.14984 2.7164 5.68328 2.62287 5.23335C2.61218 5.18192 2.59971 5.13098 2.58551 5.08059C2.40449 4.4383 2.36222 3.66112 2.84258 3.19791C3.29876 2.75803 4.02444 2.79315 4.62994 2.98013C4.7155 3.00655 4.80281 3.02843 4.89149 3.04557C5.35805 3.13575 5.84185 3.09085 6.282 2.91652L6.918 2.66194C7.35687 2.4851 7.73171 2.18708 7.9954 1.80536C8.02809 1.75804 8.05889 1.7097 8.08776 1.66045ZM4.44699 7.80108C3.9062 9.0606 3.9062 10.4869 4.44699 11.7464L4.53971 11.9624C5.06289 13.1809 6.04867 14.1416 7.28021 14.6333L7.74583 14.8192C8.93625 15.2945 10.2637 15.2944 11.4541 14.819L11.9196 14.6331C13.1505 14.1415 14.1359 13.1813 14.6592 11.9635L14.7519 11.7475C15.2934 10.4874 15.2934 9.06011 14.7519 7.79994L14.6592 7.58399C14.1359 6.36618 13.1505 5.40595 11.9196 4.91437L11.4541 4.72847C10.2637 4.25309 8.93625 4.25303 7.74583 4.72829L7.28021 4.91419C6.04867 5.40587 5.06289 6.36663 4.53971 7.58512L4.44699 7.80108Z"
                    fill="white"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="profile-pages-info">
        {activeButton === "Overview" && (
          <div className="overview-container">Overview content</div>
        )}
        {activeButton === "Activity" && (
          <div className="profile-activity">
            {" "}
            {isLoading ? (
              <Loading />
            ) : (
              userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  gameforum={post.game_forum}
                  userProfile={userProfile}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
