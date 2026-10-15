(function () {
  const storageKey = "creator-studio-theme";
  const body = document.body;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  function applyTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    body.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
    if (icon) {
      icon.textContent = next === "dark" ? "☀" : "☾";
    }
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  const preferredTheme = localStorage.getItem(storageKey);
  applyTheme(preferredTheme || "dark");

  if (toggle) {
    toggle.addEventListener("click", function () {
      const current = body.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
