import { useCallback, useEffect, useRef, useState } from "react";
import {
  getTrendingTracks,
  searchArtists,
  searchTracks,
} from "../services/audiusService";
import { sanitizeSearchQuery } from "../utils/security";

export const useAudiusMusic = () => {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const loadTrending = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError("");
    setQuery("");
    setArtists([]);

    try {
      const trendingTracks = await getTrendingTracks({ limit: 10 });

      if (requestIdRef.current === requestId) {
        setTracks(trendingTracks);
      }
    } catch (audiusError) {
      console.error("Error cargando tendencias de Audius:", audiusError);

      if (requestIdRef.current === requestId) {
        setError("No se pudieron cargar las canciones en tendencia.");
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  const searchMusic = useCallback(async (searchQuery) => {
    const cleanQuery = sanitizeSearchQuery(searchQuery);

    if (!cleanQuery) {
      await loadTrending();
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError("");
    setQuery(cleanQuery);

    try {
      const [trackResults, artistResults] = await Promise.all([
        searchTracks(cleanQuery, { limit: 10 }),
        searchArtists(cleanQuery, { limit: 5 }),
      ]);

      if (requestIdRef.current === requestId) {
        setTracks(trackResults);
        setArtists(artistResults);
      }
    } catch (audiusError) {
      console.error("Error buscando en Audius:", audiusError);

      if (requestIdRef.current === requestId) {
        setError("No se pudo completar la búsqueda musical.");
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [loadTrending]);

  useEffect(() => {
    let isActive = true;

    const loadInitialTrending = async () => {
      try {
        const trendingTracks = await getTrendingTracks({ limit: 10 });

        if (isActive) {
          setTracks(trendingTracks);
        }
      } catch (audiusError) {
        console.error("Error cargando tendencias de Audius:", audiusError);

        if (isActive) {
          setError("No se pudieron cargar las canciones en tendencia.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadInitialTrending();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    tracks,
    artists,
    query,
    loading,
    error,
    loadTrending,
    searchMusic,
  };
};
