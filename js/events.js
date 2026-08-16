import { events, getEventById, searchEvents, getEventAvailability, formatTime, formatShortDate, getCategoryColor, getCategories } from './data.js';
import { isEventSaved, toggleSaveEvent, isRegisteredForEvent } from './storage.js';
import { showToast, renderEmptyState } from './components.js';

export function initEventsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  const container = document.querySelector('.grid--events');
  const searchInput = document.getElementById('search-input');
  const filterBar = document.getElementById('filter-bar');
  const eventsCount = document.getElementById('events-count');
  
  let currentCategory = categoryParam || 'All';
  let currentSearch = '';
  
  function render() {
    if (!container) return;
    container.innerHTML = '';
    
    let filtered = events;
    if (currentCategory !== 'All') {
      filtered = filtered.filter(e => e.category === currentCategory);
    }
    if (currentSearch) {
      filtered = searchEvents(currentSearch).filter(e => 
        currentCategory === 'All' || e.category === currentCategory
      );
    }
    
    if (eventsCount) {
      eventsCount.textContent = `Showing ${filtered.length} of ${events.length} events`;
    }
    
    if (filtered.length === 0) {
      renderEmptyState(container, {
        icon: 'search-x',
        title: 'No events found',
        message: 'Try adjusting your search or category filter.',
        actionText: 'Clear Filters',
        actionHref: '#'
      });
      const clearBtn = container.querySelector('.btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          currentCategory = 'All';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          updateChips();
          render();
        });
      }
    } else {
      filtered.forEach(event => {
        container.innerHTML += renderEventCard(event);
      });
      attachCardListeners(container);
    }
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function updateChips() {
    if (!filterBar) return;
    const chips = filterBar.querySelectorAll('.badge--category, .chip');
    chips.forEach(chip => {
      if (chip.dataset.category === currentCategory) {
        chip.classList.add('chip--active');
      } else {
        chip.classList.remove('chip--active');
      }
    });
  }

  if (filterBar) {
    const categories = ['All', ...getCategories()];
    filterBar.innerHTML = categories.map(cat => `
      <button class="chip ${cat === currentCategory ? 'chip--active' : ''}" data-category="${cat}">${cat}</button>
    `).join('');
    
    filterBar.addEventListener('click', (e) => {
      if (e.target.dataset.category) {
        currentCategory = e.target.dataset.category;
        updateChips();
        render();
      }
    });
  }

  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        render();
      }, 200);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  render();
}

export function renderEventCard(event) {
  const isSaved = isEventSaved(event.id);
  const isReg = isRegisteredForEvent(event.id);
  const availability = getEventAvailability(event);
  const catColor = getCategoryColor(event.category);
  
  let statusBadge = '';
  if (availability.status === 'open') statusBadge = `<span class="badge badge--status status--open">${availability.remaining} seats left</span>`;
  else if (availability.status === 'filling') statusBadge = `<span class="badge badge--status status--filling">${availability.remaining} seats left</span>`;
  else if (availability.status === 'almost-full') statusBadge = `<span class="badge badge--status status--almost-full">Only ${availability.remaining} left</span>`;
  else statusBadge = `<span class="badge badge--status status--full">Sold Out</span>`;
  
  if (isReg) statusBadge = `<span class="badge badge--status status--registered">Registered ✓</span>`;

  let actionHtml = '';
  if (isReg) {
    actionHtml = `<a href="event.html?id=${event.id}" class="btn btn--secondary btn--sm">Registered ✓</a>`;
  } else if (availability.isFull) {
    actionHtml = `<button disabled class="btn btn--secondary btn--sm">Sold Out</button>`;
  } else {
    actionHtml = `<a href="event.html?id=${event.id}" class="btn btn--primary btn--sm">View Details</a>`;
  }

  return `
    <article class="event-card" data-event-id="${event.id}" data-category="${event.category}">
      <div class="event-card__header">
        <span class="badge badge--category" style="--cat-color: ${catColor}">${event.category}</span>
        <button class="event-card__save btn btn--icon btn--sm" data-save="${event.id}" aria-label="${isSaved ? 'Remove from festival' : 'Save to festival'}">
          <i data-lucide="bookmark" class="${isSaved ? 'fill-current' : ''}"></i>
        </button>
      </div>
      <div class="event-card__body">
        <span class="event-card__id">${event.id}</span>
        <h3 class="event-card__title"><a href="event.html?id=${event.id}">${event.name}</a></h3>
        <p class="event-card__description">${event.description}</p>
        <div class="event-card__meta">
          <span class="event-card__meta-item"><i data-lucide="calendar" width="14" height="14"></i> ${formatShortDate(event.date)}</span>
          <span class="event-card__meta-item"><i data-lucide="clock" width="14" height="14"></i> ${formatTime(event.startTime)} – ${formatTime(event.endTime)}</span>
          <span class="event-card__meta-item"><i data-lucide="map-pin" width="14" height="14"></i> ${event.venue}</span>
          <span class="event-card__meta-item"><i data-lucide="users" width="14" height="14"></i> ${event.teamSize.min === event.teamSize.max ? event.teamSize.min : event.teamSize.min + '–' + event.teamSize.max} per team</span>
        </div>
      </div>
      <div class="event-card__footer">
        <div class="event-card__availability">
          ${statusBadge}
          <div class="event-card__availability-bar">
            <div class="event-card__availability-fill" style="width: ${availability.percentageFilled}%; background: var(--color-${availability.isFull ? 'error' : availability.percentageFilled > 80 ? 'warning' : 'success'})"></div>
          </div>
        </div>
        <div class="event-card__actions">
          <span class="event-card__prize">${event.prize || ''}</span>
          ${actionHtml}
        </div>
      </div>
    </article>
  `;
}

