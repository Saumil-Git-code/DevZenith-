import { isAuthenticated, getUser, logout } from './auth.js';
import { initTheme } from './theme.js';

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type} toast--enter`;
  
  const iconMap = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
  
  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" class="toast__icon"></i>
    <span class="toast__message">${message}</span>
    <button class="toast__close btn btn--icon btn--sm" aria-label="Dismiss">
      <i data-lucide="x"></i>
    </button>
  `;
  
  container.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });
  
  const close = () => {
    toast.classList.remove('toast--enter');
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend', () => toast.remove());
  };
  
  toast.querySelector('.toast__close').addEventListener('click', close);
  if (duration > 0) setTimeout(close, duration);
  
  return toast;
}

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
let activeModal = null;

export function showModal({ title, content, footer, onClose, className = '' }) {
  closeModal(); // Close any existing modal
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal ${className}" role="dialog" aria-modal="true" ${title ? `aria-label="${title}"` : ''}>
      ${title ? `
        <div class="modal__header">
          <h3 class="modal__title">${title}</h3>
          <button class="modal__close btn btn--icon" aria-label="Close dialog">
            <i data-lucide="x"></i>
          </button>
        </div>
      ` : ''}
      <div class="modal__body">${typeof content === 'string' ? content : ''}</div>
      ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.classList.add('modal-open');
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [overlay] });
  
  // If content is a DOM node, append it
  if (content instanceof HTMLElement) {
    overlay.querySelector('.modal__body').innerHTML = '';
    overlay.querySelector('.modal__body').appendChild(content);
  }
  
  // Activate with slight delay for transition
  requestAnimationFrame(() => {
    overlay.classList.add('modal-overlay--active');
  });
  
  // Close handlers
  const handleClose = () => {
    closeModal();
    if (onClose) onClose();
  };
  
  overlay.querySelector('.modal__close')?.addEventListener('click', handleClose);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) handleClose();
  });
  
  // ESC key
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      handleClose();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
  
  activeModal = { overlay, handleEsc };
  return overlay;
}

export function closeModal() {
  if (activeModal) {
    const { overlay, handleEsc } = activeModal;
    overlay.classList.remove('modal-overlay--active');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleEsc);
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    // Fallback removal
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 500);
    activeModal = null;
  }
}

/* ============================================================
   CONFIRM DIALOG
   ============================================================ */
export function showConfirm(message, onConfirm, onCancel) {
  const footer = `
    <button class="btn btn--ghost" id="confirm-cancel">Cancel</button>
    <button class="btn btn--danger" id="confirm-ok">Confirm</button>
  `;
  
  const overlay = showModal({
    title: 'Confirm Action',
    content: `<p style="color: var(--color-text-secondary); font-size: var(--text-sm);">${message}</p>`,
    footer
  });
  
  overlay.querySelector('#confirm-cancel').addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });
  overlay.querySelector('#confirm-ok').addEventListener('click', () => {
    closeModal();
    if (onConfirm) onConfirm();
  });
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
export function renderEmptyState(container, { icon = 'inbox', title, message, actionText, actionHref, onAction }) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon"><i data-lucide="${icon}"></i></div>
      <h3 class="empty-state__title">${title}</h3>
      <p class="empty-state__message">${message}</p>
      ${actionText ? (
        actionHref 
          ? `<a href="${actionHref}" class="btn btn--primary empty-state__action">${actionText}</a>`
          : `<button class="btn btn--primary empty-state__action" id="empty-action">${actionText}</button>`
      ) : ''}
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [container] });
  if (onAction && !actionHref) {
    container.querySelector('#empty-action')?.addEventListener('click', onAction);
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
export function initNav() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const page = document.body.dataset.page;
  
  if (!nav) return;
  
  // Set active link
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) {
      link.classList.add('nav__link--active', 'mobile-nav__link--active');
    }
  });
  
  // Scroll behavior — add scrolled class
  const isTransparent = nav.classList.contains('nav--transparent');
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      nav.classList.add('nav--scrolled');
      if (isTransparent) nav.classList.remove('nav--transparent');
    } else {
      nav.classList.remove('nav--scrolled');
      if (isTransparent) nav.classList.add('nav--transparent');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
  
  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('mobile-nav--active');
      mobileNav.classList.toggle('mobile-nav--active');
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.classList.toggle('modal-open', !isOpen);
    });
    
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-nav--active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('modal-open');
      });
    });
  }
  
  // Update auth state in nav
  updateNavAuth();
  
  // Listen for auth changes
  window.addEventListener('dz:authchange', updateNavAuth);
  window.addEventListener('dz:storage', (e) => {
    if (e.detail.key === 'dz-user') updateNavAuth();
  });
}

export function updateNavAuth() {
  const navAuth = document.getElementById('nav-auth');
  const mobileNavAuth = document.getElementById('mobile-nav-auth');
  const user = isAuthenticated() ? getUser() : null;
  
  if (navAuth) {
    if (user) {
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      navAuth.innerHTML = `
        <a href="dashboard.html" class="nav__user" style="display:flex;align-items:center;gap:var(--space-2);text-decoration:none;color:var(--color-text-primary);">
          <span class="nav__avatar" style="width:32px;height:32px;border-radius:var(--radius-full);background:var(--color-accent);color:var(--color-accent-text);display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);font-weight:var(--weight-semibold);">${initials}</span>
          <span class="nav__user-name">${user.name.split(' ')[0]}</span>
        </a>
        <button class="btn btn--ghost btn--sm" id="nav-logout">Log Out</button>
      `;
      navAuth.querySelector('#nav-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.href = 'index.html';
      });
    } else {
      navAuth.innerHTML = `
        <a href="login.html" class="btn btn--ghost btn--sm">Log In</a>
        <a href="signup.html" class="btn btn--primary btn--sm">Sign Up</a>
      `;
    }
  }
  
  if (mobileNavAuth) {
    if (user) {
      mobileNavAuth.innerHTML = `
        <a href="dashboard.html" class="btn btn--primary">Dashboard</a>
        <button class="btn btn--ghost" id="mobile-logout">Log Out</button>
      `;
      mobileNavAuth.querySelector('#mobile-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.href = 'index.html';
      });
    } else {
      mobileNavAuth.innerHTML = `
        <a href="login.html" class="btn btn--ghost">Log In</a>
        <a href="signup.html" class="btn btn--primary">Sign Up</a>
      `;
    }
  }
}
