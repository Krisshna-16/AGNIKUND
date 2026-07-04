/* ==========================================================================
   AGNIKUND — GSAP Core Choreography Script
   ========================================================================== */

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/* ---------- Ember and Mist Particles Generation ---------- */
const emberField = document.getElementById('embers');
if (emberField) {
  // 1. Warm rising embers
  const EMBER_COUNT = 22;
  for (let i = 0; i < EMBER_COUNT; i++) {
    const e = document.createElement('div');
    e.className = 'ember-particle';
    const left = Math.random() * 100;
    const dur = 6 + Math.random() * 8;
    const delay = Math.random() * 10;
    const drift = (Math.random() * 60 - 30) + 'px';
    
    e.style.left = left + 'vw';
    e.style.animationDuration = dur + 's';
    e.style.animationDelay = delay + 's';
    e.style.setProperty('--drift', drift);
    
    emberField.appendChild(e);
  }

  // 2. Cool mountain mist particles (drifting near the top half)
  const MIST_COUNT = 15;
  for (let i = 0; i < MIST_COUNT; i++) {
    const m = document.createElement('div');
    m.className = 'mist-particle';
    const left = Math.random() * 100;
    const top = Math.random() * 45; // Start in upper half
    const dur = 12 + Math.random() * 12; // Slower than embers
    const delay = Math.random() * 15;
    const driftX = (Math.random() * 100 - 50) + 'px';
    const driftY = (Math.random() * 40 - 20) + 'px';
    
    m.style.left = left + 'vw';
    m.style.top = top + 'vh';
    m.style.animationDuration = dur + 's';
    m.style.animationDelay = delay + 's';
    m.style.setProperty('--drift-x', driftX);
    m.style.setProperty('--drift-y', driftY);
    
    emberField.appendChild(m);
  }
}

/* ---------- Hero Load-in Animation Timeline ---------- */
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .to('.location-badge', { opacity: 1, duration: 0.8, delay: 0.2 })
  .to('#eyebrow', { opacity: 1, duration: 0.8 }, '-=0.6')
  .to('#heroTitle', { duration: 1.2, '--stroke': 1 }, '-=0.6')
  .to('#tagline', { opacity: 1, duration: 1 }, '-=0.8')
  .to('#subTagline', { opacity: 0.7, duration: 1 }, '-=0.8');

/* ---------- Combined Hero Zoom-Through & Triptych ScrollTrigger ---------- */
const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let countUpPlayed = false;
function playStatsCountUp() {
  if (countUpPlayed) return;
  countUpPlayed = true;

  if (isReduced) {
    document.getElementById('stat-trained').textContent = '200+';
    document.getElementById('stat-disc').textContent = '3';
    document.getElementById('stat-fire').textContent = '1';
    return;
  }

  // Animate 200+
  const obj1 = { val: 0 };
  gsap.to(obj1, {
    val: 200,
    duration: 2.0,
    ease: 'power2.out',
    onUpdate: () => {
      document.getElementById('stat-trained').textContent = Math.floor(obj1.val) + '+';
    }
  });

  // Animate 3
  const obj2 = { val: 0 };
  gsap.to(obj2, {
    val: 3,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => {
      document.getElementById('stat-disc').textContent = Math.floor(obj2.val);
    }
  });

  // Animate 1
  const obj3 = { val: 0 };
  gsap.to(obj3, {
    val: 1,
    duration: 1.0,
    ease: 'power2.out',
    onUpdate: () => {
      document.getElementById('stat-fire').textContent = Math.floor(obj3.val);
    }
  });
}

const mainTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero-triptych-container',
    start: 'top top',
    end: '+=120%', // Pin for 120vh scroll distance
    scrub: 1,
    pin: true,
    pinSpacing: true
  }
});

