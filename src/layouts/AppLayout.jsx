import { Outlet } from "react-router-dom";
import AppNavigation from "../components/navigation/AppNavigation";
import GlobalPlayer from "../components/player/GlobalPlayer";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <AppNavigation />
      <main className="app-main">
        {children || <Outlet />}
      </main>
      <GlobalPlayer />
    </div>
  );
};

export default AppLayout;
