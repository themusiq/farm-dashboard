function renderWeather(rows) {
  const card = document.getElementById('weather-card');
  if(rows.length<2){
    card.innerHTML='<div class="card-label">오늘 기상 · 충남 부여</div><div class="empty">데이터 없음</div>';
    return;
  }
  
  const today = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const todayRows = rows.slice(1).filter(r=>String(r[1])===today);
  const src = todayRows.length ? todayRows : rows.slice(1).filter(r=>r[3]).slice(-18);
  const isToday = todayRows.length > 0;
  
  const temps = src.map(r=>parseFloat(r[3])).filter(v=>!isNaN(v));
  const humids = src.map(r=>parseFloat(r[4])).filter(v=>!isNaN(v));
  const rains = src.map(r=>parseFloat(r[5])).filter(v=>!isNaN(v));
  const dewPoints = src.map(r=>parseFloat(r[9])).filter(v=>!isNaN(v));  // ← index 9로 수정
  const sky = src[Math.floor(src.length/2)]?.[7]||'-';
  
  const maxT = temps.length ? Math.max(...temps) : '-';
  const minT = temps.length ? Math.min(...temps) : '-';
  const avgH = humids.length ? Math.round(humids.reduce((a,b)=>a+b,0)/humids.length) : '-';
  const minDew = dewPoints.length ? Math.min(...dewPoints) : '-';
  const maxR = rains.length ? Math.max(...rains) : 0;
  
  // 서리 경보 조건: 이슬점 < 0°C AND 온도 < 3°C
  const hasFrostRisk = minDew !== '-' && minDew < 0 && minT !== '-' && minT < 3;
  const frostWarning = hasFrostRisk ? 
    `<div style="background:#7f1d1d;border:1px solid #dc2626;color:#fca5a5;padding:12px;border-radius:6px;margin-top:12px;font-weight:600">
      🚨 서리 경보: 이슬점 ${minDew}°C, 최저기온 ${minT}°C
      <div style="font-size:12px;color:#f87171;margin-top:4px">야간 농작물 보호 필요</div>
    </div>` : '';
  
  const skyEmoji = sky==='맑음'?'☀️':sky==='구름많음'?'⛅':sky==='흐림'?'☁️':'🌤️';
  
  card.innerHTML=`<div class="card-label">${isToday?'오늘':'최근'} 기상 · 충남 부여</div>
    <div class="weather-main"><div class="temp-big">${maxT}°</div>
    <div><span style="font-size:26px">${skyEmoji}</span>
    <div style="font-size:12px;color:#94a3b8">${sky}</div></div></div>
    <div class="weather-sub">
      <span>최저 <strong style="color:#e2e8f0">${minT}°</strong></span>
      <span>습도 <strong style="color:#e2e8f0">${avgH}%</strong></span>
      <span>이슬점 <strong style="color:#${minDew !== '-' && minDew < 0 ? 'f87171' : 'e2e8f0'}">${minDew !== '-' ? minDew + '°' : '-'}</strong></span>
      <span>강수확률 <strong style="color:#e2e8f0">${maxR}%</strong></span>
      ${!isToday?'<span style="color:#475569">오늘 수집 중</span>':''}
    </div>
    ${frostWarning}`;
}
