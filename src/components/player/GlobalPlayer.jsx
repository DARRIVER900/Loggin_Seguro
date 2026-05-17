import { usePlayer } from "../../hooks/usePlayer";

const GlobalPlayer = () => {
  const { currentTrack, playerError, clearTrack, setPlayerError } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <section className="global-player" aria-label="Music player" aria-live="polite">
      <div>
        <p><strong>Now playing:</strong> {currentTrack.title}</p>
        <p>{currentTrack.artistName}</p>
      </div>
      <audio
        aria-label={`Audio player for ${currentTrack.title} by ${currentTrack.artistName}`}
        controls
        autoPlay
        src={currentTrack.streamUrl}
        onError={() => setPlayerError("No se pudo reproducir esta canción.")}
      >
        Your browser does not support audio playback.
      </audio>
      {playerError && <p role="alert">{playerError}</p>}
      <button
        type="button"
        className="loggin-button logout-button"
        onClick={clearTrack}
        aria-label="Close music player"
      >
        Close
      </button>
    </section>
  );
};

export default GlobalPlayer;
