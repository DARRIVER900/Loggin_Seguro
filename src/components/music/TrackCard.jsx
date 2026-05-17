import { Link } from "react-router-dom";
import { usePlayer } from "../../hooks/usePlayer";
import { formatDuration } from "../../utils/formatDuration";
import TrackActions from "./TrackActions";

const TrackCard = ({
  track,
  favoriteIds,
  playlists,
  actionLoading,
  onToggleFavorite,
  onAddToPlaylist,
}) => {
  const { currentTrack, playTrack } = usePlayer();
  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div className="track-card">
      {track.artwork && (
        <img src={track.artwork} alt={track.title} className="track-artwork" />
      )}
      <div className="track-info">
        <p><strong>{track.title}</strong></p>
        <p>Artist: {track.artistName}</p>
        {track.artistHandle && <p>@{track.artistHandle}</p>}
        <p><small>Duration: {formatDuration(track.duration)}</small></p>
      </div>
      <div className="track-card-actions">
        <button type="button" className="loggin-button" onClick={() => playTrack(track)}>
          {isCurrentTrack ? "Playing" : "Play"}
        </button>
        <Link to={`/music/${track.id}`} className="loggin-button logout-button">
          Details
        </Link>
        <TrackActions
          track={track}
          favoriteIds={favoriteIds}
          playlists={playlists}
          actionLoading={actionLoading}
          onToggleFavorite={onToggleFavorite}
          onAddToPlaylist={onAddToPlaylist}
        />
      </div>
    </div>
  );
};

export default TrackCard;
