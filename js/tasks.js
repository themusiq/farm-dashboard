function renderTasks(data, crop) {
  const area = document.getElementById('tasks-area');
  const tasks = [];
  const today = new Date();
  const seasonRows = (data['작기정보']||[]).slice(1);

  // 재배 규칙 기반 알림
  seasonRows.forEach(row => {
    const c = row[1];
    const current = parseFloat(row[12])||0;
    const target = parseFloat(row[9])||1;
    const pct = (current/target)*100;
    GROWTH_RULES.filter(r=>r.crop===c).forEach(rule=>{
      if(pct>=rule.gddMin && pct<rule.gddMax) {
        tasks.push({icon:rule.icon, cls:'task-'+rule.type,
          title:`${c} ${rule.title}`, desc:rule.desc});
      }
    });
  });

  // 관수 알림
  Object.keys(CROP_CONFIG).forEach(c=>{
    const rows=(data[c+'_관수']||[]).slice(1).filter(r=>r[2]);
    if(!rows.length) return;
    const last=rows.sort((a,b)=>new Date(b[2])-new Date(a[2]))[0];
    const diff=Math.floor((today-new Date(last[2]))/86400000);
    const limit=CROP_CONFIG[c].waterLimit;
    if(diff>=limit) tasks.push({icon:'💧',cls:'task-urgent',
      title:`${c} 관수 필요 (${diff}일 경과)`,desc:`권장 주기 ${limit}일 초과`});
    else if(diff>=limit-1) tasks.push({icon:'💧',cls:'task-warn',
      title:`${c} 관수 확인 (${diff}일 경과)`,desc:'내일 토양 상태 확인 권장'});
  });

  // 방제 안전기간 (미완료만)
  Object.keys(CROP_CONFIG).forEach(c=>{
    const rows=(data[c+'_방제']||[]).slice(1).filter(r=>r[2]&&r[9]);
    if(!rows.length) return;
    const last=rows.sort((a,b)=>new Date(b[2])-new Date(a[2]))[0];
    const elapsed=Math.floor((today-new Date(last[2]))/86400000);
    const remaining=parseInt(last[9])-elapsed;
    if(remaining>0 && remaining<=2){
      const name=last[3]||'방제';
      const purpose=PEST_PURPOSE[name]||'병해충 방제';
      tasks.push({icon:'⚠️',cls:'task-warn',
        title:`${c} 방제 안전기간 ${remaining}일 남음`,
        desc:`${name} · ${purpose} · 출하 전 ${remaining}일 준수 필요`});
    }
  });

  // 병해
  Object.keys(CROP_CONFIG).forEach(c=>{
    const rows=(data[c+'_병해']||[]).slice(1).filter(r=>r[2]);
    if(!rows.length) return;
    const last=rows[rows.length-1];
    const sev=last[5]||'';
    if(sev==='중'||sev==='중증') tasks.push({icon:'🚨',cls:'task-urgent',
      title:`${c} 병해 경보`,desc:`${last[3]||''} · ${last[4]||''}`});
  });

  if(!tasks.length) tasks.push({icon:'✅',cls:'task-ok',title:'오늘 특이사항 없음',desc:''});

  area.innerHTML = tasks.map(t=>`
    <div class="task ${t.cls}">
      <span class="task-icon">${t.icon}</span>
      <div class="task-body">
        <div class="task-title">${t.title}</div>
        ${t.desc?`<div class="task-desc">${t.desc}</div>`:''}
      </div>
    </div>`).join('');
}
