import { requireAuth } from './auth.js';
import { getCurrentUser, getRegistrations, getSavedEvents, removeRegistration } from './storage.js';
import { getEventById, formatShortDate } from './data.js';
import { initPassesView } from './passes.js';
import { showConfirm, showToast, renderEmptyState } from './components.js';

// XSS safety
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initDashboardPage() {
  if (!requireAuth('login.html')) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  // Welcome header
  const welcomeEl = document.getElementById('dash-welcome');
  if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.name.split(' ')[0]}`;
  
  const regs = getRegistrations().filter(r => r.userId === user.id);
  const saved = getSavedEvents();
  
  // Stats
  const statsEl = document.getElementById('dash-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="dash__stat">
        <div class="dash__stat-icon"><i data-lucide="calendar-check" width="20" height="20"></i></div>
        <div class="dash__stat-value">${regs.length}</div>
        <div class="dash__stat-label">Registrations</div>
      </div>
      <div class="dash__stat">
        <div class="dash__stat-icon"><i data-lucide="bookmark" width="20" height="20"></i></div>
        <div class="dash__stat-value">${saved.length}</div>
        <div class="dash__stat-label">Saved Events</div>
      </div>
      <div class="dash__stat">
        <div class="dash__stat-icon"><i data-lucide="ticket" width="20" height="20"></i></div>
        <div class="dash__stat-value">${regs.length}</div>
        <div class="dash__stat-label">Passes</div>
      </div>
    `;
    if (window.lucide) lucide.createIcons({ nodes: [statsEl] });
  }
  
  // Tabs
  const tabs = document.querySelectorAll('.dash__tab');
  const panels = document.querySelectorAll('.dash__panel');
  const initializedTabs = new Set();
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      tabs.forEach(t => {
        t.classList.remove('dash__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('dash__tab--active');
      tab.setAttribute('aria-selected', 'true');
      
      panels.forEach(p => {
        p.classList.remove('dash__panel--active');
        p.style.display = 'none';
      });
      
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('dash__panel--active');
        panel.style.display = 'block';
      }
      
      if (!initializedTabs.has(target)) {
        initPanel(target);
        initializedTabs.add(target);
      }
    });
  });
  
  function initPanel(target) {
    switch(target) {
      case 'overview':
        initOverview();
        break;
      case 'registrations':
        initRegistrations();
        break;
      case 'festival':
        initFestival();
        break;
      case 'passes':
        initPasses();
        break;
      case 'account':
        initAccount();
        break;
    }
  }
  
  function initOverview() {
    const panel = document.getElementById('panel-overview');
    if (!panel) return;
    
    let nextEventHtml = '';
    if (regs.length > 0) {
      const upcomingReg = regs[0];
      const ev = getEventById(upcomingReg.eventId);
      if (ev) {
        nextEventHtml = `
          <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5);margin-bottom:var(--space-6);">
            <div style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:var(--tracking-wider);margin-bottom:var(--space-2);font-family:var(--font-mono);">Next Event</div>
            <h3 style="font-family:var(--font-display);font-size:var(--text-lg);font-weight:var(--weight-semibold);margin-bottom:var(--space-1);">${escapeHtml(ev.name)}</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);">${formatShortDate(ev.date)} · ${ev.venue}</p>
            <a href="event.html?id=${ev.id}" class="btn btn--secondary btn--sm" style="margin-top:var(--space-3);">View Details</a>
          </div>
        `;
      }
    }
    
    panel.innerHTML = `
      ${nextEventHtml}
      <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
        <a href="events.html" class="btn btn--primary"><i data-lucide="compass" width="16" height="16" style="margin-right:4px;"></i> Explore Events</a>
        <a href="festival.html" class="btn btn--secondary"><i data-lucide="calendar" width="16" height="16" style="margin-right:4px;"></i> My Festival</a>
      </div>
    `;
    if (window.lucide) lucide.createIcons({ nodes: [panel] });
  }
  
  function initRegistrations() {
    const container = document.getElementById('registrations-list');
    if (!container) return;
    
    if (regs.length === 0) {
      renderEmptyState(container, {
        icon: 'calendar-x',
        title: 'No Registrations',
        message: 'You have not registered for any events yet.',
        actionText: 'Explore Events',
        actionHref: 'events.html'
      });
      return;
    }
    
    container.innerHTML = '<div class="reg-list">' + regs.map(reg => {
      const ev = getEventById(reg.eventId);
      if (!ev) return '';
      return `
        <div class="reg-item">
          <div class="reg-item__info">
            <span class="reg-item__event">${escapeHtml(ev.name)}</span>
            <div class="reg-item__meta">
              <span>${formatShortDate(ev.date)}</span>
              <span>·</span>
              <span>${ev.category}</span>
              <span class="badge badge--status status--registered">Confirmed</span>
            </div>
          </div>
          <div class="reg-item__actions">
            <a href="event.html?id=${ev.id}" class="btn btn--sm btn--ghost">View</a>
            <button class="btn btn--sm btn--danger cancel-reg-btn" data-id="${reg.id}">Cancel</button>
          </div>
        </div>
      `;
    }).join('') + '</div>';
    
    container.querySelectorAll('.cancel-reg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showConfirm('Are you sure you want to cancel this registration?', () => {
          removeRegistration(btn.dataset.id);
          showToast('Registration cancelled', 'info');
          // Re-render instead of full reload
          const updatedRegs = getRegistrations().filter(r => r.userId === user.id);
          if (updatedRegs.length === 0) {
            renderEmptyState(container, {
              icon: 'calendar-x',
              title: 'No Registrations',
              message: 'You have not registered for any events yet.',
              actionText: 'Explore Events',
              actionHref: 'events.html'
            });
          } else {
            initializedTabs.delete('registrations');
            initRegistrations();
          }
          // Update stats
          const statsVal = document.querySelector('#dash-stats .dash__stat-value');
          if (statsVal) statsVal.textContent = updatedRegs.length;
        });
      });
    });
  }
  
  function initFestival() {
    const container = document.getElementById('dash-festival');
    if (!container) return;
    
    if (saved.length === 0) {
      renderEmptyState(container, {
        icon: 'calendar',
        title: 'No Saved Events',
        message: 'Save events from the catalogue to plan your festival.',
        actionText: 'Browse Events',
        actionHref: 'events.html'
      });
    } else {
      container.innerHTML = `
        <p style="margin-bottom:var(--space-4);color:var(--color-text-secondary);">${saved.length} events in your festival.</p>
        <a href="festival.html" class="btn btn--primary">Open Full Planner</a>
      `;
    }
  }
  
  function initPasses() {
    initPassesView(document.getElementById('dash-passes'));
  }
  
  function initAccount() {
    const container = document.getElementById('dash-account');
    if (!container) return;
    
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:var(--space-5);">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" value="${escapeHtml(user.name)}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" value="${escapeHtml(user.email)}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">College</label>
          <input type="text" class="form-input" value="${escapeHtml(user.college || '')}" readonly>
        </div>
        <div style="padding-top:var(--space-6);border-top:1px solid var(--color-border);display:flex;gap:var(--space-3);">
          <button class="btn btn--danger" id="dash-logout">Log Out</button>
          <button class="btn btn--ghost" id="dash-clear">Clear All Data</button>
        </div>
      </div>
    `;
    
    document.getElementById('dash-logout')?.addEventListener('click', () => {
      import('./auth.js').then(auth => {
        auth.logout();
        window.location.href = 'index.html';
      });
    });
    
    document.getElementById('dash-clear')?.addEventListener('click', () => {
      showConfirm('This will clear all your registrations, saved events, and account data. This cannot be undone.', () => {
        localStorage.clear();
        showToast('All data cleared', 'info');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      });
    });
  }
  
  // Init default tab based on URL hash
  const hash = window.location.hash.replace('#', '') || 'overview';
  const defaultTab = document.querySelector(\`.dash__tab[data-tab="\${hash}"]\`);
  if (defaultTab) defaultTab.click();
  else if (tabs.length > 0) tabs[0].click();
  
  if (window.lucide) lucide.createIcons();
}
