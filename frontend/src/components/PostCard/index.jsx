import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config from "../../services/config";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "./styles.css";
import DefaultProfilePic from "../../assets/images/profilepic.png";
const PostCard = ({ post, gameforum, show, userProfile }) => {
  console.log(post);
  console.log(userProfile);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const formattedDate = new Date(post.created_at).toLocaleDateString();
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [comments, setComments] = useState(post.post_comments);
  useEffect(() => {
    if (userProfile && post.post_likes) {
      const userLike = post.post_likes.find(
        (like) => like.id === userProfile.id
      );

      if (userLike) {
        if (userLike.is_liked === 1) {
          setIsUpvoted(true);
          setIsDownvoted(false);
        } else {
          setIsUpvoted(false);
          setIsDownvoted(true);
        }
      } else {
        setIsUpvoted(false);
        setIsDownvoted(false);
      }
    }
  }, [userProfile, post]);

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.description,
          text: "Check out my post on iChallenger!",
          url: window.location.href,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Native sharing not supported.");
    }
  };
  const handleUpvote = async () => {
    if (!userProfile) {
      window.location.href = "/Login";
    }
    if (isUpvoted) {
      try {
        await axios.post(
          `${config.base_url}/api/user/unlikepost`,
          {
            postId: post.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikeCount(likeCount - 1);
        setIsUpvoted(false);
      } catch (error) {
        console.error("Error unliking the post:", error);
      }
    } else {
      try {
        await axios.post(
          `${config.base_url}/api/user/likepost`,
          {
            postId: post.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIsUpvoted(true);
        setLikeCount(likeCount + 1);
        setIsDownvoted(false);
      } catch (error) {
        console.error("Error liking the post:", error);
      }
    }
  };

  const handleDownvote = async () => {
    if (!userProfile) {
      window.location.href = "/Login";
    }
    if (isDownvoted) {
      try {
        const response = await axios.post(
          `${config.base_url}/api/user/unlikepost`,
          {
            postId: post.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikeCount(likeCount + 1);
        setIsDownvoted(false);
      } catch (error) {
        console.error("Error removing downvote:", error);
      }
    } else {
      try {
        const response = await axios.post(
          `${config.base_url}/api/user/dislikepost`,
          {
            postId: post.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsDownvoted(true);
        setIsUpvoted(false);
        setLikeCount(likeCount - 1);
      } catch (error) {
        console.error("Error downvoting the post:", error);
      }
    }
  };
  const handleCommentKeyPress = async (e) => {
    if (e.key === "Enter" && commentText.trim() !== "") {
      try {
        const response = await axios.post(
          `${config.base_url}/api/user/createcomment`,
          {
            postId: post.id,
            comment: commentText,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setCommentText("");
        setCommentCount(commentCount + 1);
        const newComment = {
          user: {
            profileimage: userProfile.profileimage,
            username: userProfile.username,
          },
          comment: commentText,
          created_at: Date.now(),
        };

        setComments((prevComments) => [...prevComments, newComment]);
      } catch (error) {
        console.error("Error creating comment:", error);
      }
    }
  };

  return (
    <div className="PostCard">
      <div className="vote-wrapper">
        <div className="vote-container">
          <div className="upvote" onClick={handleUpvote}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 19 18"
              fill="none"
            >
              <path
                d="M0.201513 10.0113C0.281255 10.1609 0.407434 10.2884 0.565572 10.3792C0.72371 10.47 0.907398 10.5205 1.09556 10.5248L5.09474 10.6141L5.01107 16.7152C5.0079 16.9463 5.1102 17.1704 5.29545 17.338C5.48071 17.5057 5.73375 17.6032 5.99892 17.6091L11.9977 17.7432C12.2628 17.7491 12.5184 17.6629 12.7082 17.5037C12.8979 17.3444 13.0063 17.1251 13.0094 16.8939L13.0931 10.7929L17.0923 10.8822C17.2805 10.8862 17.4655 10.8437 17.6259 10.7598C17.7864 10.6759 17.9158 10.5539 17.9994 10.4078C18.083 10.2617 18.1173 10.0975 18.0984 9.934C18.0795 9.77047 18.0081 9.61428 17.8926 9.48335L10.0137 0.588811C9.92145 0.484608 9.80377 0.399521 9.66938 0.339852C9.53499 0.280183 9.38734 0.24746 9.23736 0.244109C9.08739 0.240758 8.93893 0.266863 8.80299 0.320492C8.66705 0.37412 8.5471 0.453896 8.45204 0.553913L0.334143 9.09099C0.0905962 9.34797 0.0396937 9.70517 0.201513 10.0113ZM9.20627 2.5115L15.0356 9.09257L11.1174 9.00501L11.0218 15.9777L7.02262 15.8883L7.11824 8.91564L3.20004 8.82809L9.20627 2.5115Z"
                fill={`${isUpvoted ? "#2FD671" : "white"}`}
                fillOpacity="0.74"
              />
              <path
                d="M5.59462 10.6253L5.60147 10.1253L5.1016 10.1142L1.10265 10.0248C0.995199 10.0224 0.894148 9.99341 0.811657 9.94604C0.729761 9.89901 0.674295 9.83881 0.642597 9.77974C0.585292 9.6706 0.596372 9.5445 0.69807 9.43698C0.698163 9.43688 0.698256 9.43678 0.698349 9.43668L8.81567 0.900206L8.81575 0.900127C8.85843 0.855221 8.91694 0.814681 8.98986 0.785915C9.06281 0.757133 9.14528 0.742158 9.23051 0.744062C9.31573 0.745966 9.39774 0.764618 9.46986 0.796641C9.54195 0.828648 9.59931 0.871776 9.64074 0.918563L9.64081 0.918644L17.5191 9.81254C17.5192 9.81266 17.5193 9.81278 17.5194 9.8129C17.5706 9.87104 17.5954 9.93207 17.6018 9.98719C17.6081 10.0419 17.5974 10.0999 17.565 10.1566L17.9962 10.406L17.565 10.1566C17.5318 10.2145 17.4747 10.2726 17.3913 10.3162C17.3077 10.3599 17.2061 10.3845 17.0987 10.3823C17.0986 10.3823 17.0985 10.3823 17.0984 10.3823L13.1 10.2929L12.6001 10.2817L12.5932 10.7817L12.5096 16.8828C12.5085 16.9574 12.4739 17.0447 12.3849 17.1195C12.2936 17.196 12.1576 17.2466 12.0045 17.2432L6.00577 17.1092C5.8527 17.1057 5.71814 17.0491 5.62907 16.9685C5.54216 16.8898 5.50992 16.801 5.51095 16.7264L5.59462 10.6253ZM9.57918 2.18167L9.21641 1.77212L8.84263 2.16521L2.8364 8.4818L2.0559 9.30263L3.19318 9.32804L6.61151 9.40443L6.52274 15.8771L6.51588 16.3771L7.01576 16.3882L11.0149 16.4776L11.5148 16.4888L11.5217 15.9888L11.6104 9.51613L15.0288 9.59252L16.166 9.61793L15.4085 8.76274L9.57918 2.18167Z"
                stroke={` ${isUpvoted ? "#2FD671" : "white"}`}
                strokeOpacity="0.74"
              />
            </svg>
          </div>

          <div className="votecount">{likeCount}</div>
          <div className="downvote" onClick={handleDownvote}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                d="M17.9014 8.04353C17.8196 7.89578 17.6917 7.77112 17.5323 7.68386C17.3729 7.59659 17.1886 7.55026 17.0003 7.55017H13.0001V1.44856C13.0001 1.21738 12.8947 0.995675 12.7072 0.832207C12.5196 0.668739 12.2653 0.576904 12 0.576904H5.99967C5.73444 0.576904 5.48007 0.668739 5.29252 0.832207C5.10497 0.995675 4.99961 1.21738 4.99961 1.44856V7.55017H0.99936C0.811082 7.55045 0.62671 7.597 0.467415 7.68448C0.308119 7.77196 0.180358 7.89682 0.0987989 8.04473C0.0172402 8.19264 -0.0148093 8.3576 0.0063307 8.52066C0.0274707 8.68373 0.100943 8.83829 0.218312 8.96661L8.2188 17.6832C8.31249 17.7853 8.43134 17.8677 8.56654 17.9244C8.70174 17.9811 8.84984 18.0105 8.99985 18.0105C9.14987 18.0105 9.29796 17.9811 9.43316 17.9244C9.56837 17.8677 9.68721 17.7853 9.7809 17.6832L17.7814 8.96661C18.0214 8.70424 18.0674 8.34599 17.9014 8.04353ZM8.99985 15.7429L3.08049 9.29348H6.99973V2.32022H11V9.29348H14.9192L8.99985 15.7429Z"
                fill={` ${isDownvoted ? "red" : "white"}`}
                fillOpacity="0.69"
              />
              <path
                d="M12.5001 7.55017V8.05017H13.0001H17.0001C17.1076 8.05022 17.209 8.0769 17.2922 8.12242L17.5323 7.68386L17.2922 8.12242C17.3747 8.16759 17.431 8.2265 17.4635 8.28481C17.5223 8.39266 17.513 8.519 17.4128 8.62879C17.4127 8.6289 17.4126 8.62901 17.4125 8.62912L9.41254 17.3451L9.41247 17.3452C9.3704 17.391 9.31245 17.4329 9.23993 17.4632C9.16737 17.4937 9.0851 17.5105 8.99985 17.5105C8.9146 17.5105 8.83234 17.4937 8.75978 17.4633L8.56654 17.9244L8.75977 17.4632C8.68725 17.4329 8.6293 17.391 8.58724 17.3452L8.58716 17.3451L0.587254 8.62915C0.587181 8.62907 0.587109 8.62899 0.587036 8.62891C0.534963 8.57189 0.509312 8.51139 0.502181 8.45638C0.49511 8.40183 0.504948 8.34365 0.536645 8.28617L0.101993 8.04649L0.536645 8.28617C0.568964 8.22756 0.625266 8.16823 0.708096 8.12274C0.791083 8.07717 0.892401 8.05037 0.99982 8.05017C0.999913 8.05017 1.00001 8.05017 1.0001 8.05017L4.99961 8.05017H5.49961V7.55017V1.44856C5.49961 1.3739 5.53306 1.28582 5.62104 1.20913C5.71121 1.13054 5.84655 1.0769 5.99967 1.0769H12C12.1532 1.0769 12.2885 1.13054 12.3787 1.20913C12.4666 1.28582 12.5001 1.3739 12.5001 1.44856V7.55017ZM8.63149 16.081L8.99985 16.4823L9.36822 16.081L15.2876 9.63158L16.0568 8.79348H14.9192H11.5V2.32022V1.82022H11H6.99973H6.49973V2.32022V8.79348H3.08049H1.94291L2.71212 9.63158L8.63149 16.081Z"
                stroke={` ${isDownvoted ? "red" : "white"}`}
                strokeOpacity="0.74"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="postcontent-container">
        <div className="post-header">
          <div className="userinfo-post">
            <img
              src={config.base_url + post.user.profileimage}
              alt={post.alt}
            />

            <div className="poster-info">
              {" "}
              <div className="poster-info-child">
                <div className="poster-username">{post.user.username}</div>
                <div className="post-forumlink">
                  &nbsp; - &nbsp;
                  <a className="postlinks" href={`/Forums/${gameforum.name}`}>
                    Forum/{gameforum.name}
                  </a>
                </div>
              </div>
              <div className="post-date">{formattedDate}</div>
            </div>
          </div>
          <div className="post-description-wrapper">
            <div className="post-description">{post.description}</div>
          </div>
        </div>
        <div className="display-carousel">
          <div className="displayfiles-carousel">
            <Carousel
              infiniteLoop
              swipeable={true}
              showStatus={false}
              showThumbs={false}
              emulateTouch={true}
            >
              {post.post_uploads.length > 0 ? (
                post.post_uploads.map((upload, index) => {
                  const fileExtension = upload.file_path
                    .split(".")
                    .pop()
                    .toLowerCase();

                  if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
                    return (
                      <div key={index}>
                        <img
                          src={config.base_url + upload.file_path}
                          alt={`Upload ${index}`}
                        />
                      </div>
                    );
                  } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
                    return (
                      <div key={index}>
                        <video controls>
                          <source
                            src={config.base_url + upload.file_path}
                            type={`video/${fileExtension}`}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  } else {
                    return <p key={index}>Unsupported file type</p>;
                  }
                })
              ) : (
                <p>No uploads available.</p>
              )}
            </Carousel>
          </div>
        </div>
        <div className="post-interactions">
          <Link
            to={`/Forums/${gameforum.name}/${post.id}`}
            className="postlinks"
          >
            <div className="comments-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
              >
                <path
                  d="M0 8.12183C0 3.63452 3.584 0 8.005 0H12.371C16.861 0 20.5 3.69543 20.5 8.25381C20.5 11.2589 18.893 14.0203 16.304 15.4721L8.25 20V16.2538H8.183C3.693 16.3553 0 12.6904 0 8.12183ZM8.005 2.03046C4.688 2.03046 2 4.76142 2 8.12183C2 11.5431 4.77 14.2944 8.138 14.2233L8.489 14.2132H10.25V16.5482L15.337 13.6954C17.288 12.599 18.5 10.5178 18.5 8.25381C18.5 4.81218 15.756 2.03046 12.371 2.03046H8.005Z"
                  fill="white"
                  fillOpacity="0.75"
                />
              </svg>
              <div className="interactions-info">{commentCount} Comment</div>
            </div>
          </Link>
          <div className="share-wrapper" onClick={handleShareClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_181_3597)">
                <path
                  d="M7.99411 15.7599C6.68822 14.5399 5.93881 12.8164 5.93881 11.0293C5.93881 7.46107 8.84234 4.55872 12.4094 4.55872H15.8353L12.7223 1.44578L13.5541 0.614014L18.0882 5.14813L13.5541 9.68225L12.7223 8.85048L15.8353 5.73754H12.4094C9.49058 5.73754 7.11528 8.11284 7.11528 11.0317C7.11528 12.5152 7.71293 13.8893 8.79646 14.9022L7.99411 15.7599ZM18.88 10.6234V18.2352C18.88 18.5587 18.6153 18.8234 18.2918 18.8234H1.82116C1.49763 18.8234 1.23293 18.5587 1.23293 18.2352V10.6175H0.0564575V18.2352C0.0564575 19.2081 0.848222 19.9999 1.82116 19.9999H18.2918C19.2647 19.9999 20.0565 19.2081 20.0565 18.2352V10.6234H18.88Z"
                  fill="white"
                  fillOpacity="0.74"
                />
              </g>
              <defs>
                <clipPath id="clip0_181_3597">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <div className="interactions-info">Share</div>
          </div>
        </div>
        {show && (
          <div className="post-commentslist">
            <div className="post-comment-add border-left">
              <img
                src={
                  userProfile
                    ? config.base_url + userProfile.profileimage ||
                      DefaultProfilePic
                    : DefaultProfilePic
                }
                className="profilepicimage"
                alt="ProfileImage"
              />

              <input
                type="text"
                className="postcomment-input"
                placeholder="Comment.."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleCommentKeyPress}
              />
            </div>
            {comments
              .slice()
              .reverse()
              .map((comment, index) => (
                <div className="border-left" key={index}>
                  <div className="profilepicloadedcomment-wrapper">
                    <div className="profilepicloadedcomment">
                      <img
                        src={
                          comment.user.profileimage
                            ? config.base_url + comment.user.profileimage ||
                              DefaultProfilePic
                            : DefaultProfilePic
                        }
                        className="profilepicimage"
                        alt="ProfileImage"
                      />
                      <div className="comment-span-wrapper">
                        <span className="comment-name-span">
                          {comment.user.username} -{" "}
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                        <span className="comment-span">{comment.comment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
