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
   * Newsletter via Flodesk inline embed (no API key in the browser).
   *
   * Josipa: u Flodesk napravi Inline form → Embed → kopiraj formId
   * (hex string iz koda, npr. formId: '...' ili id="fd-form-...").
   * Zalijepi taj ID dolje u FLODESK_FORM_ID.
   *
   * Primjer:
   * const FLODESK_FORM_ID = "5e95c67cb9c153002b5aa729";
   *
   * Dok je prazno, Norie forma ostaje vizualno tu, ali prijava nije spojena
   * (nema lažnog successa).
   */
  const FLODESK_FORM_ID = "";

  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const submitBtn = document.getElementById("newsletter-submit");
  const statusEl = document.getElementById("newsletter-status");
  const embedRoot = document.getElementById("newsletter-flodesk");

  const setStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message;
    statusEl.classList.toggle("is-success", type === "success");
    statusEl.classList.toggle("is-error", type === "error");
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const ensureFlodeskUniversal = () => {
    // Official Flodesk header snippet pattern (assets.flodesk.com/universal).
    window.FlodeskObject = "fd";
    const fn = function fdQueue() {
      (window.fd.q = window.fd.q || []).push(arguments);
    };
    window.fd = window.fd || fn;

    if (document.querySelector("script[data-flodesk-universal]")) return;

    const firstScript = document.getElementsByTagName("script")[0];
    const parent =
      (firstScript && firstScript.parentNode) || document.head;
    const version =
      "?v=" + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
    const base = "https://assets.flodesk.com/universal";

    const moduleScript = document.createElement("script");
    moduleScript.async = true;
    moduleScript.type = "module";
    moduleScript.src = base + ".mjs" + version;
    moduleScript.dataset.flodeskUniversal = "module";

    const nomoduleScript = document.createElement("script");
    nomoduleScript.async = true;
    nomoduleScript.noModule = true;
    nomoduleScript.src = base + ".js" + version;
    nomoduleScript.dataset.flodeskUniversal = "nomodule";

    parent.insertBefore(moduleScript, firstScript || null);
    parent.insertBefore(nomoduleScript, firstScript || null);
  };

  const mountFlodeskInline = (formId) => {
    if (!embedRoot || !form) return;

    const containerId = `fd-form-${formId}`;
    embedRoot.innerHTML = "";
    const container = document.createElement("div");
    container.id = containerId;
    embedRoot.appendChild(container);
    embedRoot.hidden = false;
    form.hidden = true;

    ensureFlodeskUniversal();
    window.fd("form", {
      formId,
      containerEl: `#${containerId}`,
    });
  };

  if (FLODESK_FORM_ID) {
    mountFlodeskInline(FLODESK_FORM_ID.trim());
    return;
  }

  if (!form || !emailInput || !submitBtn || !statusEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("", null);

    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      setStatus("Unesi valjanu email adresu.", "error");
      emailInput.focus();
      return;
    }

    setStatus(
      "Prijava još nije spojena na Flodesk. Piši mi na noriecreativestudio@gmail.com pa te dodam.",
      "error"
    );
  });
})();
