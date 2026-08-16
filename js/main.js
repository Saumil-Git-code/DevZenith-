import { initTheme } from './theme.js';
import { initNav, updateNavAuth } from './components.js';

// Initialize core systems
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Page-specific initialization
  const page = document.body.dataset.page;
  
  switch (page) {
    case 'home':
      import('./animations.js').then(m => {
        if (m.initHomeAnimations) m.initHomeAnimations();
        if (m.initScrollReveal) m.initScrollReveal();
      }).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'events':
      import('./events.js').then(m => m.initEventsPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'event-detail':
      import('./events.js').then(m => {
        if (m.initEventDetailPage) m.initEventDetailPage();
      }).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'register':
      import('./registration.js').then(m => m.initRegistrationPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'login':
      import('./auth-pages.js').then(m => m.initLoginPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'signup':
      import('./auth-pages.js').then(m => m.initSignupPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'dashboard':
      import('./dashboard.js').then(m => m.initDashboardPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
      
    case 'festival':
      import('./planner.js').then(m => m.initPlannerPage()).catch(err => {
  console.error('Module load error:', err);
  // Ensure content is still visible even if module fails
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
});
      break;
  }
  
  // Initialize scroll reveal for all pages
  import('./animations.js').then(m => {
    if (m.initScrollReveal) m.initScrollReveal();
  }).catch(() => {}); // Graceful fallback if animations module isn't loaded
});