if (!isReduced) {
  // Set origin for text zoom
  gsap.set('#heroTitle', { transformOrigin: 'center center' });

  // 1. Fade out location badge, eyebrow, tagline, sub-tagline, and scroll cue early (first 25% of hero scroll)
  mainTimeline.fromTo(['.location-badge', '#eyebrow', '#tagline', '.scroll-cue'], 
    { opacity: 1 },
    { opacity: 0, duration: 0.35, ease: 'power1.out' }, 
    0
  );
  mainTimeline.fromTo('#subTagline', 
    { opacity: 0.7 },
    { opacity: 0, duration: 0.35, ease: 'power1.out' }, 
    0
  );

  // Mountain parallax shift
  mainTimeline.to('.mountain-bg', {
    y: 80,
    ease: 'none',
    duration: 1.2
  }, 0);

  // 2. Zoom-through: scale up wordmark to 18x
  mainTimeline.to('#heroTitle', {
    scale: 18,
    duration: 1.2,
    ease: 'power2.in'
  }, 0);

  // 3. Dissolve wordmark as it grows past 300-400% scale
  mainTimeline.to('#heroTitle', {
    opacity: 0,
    duration: 0.45,
    ease: 'power1.in'
  }, 0.35);

  // 4. Hero section glow intensifies before it dissolves
  mainTimeline.to('.hero h1', {
    textShadow: '0 0 60px rgba(255, 90, 31, 0.95)',
    duration: 0.5
  }, 0);

  // --- Athlete Deadlift Animation ---
  // Fade in the athlete container as the wordmark starts expanding
  mainTimeline.to('.hero-athlete-container', {
    opacity: 0.25,
    duration: 0.4,
    ease: 'power1.out'
  }, 0.15);

  // Fade out athlete container as the wordmark completes zoom and dissolves
  mainTimeline.to('.hero-athlete-container', {
    opacity: 0,
    duration: 0.35,
    ease: 'power1.in'
  }, 0.85);

  // Morph left leg to standing lockout
  mainTimeline.to('#legL', {
    attr: { d: 'M 135 250 L 135 200 L 135 150' },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Morph right leg to standing lockout
  mainTimeline.to('#legR', {
    attr: { d: 'M 165 250 L 165 200 L 165 150' },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Translate hips upward
  mainTimeline.to('#pelvis', {
    attr: { x1: 135, y1: 150, x2: 165, y2: 150 },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Erect torso standing tall
  mainTimeline.to('#torso', {
    attr: { x1: 150, y1: 150, x2: 150, y2: 90 },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Raise head standing tall
  mainTimeline.to('#head', {
    attr: { cy: 65 },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Extend left arm
  mainTimeline.to('#armL', {
    attr: { x1: 135, y1: 90, x2: 135, y2: 150 },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Extend right arm
  mainTimeline.to('#armR', {
    attr: { x1: 165, y1: 90, x2: 165, y2: 150 },
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);

  // Translate barbell group upward to locked out height
  mainTimeline.to('#barbellGroup', {
    y: -70,
    duration: 1.2,
    ease: 'power1.inOut'
  }, 0);
  // ----------------------------------

  // 5. Fade out the hero background gradient
  mainTimeline.to('.hero', {
    opacity: 0,
    duration: 0.4,
    ease: 'power1.inOut'
  }, 0.8);

  // Fade in Stats Strip and count up numbers as hero dissolves
  mainTimeline.to('.stats-strip', {
    opacity: 1,
    duration: 0.4,
    ease: 'power1.inOut',
    onStart: playStatsCountUp
  }, 0.8);
} else {
  // Respect reduced motion: simple crossfade between hero and stats strip
  mainTimeline.to('.hero', {
    opacity: 0,
    duration: 0.8,
    ease: 'power1.inOut'
  }, 0);

  mainTimeline.to('.stats-strip', {
    opacity: 1,
    duration: 0.8,
    ease: 'power1.inOut',
    onStart: playStatsCountUp
  }, 0.4);

  // Set static standing pose for prefers-reduced-motion
  gsap.set('#legL', { attr: { d: 'M 135 250 L 135 200 L 135 150' } });
  gsap.set('#legR', { attr: { d: 'M 165 250 L 165 200 L 165 150' } });
  gsap.set('#pelvis', { attr: { x1: 135, y1: 150, x2: 165, y2: 150 } });
  gsap.set('#torso', { attr: { x1: 150, y1: 150, x2: 150, y2: 90 } });
  gsap.set('#head', { attr: { cy: 65 } });
  gsap.set('#armL', { attr: { x1: 135, y1: 90, x2: 135, y2: 150 } });
  gsap.set('#armR', { attr: { x1: 165, y1: 90, x2: 165, y2: 150 } });
  gsap.set('#barbellGroup', { y: -70 });
  gsap.set('.hero-athlete-container', { opacity: 0.22 });
}

/* ---------- Manifesto Line and Paragraph Reveal ---------- */
gsap.utils.toArray('.reveal-line span').forEach((line, i) => {
  gsap.to(line, {
    y: '0%',
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.manifesto',
      start: 'top 70%',
    },
    delay: i * 0.12
  });
});

// Set initial invisible state for manifesto body paragraph
gsap.set('.manifesto p', { opacity: 0, y: 20 });

gsap.to('.manifesto p', {
  opacity: 1,
  y: 0,
  duration: 1,
  scrollTrigger: {
    trigger: '.manifesto p',
    start: 'top 85%'
  }
});

/* ---------- Program Cards Staggered Rise-in ---------- */
gsap.utils.toArray('.program-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 30,
    duration: 0.7,
    delay: i * 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 90%'
    }
  });
});

/* ---------- CTA Header Entrance ---------- */
gsap.from('.cta h2', {
  opacity: 0,
  y: 40,
  duration: 1,
  scrollTrigger: {
    trigger: '.cta',
    start: 'top 75%'
  }
});

/* ---------- Trainer Cards Staggered Rise-in ---------- */
gsap.utils.toArray('.trainer-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 35,
    duration: 0.8,
    delay: i * 0.10,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.trainers-section',
      start: 'top 85%'
    }
  });
});

/* ---------- Draggable Carousel for Desktop ---------- */
const slider = document.querySelector('.trainers-carousel-wrapper');
if (slider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed factor
    slider.scrollLeft = scrollLeft - walk;
  });
}

/* ---------- Schedule Grid Hover Dimming Interaction ---------- */
const timetable = document.querySelector('.timetable');
if (timetable) {
  const cells = timetable.querySelectorAll('tbody td:not(.time-col)');
  cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
      const colIndex = cell.cellIndex;
      const row = cell.parentElement;
      
      timetable.classList.add('dimmed');
      
      const allCells = timetable.querySelectorAll('tbody td');
      allCells.forEach(c => {
        const cColIndex = c.cellIndex;
        const cRow = c.parentElement;
        
        if (cRow === row || cColIndex === colIndex) {
          c.classList.add('active-hover');
        } else {
          c.classList.remove('active-hover');
        }
      });
    });
    
    cell.addEventListener('mouseleave', () => {
      timetable.classList.remove('dimmed');
      const allCells = timetable.querySelectorAll('tbody td');
      allCells.forEach(c => {
        c.classList.remove('active-hover');
      });
    });
  });
}

