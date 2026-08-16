export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // once: true
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => observer.observe(el));
}

export function initHeroAnimations() {
  initHomeAnimations();
}

export function initHomeAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }
  
  try {
    if (!window.gsap) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }
    const gsap = window.gsap;
    
    gsap.from('.hero__eyebrow, .hero__title, .hero__subtitle, .hero__meta, .hero__cta', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2
    });
    
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
      
      gsap.utils.toArray('.hero__stat-value').forEach(stat => {
        const val = parseInt(stat.textContent) || 100;
        gsap.from(stat, {
          textContent: 0,
          duration: 1.5,
          snap: { textContent: 1 },
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.hero__stats',
            start: 'top 80%'
          },
          onUpdate: function() {
            stat.textContent = Math.ceil(this.targets()[0].textContent);
          }
        });
      });
      
      gsap.utils.toArray('.section').forEach(sec => {
        gsap.from(sec, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%'
          }
        });
      });
    }
  } catch(e) {
    console.error('GSAP animation error:', e);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }
}

export function initAnimations() {
  initScrollReveal();
  if (document.body && document.body.dataset.page === 'home') {
    initHomeAnimations();
  }
}
