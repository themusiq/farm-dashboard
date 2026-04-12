function renderGDD(rows, crop) {
  const card = document.getElementById('gdd-card');
  const cfg = CROP_CONFIG[crop];
  const dataRow = rows.slice(1).find(r=>r[1]===crop);
  if(!dataRow){
    card.innerHTML=`<div class="card-label">적산온도 · ${crop}</div><div class="empty">작기 정보 없음</div>`;
    return;
  }
  const current=parseFloat(dataRow[12])||0;
  const target=parseFloat(dataRow[9])||cfg.gddTarget;
  const progress=Math.min(100,Math.round((current/target)*100));
  const startDate=dataRow[3]?new Date(dataRow[3]):null;
  const targetDate=dataRow[4]?new Date(dataRow[4]):null;
  const today=new Date();
  const daysSince=startDate?Math.floor((today-startDate)/86400000):'-';
  const daysTo=targetDate?Math.floor((targetDate-today)/86400000):'-';
  let stage='발아·발근기';let si=0;
  if(progress>=20){stage='신초신장기';si=1;}
  if(progress>=50){stage='착과·비대기';si=2;}
  if(progress>=80){stage='수확 적기 진입';si=3;}
  const stages=['발아·발근','신초신장','착과·비대','수확적기'];
  card.innerHTML=`<div class="card-label">적산온도 · ${crop}</div>
    <div class="gdd-main"><div class="gdd-val">${current.toFixed(1)}°C</div><div class="gdd-pct">${progress}%</div></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${progress}%"></div></div>
    <div class="stage-labels">${stages.map((s,i)=>`<span style="color:${i===si?'#94a3b8':'#334155'}">${s}</span>`).join('')}</div>
    <div style="font-size:12px;color:#94a3b8;margin-bottom:4px">현재 단계: <strong style="color:#e2e8f0">${stage}</strong></div>
    <div class="meta-row">
      <span>목표 <strong>${target}°C</strong></span>
      <span>작기 <strong>D+${daysSince}</strong></span>
      <span>수확 예상 <strong style="color:#06b6d4">D-${daysTo}</strong></span>
    </div>`;
}

function renderHarvest() {
  const card = document.getElementById('harvest-card');
  card.innerHTML=`<div class="card-label">수확량 예측 · 포도</div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:22px;font-weight:700">목표 2,000kg</div>
      <div style="font-size:12px;color:#94a3b8">300평 · 주당 3.5kg</div></div>
      <div style="text-align:right"><div style="font-size:13px;color:#475569">총 565주</div>
      <div style="font-size:11px;color:#334155">온실 300 + 노지 265</div></div>
    </div>
    <div style="font-size:11px;color:#475569;margin-top:8px">착과 시기에 구역별 착과수 입력하면 자동 계산됩니다</div>`;
}
