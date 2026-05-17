import { useState } from "react";
import { sanitizeSearchQuery } from "../../utils/security";

const MusicSearch = ({ onSearch, onReset, loading }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanValue = sanitizeSearchQuery(searchValue);

    if (!cleanValue) {
      return;
    }

    onSearch(cleanValue);
  };

  const handleReset = () => {
    setSearchValue("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="music-search" aria-label="Search Audius music">
      <label htmlFor="music-search-input" className="sr-only">
        Search songs or artists on Audius
      </label>
      <input
        id="music-search-input"
        type="text"
        className="input-field"
        placeholder="Search songs or artists on Audius..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value.slice(0, 80))}
        aria-describedby="music-search-help"
        maxLength={80}
        required
      />
      <span id="music-search-help" className="sr-only">
        Type a song or artist name and press Search music.
      </span>
      <button
        type="submit"
        className="loggin-button"
        disabled={loading || !sanitizeSearchQuery(searchValue)}
        aria-busy={loading}
      >
        {loading ? "Searching..." : "Search music"}
      </button>
      <button
        type="button"
        className="loggin-button logout-button"
        onClick={handleReset}
        aria-label="Show trending songs"
      >
        Trending
      </button>
    </form>
  );
};

export default MusicSearch;
