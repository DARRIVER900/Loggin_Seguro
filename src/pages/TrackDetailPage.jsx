import { Link, useParams } from "react-router-dom";
import TrackActions from "../components/music/TrackActions";
import { useAudiusTrack } from "../hooks/useAudiusTrack";
import { useMusicLibrary } from "../hooks/useMusicLibrary";
import { usePlayer } from "../hooks/usePlayer";
import { formatDuration } from "../utils/formatDuration";

const TrackDetailPage = () => {
  const { trackId } = useParams();
  const { track, loading, error } = useAudiusTrack(trackId);
  const { currentTrack, playTrack } = usePlayer();
  const library = useMusicLibrary();
  const isCurrentTrack = currentTrack?.id === track?.id;

  return (
    <div className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">Track profile</p>
          <h1 className="home-title">Song details</h1>
        </div>
        <Link to="/music" className="loggin-button logout-button">
          Back to music
        </Link>
      </section>

        {loading && <p role="status">Loading song...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && track && (
          <section className="track-detail-card">
            {track.artwork && (
              <img src={track.artwork} alt={track.title} className="track-detail-artwork" />
            )}
            <div className="track-detail-content">
              <p className="eyebrow">{track.artistName}</p>
              <h2>{track.title}</h2>
              {track.artistHandle && <p>@{track.artistHandle}</p>}
              <p><small>Duration: {formatDuration(track.duration)}</small></p>
              {track.genre && <p>Genre: {track.genre}</p>}
              {track.mood && <p>Mood: {track.mood}</p>}
              {track.releaseDate && <p>Release: {track.releaseDate}</p>}
              <p><small>Plays: {track.playCount}</small></p>
              {track.description && <p>{track.description}</p>}

              <button
                type="button"
                className="loggin-button"
                onClick={() => playTrack(track)}
                aria-label={`Play ${track.title} by ${track.artistName}`}
              >
                {isCurrentTrack ? "Playing" : "Play song"}
              </button>
              <TrackActions
                track={track}
                favoriteIds={library.favoriteIds}
                playlists={library.playlists}
                actionLoading={library.actionLoading}
                onToggleFavorite={library.toggleFavorite}
                onAddToPlaylist={library.addTrackToUserPlaylist}
              />
            </div>
          </section>
        )}
    </div>
  );
};

export default TrackDetailPage;
