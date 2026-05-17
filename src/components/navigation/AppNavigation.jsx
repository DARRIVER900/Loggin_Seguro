import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AppNavigation = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  return (
    <header className="app-navigation">
      <Link to="/" className="app-brand" aria-label="Go to dashboard">
        Mi Loggin Music
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/music">Music</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
      </nav>
    </header>
  );
};

export default AppNavigation;
