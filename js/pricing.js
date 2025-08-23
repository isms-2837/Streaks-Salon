
async function loadPricing() {
  const res = await fetch('assets/services.json');
  const data = await res.json();
  const tbody = document.querySelector('#pricing-table tbody');
  tbody.innerHTML = data.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.duration_min} min</td>
      <td>${s.price}</td>
    </tr>
  `).join('');
}
loadPricing();
