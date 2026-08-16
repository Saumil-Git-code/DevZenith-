/* ============================================================
   DEVZENITH — Centralized Storage Layer
   All localStorage operations go through this module.
   No other module touches localStorage directly.
   ============================================================ */

export const StorageKeys = {
  THEME: 'dz-theme',
  USER: 'dz-user',
  REGISTRATIONS: 'dz-registrations',
  SAVED_EVENTS: 'dz-saved-events',
  USERS_DB: 'dz-users-db'
};

/* --- Core Operations --- */

function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    console.warn(`[Storage] Failed to read key: ${key}`);
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('dz:storage', { detail: { key, value } }));
  } catch (e) {
    console.warn(`[Storage] Failed to write key: ${key}`, e);
  }
}

function removeItem(key) {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('dz:storage', { detail: { key, value: null } }));
  } catch {
    console.warn(`[Storage] Failed to remove key: ${key}`);
  }
}

/* ============================================================
   REGISTRATIONS
   ============================================================ */

export function getRegistrations() {
  return getItem(StorageKeys.REGISTRATIONS) || [];
}

export function addRegistration(registration) {
  const regs = getRegistrations();
  regs.push({
    ...registration,
    registeredAt: new Date().toISOString()
  });
  setItem(StorageKeys.REGISTRATIONS, regs);
  return registration;
}

export function removeRegistration(regId) {
  const regs = getRegistrations().filter(r => r.id !== regId);
  setItem(StorageKeys.REGISTRATIONS, regs);
}

export function getRegistrationByEventId(eventId) {
  const user = getCurrentUser();
  if (!user) return null;
  return getRegistrations().find(
    r => r.eventId === eventId && r.userId === user.id
  ) || null;
}

export function getRegistrationsByUserId(userId) {
  return getRegistrations().filter(r => r.userId === userId);
}

export function isRegisteredForEvent(eventId) {
  return getRegistrationByEventId(eventId) !== null;
}

export function generateRegId() {
  const count = getRegistrations().length + 1;
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `REG-${rand}-${String(count).padStart(3, '0')}`;
}

export function getRegistrationCount(eventId) {
  return getRegistrations().filter(r => r.eventId === eventId).length;
}

/* ============================================================
   SAVED EVENTS (My Festival)
   ============================================================ */

export function getSavedEvents() {
  return getItem(StorageKeys.SAVED_EVENTS) || [];
}

export function saveEvent(eventId) {
  const saved = getSavedEvents();
  if (!saved.includes(eventId)) {
    saved.push(eventId);
    setItem(StorageKeys.SAVED_EVENTS, saved);
  }
}

export function unsaveEvent(eventId) {
  const saved = getSavedEvents().filter(id => id !== eventId);
  setItem(StorageKeys.SAVED_EVENTS, saved);
}

export function isEventSaved(eventId) {
  return getSavedEvents().includes(eventId);
}

export function toggleSaveEvent(eventId) {
  if (isEventSaved(eventId)) {
    unsaveEvent(eventId);
    return false;
  } else {
    saveEvent(eventId);
    return true;
  }
}

/* ============================================================
   CURRENT USER (Session)
   ============================================================ */

export function getCurrentUser() {
  return getItem(StorageKeys.USER);
}

export function setCurrentUser(user) {
  setItem(StorageKeys.USER, user);
}

export function clearCurrentUser() {
  removeItem(StorageKeys.USER);
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/* ============================================================
   USERS DATABASE (Demo Auth)
   In production, this would be server-side.
   ============================================================ */

export function getUsersDB() {
  return getItem(StorageKeys.USERS_DB) || [];
}

export function addUserToDB(user) {
  const users = getUsersDB();
  users.push(user);
  setItem(StorageKeys.USERS_DB, users);
  return user;
}

export function findUserByEmail(email) {
  return getUsersDB().find(
    u => u.email.toLowerCase() === email.toLowerCase()
  ) || null;
}

export function generateUserId() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `USR-${rand}`;
}

/* ============================================================
   THEME
   ============================================================ */

export function getTheme() {
  return localStorage.getItem(StorageKeys.THEME);
}

export function setTheme(theme) {
  localStorage.setItem(StorageKeys.THEME, theme);
  window.dispatchEvent(new CustomEvent('dz:theme', { detail: { theme } }));
}

/* ============================================================
   UTILITY — Clear all DevZenith data
   ============================================================ */

export function clearAllData() {
  Object.values(StorageKeys).forEach(key => {
    localStorage.removeItem(key);
  });
  window.dispatchEvent(new CustomEvent('dz:storage', { detail: { key: 'all', value: null } }));
}
