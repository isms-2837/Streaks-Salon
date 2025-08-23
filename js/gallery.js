
async function loadGallery() {
  const res = await fetch('assets/gallery.json');
  const data = await res.json();
  const wrap = document.getElementById('gallery');
  wrap.innerHTML = data.map((src, i) => `
    <div class="card"><img src="${src}" alt="Gallery ${i+1}"/></div>
  `).join('');
}
loadGallery();
