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

const PostPage = ({ userProfile }) => {
  const { gamename } = useParams();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const uploadInputRef = useRef(null);
  const [postDescription, setPostDescription] = useState("");
  const [gameforum, setGameForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postuploaderrormessage, setPostUploadErrorMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const toggleUploadDivision = () => {
    setUploadVisible(!uploadVisible);
  };

  const handleFileUpload = (event) => {
    setPostUploadErrorMessage("");
    const files = event.target.files;

    const newFiles = Array.from(files).filter(
      (file) =>
        !uploadedFiles.some((existingFile) => existingFile.name === file.name)
    );

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileToRemove) => {
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
        console.log("Forum posts:", response.data);
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
        setGameForum(response.data.data.game);
        fetchForumPosts(response.data.data.game);
      } else {
        console.error("Error fetching game forum:", response.data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching game forum:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [gamename]);

  return (
    <div className="GameForum">
      {loading ? (
        <Loading />
      ) : gameforum ? (
        <>
          <div className="game-forum-container">
            <Link to="/Forums">
              <div className="game-forum-container-navigation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
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
              </div>
            </Link>
            <div className="game-forum-container-navigation">
              <h2 className="game-forum-name">{gameforum.name}</h2>
            </div>
            <div className="game-forum-container-navigation"></div>
          </div>
          {userProfile && (
            <>
              <div
                className="gameforumposts-list"
                style={{ marginTop: "20px" }}
              >
                {posts.length === 0 ? (
                  <h3 style={{ color: "white" }}>No posts found.</h3>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      gameforum={gameforum}
                      show={true}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div>
          <h2> not found</h2>
        </div>
      )}
    </div>
  );
};

export default PostPage;
