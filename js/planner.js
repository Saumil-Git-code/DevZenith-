import { getSavedEvents, unsaveEvent } from './storage.js';
import { getEventById, checkTimeConflict, formatTime, getCategoryColor } from './data.js';
import { showToast, renderEmptyState } from './components.js';

export function initPlannerPage() {
  const container = document.getElementById('festival-planner');
  if (!container) return;

  function render() {
    const savedIds = getSavedEvents();
    if (savedIds.length === 0) {
      renderEmptyState(container, {
        icon: 'calendar',
        title: 'Your festival is empty',
        message: 'Save events to build your personalized schedule.',
        actionText: 'Explore Events',
        actionHref: 'events.html'
      });
      return;
    }

    const events = savedIds.map(getEventById).filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date) || a.startTime.localeCompare(b.startTime));
    
    const byDay = {};
    events.forEach(e => {
      if (!byDay[e.date]) byDay[e.date] = [];
      byDay[e.date].push(e);
    });

    let conflicts = 0;
    let html = '';
    
    const summary = document.getElementById('festival-summary');
    if (summary) summary.textContent = `You have ${events.length} event${events.length !== 1 ? 's' : ''} saved to your schedule.`;
    
    const stats = document.getElementById('festival-stats');
    if (stats) stats.innerHTML = `<strong>${events.length}</strong> events saved &middot; <strong>${Object.keys(byDay).length}</strong> days`;
    
    Object.keys(byDay).forEach(date => {
      html += `
        <div class="planner__day">
          <h2 class="planner__day-header">${new Date(date).toLocaleDateString(undefined, {weekday:'long', month:'short', day:'numeric'})}</h2>
          <div class="planner__events">
      `;
      
      const dayEvents = byDay[date];
      for (let i = 0; i < dayEvents.length; i++) {
        const ev = dayEvents[i];
        const catColor = getCategoryColor(ev.category);
        
        let conflictHtml = '';
        if (i > 0 && checkTimeConflict(dayEvents[i-1], ev)) {
          conflicts++;
          conflictHtml = `<div class="planner__conflict"><i data-lucide="alert-triangle"></i> Time Conflict</div>`;
        }
        
        html += `
          ${conflictHtml}
          <div class="planner__event">
            <div class="planner__time">${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}</div>
            <div class="planner__event-content">
              <span class="badge badge--category" style="--cat-color: ${catColor}">${ev.category}</span>
              <h3 class="planner__event-name"><a href="event.html?id=${ev.id}">${ev.name}</a></h3>
              <p class="planner__event-venue">${ev.venue}</p>
            </div>
            <div class="planner__event-actions">
              <a href="register.html?event=${ev.id}" class="btn btn--primary btn--sm">Register</a>
              <button class="btn btn--icon btn--sm btn--danger remove-btn" data-id="${ev.id}" aria-label="Remove"><i data-lucide="trash-2"></i></button>
            </div>
          </div>
        `;
      }
      
      html += `</div></div>`;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        unsaveEvent(id);
        showToast('Event removed from festival', 'info');
        render();
      });
    });
    
    if (window.lucide) window.lucide.createIcons();
  }
  
  window.addEventListener('dz:storage', render);
  render();
}
