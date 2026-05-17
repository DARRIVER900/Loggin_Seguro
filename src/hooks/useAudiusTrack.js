import { useEffect, useState } from "react";
import { getTrackDetails } from "../services/audiusService";

export const useAudiusTrack = (trackId) => {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadTrack = async () => {
      try {
        const trackDetails = await getTrackDetails(trackId);

        if (isActive) {
          setTrack(trackDetails);
          setError("");
        }
      } catch (audiusError) {
        console.error("Error cargando detalle de Audius:", audiusError);

        if (isActive) {
          setError("No se pudo cargar el detalle de la canción.");
          setTrack(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadTrack();

    return () => {
      isActive = false;
    };
  }, [trackId]);

  return { track, loading, error };
};
