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
  if (reveals.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
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
    }
  }

  /**
   * Newsletter signup via Formspree (or any compatible POST endpoint).
   *
   * Josipa: create a free form at https://formspree.io/ → New Form →
   * paste the endpoint below, e.g. "https://formspree.io/f/xxxxxxxx".
   * Leave empty until then; the UI will say the signup is not connected yet.
   */
  const NEWSLETTER_ENDPOINT = "";

  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const submitBtn = document.getElementById("newsletter-submit");
  const statusEl = document.getElementById("newsletter-status");

  if (!form || !emailInput || !submitBtn || !statusEl) return;

  const setStatus = (message, type) => {
    statusEl.hidden = !message;
    statusEl.textContent = message;
    statusEl.classList.toggle("is-success", type === "success");
    statusEl.classList.toggle("is-error", type === "error");
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      setStatus("Unesi valjanu email adresu.", "error");
      emailInput.focus();
      return;
    }

    if (!NEWSLETTER_ENDPOINT) {
      setStatus(
        "Prijava još nije spojena. Piši mi na noriecreativestudio@gmail.com pa te dodam.",
        "error"
      );
      return;
    }

    submitBtn.disabled = true;
    const previousLabel = submitBtn.textContent;
    submitBtn.textContent = "Šaljem…";

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          _subject: "Nova prijava na NORIE newsletter",
        }),
      });

      if (!response.ok) {
        throw new Error(`Newsletter signup failed (${response.status})`);
      }

      form.reset();
      setStatus("Hvala. Bit ćeš među prvima kad pošaljem iduću bilješku.", "success");
    } catch (_error) {
      setStatus("Nešto nije uspjelo. Probaj ponovo ili mi piši na mail.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = previousLabel;
    }
  });
})();
