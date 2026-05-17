import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext.js";

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer debe usarse dentro de PlayerProvider");
  }

  return context;
};
