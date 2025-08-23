
async function loadTeam() {
  const res = await fetch('assets/team.json');
  const data = await res.json();
  const grid = document.getElementById('team-grid');
  grid.innerHTML = data.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p class="lead">${p.role}</p>
      <p>${p.bio}</p>
      <a class="btn" href="booking.html?stylist=${encodeURIComponent(p.name)}">Book with ${p.name.split(' ')[0]}</a>
    </div>
  `).join('');
}
loadTeam();