function attachCardListeners(container) {
  const saveBtns = container.querySelectorAll('.event-card__save');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.save;
      const isNowSaved = toggleSaveEvent(id);
      
      // Update aria-label
      btn.setAttribute('aria-label', isNowSaved ? 'Remove from festival' : 'Save to festival');
      
      // Replace the icon element to force Lucide to re-render
      const iconEl = btn.querySelector('svg, i');
      if (iconEl) {
        const newIcon = document.createElement('i');
        newIcon.setAttribute('data-lucide', isNowSaved ? 'bookmark-check' : 'bookmark');
        if (isNowSaved) newIcon.classList.add('fill-current');
        iconEl.replaceWith(newIcon);
        if (window.lucide) lucide.createIcons({ nodes: [btn] });
      }
      
      showToast(
        isNowSaved ? 'Event saved to your festival' : 'Event removed from your festival',
        isNowSaved ? 'success' : 'info'
      );
    });
  });
}

export function initEventDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (!id) {
    const main = document.getElementById('main-content');
    if (main) renderEmptyState(main.querySelector('.container'), { icon: 'alert-circle', title: 'Event Not Found', message: 'No event ID provided.', actionText: 'View Events', actionHref: 'events.html' });
    return;
  }
  
  const event = getEventById(id);
  if (!event) {
    const main = document.getElementById('main-content');
    if (main) renderEmptyState(main.querySelector('.container'), { icon: 'alert-circle', title: 'Event Not Found', message: 'The event you are looking for does not exist.', actionText: 'View Events', actionHref: 'events.html' });
    return;
  }

  // Update page title
  document.title = `${event.name} — DevZenith 2026`;
  
  const catColor = getCategoryColor(event.category);
  const isSaved = isEventSaved(event.id);
  const isReg = isRegisteredForEvent(event.id);
  const availability = getEventAvailability(event);
  
  // Breadcrumb
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  const breadcrumbName = document.getElementById('breadcrumb-name');
  if (breadcrumbCat) breadcrumbCat.innerHTML = `<a href="events.html?category=${encodeURIComponent(event.category)}">${event.category}</a>`;
  if (breadcrumbName) breadcrumbName.textContent = event.name;
  
  // Hero
  const hero = document.getElementById('event-hero');
  if (hero) {
    let actionHtml = '';
    if (isReg) {
      actionHtml = `<a href="dashboard.html#passes" class="btn btn--secondary">Already Registered — View Pass</a>`;
    } else if (availability.isFull) {
      actionHtml = `<button disabled class="btn btn--secondary">Sold Out</button>`;
    } else {
      actionHtml = `<a href="register.html?event=${event.id}" class="btn btn--primary btn--lg">Register Now</a>`;
    }
    
    hero.innerHTML = `
      <span class="badge badge--category" style="--cat-color: ${catColor}">${event.category}</span>
      <h1 class="event-detail__title">${event.name}</h1>
      <p class="event-detail__tagline">${event.description}</p>
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-6);flex-wrap:wrap;align-items:center;">
        ${actionHtml}
        <button class="btn btn--ghost event-card__save" data-save="${event.id}" style="display:flex;align-items:center;gap:var(--space-2)">
          <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="${isSaved ? 'fill-current' : ''}"></i>
          ${isSaved ? 'Saved to Festival' : 'Save to Festival'}
        </button>
      </div>
    `;
  }
  
  // Content
  const content = document.getElementById('event-content');
  if (content) {
    content.innerHTML = `
      <div class="event-detail__section">
        <h2 class="event-detail__section-title">About This Event</h2>
        <p style="color:var(--color-text-secondary);line-height:var(--leading-relaxed);">${event.description}</p>
      </div>
      ${event.rules && event.rules.length ? `
        <div class="event-detail__section">
          <h2 class="event-detail__section-title">Rules</h2>
          <ul class="event-detail__rules">
            ${event.rules.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${event.prerequisites && event.prerequisites.length ? `
        <div class="event-detail__section">
          <h2 class="event-detail__section-title">Prerequisites</h2>
          <ul class="event-detail__rules">
            ${event.prerequisites.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }
  
  // Sidebar
  const sidebar = document.getElementById('event-sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="event-detail__info-grid">
        <div class="event-detail__info-item">
          <i data-lucide="calendar" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Date</div>
            <div class="event-detail__info-value">${formatShortDate(event.date)}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="clock" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Time</div>
            <div class="event-detail__info-value">${formatTime(event.startTime)} – ${formatTime(event.endTime)}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="map-pin" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Venue</div>
            <div class="event-detail__info-value">${event.venue}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="monitor" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Mode</div>
            <div class="event-detail__info-value">${event.mode || 'In-person'}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="users" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Team Size</div>
            <div class="event-detail__info-value">${event.teamSize.min === event.teamSize.max ? event.teamSize.min + ' per team' : event.teamSize.min + '–' + event.teamSize.max + ' per team'}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="trophy" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Prize</div>
            <div class="event-detail__info-value">${event.prize}</div>
          </div>
        </div>
        <div class="event-detail__info-item">
          <i data-lucide="bar-chart-2" class="event-detail__info-icon"></i>
          <div>
            <div class="event-detail__info-label">Difficulty</div>
            <div class="event-detail__info-value">${event.difficulty}</div>
          </div>
        </div>
      </div>
      <div style="margin-top:var(--space-5);padding-top:var(--space-5);border-top:1px solid var(--color-border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
          <span style="font-size:var(--text-xs);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:var(--tracking-wider);">
            Availability
          </span>
          <span class="badge badge--status ${availability.isFull ? 'status--full' : availability.percentageFilled > 80 ? 'status--almost-full' : availability.percentageFilled > 50 ? 'status--filling' : 'status--open'}">
            ${availability.isFull ? 'Sold Out' : availability.remaining + ' seats left'}
          </span>
        </div>
        <div class="event-card__availability-bar">
          <div class="event-card__availability-fill" style="width: ${availability.percentageFilled}%; background: var(--color-${availability.isFull ? 'error' : availability.percentageFilled > 80 ? 'warning' : 'success'})"></div>
        </div>
      </div>
    `;
  }
  
  // Related events
  const related = document.getElementById('related-events');
  if (related) {
    const relatedEvents = events.filter(e => e.category === event.category && e.id !== event.id).slice(0, 3);
    if (relatedEvents.length > 0) {
      related.innerHTML = `
        <div class="section__header">
          <h2 class="section__title">Related Events</h2>
        </div>
        <div class="grid grid--events">
          ${relatedEvents.map(renderEventCard).join('')}
        </div>
      `;
      attachCardListeners(related);
    }
  }
  
  // Attach save listener on hero
  const heroContainer = document.getElementById('event-hero');
  if (heroContainer) attachCardListeners(heroContainer);
  
  if (window.lucide) window.lucide.createIcons();
}
