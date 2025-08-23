
async function loadServices() {
  const res = await fetch('assets/services.json');
  const data = await res.json();
  const grid = document.getElementById('services-grid');
  grid.innerHTML = data.map(s => `
    <div class="card">
      <h3>${s.name}</h3>
      <p>Category: ${s.category}</p>
      <p>Duration: ${s.duration_min} min</p>
      <strong>AED ${s.price}</strong>
      <div style="margin-top:10px">
        <a class="btn" href="booking.html?service=${s.id}">Book</a>
      </div>
    </div>
  `).join('');
}
loadServices();
