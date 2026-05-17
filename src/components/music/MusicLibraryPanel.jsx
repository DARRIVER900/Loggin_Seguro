import { useState } from "react";
import { sanitizePlaylistName } from "../../utils/security";

const MusicLibraryPanel = ({
  favorites,
  playlists,
  history,
  loading,
  actionLoading,
  error,
  onCreatePlaylist,
}) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanName = sanitizePlaylistName(playlistName);

    if (!cleanName) {
      return;
    }

    await onCreatePlaylist(cleanName);
    setPlaylistName("");
  };

  return (
    <section className="library-panel" aria-labelledby="library-title">
      <div className="section-heading">
        <p className="eyebrow">Your library</p>
        <h2 id="library-title">Favorites, playlists and history</h2>
      </div>

      {loading && <p role="status">Loading your library...</p>}
      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="playlist-form" aria-label="Create playlist">
        <label htmlFor="playlist-name" className="sr-only">
          New playlist name
        </label>
        <input
          id="playlist-name"
          type="text"
          className="input-field"
          placeholder="New playlist name..."
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value.slice(0, 60))}
          minLength={3}
          maxLength={60}
          required
        />
        <button
          type="submit"
          className="loggin-button"
          disabled={actionLoading || sanitizePlaylistName(playlistName).length < 3}
          aria-busy={actionLoading}
        >
          {actionLoading ? "Saving..." : "Create playlist"}
        </button>
      </form>

      <div className="library-list" aria-live="polite">
        <div className="library-summary-card">
          <p><strong>Favorites:</strong> {favorites.length}</p>
          <p><strong>Playlists:</strong> {playlists.length}</p>
          <p><strong>Recent plays:</strong> {history.length}</p>
        </div>

        {playlists.map((playlist) => (
          <div key={playlist.id} className="library-item">
            <p><strong>{playlist.name}</strong></p>
            <p><small>Playlist saved in Firestore</small></p>
          </div>
        ))}

        {history.slice(0, 5).map((item) => (
          <div key={item.id} className="library-item">
            <p><strong>{item.title}</strong></p>
            <p>{item.artistName}</p>
            <p><small>Recently played</small></p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MusicLibraryPanel;
