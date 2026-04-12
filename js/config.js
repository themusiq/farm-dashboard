const CROP_CONFIG = {
  '포도':   {baseTemp:10, gddTarget:1200, goalKg:2000, emoji:'🍇', waterLimit:5},
  '수박':   {baseTemp:12, gddTarget:800,  goalKg:0,    emoji:'🍉', waterLimit:4},
  '양상추': {baseTemp:5,  gddTarget:400,  goalKg:0,    emoji:'🥬', waterLimit:3},
};

const PEST_PURPOSE = {
  '보르도액':   '노균병·갈색무늬병 예방',
  '모두싹':     '절단면 곰팡이·병해충 예방 (유기농)',
  '충방제':     '해충 예방적 방제',
  '유황자재':   '병해충 예방 (유기농)',
  '청쓸이':     '해충 방제',
  '잘무더':     '응애 방제',
  '키토나이스플러스': '면역증진·병해 예방',
};

// 재배 규칙 (검토 완료된 것만)
const GROWTH_RULES = [
  {crop:'포도', gddMin:0,  gddMax:10, type:'info',  icon:'🌱',
   title:'잔뿌리 유도 기간',
   desc:'토양 약건조 유지 · 발근제/영양제 관주 금지 · 덩굴손 갈고리로 수분 판단'},
  {crop:'포도', gddMin:5,  gddMax:25, type:'warn',  icon:'⚡',
   title:'강세 주의 — 관수량 최소화',
   desc:'과다관수 → 저장양분 빠른 소모 → 6월 이후 잎 타기·축과 유발'},
  {crop:'포도', gddMin:10, gddMax:30, type:'info',  icon:'✂️',
   title:'신초 솎기 시작',
   desc:'묵은 가지 눈 우선 제거 · 솎기와 양수분 제한 병행'},
  {crop:'포도', gddMin:78, gddMax:85, type:'warn',  icon:'🔍',
   title:'당도 측정 시작',
   desc:'수확 적기 진입 준비 — Brix 측정'},
  {crop:'포도', gddMin:85, gddMax:100, type:'urgent', icon:'🍇',
   title:'수확 준비',
   desc:'적산온도 85% 이상 — 수확 적기 진입'},
  {crop:'포도', gddMin:0, gddMax:15, type:'warn', icon:'🌡️',
 title:'온도 관리 — 낮 25°C 이하 유지',
 desc:'측창 개방 확인 · 고온 시 기형화수 위험 · 최저 7°C 이상 유지'},
{crop:'포도', gddMin:0, gddMax:20, type:'info', icon:'👁️',
 title:'눈따기 작업 시작',
 desc:'묵은 가지 눈, 꽃송이 없는 눈 우선 제거 · 저장양분 절약'},
{crop:'포도', gddMin:0, gddMax:25, type:'info', icon:'🌿',
 title:'멀칭 준비 (5~7월)',
 desc:'주목 좌우 50cm 개방 · 통로 위주 멀칭 · 초생재배 발목 높이 이상 시 예초'},
];

// 솔이숲농장 재배 방식
const FARM_METHOD = {
  groundCover: '초생재배', // 멀칭 없이 풀 유지
  mowingTrigger: '발목 이상', // 예초 기준
  mulchingPlan: {
    timing: '5월~7월',
    zone: '통로 위주',
    clearance: '주목 좌우 50cm 개방'
  }
};
