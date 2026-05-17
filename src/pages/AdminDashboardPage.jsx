import { Link } from "react-router-dom";
import AdminCatalogPreview from "../components/admin/AdminCatalogPreview";
import AdminCategoryManager from "../components/admin/AdminCategoryManager";
import AdminStats from "../components/admin/AdminStats";
import { useAudiusMusic } from "../hooks/useAudiusMusic";

const AdminDashboardPage = () => {
  const { tracks, artists, loading, error } = useAudiusMusic();

  return (
    <div className="admin-dashboard-page">
      <section className="dashboard-hero admin-hero">
        <div>
          <p className="eyebrow">Administrator</p>
          <h1 className="home-title">Music Platform Console</h1>
          <p className="home-subtitle">
            Manage the music experience, editorial categories and catalog visibility.
          </p>
        </div>

        <nav className="admin-nav" aria-label="Administrative navigation">
          <Link to="/admin" className="nav-pill">Dashboard</Link>
          <Link to="/music" className="nav-pill">User Music View</Link>
          <Link to="/" className="nav-pill">Home</Link>
        </nav>
      </section>

      <AdminStats tracks={tracks} artists={artists} playlists={["Trending", "Discover", "Editorial"]} />

      <div className="admin-grid">
        <AdminCategoryManager />
        <AdminCatalogPreview tracks={tracks} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
