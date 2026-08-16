import { getRegistrations, getCurrentUser } from './storage.js';
import { getEventById, formatShortDate, formatTime } from './data.js';
import { renderEmptyState, showToast } from './components.js';

export function generatePassData(registration, event) {
  return {
    ...registration,
    event,
    passType: event.teamSize.max > 1 && registration.teamSize ? 'TEAM LEAD' : 'PARTICIPANT',
    generatedId: registration.id,
    initials: registration.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
  };
}

export function generateQRPattern(regId) {
  return `<div class="pass__qr-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;width:100%;height:100%">
    ${Array.from({length: 64}).map((_, i) => `<div style="background:${(regId.charCodeAt(i % regId.length) * i) % 2 === 0 ? 'currentColor' : 'transparent'}"></div>`).join('')}
  </div>`;
}

export function renderPass(container, registration, event) {
  const pass = generatePassData(registration, event);
  
  const passHtml = `
    <div class="pass" id="pass-${pass.id}">
      <div class="pass__inner">
        <div class="pass__header">
          <div class="pass__brand">
            <span class="pass__brand-mark">DZ</span>
            <span class="pass__brand-text">DEVZENITH</span>
          </div>
          <span class="pass__type">${pass.passType}</span>
        </div>
        <div class="pass__body">
          <div class="pass__avatar">${pass.initials}</div>
          <h3 class="pass__name">${pass.name}</h3>
          <p class="pass__college">${pass.college}</p>
          <div class="pass__fields">
            <div class="pass__field">
              <span class="pass__label">Event</span>
              <span class="pass__value">${event.name}</span>
            </div>
            <div class="pass__field">
              <span class="pass__label">Category</span>
              <span class="pass__value">${event.category}</span>
            </div>
            <div class="pass__field">
              <span class="pass__label">Date</span>
              <span class="pass__value">${formatShortDate(event.date)}</span>
            </div>
            <div class="pass__field">
              <span class="pass__label">Venue</span>
              <span class="pass__value">${event.venue}</span>
            </div>
          </div>
        </div>
        <div class="pass__pattern">
           <svg width="100%" height="20" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="pattern-${pass.id}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                 <circle cx="2" cy="2" r="2" fill="var(--color-accent-subtle)"></circle>
               </pattern>
             </defs>
             <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-${pass.id})"></rect>
           </svg>
        </div>
        <div class="pass__footer">
          <span class="pass__id">${pass.generatedId}</span>
          <div class="pass__qr" style="width:48px;height:48px">
            ${generateQRPattern(pass.generatedId)}
          </div>
        </div>
      </div>
      <button class="btn btn--secondary btn--sm download-pass-btn" style="margin-top:1rem;width:100%" data-id="${pass.id}">Download Pass</button>
    </div>
  `;
  container.innerHTML += passHtml;
}

export function downloadPass(registration, event) {
  showToast(`Generating pass for ${event.name}...`, 'info');
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#111111'; // Dark background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('DEVZENITH', 20, 40);
  
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(registration.name, 20, 120);
  
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('Event:', 20, 180);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(event.name, 20, 210);
  
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('Date:', 20, 260);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(formatShortDate(event.date), 20, 290);
  
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('Venue:', 20, 340);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(event.venue, 20, 370);
  
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('ID:', 20, 560);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(registration.id, 20, 580);
  
  // Fake QR code pattern
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 400; i++) {
    if (Math.random() > 0.5) {
      ctx.fillRect(280 + (i % 20) * 4, 480 + Math.floor(i / 20) * 4, 4, 4);
    }
  }
  
  const link = document.createElement('a');
  link.download = `DevZenith-Pass-${registration.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  setTimeout(() => {
    showToast('Pass downloaded!', 'success');
  }, 500);
}

export function initPassesView(container) {
  if (!container) return;
  const user = getCurrentUser();
  if (!user) return;
  
  const regs = getRegistrations().filter(r => r.userId === user.id);
  if (regs.length === 0) {
    renderEmptyState(container, {
      icon: 'ticket',
      title: 'No Passes Found',
      message: 'You have not registered for any events yet.',
      actionText: 'Browse Events',
      actionHref: 'events.html'
    });
    return;
  }
  
  container.innerHTML = '<div class="grid grid--3"></div>';
  const grid = container.querySelector('.grid');
  
  regs.forEach(reg => {
    const event = getEventById(reg.eventId);
    if (event) renderPass(grid, reg, event);
  });
  
  grid.querySelectorAll('.download-pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const reg = regs.find(r => r.id === id);
      const event = getEventById(reg.eventId);
      downloadPass(reg, event);
    });
  });
}
