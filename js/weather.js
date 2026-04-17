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
  const dewPoints = src.map(r=>parseFloat(r[9])).filter(v=>!isNaN(v));
  const sky = src[Math.floor(src.length/2)]?.[7]||'-';
  
  const maxT = temps.length ? Math.max(...temps) : '-';
  const minT = temps.length ? Math.min(...temps) : '-';
  const avgH = humids.length ? Math.round(humids.reduce((a,b)=>a+b,0)/humids.length) : '-';
  const minDew = dewPoints.length ? Math.min(...dewPoints) : '-';
  const maxR = rains.length ? Math.max(...rains) : 0;
  
  // === 서리 위험도 계산 ===
  let frostRisk = 0;
  if (minDew !== '-' && minT !== '-') {
    // 이슬점이 낮을수록 위험도 증가
    frostRisk += Math.max(0, (0 - minDew) * 10);
    // 최저기온이 낮을수록 추가 위험
    frostRisk += Math.max(0, (3 - minT) * 5);
  }
  frostRisk = Math.min(100, Math.round(frostRisk));
  
  // 위험도에 따른 레벨 결정
  let riskEmoji, riskLevel, riskColor, riskBgColor;
  if (frostRisk >= 70) {
    riskEmoji = '🚨';
    riskLevel = '높음';
    riskColor = '#ef4444';
    riskBgColor = '#7f1d1d';
  } else if (frostRisk >= 40) {
    riskEmoji = '⚠️';
    riskLevel = '중간';
    riskColor = '#f59e0b';
    riskBgColor = '#78350f';
  } else {
    riskEmoji = '✅';
    riskLevel = '낮음';
    riskColor = '#10b981';
    riskBgColor = '#064e3b';
  }
  
  // 조치 사항
  let measures = '';
  if (frostRisk >= 70) {
    measures = `
      <div style="font-size:12px;color:#fca5a5;margin-top:8px;line-height:1.6">
        <strong>⚡ 즉시 조치:</strong><br>
        • 난방 시스템 점검<br>
        • 하우스 보온 강화<br>
        • 관수 중단 권장
      </div>`;
  } else if (frostRisk >= 40) {
    measures = `
      <div style="font-size:12px;color:#fcd34d;margin-top:8px;line-height:1.6">
        <strong>⚡ 예방 조치:</strong><br>
        • 난방 준비<br>
        • 환기 최소화<br>
        • 상태 모니터링
      </div>`;
  }
  
  // 진행바
  const barWidth = frostRisk;
  const frostWarning = frostRisk > 0 ? `
    <div style="background:#${riskBgColor};border:1px solid #${riskColor};color:#${riskColor};padding:12px;border-radius:6px;margin-top:12px;font-weight:600">
      ${riskEmoji} 오늘밤 서리 ${riskLevel}
      <div style="margin-top:8px">
        <div style="font-size:12px;color:#${riskColor};margin-bottom:4px">위험도: ${frostRisk}%</div>
        <div style="background:#0f172a;border-radius:4px;height:8px;overflow:hidden;width:100%">
          <div style="background:linear-gradient(90deg,#ef4444,#f59e0b);height:100%;width:${barWidth}%;border-radius:4px;"></div>
        </div>
      </div>
      ${measures}
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
// 이슬점 위험도 계산
const dewPoint = Math.min(...dewPoints); // 최저 이슬점
const minTemp = Math.min(...temps);      // 최저 기온

const dewPointMargin = minTemp - dewPoint; // 온도 여유도

// 위험도 판정
let dewPointRisk = '✅ 안전';
let dewPointColor = '#4CAF50'; // 초록

if (dewPointMargin < 5) {
  dewPointRisk = '⚠️ 주의';
  dewPointColor = '#FF9800'; // 주황
}
if (dewPointMargin < 2) {
  dewPointRisk = '🚨 위험';
  dewPointColor = '#F44336'; // 빨강
}

// UI
const dewPointCard = `
  <div class="card" style="border-left: 4px solid ${dewPointColor}">
    <h3>이슬점 위험도</h3>
    <div style="font-size: 24px; font-weight: bold; color: ${dewPointColor}">
      ${dewPointRisk}
    </div>
    <p>현재 온도: ${minTemp}°C</p>
    <p>최저 이슬점: ${dewPoint.toFixed(1)}°C</p>
    <p>여유도: ${dewPointMargin.toFixed(1)}°C</p>
    <p style="font-size: 12px; color: #999;">
      ${dewPointMargin < 2 ? '서리 발생 가능 - 보온 강화' : '현재 안전 상태'}
    </p>
  </div>
`;
