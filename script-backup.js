(() => {
  const backToTop = document.getElementById("backToTop");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

    // Adjusted observer: highlight section when its top is near viewport top
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the top and visible
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
      },
    );

    sections.forEach((s) => observer.observe(s));
  }
})();
