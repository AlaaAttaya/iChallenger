import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GameCard from "../../components/GameCard";
import config from "../../services/config";
import axios from "axios";
import Loading from "../../components/Loading";
import "./styles.css";
const ForumsPage = () => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearchResultsFocus = () => {
    setInputFocused(true);
  };
  useEffect(() => {
    handleSearchInputChange({ target: { value: searchText } });
  }, []);

  const handleSearchResultsBlur = () => {
    setInputFocused(false);
  };
  const handleSearchInputChange = async (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${config.base_url}/api/guest/getgames`,
        {
          params: { search: searchText },
        }
      );

      if (response.status === 200) {
        setSearchResults(response.data.data);
      } else {
        console.error("Error fetching search results:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="ForumsPage">
      <div className="navcommunity">
        <Link to="/Activity">
          <button>Following Activity</button>
        </Link>
        <Link to="/Forums">
          <button className="thispage">Game Forums</button>
        </Link>
      </div>
      <div className="searchgames-container">
        <div
          className={`searchgamesbar ${isInputFocused ? "focused" : ""}`}
          id="searchgamesbar"
        >
          <svg
            width="25"
            height="34"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="searchgames-iconsvg"
          >
            <path
              d="M13.9589 0C6.24175 0 0 6.09868 0 13.639C0 21.1793 6.24175 27.2779 13.9589 27.2779C16.7142 27.2779 19.2641 26.4882 21.426 25.1469L31.5103 35L35 31.5903L25.044 21.8875C26.8338 19.5935 27.9179 16.751 27.9179 13.639C27.9179 6.09868 21.6761 0 13.9589 0ZM13.9589 3.20917C19.8703 3.20917 24.6334 7.86309 24.6334 13.639C24.6334 19.4148 19.8703 24.0688 13.9589 24.0688C8.04756 24.0688 3.28446 19.4148 3.28446 13.639C3.28446 7.86309 8.04756 3.20917 13.9589 3.20917Z"
              className={`searchgames-icon ${isInputFocused ? "focused" : ""}`}
            />
          </svg>

          <input
            type="text"
            id="searchgames"
            name="searchgames"
            placeholder="Search..."
            className={`searchgamesinput ${isInputFocused ? "focused" : ""}`}
            onFocus={handleSearchResultsFocus}
            onBlur={handleSearchResultsBlur}
            value={searchText}
            onChange={handleSearchInputChange}
            required
          />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : searchResults.length > 0 ? (
        <div className="searchgames-results">
          {searchResults.map((game) => (
            <Link key={game.id} to={`/Forums/${game.name}`}>
              <GameCard
                key={game.id}
                title={game.name}
                image={config.base_url + game.gameimage}
                alt={game.name}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>No results found</h3>
        </div>
      )}
    </div>
  );
};
export default ForumsPage;
