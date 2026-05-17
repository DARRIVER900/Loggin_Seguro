import { useState } from "react";

const TrackActions = ({
  track,
  favoriteIds,
  playlists,
  actionLoading,
  onToggleFavorite,
  onAddToPlaylist,
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const isFavorite = favoriteIds.has(track.id);

  const handleAddToPlaylist = () => {
    onAddToPlaylist(selectedPlaylist, track);
  };

  return (
    <div className="track-actions">
      <button
        type="button"
        className="loggin-button"
        disabled={actionLoading}
        onClick={() => onToggleFavorite(track)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
      >
        {isFavorite ? "Remove favorite" : "Add favorite"}
      </button>

      {playlists.length > 0 && (
        <div className="playlist-actions">
          <select
            aria-label={`Select playlist for ${track.title}`}
            className="input-field playlist-select"
            value={selectedPlaylist}
            onChange={(event) => setSelectedPlaylist(event.target.value)}
          >
            <option value="">Select playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="loggin-button logout-button"
            disabled={actionLoading || !selectedPlaylist}
            onClick={handleAddToPlaylist}
            aria-label={`Add ${track.title} to selected playlist`}
          >
            Add to playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackActions;
