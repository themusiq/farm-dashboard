function makeDonut(pct, color, size=80) {
  const r=28,cx=40,cy=40,circ=2*Math.PI*r;
  const dash=circ*(pct/100),gap=circ-dash;
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0f172a" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
      stroke-dasharray="${dash} ${gap}" stroke-linecap="round"/></svg>`;
}

function donutCard(label, info, limit, note='') {
  if(!info) return `<div class="donut-item">
    <div class="donut-wrap">${makeDonut(0,'#334155')}
    <div class="donut-center"><div class="donut-day">-</div><div class="donut-sub">기록없음</div></div></div>
    <div class="donut-label">${label}</div>
    <div class="donut-status status-ok">${note}</div></div>`;
  const pct=Math.min(100,Math.round((info.diff/limit)*100));
  const color=info.diff>=limit?'#ef4444':info.diff>=limit-1?'#f59e0b':'#10b981';
  const cls=info.diff>=limit?'status-danger':info.diff>=limit-1?'status-warn':'status-ok';
  const statusTxt=info.diff>=limit?'관수 필요':info.diff>=limit-1?'내일 확인':'충분';
  return `<div class="donut-item">
    <div class="donut-wrap">${makeDonut(pct,color)}
    <div class="donut-center"><div class="donut-day" style="color:${color}">D+${info.diff}</div>
    <div class="donut-sub">${limit}일 주기</div></div></div>
    <div class="donut-label">${label}</div>
    <div class="donut-status ${cls}">${statusTxt}</div>
    ${info.amount?`<div style="font-size:10px;color:#475569">${Number(info.amount).toLocaleString()}L</div>`:''}
  </div>`;
}

function renderWaterDonut(rows, crop) {
  const card = document.getElementById('water-card');
  const today = new Date();
  function getDiff(arr) {
    if(!arr.length) return null;
    const last=arr.sort((a,b)=>new Date(b[2])-new Date(a[2]))[0];
    return {diff:Math.floor((today-new Date(last[2]))/86400000),date:last[2],amount:last[5]};
  }
  if(crop==='포도') {
    const ghRows=rows.slice(1).filter(r=>r[2]&&((r[4]||'').includes('1동')||(r[4]||'').includes('2동')||(r[4]||'').includes('온실')||(r[4]||'').includes('하우스')));
    const ozRows=rows.slice(1).filter(r=>r[2]&&(r[4]||'').includes('노지'));
    const allRows=rows.slice(1).filter(r=>r[2]);
    card.innerHTML=`<div class="card-label">관수 현황 · 포도</div>
      <div style="font-size:11px;color:#475569;margin-bottom:8px">온실: 5일 1회 15톤 · 착과기 3일 1회 20톤</div>
      <div class="donut-grid">
        ${donutCard('🏠 온실 1동',getDiff([...ghRows]),5)}
        ${donutCard('🏠 온실 2동',getDiff([...ghRows]),5)}
        ${donutCard('🌿 노지',getDiff([...ozRows]),14,'강우 시 자연공급')}
        ${donutCard('전체',getDiff([...allRows]),5)}
      </div>`;
    return;
  }
  const allRows=rows.slice(1).filter(r=>r[2]);
  if(!allRows.length){card.innerHTML=`<div class="card-label">관수 현황 · ${crop}</div><div class="empty">관수 기록 없음</div>`;return;}
  const info=getDiff([...allRows]);
  const limit=CROP_CONFIG[crop].waterLimit;
  const pct=Math.min(100,Math.round((info.diff/limit)*100));
  const color=info.diff>=limit?'#ef4444':info.diff>=limit-1?'#f59e0b':'#10b981';
  card.innerHTML=`<div class="card-label">관수 현황 · ${crop}</div>
    <div style="display:flex;align-items:center;gap:16px;padding:8px 0">
      <div class="donut-wrap">${makeDonut(pct,color)}
      <div class="donut-center"><div class="donut-day" style="color:${color}">D+${info.diff}</div>
      <div class="donut-sub">마지막</div></div></div>
      <div><div style="font-size:13px;font-weight:500">${info.diff}일 전 관수</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">${info.date}</div>
      ${info.amount?`<div style="font-size:12px;color:#38bdf8;margin-top:2px">${Number(info.amount).toLocaleString()}L</div>`:''}
      </div></div>`;
}
