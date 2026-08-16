// Theme system with system preference detection and persistence
import { getTheme, setTheme } from './storage.js';

export function initTheme() {
  // Theme is already applied by inline <head> script.
  // This sets up the toggle button event listener.
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  }
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = getTheme();
    // Only auto-switch if user hasn't manually set preference (savedTheme will be a string if set)
    if (savedTheme === null) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  setTheme(next);
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Dispatch event for any JS that needs to react
  window.dispatchEvent(new CustomEvent('dz:themechange', { detail: { theme } }));
}
