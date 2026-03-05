
/**
 * Simple i18n for pure HTML (best quality manual translations)
 * - Uses data-i18n="key.path"
 * - Loads /assets/i18n/{lang}.json
 * - Persists language in localStorage
 * - Switches RTL for Arabic
 */

(function () {
  const SUPPORTED = ["en", "fr", "de", "ar"];
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "site_lang";

  function getSavedLang() {
    const v = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(v) ? v : DEFAULT_LANG;
  }

  function setHtmlDirection(lang) {
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", lang);
    }
  }

  function getValueByPath(obj, path) {
    return path.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : null), obj);
  }

  async function loadTranslations(lang) {
    const res = await fetch(`/assets/i18n/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not load translations: ${lang}`);
    return res.json();
  }

  function applyTranslations(dict) {
    // Text nodes
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getValueByPath(dict, key);
      if (val != null) el.textContent = val;
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = getValueByPath(dict, key);
      if (val != null) el.setAttribute("placeholder", val);
    });

    // Titles/tooltips
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const val = getValueByPath(dict, key);
      if (val != null) el.setAttribute("title", val);
    });
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);

    setHtmlDirection(lang);

    try {
      const dict = await loadTranslations(lang);
      applyTranslations(dict);
    } catch (err) {
      console.error(err);
      // fallback: English
      if (lang !== DEFAULT_LANG) {
        const dict = await loadTranslations(DEFAULT_LANG);
        applyTranslations(dict);
      }
    }

    // Keep dropdown synced
    const select = document.getElementById("langSelect");
    if (select) select.value = lang;
  }

  // Init on page load
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("langSelect");
    if (select) {
      select.addEventListener("change", (e) => setLanguage(e.target.value));
    }
    setLanguage(getSavedLang());
  });

  // Expose if you want buttons elsewhere
  window.setSiteLanguage = setLanguage;
})();
