import ArtistList from "../components/music/ArtistList";
import MusicLibraryPanel from "../components/music/MusicLibraryPanel";
import MusicSearch from "../components/music/MusicSearch";
import TrackList from "../components/music/TrackList";
import { useAudiusMusic } from "../hooks/useAudiusMusic";
import { useMusicLibrary } from "../hooks/useMusicLibrary";

const MusicPage = () => {
  const {
    tracks,
    artists,
    query,
    loading,
    error,
    loadTrending,
    searchMusic,
  } = useAudiusMusic();
  const library = useMusicLibrary();

  return (
    <div className="music-page">
      <section className="music-hero">
        <div>
          <p className="eyebrow">Audius streaming</p>
          <h1 className="home-title">Discover your next track</h1>
          <p className="home-subtitle">
            {query ? `Results for "${query}"` : "Trending songs from Audius"}
          </p>
        </div>

        <MusicSearch onSearch={searchMusic} onReset={loadTrending} loading={loading} />
      </section>

      <div className="music-content-grid">
        <section className="music-main-panel" aria-labelledby="music-results-title">
        <h2 id="music-results-title" className="sr-only">Music results</h2>
        {loading && <p role="status">Loading music from Audius...</p>}
        {error && <p role="alert">{error}</p>}
        {library.error && <p role="alert">{library.error}</p>}

        {!loading && !error && (
          <>
            <ArtistList artists={artists} />
            <TrackList
              tracks={tracks}
              favoriteIds={library.favoriteIds}
              playlists={library.playlists}
              actionLoading={library.actionLoading}
              onToggleFavorite={library.toggleFavorite}
              onAddToPlaylist={library.addTrackToUserPlaylist}
            />
          </>
        )}
        </section>

        <aside className="music-sidebar" aria-label="User music library">
        <MusicLibraryPanel
          favorites={library.favorites}
          playlists={library.playlists}
          history={library.history}
          loading={library.loading}
          actionLoading={library.actionLoading}
          error={library.error}
          onCreatePlaylist={library.createUserPlaylist}
        />
        </aside>
      </div>
    </div>
  );
};

export default MusicPage;
