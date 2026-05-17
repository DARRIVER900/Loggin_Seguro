import {
  isValidAudiusId,
  sanitizePlaylistName,
  sanitizeText,
  sanitizeUrl,
  toSafeNumber,
} from "./security";

export const validatePlaylistName = (name) => {
  const cleanName = sanitizePlaylistName(name);

  if (cleanName.length < 3) {
    return "Playlist name must have at least 3 characters.";
  }

  if (cleanName.length > 60) {
    return "Playlist name cannot exceed 60 characters.";
  }

  return "";
};

export const createTrackSnapshot = (track) => {
  if (!isValidAudiusId(track?.id) || !track?.title || !track?.artistName) {
    throw new Error("La canción no tiene la información mínima requerida.");
  }

  return {
    audiusTrackId: String(track.id),
    title: sanitizeText(track.title, 120),
    artistName: sanitizeText(track.artistName, 120),
    artistHandle: sanitizeText(track.artistHandle || "", 80),
    artwork: sanitizeUrl(track.artwork || ""),
    duration: toSafeNumber(track.duration),
    streamUrl: sanitizeUrl(track.streamUrl || ""),
  };
};
