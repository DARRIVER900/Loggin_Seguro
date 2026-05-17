const AdminStats = ({ tracks, artists, playlists }) => {
  const stats = [
    { label: "Trending tracks", value: tracks.length },
    { label: "Artists discovered", value: artists.length },
    { label: "Featured categories", value: playlists.length },
  ];

  return (
    <section className="admin-stats-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="admin-stat-card">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default AdminStats;
