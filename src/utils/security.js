const UNSAFE_TEXT_CHARS = /[<>]/g;
const SEARCH_QUERY_PATTERN = /^[\p{L}\p{N}\s.'’&+\-_,!?()]+$/u;
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

const stripControlCharacters = (value) => {
  return [...value].filter((char) => {
    const code = char.charCodeAt(0);
    return code > 31 && (code < 127 || code > 159);
  }).join("");
};

export const sanitizeText = (value, maxLength = 120) => {
  return stripControlCharacters(String(value ?? ""))
    .replace(UNSAFE_TEXT_CHARS, "")
    .trim()
    .slice(0, maxLength);
};

export const sanitizeSearchQuery = (value) => {
  const query = sanitizeText(value, 80);

  if (!query || !SEARCH_QUERY_PATTERN.test(query)) {
    return "";
  }

  return query;
};

export const sanitizePlaylistName = (value) => sanitizeText(value, 60);

export const isValidAudiusId = (value) => ID_PATTERN.test(String(value ?? ""));

export const sanitizeUrl = (value) => {
  const rawUrl = String(value ?? "").trim();

  if (!rawUrl) {
    return "";
  }

  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
};

export const toSafeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};
