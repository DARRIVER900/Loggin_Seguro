import { useCallback, useMemo, useState } from "react";
import { PlayerContext } from "./PlayerContext.js";
import { useAuth } from "../hooks/useAuth";
import { addHistoryItem } from "../services/musicLibraryService";

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();
  const uid = user?.uid;
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playerError, setPlayerError] = useState("");

  const playTrack = useCallback(async (track) => {
    setPlayerError("");
    setCurrentTrack(track);

    if (uid) {
      try {
        await addHistoryItem(uid, track);
      } catch (historyError) {
        console.error("Error guardando historial:", historyError);
      }
    }
  }, [uid]);

  const clearTrack = useCallback(() => {
    setCurrentTrack(null);
    setPlayerError("");
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      playerError,
      playTrack,
      clearTrack,
      setPlayerError,
    }),
    [clearTrack, currentTrack, playerError, playTrack],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
