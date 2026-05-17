const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const COOLDOWN_MS = 60 * 1000;
const STORAGE_PREFIX = "mi-loggin:login-rate-limit:";

const normalizeIdentifier = (identifier) => {
  return String(identifier || "anonymous").trim().toLowerCase();
};

const getStorageKey = (identifier) => {
  return `${STORAGE_PREFIX}${normalizeIdentifier(identifier)}`;
};

const readEntry = (identifier) => {
  try {
    const rawEntry = window.localStorage.getItem(getStorageKey(identifier));
    return rawEntry ? JSON.parse(rawEntry) : { attempts: [], cooldownUntil: 0 };
  } catch {
    return { attempts: [], cooldownUntil: 0 };
  }
};

const writeEntry = (identifier, entry) => {
  try {
    window.localStorage.setItem(getStorageKey(identifier), JSON.stringify(entry));
  } catch {
    // If storage is unavailable, Firebase Auth still handles server-side throttling.
  }
};

const pruneAttempts = (attempts, now = Date.now()) => {
  return attempts.filter((timestamp) => now - timestamp < ATTEMPT_WINDOW_MS);
};

export const getLoginRateLimitStatus = (identifier) => {
  const now = Date.now();
  const entry = readEntry(identifier);
  const attempts = pruneAttempts(entry.attempts || [], now);
  const cooldownUntil = Number(entry.cooldownUntil || 0);
  const remainingMs = Math.max(cooldownUntil - now, 0);

  if (remainingMs > 0) {
    return {
      blocked: true,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      attemptsRemaining: 0,
    };
  }

  return {
    blocked: false,
    remainingSeconds: 0,
    attemptsRemaining: Math.max(MAX_FAILED_ATTEMPTS - attempts.length, 0),
  };
};

export const recordLoginFailure = (identifier) => {
  const now = Date.now();
  const entry = readEntry(identifier);
  const attempts = [...pruneAttempts(entry.attempts || [], now), now];
  const isBlocked = attempts.length >= MAX_FAILED_ATTEMPTS;
  const cooldownUntil = isBlocked ? now + COOLDOWN_MS : 0;

  writeEntry(identifier, { attempts, cooldownUntil });

  return getLoginRateLimitStatus(identifier);
};

export const clearLoginFailures = (identifier) => {
  try {
    window.localStorage.removeItem(getStorageKey(identifier));
  } catch {
    // Ignore storage cleanup failures.
  }
};