/* ---------- Mobile Schedule Accordion Toggles ---------- */
const accordionItems = document.querySelectorAll('.timetable-mobile-wrapper .accordion-item');
accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  header.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close other items
    accordionItems.forEach(i => i.classList.remove('active'));
    
    // Toggle clicked item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

/* ---------- Schedule Section Fade-in ScrollTrigger ---------- */
gsap.from('.schedule-section', {
  opacity: 0,
  y: 30,
  duration: 1.0,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.schedule-section',
    start: 'top 85%'
  }
});

/* ---------- Membership Pricing Cards Staggered Rise-in ---------- */
gsap.utils.toArray('.pricing-card').forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 35,
    duration: 0.8,
    delay: i * 0.10,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.membership-section',
      start: 'top 85%'
    }
  });
});

/* ---------- Gallery Drag Carousel ---------- */
const gallerySlider = document.querySelector('.gallery-carousel-wrapper');
if (gallerySlider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  gallerySlider.addEventListener('mousedown', (e) => {
    isDown = true;
    gallerySlider.style.cursor = 'grabbing';
    startX = e.pageX - gallerySlider.offsetLeft;
    scrollLeft = gallerySlider.scrollLeft;
  });
  gallerySlider.addEventListener('mouseleave', () => {
    isDown = false;
    gallerySlider.style.cursor = 'grab';
  });
  gallerySlider.addEventListener('mouseup', () => {
    isDown = false;
    gallerySlider.style.cursor = 'grab';
  });
  gallerySlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - gallerySlider.offsetLeft;
    const walk = (x - startX) * 1.5;
    gallerySlider.scrollLeft = scrollLeft - walk;
  });
}

/* ---------- Gallery Horizontal Parallax Effect ---------- */
const galleryWrapper = document.querySelector('.gallery-carousel-wrapper');
if (galleryWrapper) {
  const items = galleryWrapper.querySelectorAll('.gallery-item');
  
  const updateParallax = () => {
    const wrapperRect = galleryWrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
    
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      
      // Calculate offset from center of wrapper (-1 to 1)
      const offset = (itemCenter - wrapperCenter) / (window.innerWidth / 2);
      
      // Max shift: 35px
      const shift = offset * -35; 
      
      const placeholder = item.querySelector('.gallery-placeholder');
      if (placeholder) {
        placeholder.style.transform = `translateX(${shift}px)`;
      }
    });
  };

  galleryWrapper.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);
  // Run once initially
  updateParallax();
}

/* ---------- Gallery Section Fade-in ScrollTrigger ---------- */
gsap.from('.gallery-section', {
  opacity: 0,
  y: 30,
  duration: 1.0,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.gallery-section',
    start: 'top 85%'
  }
});

/* ---------- FAQ Accordion Click Toggles ---------- */
const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
faqItems.forEach(item => {
  const header = item.querySelector('.faq-header');
  header.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all other items
    faqItems.forEach(i => {
      i.classList.remove('active');
    });
    
    // Toggle clicked item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

/* ---------- FAQ Section Fade-in ScrollTrigger ---------- */
gsap.from('.faq-section', {
  opacity: 0,
  y: 30,
  duration: 1.0,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.faq-section',
    start: 'top 85%'
  }
});
