import { Link } from 'react-router-dom';
import { auth } from './firebase/credenciales';
import { signOut } from 'firebase/auth';

const Home = ({ user, userRole }) => {
  const isAdmin = userRole === "admin";

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">{isAdmin ? "Admin console" : "Music streaming"}</p>
          <h1 className="home-title">
            Hi, <span className="role-highlight">{isAdmin ? "Administrator" : "Music lover"}</span>
          </h1>
          <p className="home-subtitle">{user.email}</p>
        </div>

        <div className="dashboard-actions">
          <Link to={isAdmin ? "/admin" : "/music"} className="loggin-button">
            {isAdmin ? "Open Admin Dashboard" : "Explore Music"}
          </Link>
          <button className="loggin-button logout-button" onClick={() => signOut(auth)}>
            Close session
          </button>
        </div>
      </section>

      <section className="feature-grid">
        {(isAdmin
          ? [
              ["Catalog visibility", "Review trending content coming from Audius."],
              ["Featured playlists", "Prepare categories and editorial sections."],
              ["System overview", "Monitor users, roles and music activity."],
            ]
          : [
              ["Search", "Find songs and artists from Audius."],
              ["Playlists", "Organize music into your own collections."],
              ["History", "Keep track of your recent listening activity."],
            ]
        ).map(([title, description]) => (
          <article key={title} className="feature-card">
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Home;