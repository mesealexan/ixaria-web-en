const root = document.documentElement;
const revealItems = [...document.querySelectorAll("[data-reveal]")];
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const siteHeader = document.querySelector(".site-header");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 220)}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === currentId);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -35% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  root.style.setProperty("--scroll-progress", progress.toFixed(2));
  siteHeader?.classList.toggle("is-scrolled", scrollTop > 24);

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    const rect = item.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - rect.top) * speed;
    item.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
  });
};

let ticking = false;
const requestScrollUpdate = () => {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
};

updateScrollEffects();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = href ? document.querySelector(href) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const newsletterForm = document.querySelector(".newsletter-form");
const newsletterNote = document.querySelector("#newsletter-note");

if (newsletterForm && newsletterNote) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterNote.textContent =
      "Thanks. This demo sign-up is captured as a placeholder until the live newsletter integration is connected.";
    newsletterNote.dataset.state = "success";
  });
}
