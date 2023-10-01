import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config from "../../services/config";
import axios from "axios";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import "./styles.css";

const FollowingActivityPage = ({ userProfile }) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingPosts, setFollowingPosts] = useState([]);

  const handleSearchResultsFocus = () => {
    setInputFocused(true);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/Login";
    } else {
      scrollToTop();
      fetchFollowingPosts();
    }
  }, []);

  const fetchFollowingPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.base_url}/api/user/getfollowingposts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setFollowingPosts(response.data.data);
      } else {
        console.error("Error fetching following posts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching following posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResultsBlur = () => {
    setInputFocused(false);
  };

  const handleSearchInputChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    const filteredPosts = followingPosts.filter((post) =>
      post.description.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(filteredPosts);
  };

  return (
    <div className="FollowingActivityPage">
      <div>
        <div className="navcommunity-wrapper">
          <div className="navcommunityfollowing">
            <Link to="/Forums" className="gameforumlink">
              <button>Game Forums</button>
            </Link>
            <Link to="/Activity">
              <button className="thispage">Following Activity</button>
            </Link>
          </div>
          <div className="followingnavbarsearch-wrapper">
            <div className="followingnavbarsearch">
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
                className="inputtext-search-following"
                placeholder="Search.."
                value={searchText}
                onChange={handleSearchInputChange}
                onFocus={handleSearchResultsFocus}
                onBlur={handleSearchResultsBlur}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="post-list">
        {isLoading ? (
          <Loading />
        ) : searchResults.length > 0 || followingPosts.length > 0 ? (
          <>
            {searchResults.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                gameforum={post.game_forum}
                userProfile={userProfile}
              />
            ))}
            {followingPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                gameforum={post.game_forum}
                userProfile={userProfile}
              />
            ))}
          </>
        ) : (
          <h3>No posts found.</h3>
        )}
      </div>
    </div>
  );
};

export default FollowingActivityPage;
