
let selectedId = null;
let data = {};

const modal = document.getElementById('modal');
const nameInput = document.getElementById('name');
const descInput = document.getElementById('desc');
const colorInput = document.getElementById('color');

fetch('/zones').then(r => r.json()).then(z => {
  data = z;
  updateMap();
  updateRanking();
});

function updateMap() {
  const svgDoc = document.getElementById('map').contentDocument;
  if (!svgDoc) return setTimeout(updateMap, 100);

  [...svgDoc.querySelectorAll('[id]')].forEach(zone => {
    const info = data[zone.id];
    zone.style.cursor = 'pointer';
    if (info) {
      zone.style.fill = info.color;
    }
    zone.onclick = () => openModal(zone.id);
  });
}

function openModal(id) {
  selectedId = id;
  const info = data[id] || {};
  nameInput.value = info.name || '';
  descInput.value = info.description || '';
  colorInput.value = info.color || '#00ff00';
  modal.classList.remove('hidden');
}

document.getElementById('save').onclick = () => {
  data[selectedId] = {
    name: nameInput.value,
    description: descInput.value,
    color: colorInput.value
  };
  saveData();
};

document.getElementById('delete').onclick = () => {
  delete data[selectedId];
  saveData();
};

function saveData() {
  fetch('/zones', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(() => {
    modal.classList.add('hidden');
    updateMap();
    updateRanking();
  });
}

function updateRanking() {
  const counts = {};
  for (const id in data) {
    const name = data[id].name || 'Unnamed';
    counts[name] = (counts[name] || 0) + 1;
  }
  const list = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const ul = document.getElementById('ranking');
  ul.innerHTML = list.map(([name, count]) => `<li>${name} - ${count}</li>`).join('');
}
