
// Basic helpers
document.addEventListener("DOMContentLoaded", () => {
  // Highlight current nav link
  const path = location.pathname.split('/').pop() || "index.html";
  document.querySelectorAll('.nav a.link').forEach(a => {
    if (a.getAttribute('href') === path) a.style.background = "var(--accent)";
  });
});
