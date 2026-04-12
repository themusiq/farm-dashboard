let ALL_DATA = {};
let CURRENT_CROP = '포도';

async function loadData() {
  try {
    const res = await fetch('/api/sheets');
    ALL_DATA = await res.json();
    renderAll();
    document.getElementById('update-time').textContent =
      new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) + ' 업데이트';
  } catch(e) { console.error(e); }
}

function switchCrop(crop, btn) {
  CURRENT_CROP = crop;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderCropCards();
}

function renderAll() {
  renderWeather(ALL_DATA['기상'] || []);
  renderTasks(ALL_DATA, CURRENT_CROP);
  renderCropCards();
}

function renderCropCards() {
  renderGDD(ALL_DATA['작기정보'] || [], CURRENT_CROP);
  renderWaterDonut(ALL_DATA[CURRENT_CROP+'_관수'] || [], CURRENT_CROP);
  renderPestHistory(ALL_DATA[CURRENT_CROP+'_방제'] || [], CURRENT_CROP);
  renderDisease(ALL_DATA[CURRENT_CROP+'_병해'] || [], CURRENT_CROP);
  const hCard = document.getElementById('harvest-card');
  if(CURRENT_CROP === '포도') {
    hCard.style.display = 'block';
    renderHarvest();
  } else {
    hCard.style.display = 'none';
  }
}

loadData();
setInterval(loadData, 300000);
