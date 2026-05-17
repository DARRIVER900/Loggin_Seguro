import { formatDuration } from "../../utils/formatDuration";

const AdminCatalogPreview = ({ tracks, loading, error }) => {
  return (
    <section className="admin-panel" aria-labelledby="admin-catalog-title">
      <div className="section-heading">
        <p className="eyebrow">Audius catalog</p>
        <h2 id="admin-catalog-title">Administrative catalog view</h2>
      </div>

      {loading && <p role="status">Loading catalog...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="admin-catalog-list" aria-live="polite">
          {tracks.map((track) => (
            <article key={track.id} className="admin-catalog-row">
              {track.artwork && <img src={track.artwork} alt={track.title} />}
              <div>
                <strong>{track.title}</strong>
                <p>{track.artistName}</p>
              </div>
              <span>{formatDuration(track.duration)}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminCatalogPreview;
