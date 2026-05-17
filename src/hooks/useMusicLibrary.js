import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  addFavorite,
  addTrackToPlaylist,
  createPlaylist,
  getFavorites,
  getHistory,
  getPlaylists,
  removeFavorite,
} from "../services/musicLibraryService";

export const useMusicLibrary = () => {
  const { user } = useAuth();
  const uid = user?.uid;
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.audiusTrackId)),
    [favorites],
  );

  const loadLibrary = useCallback(async () => {
    if (!uid) {
      setFavorites([]);
      setPlaylists([]);
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [favoriteDocs, playlistDocs, historyDocs] = await Promise.all([
        getFavorites(uid),
        getPlaylists(uid),
        getHistory(uid),
      ]);

      setFavorites(favoriteDocs);
      setPlaylists(playlistDocs);
      setHistory(historyDocs);
    } catch (libraryError) {
      console.error("Error cargando biblioteca musical:", libraryError);
      setError("No se pudo cargar tu biblioteca musical.");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const toggleFavorite = async (track) => {
    if (!uid) {
      setError("Debes iniciar sesión para guardar favoritos.");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      if (favoriteIds.has(track.id)) {
        await removeFavorite(uid, track.id);
      } else {
        await addFavorite(uid, track);
      }

      await loadLibrary();
    } catch (libraryError) {
      console.error("Error actualizando favorito:", libraryError);
      setError(libraryError.message || "No se pudo actualizar el favorito.");
    } finally {
      setActionLoading(false);
    }
  };

  const createUserPlaylist = async (name) => {
    if (!uid) {
      setError("Debes iniciar sesión para crear playlists.");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await createPlaylist(uid, name);
      await loadLibrary();
    } catch (libraryError) {
      console.error("Error creando playlist:", libraryError);
      setError(libraryError.message || "No se pudo crear la playlist.");
    } finally {
      setActionLoading(false);
    }
  };

  const addTrackToUserPlaylist = async (playlistId, track) => {
    if (!uid) {
      setError("Debes iniciar sesión para agregar canciones.");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await addTrackToPlaylist(uid, playlistId, track);
      await loadLibrary();
    } catch (libraryError) {
      console.error("Error agregando canción a playlist:", libraryError);
      setError(libraryError.message || "No se pudo agregar la canción.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialLibrary = async () => {
      await Promise.resolve();

      if (!uid) {
        if (isActive) {
          setFavorites([]);
          setPlaylists([]);
          setHistory([]);
          setLoading(false);
        }
        return;
      }

      try {
        const [favoriteDocs, playlistDocs, historyDocs] = await Promise.all([
          getFavorites(uid),
          getPlaylists(uid),
          getHistory(uid),
        ]);

        if (isActive) {
          setFavorites(favoriteDocs);
          setPlaylists(playlistDocs);
          setHistory(historyDocs);
          setError("");
        }
      } catch (libraryError) {
        console.error("Error cargando biblioteca musical:", libraryError);

        if (isActive) {
          setError("No se pudo cargar tu biblioteca musical.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadInitialLibrary();

    return () => {
      isActive = false;
    };
  }, [uid]);

  return {
    favorites,
    favoriteIds,
    playlists,
    history,
    loading,
    actionLoading,
    error,
    loadLibrary,
    toggleFavorite,
    createUserPlaylist,
    addTrackToUserPlaylist,
  };
};
