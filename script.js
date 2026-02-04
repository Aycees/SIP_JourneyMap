(() => {
  // Initialize Elements
  const backToTop = document.getElementById("backToTop");
  const yearEl = document.getElementById("year");
  const particleCanvas = document.getElementById("particleCanvas");

  // Set current year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Particle Animation System
  if (particleCanvas) {
    const ctx = particleCanvas.getContext("2d");
    let particles = [];
    let animationId;

    const setCanvasSize = () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * particleCanvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = -10;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        
        // Gradient colors
        const colors = [
          'rgba(99, 102, 241, 0.6)',    // Indigo
          'rgba(236, 72, 153, 0.6)',    // Pink
          'rgba(16, 185, 129, 0.6)',    // Green
          'rgba(245, 158, 11, 0.6)'     // Amber
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > particleCanvas.height || this.x < 0 || this.x > particleCanvas.width) {
          this.reset();
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animateParticles);
    };

    const startParticles = () => {
      setCanvasSize();
      initParticles();
      if (animationId) cancelAnimationFrame(animationId);
      animateParticles();
    };

    // Debounce resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(startParticles, 150);
    });

    // Start particles
    startParticles();
  }

  // Back to Top Button
  const toggleBackToTop = () => {
    if (!backToTop) return;
    const shouldShow = window.scrollY > 650;
    backToTop.classList.toggle("is-visible", shouldShow);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Navigation Active State
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const byId = new Map();
    for (const a of navLinks) {
      const hash = a.getAttribute("href");
      if (!hash) continue;
      byId.set(hash.slice(1), a);
    }

    const setActive = (id) => {
      for (const a of navLinks) {
        a.removeAttribute("aria-current");
        a.classList.remove("is-active");
      }
      const active = byId.get(id);
      if (active) {
        active.setAttribute("aria-current", "true");
        active.classList.add("is-active");
      }
    };

    // Fallback: highlight nav on click
    navLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        const hash = a.getAttribute("href");
        if (hash && byId.has(hash.slice(1))) {
          setActive(hash.slice(1));
        }
      });
    });

    // Intersection Observer for nav highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        let minTop = Infinity;
        let activeId = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            if (rect.top >= 0 && rect.top < minTop) {
              minTop = rect.top;
              activeId = entry.target.id;
            }
          }
        }
        if (activeId) setActive(activeId);
      },
      {
        root: null,
        threshold: 0.3,
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Parallax Effect for Hero
  const hero = document.querySelector('.hero');
  const heroCard = document.querySelector('.hero-card');
  
  if (hero && heroCard) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        heroCard.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroCard.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      }
    }, { passive: true });
  }

  // Add smooth scroll behavior for all anchor links
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

  // Add hover effect to journey fields
  const journeyFields = document.querySelectorAll('.journey-field');
  journeyFields.forEach(field => {
    field.addEventListener('mouseenter', function() {
      this.style.setProperty('--hover-intensity', '1');
    });
    field.addEventListener('mouseleave', function() {
      this.style.setProperty('--hover-intensity', '0');
    });
  });

  // Add year data attributes animation on scroll
  const journeyCards = document.querySelectorAll('.journey-card[data-year]');
  
  if ('IntersectionObserver' in window && journeyCards.length) {
    const yearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const year = entry.target.getAttribute('data-year');
            if (year) {
              setTimeout(() => {
                entry.target.style.setProperty('--year-opacity', '1');
              }, 300);
            }
            yearObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.2
      }
    );

    journeyCards.forEach(card => yearObserver.observe(card));
  }

  // Add floating animation to reflection sparkle
  const sparkle = document.querySelector('.reflection-sparkle');
  if (sparkle) {
    let floatDirection = 1;
    let floatPosition = 0;
    
    setInterval(() => {
      floatPosition += floatDirection * 0.5;
      if (floatPosition > 10 || floatPosition < -10) {
        floatDirection *= -1;
      }
      sparkle.style.transform = `translateY(${floatPosition}px) rotate(${floatPosition * 2}deg)`;
    }, 50);
  }

  // Keyboard navigation enhancement
  document.addEventListener('keydown', (e) => {
    // Press 'Home' to scroll to top
    if (e.key === 'Home' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press 'End' to scroll to footer
    if (e.key === 'End' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });

  console.log('%c🎓 AdDU Journey Map', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
  console.log('%cDesigned with creativity and passion', 'font-size: 12px; color: #6366f1;');
})();
