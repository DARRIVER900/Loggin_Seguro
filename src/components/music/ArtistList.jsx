const ArtistList = ({ artists }) => {
  if (!artists.length) {
    return null;
  }

  return (
    <div className="artist-strip">
      <h2>Artists</h2>
      <div className="artist-row">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-card">
            {artist.artwork && (
              <img src={artist.artwork} alt={artist.name} />
            )}
            <p><strong>{artist.name}</strong></p>
            {artist.handle && <p>@{artist.handle}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistList;
