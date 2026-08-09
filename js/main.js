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
   * Newsletter via MailerLite (no API key in the browser).
   *
   * Josipa: u MailerLite napravi Embedded form, otvori Overview → Embed → HTML,
   * u kodu nađi action="https://assets.mailerlite.com/jsonp/.../subscribe"
   * i zalijepi taj URL dolje u MAILERLITE_FORM_ACTION (samo URL, bez navodnika).
   *
   * Primjer oblika:
   * "https://assets.mailerlite.com/jsonp/123456/forms/98765432101234567/subscribe"
   *
   * Dok je prazno, forma pokazuje da prijava još nije spojena.
   */
  const MAILERLITE_FORM_ACTION = "";

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

  const submitToMailerLite = (actionUrl, email) =>
    new Promise((resolve, reject) => {
      const callbackName = `mlCb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
      const script = document.createElement("script");
      let settled = false;

      const cleanup = () => {
        window.clearTimeout(timer);
        try {
          delete window[callbackName];
        } catch (_err) {
          window[callbackName] = undefined;
        }
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        fn(value);
      };

      const timer = window.setTimeout(() => {
        finish(reject, new Error("MailerLite timeout"));
      }, 12000);

      window[callbackName] = (response) => {
        if (response && (response.success === true || response.success === "true")) {
          finish(resolve, response);
          return;
        }
        finish(reject, response || new Error("MailerLite subscribe failed"));
      };

      let url;
      try {
        url = new URL(actionUrl);
      } catch (_err) {
        finish(reject, new Error("Invalid MailerLite form action URL"));
        return;
      }

      url.searchParams.set("fields[email]", email);
      url.searchParams.set("ml-submit", "1");
      url.searchParams.set("anticsrf", "true");
      url.searchParams.set("callback", callbackName);

      script.src = url.toString();
      script.async = true;
      script.onerror = () => finish(reject, new Error("MailerLite script error"));
      document.body.appendChild(script);
    });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      setStatus("Unesi valjanu email adresu.", "error");
      emailInput.focus();
      return;
    }

    if (!MAILERLITE_FORM_ACTION) {
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
      await submitToMailerLite(MAILERLITE_FORM_ACTION, email);
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
