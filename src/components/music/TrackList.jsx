import TrackCard from "./TrackCard";

const TrackList = ({
  tracks,
  favoriteIds,
  playlists,
  actionLoading,
  onToggleFavorite,
  onAddToPlaylist,
}) => {
  if (!tracks.length) {
    return <p>There are no songs to show.</p>;
  }

  return (
    <div className="track-grid">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          favoriteIds={favoriteIds}
          playlists={playlists}
          actionLoading={actionLoading}
          onToggleFavorite={onToggleFavorite}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
    </div>
  );
};

export default TrackList;
