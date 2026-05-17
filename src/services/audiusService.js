import {
  isValidAudiusId,
  sanitizeSearchQuery,
  sanitizeText,
  sanitizeUrl,
  toSafeNumber,
} from "../utils/security";

const DEFAULT_HOSTS = [
  "https://discoveryprovider.audius.co",
  "https://api.audius.co",
];

const APP_NAME = import.meta.env.VITE_AUDIUS_APP_NAME || "mi-loggin";
const CONFIGURED_HOST = import.meta.env.VITE_AUDIUS_API_HOST;
const API_HOSTS = CONFIGURED_HOST ? [CONFIGURED_HOST] : DEFAULT_HOSTS;
const REQUEST_TIMEOUT_MS = 8000;

let activeHost = API_HOSTS[0];

const buildUrl = (host, path, params = {}) => {
  const url = new URL(`/v1${path}`, host);

  url.searchParams.set("app_name", APP_NAME);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const requestAudius = async (path, params) => {
  const hosts = [activeHost, ...API_HOSTS.filter((host) => host !== activeHost)];
  let lastError;

  for (const host of hosts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(buildUrl(host, path, params), {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Audius API respondió con estado ${response.status}`);
      }

      activeHost = host;
      return response.json();
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("No se pudo conectar con Audius API");
};

const pickArtwork = (artwork, fallbackArtwork) => {
  const source = artwork || fallbackArtwork;

  return sanitizeUrl(
    source?.["1000x1000"] ||
    source?.["480x480"] ||
    source?.["150x150"] ||
    "",
  );
};

export const getTrackStreamUrl = (trackId) => {
  if (!isValidAudiusId(trackId)) {
    return "";
  }

  return buildUrl(activeHost, `/tracks/${encodeURIComponent(trackId)}/stream`);
};

export const mapAudiusTrack = (track) => ({
  id: isValidAudiusId(track?.id) ? String(track.id) : "",
  title: sanitizeText(track?.title || "Untitled", 120),
  description: sanitizeText(track?.description || "", 500),
  duration: toSafeNumber(track?.duration),
  genre: sanitizeText(track?.genre || "", 60),
  mood: sanitizeText(track?.mood || "", 60),
  playCount: toSafeNumber(track?.play_count),
  favoriteCount: toSafeNumber(track?.favorite_count),
  repostCount: toSafeNumber(track?.repost_count),
  releaseDate: sanitizeText(track?.release_date || "", 40),
  artistName: sanitizeText(track?.user?.name || "Unknown artist", 120),
  artistHandle: sanitizeText(track?.user?.handle || "", 80),
  artwork: pickArtwork(track?.artwork, track?.user?.profile_picture),
  streamUrl: getTrackStreamUrl(track?.id),
});

export const mapAudiusArtist = (artist) => ({
  id: isValidAudiusId(artist?.id) ? String(artist.id) : "",
  name: sanitizeText(artist?.name || "Unknown artist", 120),
  handle: sanitizeText(artist?.handle || "", 80),
  artwork: pickArtwork(artist?.profile_picture),
});

const onlyValidTracks = (tracks) => tracks.map(mapAudiusTrack).filter((track) => track.id);
const onlyValidArtists = (artists) => artists.map(mapAudiusArtist).filter((artist) => artist.id);

export const getTrendingTracks = async ({ limit = 10 } = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);
  const response = await requestAudius("/tracks/trending", { limit: safeLimit });
  return onlyValidTracks(response.data || []);
};

export const getTrackDetails = async (trackId) => {
  if (!isValidAudiusId(trackId)) {
    throw new Error("Identificador de canción inválido.");
  }

  const response = await requestAudius(`/tracks/${encodeURIComponent(trackId)}`);
  return mapAudiusTrack(response.data);
};

export const searchTracks = async (query, { limit = 10 } = {}) => {
  const cleanQuery = sanitizeSearchQuery(query);

  if (!cleanQuery) {
    return [];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);
  const response = await requestAudius("/tracks/search", {
    query: cleanQuery,
    limit: safeLimit,
  });

  return onlyValidTracks(response.data || []);
};

export const searchArtists = async (query, { limit = 5 } = {}) => {
  const cleanQuery = sanitizeSearchQuery(query);

  if (!cleanQuery) {
    return [];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 10);
  const response = await requestAudius("/users/search", {
    query: cleanQuery,
    limit: safeLimit,
  });

  return onlyValidArtists(response.data || []);
};
