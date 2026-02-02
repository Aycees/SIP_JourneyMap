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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible.length) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5],
        rootMargin: "-12% 0px -70% 0px",
      },
    );

    sections.forEach((s) => observer.observe(s));
  }
})();
