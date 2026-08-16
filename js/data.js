/* ============================================================
   DEVZENITH — Event Data Model
   Structured for easy replacement with a real API later.
   All UI code imports from this module — never hardcodes events.
   ============================================================ */

export const CONFERENCE = {
  name: 'DevZenith',
  tagline: 'Where Code Meets Competition',
  description: 'A three-day technology conference bringing together student developers, designers, and engineers to compete, learn, and connect.',
  dates: 'September 18\u201320, 2026',
  startDate: '2026-09-18',
  endDate: '2026-09-20',
  venue: 'Nexus Convention Center',
  city: 'Bangalore',
  totalPrizePool: '\u20B92,40,000',
  expectedParticipants: 500,
  totalEvents: 8,
  days: 3,
  categories: ['Hackathon', 'AI / ML', 'Cybersecurity', 'Robotics', 'UI/UX', 'Cloud', 'Web Development', 'Gaming'],
  year: 2026
};

export const events = [
  {
    id: 'EVT-001',
    name: 'CodeStorm',
    slug: 'codestorm',
    category: 'Hackathon',
    date: '2026-09-18',
    day: 'Day 1 \u2014 Friday',
    dayShort: 'Day 1',
    startTime: '09:00',
    endTime: '21:00',
    mode: 'In-person',
    venue: 'Hall A, Nexus Convention Center',
    description: 'A 12-hour intensive hackathon where teams build functional prototypes addressing real-world challenges. From ideation to demo, push your engineering limits and ship something remarkable.',
    longDescription: 'CodeStorm is DevZenith\u2019s flagship hackathon \u2014 a 12-hour sprint from concept to working prototype. Teams receive real-world problem statements at 9 AM and must ship a functional demo by 9 PM. Judging emphasizes technical execution, innovation, and presentation quality. Previous winners have gone on to receive pre-incubation offers. Meals and refreshments provided throughout the event.',
    teamSize: { min: 2, max: 4 },
    prize: '\u20B950,000',
    prizeBreakdown: '1st: \u20B930,000 \u00B7 2nd: \u20B915,000 \u00B7 3rd: \u20B95,000',
    totalSeats: 60,
    registeredCount: 45,
    difficulty: 'Advanced',
    rules: [
      'Teams of 2\u20134 members required',
      'All code must be written during the event window',
      'External APIs and open-source libraries are permitted',
      'Pre-built templates and boilerplate generators are allowed',
      'Final demo limited to 5 minutes followed by 2-minute Q&A',
      'Judging criteria: innovation (30%), execution (30%), design (20%), presentation (20%)'
    ],
    prerequisites: [
      'Laptop with your preferred development environment pre-configured',
      'Familiarity with at least one full-stack framework recommended',
      'GitHub account for code submission'
    ],
    icon: 'code-2'
  },
  {
    id: 'EVT-002',
    name: 'Neural Nexus',
    slug: 'neural-nexus',
    category: 'AI / ML',
    date: '2026-09-18',
    day: 'Day 1 \u2014 Friday',
    dayShort: 'Day 1',
    startTime: '10:00',
    endTime: '16:00',
    mode: 'Hybrid',
    venue: 'Lab 3, Nexus Convention Center',
    description: 'A competitive model-building challenge. Tackle a curated dataset, optimize your pipeline, and present your approach to a panel of industry ML practitioners.',
    longDescription: 'Neural Nexus challenges participants to build the most effective machine learning solution for a provided dataset within six hours. The competition evaluates not just model accuracy but your entire approach \u2014 data exploration, feature engineering, model selection, and how clearly you communicate your methodology. Remote participants join via a shared Jupyter environment.',
    teamSize: { min: 1, max: 3 },
    prize: '\u20B930,000',
    prizeBreakdown: '1st: \u20B918,000 \u00B7 2nd: \u20B99,000 \u00B7 3rd: \u20B93,000',
    totalSeats: 40,
    registeredCount: 38,
    difficulty: 'Intermediate',
    rules: [
      'Individual or teams of up to 3',
      'Pre-trained models allowed with clear attribution',
      'Evaluation: accuracy (40%), methodology (30%), presentation (30%)',
      'Code must be submitted via the provided repository by deadline',
      'AutoML tools permitted but must be explained'
    ],
    prerequisites: [
      'Python proficiency required',
      'Familiarity with scikit-learn, PyTorch, or TensorFlow',
      'Jupyter Notebook experience recommended'
    ],
    icon: 'brain'
  },
  {
    id: 'EVT-003',
    name: 'Cipher Siege',
    slug: 'cipher-siege',
    category: 'Cybersecurity',
    date: '2026-09-18',
    day: 'Day 1 \u2014 Friday',
    dayShort: 'Day 1',
    startTime: '14:00',
    endTime: '18:00',
    mode: 'In-person',
    venue: 'Hall B, Nexus Convention Center',
    description: 'A capture-the-flag competition spanning cryptography, reverse engineering, web exploitation, and forensics. Solve layered challenges and capture the flag.',
    longDescription: 'Cipher Siege is a Jeopardy-style CTF with challenges across five domains: cryptography, web exploitation, binary analysis, forensics, and OSINT. Challenges unlock progressively \u2014 solving easier flags reveals harder ones. The event runs on a dedicated CTF platform with real-time scoring. Top performers will be invited to join DevZenith\u2019s security research group.',
    teamSize: { min: 1, max: 2 },
    prize: '\u20B925,000',
    prizeBreakdown: '1st: \u20B915,000 \u00B7 2nd: \u20B97,500 \u00B7 3rd: \u20B92,500',
    totalSeats: 30,
    registeredCount: 30,
    difficulty: 'Advanced',
    rules: [
      'Solo or pairs',
      'No attacking competition infrastructure or other participants',
      'Standard CTF rules apply \u2014 no flag sharing',
      'Points awarded based on challenge difficulty tier',
      'Hints available with point deduction'
    ],
    prerequisites: [
      'Linux command-line proficiency',
      'Basic networking and web security knowledge',
      'Familiarity with common CTF tools (Burp Suite, Wireshark, etc.)'
    ],
    icon: 'shield'
  },
  {
    id: 'EVT-004',
    name: 'MechMind',
    slug: 'mechmind',
    category: 'Robotics',
    date: '2026-09-19',
    day: 'Day 2 \u2014 Saturday',
    dayShort: 'Day 2',
    startTime: '09:00',
    endTime: '17:00',
    mode: 'In-person',
    venue: 'Workshop Bay, Nexus Convention Center',
    description: 'Design, build, and program an autonomous robot to navigate an obstacle course. Combines mechanical design, sensor integration, and algorithmic problem-solving.',
    longDescription: 'MechMind is a full-day robotics challenge where teams receive a standardized components kit and must design an autonomous robot capable of navigating a multi-terrain obstacle course. The course includes line following, obstacle avoidance, ramp climbing, and precision parking. Teams are judged on completion time across three timed runs, with bonus points for elegant mechanical solutions.',
    teamSize: { min: 2, max: 4 },
    prize: '\u20B940,000',
    prizeBreakdown: '1st: \u20B924,000 \u00B7 2nd: \u20B912,000 \u00B7 3rd: \u20B94,000',
    totalSeats: 24,
    registeredCount: 18,
    difficulty: 'Advanced',
    rules: [
      'Teams of 2\u20134 members',
      'Components kit provided on-site \u2014 no outside hardware',
      'Robot must be fully autonomous \u2014 no remote control permitted',
      'Three timed arena runs; best time determines ranking',
      'Maximum robot dimensions: 30cm \u00D7 30cm \u00D7 30cm'
    ],
    prerequisites: [
      'Arduino or Raspberry Pi programming experience',
      'Basic electronics and soldering knowledge',
      'Understanding of sensors (IR, ultrasonic, etc.)'
    ],
    icon: 'cpu'
  },
  {
    id: 'EVT-005',
    name: 'PixelCraft',
    slug: 'pixelcraft',
    category: 'UI/UX',
    date: '2026-09-19',
    day: 'Day 2 \u2014 Saturday',
    dayShort: 'Day 2',
    startTime: '10:00',
    endTime: '15:00',
    mode: 'Online',
    venue: 'Virtual \u2014 Zoom + Figma',
    description: 'A rapid design sprint where participants reimagine a real product\u2019s user experience. Research, wireframe, prototype, and present \u2014 all within five hours.',
    longDescription: 'PixelCraft is a solo design competition that simulates real product design under pressure. At 10 AM, participants receive a brief describing a real product with a specific UX problem to solve. Over five hours, they must research, ideate, wireframe, create a high-fidelity prototype, and record a 3-minute walkthrough video. This event runs entirely online via Figma and Zoom.',
    teamSize: { min: 1, max: 1 },
    prize: '\u20B915,000',
    prizeBreakdown: '1st: \u20B99,000 \u00B7 2nd: \u20B94,500 \u00B7 3rd: \u20B91,500',
    totalSeats: 50,
    registeredCount: 22,
    difficulty: 'Beginner',
    rules: [
      'Individual participation only',
      'Figma, Sketch, or Adobe XD permitted',
      'Submission: prototype link + 3-minute video walkthrough',
      'Judged on: usability (35%), visual design (25%), innovation (25%), presentation (15%)',
      'No pre-made templates \u2014 start from scratch'
    ],
    prerequisites: [
      'Figma account (free tier sufficient)',
      'Basic understanding of UI/UX design principles',
      'Screen recording capability'
    ],
    icon: 'palette'
  },
  {
    id: 'EVT-006',
    name: 'CloudForge',
    slug: 'cloudforge',
    category: 'Cloud',
    date: '2026-09-19',
    day: 'Day 2 \u2014 Saturday',
    dayShort: 'Day 2',
    startTime: '13:00',
    endTime: '18:00',
    mode: 'Hybrid',
    venue: 'Lab 5, Nexus Convention Center',
    description: 'Deploy a scalable, fault-tolerant application on a cloud platform within five hours. Architect microservices, configure CI/CD, and defend your infrastructure decisions.',
    longDescription: 'CloudForge tests your ability to architect and deploy production-grade cloud infrastructure under time pressure. Teams receive a pre-built application and must design the deployment architecture, containerize services, set up CI/CD pipelines, configure monitoring, and deploy to a cloud provider. The final 30 minutes involve a live architecture review with industry cloud engineers.',
    teamSize: { min: 1, max: 3 },
    prize: '\u20B920,000',
    prizeBreakdown: '1st: \u20B912,000 \u00B7 2nd: \u20B96,000 \u00B7 3rd: \u20B92,000',
    totalSeats: 36,
    registeredCount: 14,
    difficulty: 'Intermediate',
    rules: [
      'Teams of 1\u20133',
      'AWS, GCP, or Azure \u2014 choose your platform',
      'Free-tier resources only \u2014 no paid services',
      'Architecture documentation required (diagram + rationale)',
      'Live demo must handle simulated load test'
    ],
    prerequisites: [
      'Cloud platform basics (any major provider)',
      'Docker fundamentals',
      'Basic CI/CD pipeline experience (GitHub Actions, etc.)'
    ],
    icon: 'cloud'
  },
  {
    id: 'EVT-007',
    name: 'WebForge',
    slug: 'webforge',
    category: 'Web Development',
    date: '2026-09-20',
    day: 'Day 3 \u2014 Sunday',
    dayShort: 'Day 3',
    startTime: '09:00',
    endTime: '18:00',
    mode: 'In-person',
    venue: 'Hall A, Nexus Convention Center',
    description: 'Build a complete, functional web application from scratch in nine hours. Frontend, backend, database \u2014 ship a product that works and ship it well.',
    longDescription: 'WebForge is a full-stack web development competition where teams build a complete, deployable web application in nine hours. Unlike a hackathon that emphasizes the idea, WebForge specifically evaluates technical craft \u2014 code quality, architecture decisions, responsive design, accessibility, and deployment. The theme is announced at 9 AM. By 6 PM, your application must be live and functional.',
    teamSize: { min: 1, max: 3 },
    prize: '\u20B935,000',
    prizeBreakdown: '1st: \u20B921,000 \u00B7 2nd: \u20B910,500 \u00B7 3rd: \u20B93,500',
    totalSeats: 48,
    registeredCount: 31,
    difficulty: 'Intermediate',
    rules: [
      'Teams of 1\u20133',
      'Any technology stack permitted',
      'Application must be deployed and publicly accessible',
      'Source code submitted via Git repository',
      'Judged on: functionality (30%), code quality (25%), design (25%), creativity (20%)'
    ],
    prerequisites: [
      'Full-stack development experience',
      'Laptop with preferred development tools pre-configured',
      'Deployment platform account (Vercel, Netlify, Railway, etc.)'
    ],
    icon: 'globe'
  },
  {
    id: 'EVT-008',
    name: 'BitArena',
    slug: 'bitarena',
    category: 'Gaming',
    date: '2026-09-20',
    day: 'Day 3 \u2014 Sunday',
    dayShort: 'Day 3',
    startTime: '11:00',
    endTime: '20:00',
    mode: 'In-person',
    venue: 'Arena, Nexus Convention Center',
    description: 'Design and develop a playable game in under nine hours. 2D, 3D, puzzle, platformer \u2014 any genre. Create something fun, polished, and original.',
    longDescription: 'BitArena is a game jam compressed into a single high-energy day. Teams have nine hours to conceptualize, design, develop, and polish a playable game. The theme is revealed at event start. Submissions must be playable in a browser or as a downloadable build. Judging prioritizes gameplay feel and fun factor over graphical fidelity \u2014 a compelling 2D puzzle beats a buggy 3D world.',
    teamSize: { min: 1, max: 5 },
    prize: '\u20B925,000',
    prizeBreakdown: '1st: \u20B915,000 \u00B7 2nd: \u20B97,500 \u00B7 3rd: \u20B92,500',
    totalSeats: 32,
    registeredCount: 12,
    difficulty: 'Intermediate',
    rules: [
      'Teams of 1\u20135',
      'Any engine or framework (Unity, Godot, Phaser, custom, etc.)',
      'Pre-made assets allowed with proper attribution',
      'Game must be playable in browser or as downloadable executable',
      'Judged on: gameplay (35%), polish (25%), creativity (25%), technical merit (15%)'
    ],
    prerequisites: [
      'Game engine or framework experience recommended',
      'Art assets optional \u2014 gameplay is prioritized over visuals',
      'Controller support optional but appreciated'
    ],
    icon: 'gamepad-2'
  }
];

