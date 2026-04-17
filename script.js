// ===== LUCIDE ICONS =====
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ===== GSAP & SCROLLTRIGGER REGISTRATION =====
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== HAMBURGER MENU TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navHeaderEl = document.querySelector('.nav-header');

if (navToggle && navHeaderEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = navHeaderEl.classList.toggle('menu-open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // Prevent page scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navHeaderEl.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navHeaderEl.classList.remove('menu-open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside tap
  document.addEventListener('click', (e) => {
    if (navHeaderEl.classList.contains('menu-open') && !navHeaderEl.contains(e.target)) {
      navHeaderEl.classList.remove('menu-open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ===== PREMIUM HERO EXPERIENCE =====
const hero = document.getElementById('hero');
const pageHero = document.querySelector('.page-hero');
const navHeader = document.querySelector('.nav-header');
const button = document.querySelector('.cta-button');
const heroHeight = window.innerHeight;
let navVisible = false;

// Only apply hero-specific behavior if on the home page (has hero element)
if (hero) {
  // Initialize hero to fully visible state
  hero.style.opacity = '1';
  hero.style.filter = 'blur(0px)';
  
  // Disable scrolling during hero animation (desktop only — skip on touch devices)
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (!isTouchDevice) {
    document.body.style.overflow = 'hidden';
    // Overflow is restored by GSAP onComplete; this timeout is a safety fallback only
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 2000);
  }

  // ===== GSAP HERO ENTRANCE =====
  // To revert: remove the gsap.min.js script tag from index.html and delete this block
  if (typeof gsap !== 'undefined') {
    const heroContent = document.querySelector('.hero-content');
    const h1 = hero.querySelector('h1');
    const heroP = hero.querySelector('p');
    const ctaBtn = hero.querySelector('.cta-button');
    const mountainPaths = document.querySelectorAll('.mountain-background path');

    // Set initial states before revealing hero-content, so there's no flash
    gsap.set(mountainPaths, { opacity: 0, y: 50 });
    if (h1) gsap.set(h1, { opacity: 0, y: 50 });
    if (heroP) gsap.set(heroP, { opacity: 0, y: 30 });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, y: 20, scale: 0.92 });

    // Cancel the CSS content-reveal animation — GSAP drives it now
    if (heroContent) {
      heroContent.style.animation = 'none';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }

    // Orchestrated timeline — restores scrollbar exactly when animation finishes
    const heroTL = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = 'auto';
      }
    });

    // Mountain layers stagger in: back → middle → front
    heroTL.to(mountainPaths, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: 'power2.out'
    }, 0);

    // Heading slides up after mountains start arriving
    if (h1) heroTL.to(h1, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.5);

    // Subtitle follows heading
    if (heroP) heroTL.to(heroP, {
      opacity: 0.9,
      y: 0,
      duration: 0.7,
      ease: 'power2.out'
    }, 0.8);

    // CTA button pops in with a subtle bounce
    if (ctaBtn) heroTL.to(ctaBtn, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, 1.05);

    // ===== SCROLL-DRIVEN IMMERSIVE EXPERIENCE (Inspired by "The Boat") =====
    // Parallax for mountain layers as you scroll
    mountainPaths.forEach((path, i) => {
      gsap.to(path, {
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: (i + 1) * 50, // Each layer moves at a different speed
        ease: "none"
      });
    });

    // Fade out hero content and blur hero as you scroll
    gsap.to([heroContent, hero], {
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      opacity: 0,
      filter: "blur(10px)",
      y: 100,
      ease: "none"
    });

    // Navigation visibility toggle
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom 80%",
      onEnter: () => {
        navHeader.classList.add('visible');
        navVisible = true;
      },
      onLeaveBack: () => {
        navHeader.classList.remove('visible');
        navVisible = false;
      }
    });
  }
} else if (pageHero) {
  // Apply parallax to page-hero on non-home pages
  if (typeof gsap !== 'undefined') {
    const mountainPaths = document.querySelectorAll('.mountain-background path');
    if (mountainPaths.length > 0) {
      mountainPaths.forEach((path, i) => {
        gsap.to(path, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
          },
          y: (i + 1) * 30,
          ease: "none"
        });
      });
    }
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax: Move page-hero up as you scroll at 0.5x speed
    pageHero.style.transform = `translateY(${scrollY * 0.5}px)`;
    
    // Fade: Gradually reduce opacity as you scroll past the hero
    const pageHeroRect = pageHero.getBoundingClientRect();
    const pageHeroHeight = pageHeroRect.height;
    
    // Start fading when hero comes into view, complete fade by end of hero
    const fadeStart = pageHeroHeight;
    const fadeEnd = pageHeroHeight * 1.5;
    const pageHeroOpacity = Math.max(0, 1 - Math.max(0, scrollY - fadeStart) / (fadeEnd - fadeStart));
    
    pageHero.style.opacity = pageHeroOpacity;
    
    // Blur effect
    const blurAmount = Math.min(5, (scrollY / window.innerHeight) * 5);
    pageHero.style.filter = `blur(${blurAmount}px)`;
  });
  
  // Show navigation immediately on non-home pages
  if (navHeader) {
    navHeader.classList.add('visible');
  }
} else {
  // Fallback: show navigation if no hero elements found
  if (navHeader) {
    navHeader.classList.add('visible');
  }
}

// Smooth scroll behavior for buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== FEATURE CARDS REVEAL (GSAP SCROLLTRIGGER) =====
if (typeof gsap !== 'undefined') {
  // Home page feature cards
  gsap.from(".feature-card", {
    scrollTrigger: {
      trigger: ".feature-grid",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Initiatives page cards
  gsap.from(".initiative-card", {
    scrollTrigger: {
      trigger: ".initiatives-content",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
  });

  // Challenges page cards
  gsap.from(".challenge-card", {
    scrollTrigger: {
      trigger: ".challenges-grid",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const submitBtn = document.getElementById('submitBtn');
    const originalButtonText = submitBtn.textContent;

    // Clear previous messages
    formMessage.innerHTML = '';
    formMessage.className = 'form-message';

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send form data via AJAX
    fetch('contact.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Success message
        formMessage.innerHTML = data.message;
        formMessage.className = 'form-message success';
        
        // Reset form
        contactForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          formMessage.innerHTML = '';
          formMessage.className = 'form-message';
        }, 5000);
      } else {
        // Error message
        formMessage.innerHTML = data.message;
        formMessage.className = 'form-message error';
      }
    })
    .catch(error => {
      // Network or parsing error
      console.error('Error:', error);
      formMessage.innerHTML = 'An error occurred. Please try again later.';
      formMessage.className = 'form-message error';
    })
    .finally(() => {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalButtonText;
    });
  });
}

// Smooth scroll behavior for anchor links to initiative cards
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href*="#"]');
  if (!target) return;

  const href = target.getAttribute('href');
  const hash = href.split('#')[1];

  // Only handle if there's a hash and it's not just '#'
  if (hash && href.includes('#') && hash !== '') {
    const targetElement = document.getElementById(hash);
    
    if (targetElement) {
      e.preventDefault();
      
      // Use smooth scrolling behavior
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update URL without triggering navigation
      window.history.pushState(null, '', '#' + hash);
    }
  }
});
