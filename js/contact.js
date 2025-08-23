
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg = document.getElementById('cmsg').value.trim();
  if (!name || !email || !msg) return;
  // Send via mailto (works on static hosting). Replace with your email.
  const subject = encodeURIComponent('Website Message — Streaks Salon');
  const body = encodeURIComponent(`From: ${name} <${email}>

${msg}`);
  location.href = `mailto:hello@streakssalon.com?subject=${subject}&body=${body}`;
  document.getElementById('cstatus').textContent = 'Opening mail app...';
});