/* ============================================================
   HELPER FUNCTIONS
   Designed to be replaced with API calls later.
   ============================================================ */

export function getEventById(id) {
  return events.find(e => e.id === id) || null;
}

export function getEventBySlug(slug) {
  return events.find(e => e.slug === slug) || null;
}

export function getEventsByCategory(category) {
  if (!category || category === 'All') return [...events];
  return events.filter(e => e.category === category);
}

export function searchEvents(query, category = 'All') {
  let results = getEventsByCategory(category);
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }
  return results;
}

export function getCategories() {
  return CONFERENCE.categories;
}

export function getEventAvailability(event) {
  const remaining = event.totalSeats - event.registeredCount;
  const percentage = remaining / event.totalSeats * 100;

  if (remaining <= 0) return { status: 'full', label: 'Sold Out', remaining: 0, percentage: 0, cssClass: 'status--full' };
  if (percentage <= 10) return { status: 'almost-full', label: `${remaining} seat${remaining === 1 ? '' : 's'} left`, remaining, percentage, cssClass: 'status--almost-full' };
  if (percentage <= 40) return { status: 'filling', label: `${remaining} seats left`, remaining, percentage, cssClass: 'status--filling' };
  return { status: 'open', label: `${remaining} seats available`, remaining, percentage, cssClass: 'status--open' };
}

