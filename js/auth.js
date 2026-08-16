import { getCurrentUser, setCurrentUser, clearCurrentUser, getUsersDB, addUserToDB, findUserByEmail, generateUserId } from './storage.js';

// Simple hash function for demo passwords (NOT secure - this is frontend demo)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export function signup({ name, email, college, password }) {
  // Validate
  if (!name || !email || !college || !password) {
    return { success: false, error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }
  // Check duplicate
  if (findUserByEmail(email)) {
    return { success: false, error: 'An account with this email already exists.' };
  }
  // Create user
  const user = {
    id: generateUserId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    college: college.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };
  addUserToDB(user);
  // Auto-login
  const sessionUser = { id: user.id, name: user.name, email: user.email, college: user.college };
  setCurrentUser(sessionUser);
  return { success: true, user: sessionUser };
}

export function login({ email, password }) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }
  const user = findUserByEmail(email.trim());
  if (!user) {
    return { success: false, error: 'No account found with this email.' };
  }
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  const sessionUser = { id: user.id, name: user.name, email: user.email, college: user.college };
  setCurrentUser(sessionUser);
  return { success: true, user: sessionUser };
}

export function logout() {
  clearCurrentUser();
  window.dispatchEvent(new CustomEvent('dz:authchange'));
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function getUser() {
  return getCurrentUser();
}

export function requireAuth(redirectUrl = 'login.html') {
  const user = getCurrentUser();
  if (!user) {
    // Save the intended destination
    sessionStorage.setItem('dz-redirect', window.location.href);
    window.location.href = redirectUrl;
    return null;
  }
  return user;
}

export function getRedirectUrl() {
  const url = sessionStorage.getItem('dz-redirect');
  sessionStorage.removeItem('dz-redirect');
  return url || 'dashboard.html';
}
