function renderPestHistory(rows, crop) {
  const card = document.getElementById('safety-card');
  const today = new Date();
  const data = rows.slice(1).filter(r=>r[2]&&r[3]).slice(-5).reverse();
  if(!data.length){
    card.innerHTML=`<div class="card-label">방제 이력 · ${crop}</div><div class="empty">방제 기록 없음</div>`;
    return;
  }
  card.innerHTML=`<div class="card-label">방제 이력 · ${crop}</div>
    ${data.map(r=>{
      const elapsed=Math.floor((today-new Date(r[2]))/86400000);
      const safeDays=parseInt(r[9])||0;
      const remaining=safeDays>0?safeDays-elapsed:null;
      const name=r[3]||'-';
      const purpose=PEST_PURPOSE[name]||r[10]||'병해충 방제';
      let badge='',badgeCls='';
      if(remaining===null){badge='기록됨';badgeCls='badge-done';}
      else if(remaining<=0){badge='✅ 완료';badgeCls='badge-done';}
      else if(remaining<=2){badge=`⚠️ ${remaining}일`;badgeCls='badge-danger';}
      else{badge=`${remaining}일 남음`;badgeCls='badge-warn';}
      return `<div class="pest-item">
        <div class="pest-left">
          <div class="pest-name">${name}</div>
          <div class="pest-meta">${r[2]} · 안전기간 ${safeDays>0?safeDays+'일':'미기재'}</div>
          <div class="pest-purpose">목적: ${purpose}</div>
        </div>
        <span class="pest-badge ${badgeCls}">${badge}</span>
      </div>`;
    }).join('')}`;
}

function renderDisease(rows, crop) {
  const card = document.getElementById('disease-card');
  const data = rows.slice(1).filter(r=>r[0]);
  if(!data.length){
    card.innerHTML=`<div class="card-label">병해 경보 · ${crop}</div>
      <div style="text-align:center;padding:12px 0">
        <span class="dot dot-g"></span>
        <span style="font-size:15px;font-weight:600;color:#10b981">이상 없음</span>
        <div style="font-size:12px;color:#475569;margin-top:4px">병해 기록 없음</div></div>`;
    return;
  }
  const last=data[data.length-1];
  const sev=last[5]||'경';
  const dotCls=sev==='중증'?'dot-r':sev==='중'?'dot-y':'dot-g';
  const badgeCls=sev==='중증'?'badge-r':sev==='중'?'badge-y':'badge-g';
  const cropEmoji=crop==='포도'?'🍇':crop==='수박'?'🍉':'🥬';
  card.innerHTML=`<div class="card-label">병해 경보 · ${crop}</div>
    <div style="margin-top:4px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span class="dot ${dotCls}"></span>
        <span class="badge ${badgeCls}">${sev}</span>
        <span style="font-size:15px">${cropEmoji}</span>
        <span style="font-size:13px;font-weight:500">${crop}</span>
      </div>
      <div style="font-size:15px;font-weight:600;color:#f1f5f9">${last[3]||'-'}</div>
      <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">
        <span style="font-size:12px;color:#64748b">📅 ${last[2]||''}</span>
        <span style="font-size:12px;color:#64748b">📍 ${last[4]||''}</span>
      </div>
      ${last[6]?`<div style="font-size:12px;color:#94a3b8;margin-top:4px">발생비율: ${last[6]}%</div>`:''}
      ${last[7]?`<div style="font-size:12px;color:#06b6d4;margin-top:4px">✅ 조치: ${last[7]}</div>`:''}
    </div>`;
}
