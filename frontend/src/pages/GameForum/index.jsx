import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../services/config";
import Loading from "../../components/Loading";
import DefaultProfilePic from "../../assets/images/profilepic.png";
import { Carousel } from "react-responsive-carousel";
import PostCard from "../../components/PostCard";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./styles.css";

const GameForum = ({ userProfile }) => {
  const { gamename } = useParams();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const uploadInputRef = useRef(null);
  const [postDescription, setPostDescription] = useState("");
  const [gameforum, setGameForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postuploaderrormessage, setPostUploadErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const toggleUploadDivision = () => {
    setUploadVisible(!uploadVisible);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleFileUpload = (event) => {
    setPostUploadErrorMessage("");
    const files = event.target.files;

    const newFiles = Array.from(files).filter(
      (file) =>
        !uploadedFiles.some((existingFile) => existingFile.name === file.name)
    );
    console.log(uploadedFiles);
    console.log(newFiles);
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileToRemove) => {
    console.log(fileToRemove);
    const updatedFiles = uploadedFiles.filter(
      (file) => file.name !== fileToRemove.name
    );
    setPostUploadErrorMessage("");
    setUploadedFiles(updatedFiles);
  };
  const handlePostClick = async () => {
    try {
      if (uploadedFiles.length === 0) {
        setPostUploadErrorMessage("Please select at least one file.");
        return;
      }
      if (postDescription.trim() === "") {
        setPostUploadErrorMessage("Please enter a description.");
        return;
      }

      setPostUploadErrorMessage("");

      const formData = new FormData();
      formData.append("description", postDescription);
      formData.append("game_forum_id", gameforum.id);

      uploadedFiles.forEach((file, index) => {
        formData.append(`uploads[${index}]`, file);
      });

      const response = await axios.post(
        `${config.base_url}/api/user/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Post created successfully!");

        setPostDescription("");
        setUploadedFiles([]);
        navigate(`/Forums/${gameforum.name}/${response.data.data.id}`);
      } else {
        console.error("Error creating post:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchForumPosts = async (gameforum) => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getgameforumposts`,
        {
          params: { ForumId: gameforum.id },
        }
      );

      if (response.status === 200) {
        setPosts(response.data.data);
      } else {
        console.error("Error fetching forum posts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getgameforum`,
        {
          params: { name: gamename },
        }
      );

      if (response.status === 200) {
        setGameForum(response.data.data);
        fetchForumPosts(response.data.data);
      } else {
        console.error("Error fetching game forum:", response.data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching game forum:", error);
    }
  };
  useEffect(() => {
    scrollToTop();
    fetchData();
  }, [gamename]);

  return (
    <div className="GameForum">
      {loading ? (
        <Loading />
      ) : gameforum ? (
        <>
          <div className="game-forum-container">
            <div className=" adjustor">
              <h2 className="game-forum-name">{gameforum.name}</h2>
            </div>
            <div className="game-forum-container-navigation">
              <div className="postnavbarsearch">
                <svg
                  width="25"
                  height="34"
                  viewBox="0 0 35 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
                    fill="#a4a3a3"
                  ></path>
                </svg>
                <input
                  type="text"
                  className="inputtext-search-post"
                  placeholder="Search.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>{" "}
          </div>
          <div className="post-column">
            <div className="adjustor-2"></div>
            {userProfile && (
              <>
                <div className="profile-upload-wrapper">
                  <div className="profile-upload-container">
                    <div className="post-upload-wrapper-title">Post</div>
                    <div className="post-upload-wrapper-button">
                      <button onClick={toggleUploadDivision}>POST</button>
                    </div>
                  </div>{" "}
                </div>
              </>
            )}
            <div className="gameforumposts-list">
              {filteredPosts.length === 0 ? (
                <h3>No posts found.</h3>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    gameforum={gameforum}
                    userProfile={userProfile}
                    show={false}
                  />
                ))
              )}
            </div>
            <div className="adjustor-2"></div>
          </div>
          {uploadVisible && (
            <div className="profile-uploadvisible-wrapper">
              <div className="postforum-wrapper">
                <div className="close-postforum">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 22 22"
                    fill="none"
                    onClick={toggleUploadDivision}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.68056 10.9999L0 19.6805L2.31935 22L11 13.3193L19.6806 22L22 19.6805L13.3194 10.9999L21.9998 2.31938L19.6803 0L11 8.68039L2.31961 0L0.000261718 2.31938L8.68056 10.9999Z"
                      fill="#2FD671"
                    />
                  </svg>
                </div>
                <span className="title-PostUpload">Upload Post</span>
                <div className="profile-uploadvisible-container">
                  <div className="profile-imagevisible">
                    <img
                      src={
                        userProfile
                          ? config.base_url + userProfile.profileimage ||
                            DefaultProfilePic
                          : DefaultProfilePic
                      }
                      alt="ProfileImage"
                    />
                  </div>
                  <div className="profile-textvisible">
                    <input
                      type="text"
                      className="profile-text-inputvisible"
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                    />
                  </div>
                  <div className="profile-buttonsvisible">
                    <button
                      className="upload-buttonvisible"
                      onClick={() => uploadInputRef.current.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 18 23"
                        fill="none"
                      >
                        <path
                          d="M5.59894 17.211H12.7651V9.37471H17.5425L9.182 0.232422L0.821533 9.37471H5.59894V17.211ZM0.821533 19.823H17.5425V22.4351H0.821533V19.823Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    <button
                      className="post-button-visible"
                      onClick={handlePostClick}
                    >
                      Post
                    </button>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={(e) => handleFileUpload(e)}
                      style={{ display: "none" }}
                      ref={uploadInputRef}
                    />
                  </div>
                </div>

                <div className="files-carousel">
                  {uploadedFiles.length > 0 && (
                    <>
                      <Carousel
                        infiniteLoop
                        swipeable={true}
                        showStatus={false}
                        showThumbs={false}
                        emulateTouch={true}
                      >
                        {uploadedFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`}>
                            {file.type.startsWith("image/") ? (
                              <>
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Uploaded ${file.type}`}
                                />

                                <button
                                  key={`${file.name}-${index}`}
                                  className="remove-button-files"
                                  onClick={() => removeFile(file)}
                                >
                                  Remove
                                </button>
                              </>
                            ) : file.type.startsWith("video/") ? (
                              <>
                                <video controls>
                                  <source
                                    src={URL.createObjectURL(file)}
                                    type={file.type}
                                  />
                                  Your browser does not support the video tag.
                                </video>

                                <button
                                  key={`${file.name}-${index}`}
                                  className="remove-button-files"
                                  onClick={() => removeFile(file)}
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <p>Unsupported file type: {file.type}</p>
                            )}
                          </div>
                        ))}
                      </Carousel>
                    </>
                  )}
                </div>
                <div className="error-postuploadmessage">
                  {postuploaderrormessage}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Gameforum not found</h2>
        </div>
      )}
    </div>
  );
};

export default GameForum;
