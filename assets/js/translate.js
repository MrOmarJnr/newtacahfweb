function setLanguage(lang) {
    localStorage.setItem("site_lang", lang);

    // RTL support
    if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
    } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", lang);
    }

    const googleSelect = document.querySelector(".goog-te-combo");

    if (googleSelect) {
        googleSelect.value = lang;
        googleSelect.dispatchEvent(new Event("change"));
    }
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "en,fr,de,ar",
            autoDisplay: false
        },
        "google_translate_element"
    );

    // Apply saved language after Google loads
    const saved = localStorage.getItem("site_lang") || "en";

    setTimeout(() => {
        setLanguage(saved);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {

    const select = document.getElementById("langSelect");

    if (!select) return;

    const saved = localStorage.getItem("site_lang") || "en";

    select.value = saved;

    select.addEventListener("change", function () {
        setLanguage(this.value);
    });
});