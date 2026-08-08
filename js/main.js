(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const hero = document.querySelector(".hero");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll(".nav-links a");

  if (toggle && hero) {
    toggle.addEventListener("click", () => {
      const open = hero.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        hero.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
})();
