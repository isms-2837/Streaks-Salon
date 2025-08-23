
async function loadServices() {
  const res = await fetch('assets/services.json');
  return res.json();
}

function timeslots(start='10:00', end='20:00', stepMin=30) {
  const out = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMin = sh*60 + sm;
  const endMin = eh*60 + em;
  for (let m=startMin; m<=endMin; m+=stepMin) {
    const hh = String(Math.floor(m/60)).padStart(2,'0');
    const mm = String(m%60).padStart(2,'0');
    out.push(`${hh}:${mm}`);
  }
  return out;
}

function generateICS({title, description, location, startISO, endISO}) {
  const dt = (d)=> d.replace(/[-:]/g, '').split('.')[0] + 'Z';
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Streaks Salon//Booking//EN
BEGIN:VEVENT
UID:${Date.now()}@streakssalon.com
DTSTAMP:${dt(new Date().toISOString())}
DTSTART:${dt(startISO)}
DTEND:${dt(endISO)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
}

function setMinDate() {
  const input = document.getElementById('date');
  const today = new Date();
  today.setHours(0,0,0,0);
  input.min = today.toISOString().split('T')[0];
}

async function initBooking() {
  setMinDate();
  const services = await loadServices();

  // populate service options
  const serviceSel = document.getElementById('service');
  serviceSel.innerHTML = services.map(s => `<option value="${s.id}" data-duration="${s.duration_min}" data-price="${s.price}">${s.name} — AED ${s.price}</option>`).join('');

  // populate time options
  const timeSel = document.getElementById('time');
  timeSel.innerHTML = timeslots().map(t=> `<option>${t}</option>`).join('');

  // prefill from URL
  const params = new URLSearchParams(location.search);
  if (params.get('service')) serviceSel.value = params.get('service');
  if (params.get('stylist')) document.getElementById('stylist').value = params.get('stylist');

  // handle submit
  document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const service = services.find(s => s.id === serviceSel.value);
    const stylist = document.getElementById('stylist').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const status = document.getElementById('status');

    if (!service || !date || !time || !name || !phone || !email) {
      status.textContent = 'Please fill all required fields.';
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + service.duration_min*60000);

    // Try backend if deployed, else fallback to mailto
    const payload = { service: service.name, stylist, date, time, name, phone, email, notes, duration_min: service.duration_min, price: service.price };
    let ok = false;
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
      ok = res.ok;
    } catch (e) {}

    if (!ok) {
      // Fallback: open email client
      const subject = encodeURIComponent('New Booking Request — Streaks Salon');
      const body = encodeURIComponent(Object.entries(payload).map(([k,v]) => `${k}: ${v}`).join('\n'));
      location.href = `mailto:hello@streakssalon.com?subject=${subject}&body=${body}`;
      status.textContent = 'Sending via email…';
    } else {
      status.textContent = 'Request sent! We will confirm shortly.';
    }
    // Save locally so user sees it
    const bookings = JSON.parse(localStorage.getItem('bookings')||'[]');
    bookings.push(payload);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  });

  // ICS download
  document.getElementById('download-ics').addEventListener('click', () => {
    const service = services.find(s => s.id === serviceSel.value);
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (!service || !date || !time) return;
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + service.duration_min*60000);
    const ics = generateICS({
      title: `Streaks Salon — ${service.name}`,
      description: `Service: ${service.name}\nDuration: ${service.duration_min} min`,
      location: 'Streaks Salon, Dubai',
      startISO: start.toISOString(),
      endISO: end.toISOString()
    });
    const blob = new Blob([ics], {type: 'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'streaks-salon-booking.ics';
    a.click();
    URL.revokeObjectURL(url);
  });
}

initBooking();
