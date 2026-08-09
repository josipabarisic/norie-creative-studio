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
   * Flodesk inline form only (no custom Norie chrome / placeholder form).
   * Mount target in HTML: #fd-form-{FLODESK_FORM_ID}
   */
  const FLODESK_FORM_ID = "6a786294f6a3ec722d645dd9";

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
    const containerEl = `#fd-form-${formId}`;
    if (!document.querySelector(containerEl)) return;

    ensureFlodeskUniversal();
    window.fd("form", {
      formId,
      containerEl,
    });
  };

  const initFlodesk = () => {
    if (!FLODESK_FORM_ID) return;
    mountFlodeskInline(FLODESK_FORM_ID.trim());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFlodesk);
  } else {
    initFlodesk();
  }
})();