export function getEventsByDay() {
  const days = {};
  const dayNames = {
    '2026-09-18': { label: 'Day 1 \u2014 Friday, September 18', short: 'Day 1' },
    '2026-09-19': { label: 'Day 2 \u2014 Saturday, September 19', short: 'Day 2' },
    '2026-09-20': { label: 'Day 3 \u2014 Sunday, September 20', short: 'Day 3' }
  };

  events.forEach(e => {
    if (!days[e.date]) {
      days[e.date] = {
        ...dayNames[e.date],
        date: e.date,
        events: []
      };
    }
    days[e.date].events.push(e);
  });

  Object.values(days).forEach(day => {
    day.events.sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return days;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatTimeRange(start, end) {
  return `${formatTime(start)} \u2013 ${formatTime(end)}`;
}

export function checkTimeConflict(event1, event2) {
  if (event1.date !== event2.date) return false;
  if (event1.id === event2.id) return false;
  return event1.startTime < event2.endTime && event2.startTime < event1.endTime;
}

export function getCategoryColor(category) {
  const map = {
    'Hackathon': 'var(--cat-hackathon)',
    'AI / ML': 'var(--cat-ai)',
    'Cybersecurity': 'var(--cat-cyber)',
    'Robotics': 'var(--cat-robotics)',
    'UI/UX': 'var(--cat-uiux)',
    'Cloud': 'var(--cat-cloud)',
    'Web Development': 'var(--cat-webdev)',
    'Gaming': 'var(--cat-gaming)'
  };
  return map[category] || 'var(--color-accent)';
}

export function getCategoryIcon(category) {
  const map = {
    'Hackathon': 'code-2',
    'AI / ML': 'brain',
    'Cybersecurity': 'shield',
    'Robotics': 'cpu',
    'UI/UX': 'palette',
    'Cloud': 'cloud',
    'Web Development': 'globe',
    'Gaming': 'gamepad-2'
  };
  return map[category] || 'calendar';
}

export function getDurationHours(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
}
