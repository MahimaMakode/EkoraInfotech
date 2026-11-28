// Keep the copyright year up to date.
(() => {
  function updateFooterYear() {
    const yearElement = document.getElementById("footer-year");

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      updateFooterYear,
      { once: true }
    );
  } else {
    updateFooterYear();
  }
})();
