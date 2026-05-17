import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { PlayerProvider } from "../contexts/PlayerContext.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <AppRoutes />
      </PlayerProvider>
    </BrowserRouter>
  );
};

export default App;
