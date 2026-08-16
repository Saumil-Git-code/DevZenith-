import { getEventById, getEventAvailability, getCategoryColor, formatTime, formatShortDate } from './data.js';
import { isRegisteredForEvent, addRegistration, generateRegId, getCurrentUser, isLoggedIn } from './storage.js';
import { showToast, renderEmptyState } from './components.js';

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initRegistrationPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event');
  
  const eventInfoEl = document.getElementById('reg-event-info');
  const formEl = document.getElementById('registration-form');
  const successEl = document.getElementById('reg-success');
  const alreadyEl = document.getElementById('reg-already');
  const fullEl = document.getElementById('reg-full');
  const teamFieldsEl = document.getElementById('team-fields');
  const submitBtn = document.getElementById('reg-submit');
  
  if (!eventId || !formEl) {
    if (eventInfoEl) {
      renderEmptyState(eventInfoEl, {
        icon: 'alert-circle',
        title: 'Event Not Found',
        message: 'No event specified. Please select an event first.',
        actionText: 'View Events',
        actionHref: 'events.html'
      });
    }
    if (formEl) formEl.style.display = 'none';
    return;
  }
  
  const event = getEventById(eventId);
  if (!event) {
    if (eventInfoEl) {
      renderEmptyState(eventInfoEl, {
        icon: 'alert-circle',
        title: 'Event Not Found',
        message: 'The requested event does not exist.',
        actionText: 'View Events',
        actionHref: 'events.html'
      });
    }
    if (formEl) formEl.style.display = 'none';
    return;
  }
  
  const availability = getEventAvailability(event);
  
  // Populate event info header
  if (eventInfoEl) {
    const catColor = getCategoryColor(event.category);
    eventInfoEl.innerHTML = `
      <span class="badge badge--category" style="--cat-color: ${catColor};margin-bottom:var(--space-3);display:inline-flex;">${event.category}</span>
      <h2 style="font-family:var(--font-display);font-size:var(--text-xl);font-weight:var(--weight-semibold);margin-bottom:var(--space-2);">${escapeHtml(event.name)}</h2>
      <div style="display:flex;gap:var(--space-4);color:var(--color-text-muted);font-size:var(--text-sm);flex-wrap:wrap;">
        <span><i data-lucide="calendar" width="14" height="14" style="vertical-align:-2px;"></i> ${formatShortDate(event.date)}</span>
        <span><i data-lucide="clock" width="14" height="14" style="vertical-align:-2px;"></i> ${formatTime(event.startTime)} – ${formatTime(event.endTime)}</span>
        <span><i data-lucide="map-pin" width="14" height="14" style="vertical-align:-2px;"></i> ${event.venue}</span>
      </div>
      <div style="margin-top:var(--space-3);">
        <span class="badge badge--status ${availability.isFull ? 'status--full' : availability.percentageFilled > 80 ? 'status--almost-full' : 'status--open'}">
          ${availability.isFull ? 'Sold Out' : availability.remaining + ' seats left'}
        </span>
      </div>
    `;
    if (window.lucide) lucide.createIcons({ nodes: [eventInfoEl] });
  }
  
  // Update page title
  document.title = `Register for ${event.name} — DevZenith 2026`;
  
  // Check if already registered
  if (isRegisteredForEvent(eventId)) {
    if (formEl) formEl.closest('div').style.display = 'none';
    if (alreadyEl) {
      alreadyEl.classList.remove('hidden');
      alreadyEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon" style="color:var(--color-success);"><i data-lucide="check-circle"></i></div>
          <h3 class="empty-state__title">Already Registered</h3>
          <p class="empty-state__message">You are already registered for ${escapeHtml(event.name)}.</p>
          <a href="dashboard.html#passes" class="btn btn--primary empty-state__action">View Your Pass</a>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [alreadyEl] });
    }
    return;
  }
  
  // Check if event is full
  if (availability.isFull) {
    if (formEl) formEl.closest('div').style.display = 'none';
    if (fullEl) {
      fullEl.classList.remove('hidden');
      fullEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i data-lucide="x-circle"></i></div>
          <h3 class="empty-state__title">Event Full</h3>
          <p class="empty-state__message">${escapeHtml(event.name)} is currently sold out.</p>
          <a href="events.html" class="btn btn--primary empty-state__action">Browse Other Events</a>
        </div>
      `;
      if (window.lucide) lucide.createIcons({ nodes: [fullEl] });
    }
    return;
  }
  
  // Pre-fill from logged-in user
  const user = getCurrentUser();
  if (user) {
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const collegeInput = document.getElementById('reg-college');
    if (nameInput && !nameInput.value) nameInput.value = user.name;
    if (emailInput && !emailInput.value) emailInput.value = user.email;
    if (collegeInput && !collegeInput.value) collegeInput.value = user.college || '';
  }
  
  // Show/hide team fields
  const isTeam = event.teamSize && event.teamSize.max > 1;
  if (isTeam && teamFieldsEl) {
    teamFieldsEl.classList.remove('hidden');
    // Populate team size options
    const teamSizeSelect = document.getElementById('reg-team-size');
    if (teamSizeSelect) {
      teamSizeSelect.innerHTML = '';
      for (let i = event.teamSize.min; i <= event.teamSize.max; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i + ' members';
        teamSizeSelect.appendChild(opt);
      }
    }
    // Make team name required
    const teamNameInput = document.getElementById('reg-team');
    if (teamNameInput) teamNameInput.required = true;
  }
  
  // Form validation on blur
  formEl.querySelectorAll('.form-input, .form-select').forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group')?.classList.contains('form-group--error')) {
        validateInput(input);
      }
    });
  });
  
  // Form submission with duplicate prevention
  let isSubmitting = false;
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    // Validate all fields
    let valid = true;
    formEl.querySelectorAll('.form-input[required], .form-select[required]').forEach(input => {
      if (!validateInput(input)) valid = false;
    });
    
    if (!valid) return;
    
    // Double-check not already registered (race condition prevention)
    if (isRegisteredForEvent(eventId)) {
      showToast('You are already registered for this event.', 'warning');
      return;
    }
    
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn--loading');
    }
    
    const regData = {
      id: generateRegId(),
      eventId: event.id,
      userId: user?.id || null,
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      college: document.getElementById('reg-college').value.trim(),
      phone: document.getElementById('reg-phone')?.value.trim() || '',
      timestamp: new Date().toISOString()
    };
    
    if (isTeam) {
      regData.teamName = document.getElementById('reg-team')?.value.trim() || '';
      regData.teamSize = parseInt(document.getElementById('reg-team-size')?.value) || event.teamSize.min;
    }
    
    // Brief delay for UX
    setTimeout(() => {
      addRegistration(regData);
      showToast('Registration successful!', 'success');
      
      // Hide form, show success
      formEl.closest('div').querySelector('h1').style.display = 'none';
      formEl.closest('div').querySelector('p').style.display = 'none';
      formEl.style.display = 'none';
      
      if (successEl) {
        successEl.classList.remove('hidden');
        successEl.innerHTML = `
          <div style="animation: fadeIn 0.5s ease-out;">
            <div style="width:64px;height:64px;border-radius:var(--radius-full);background:var(--color-success);color:white;display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-6);">
              <i data-lucide="check" width="32" height="32"></i>
            </div>
            <h2 style="font-family:var(--font-display);font-size:var(--text-2xl);font-weight:var(--weight-bold);margin-bottom:var(--space-3);">Registration Confirmed!</h2>
            <p style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2);">Registration ID</p>
            <p style="font-family:var(--font-mono);font-size:var(--text-lg);font-weight:var(--weight-semibold);color:var(--color-accent);margin-bottom:var(--space-6);">${regData.id}</p>
            <p style="color:var(--color-text-secondary);margin-bottom:var(--space-8);">${escapeHtml(event.name)} · ${formatShortDate(event.date)}</p>
            <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
              <a href="dashboard.html#passes" class="btn btn--primary">View Your Pass</a>
              <a href="events.html" class="btn btn--secondary">Register for Another</a>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons({ nodes: [successEl] });
      }
    }, 600);
  });
}

function validateInput(input) {
  const group = input.closest('.form-group');
  const errorEl = group?.querySelector('.form-error');
  if (!group) return true;
  
  let valid = true;
  let msg = '';
  
  const value = input.value.trim();
  
  if (input.required && !value) {
    valid = false;
    msg = 'This field is required.';
  } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    valid = false;
    msg = 'Please enter a valid email address.';
  } else if (input.minLength > 0 && value.length < input.minLength) {
    valid = false;
    msg = \`Must be at least \${input.minLength} characters.\`;
  }
  
  if (valid) {
    group.classList.remove('form-group--error');
    group.classList.add('form-group--valid');
    if (errorEl) errorEl.textContent = '';
  } else {
    group.classList.add('form-group--error');
    group.classList.remove('form-group--valid');
    if (errorEl) errorEl.textContent = msg;
  }
  
  return valid;
}
