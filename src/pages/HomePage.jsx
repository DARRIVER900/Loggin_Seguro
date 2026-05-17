import Home from "../Home";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user, userRole } = useAuth();

  return <Home user={user} userRole={userRole} />;
};

export default HomePage;
