import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/credenciales";
import { createTrackSnapshot, validatePlaylistName } from "../utils/musicValidation";
import { isValidAudiusId, sanitizePlaylistName } from "../utils/security";

const userDoc = (uid) => doc(db, "usuarios", uid);
const userCollection = (uid, collectionName) => collection(userDoc(uid), collectionName);

const requireUid = (uid) => {
  if (!uid) {
    throw new Error("Debes iniciar sesión para guardar tu música.");
  }
};

export const getFavorites = async (uid) => {
  requireUid(uid);

  const favoritesQuery = query(
    userCollection(uid, "favorites"),
    orderBy("addedAt", "desc"),
  );
  const snapshot = await getDocs(favoritesQuery);

  return snapshot.docs.map((favoriteDoc) => ({
    id: favoriteDoc.id,
    ...favoriteDoc.data(),
  }));
};

export const addFavorite = async (uid, track) => {
  requireUid(uid);
  const trackSnapshot = createTrackSnapshot(track);

  await setDoc(doc(userCollection(uid, "favorites"), trackSnapshot.audiusTrackId), {
    ...trackSnapshot,
    ownerUid: uid,
    addedAt: serverTimestamp(),
  });
};

export const removeFavorite = async (uid, audiusTrackId) => {
  requireUid(uid);

  if (!isValidAudiusId(audiusTrackId)) {
    throw new Error("Identificador de favorito inválido.");
  }

  await deleteDoc(doc(userCollection(uid, "favorites"), audiusTrackId));
};

export const getPlaylists = async (uid) => {
  requireUid(uid);

  const playlistsQuery = query(
    userCollection(uid, "playlists"),
    orderBy("updatedAt", "desc"),
  );
  const snapshot = await getDocs(playlistsQuery);

  return snapshot.docs.map((playlistDoc) => ({
    id: playlistDoc.id,
    ...playlistDoc.data(),
  }));
};

export const createPlaylist = async (uid, name) => {
  requireUid(uid);

  const validationError = validatePlaylistName(name);

  if (validationError) {
    throw new Error(validationError);
  }

  const cleanName = sanitizePlaylistName(name);
  const playlistRef = await addDoc(userCollection(uid, "playlists"), {
    name: cleanName,
    ownerUid: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return playlistRef.id;
};

export const addTrackToPlaylist = async (uid, playlistId, track) => {
  requireUid(uid);

  if (!playlistId) {
    throw new Error("Selecciona una playlist primero.");
  }

  const trackSnapshot = createTrackSnapshot(track);
  const playlistRef = doc(userCollection(uid, "playlists"), playlistId);

  await setDoc(doc(collection(playlistRef, "tracks"), trackSnapshot.audiusTrackId), {
    ...trackSnapshot,
    ownerUid: uid,
    addedAt: serverTimestamp(),
  });

  await setDoc(playlistRef, { updatedAt: serverTimestamp() }, { merge: true });
};

export const getHistory = async (uid, historyLimit = 20) => {
  requireUid(uid);

  const historyQuery = query(
    userCollection(uid, "history"),
    orderBy("playedAt", "desc"),
    limit(historyLimit),
  );
  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((historyDoc) => ({
    id: historyDoc.id,
    ...historyDoc.data(),
  }));
};

export const addHistoryItem = async (uid, track) => {
  requireUid(uid);
  const trackSnapshot = createTrackSnapshot(track);

  await addDoc(userCollection(uid, "history"), {
    ...trackSnapshot,
    ownerUid: uid,
    playedAt: serverTimestamp(),
  });
};
