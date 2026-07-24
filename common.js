// ═══════════ 邀请返佣系统 - 公用数据 & 工具函数 ═══════════

// ── Inject glassmorphism background ──
(function injectBackground() {
  if (document.getElementById('bg-layer')) return; // already injected
  var bgLayer = document.createElement('div');
  bgLayer.id = 'bg-layer';
  bgLayer.className = 'bg-layer';
  bgLayer.innerHTML = '<div class="bg-orb"></div><div class="bg-orb"></div><div class="bg-orb"></div>';
  document.body.prepend(bgLayer);
  var bgGrid = document.createElement('div');
  bgGrid.className = 'bg-grid';
  document.body.prepend(bgGrid);
})();

const cycleMap = { daily:'日结算', weekly:'周结算', monthly:'月结算' };
const revCycleMap = { '日结算':'daily', '周结算':'weekly', '月结算':'monthly' };

// 团队返佣业务线字段形状：
// { enabled, requireActive, requireAmount, silverLimit, goldLimit, blackLimit, mode:'flat'|'tier', rate, tiers:[{amount,rate}] }
// requireAmount 仅在 requireActive 为 true 时才可能为 true（表单上二者联动）
function emptyTeamLine(extra) {
  return Object.assign({ enabled:false, requireActive:false, requireAmount:false, silverLimit:0, goldLimit:0, blackLimit:0, mode:'flat', rate:0, tiers:[] }, extra || {});
}

let teamData = [
  { id:1, name:'华北BD团队', type:'BD--代理商模式', depth:3, requireCard:false, extraFee:false, cycle:'日结算', status:'enabled',
    lines: {
      co: emptyTeamLine({ enabled:true, mode:'flat', rate:80 }),
      spot: emptyTeamLine({ enabled:true, mode:'flat', rate:60 }),
      deposit: emptyTeamLine({ enabled:false }),
      card: emptyTeamLine({ enabled:false }),
    },
    createdBy:'admin', createdAt:'2026-01-15 09:30', updatedBy:'admin', updatedAt:'2026-06-20 14:22' },
  { id:2, name:'华南BD团队', type:'BD--代理商模式', depth:3, requireCard:false, extraFee:false, cycle:'日结算', status:'enabled',
    lines: {
      co: emptyTeamLine({ enabled:true, mode:'flat', rate:75 }),
      spot: emptyTeamLine({ enabled:true, mode:'flat', rate:55 }),
      deposit: emptyTeamLine({ enabled:false }),
      card: emptyTeamLine({ enabled:false }),
    },
    createdBy:'admin', createdAt:'2026-02-03 10:15', updatedBy:'李主管', updatedAt:'2026-07-01 16:45' },
  { id:3, name:'卡商渠道组', type:'卡商--地推模式', depth:5, requireCard:true, extraFee:true, cycle:'周结算', status:'enabled',
    lines: {
      co: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'tier',
        tiers:[{amount:50000000,rate:20},{amount:200000000,rate:25},{amount:500000000,rate:30},{amount:1000000000,rate:35},{amount:0,rate:40}] }),
      spot: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'tier',
        tiers:[{amount:2000000,rate:20},{amount:5000000,rate:25},{amount:14000000,rate:30},{amount:40000000,rate:35},{amount:0,rate:40}] }),
      deposit: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'flat', rate:0.8 }),
      card: emptyTeamLine({ enabled:true, mode:'flat', rate:0.8 }),
    },
    createdBy:'张经理', createdAt:'2026-03-10 14:00', updatedBy:'张经理', updatedAt:'2026-06-28 11:30' },
  { id:6, name:'旧华东BD组', type:'BD--地推模式', depth:2, requireCard:false, extraFee:false, cycle:'周结算', status:'disabled',
    lines: {
      co: emptyTeamLine({ enabled:true, mode:'flat', rate:70 }),
      spot: emptyTeamLine({ enabled:true, mode:'flat', rate:50 }),
      deposit: emptyTeamLine({ enabled:false }),
      card: emptyTeamLine({ enabled:false }),
    },
    createdBy:'admin', createdAt:'2025-11-05 09:00', updatedBy:'李主管', updatedAt:'2026-06-15 10:20' },
];

let groupData = [
  { id:1, name:'华北BD-1组', teamId:1, leaderUid:'10001', leaderName:'张三', memberCount:8, createdBy:'admin', createdAt:'2026-01-15 09:30', updatedBy:'admin', updatedAt:'2026-06-20 14:22' },
  { id:2, name:'华北BD-2组', teamId:1, leaderUid:'10002', leaderName:'李四', memberCount:5, createdBy:'admin', createdAt:'2026-02-03 10:15', updatedBy:'李主管', updatedAt:'2026-07-01 16:45' },
  { id:3, name:'华南BD-1组', teamId:2, leaderUid:'10003', leaderName:'王五', memberCount:12, createdBy:'admin', createdAt:'2026-03-10 14:00', updatedBy:'张经理', updatedAt:'2026-06-28 11:30' },
  { id:5, name:'卡商地推-1组', teamId:3, leaderUid:'10005', leaderName:'孙七', memberCount:20, createdBy:'admin', createdAt:'2025-11-05 09:00', updatedBy:'admin', updatedAt:'2026-06-15 10:20' },
];

// BD 自身不允许独立设计返佣梯度：梯度类业务线始终跟随所属团队的梯度，
// lines 里只保存固定比例业务线的自有比例（不可超过团队对应比例），梯度业务线不存自有值。
let bdData = [
  { id:1, uid:'10001', name:'张三', groupId:1, isLeader:true, status:'启用', lines:{co:75,spot:55,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-01-15 09:30', updatedBy:'admin', updatedAt:'2026-06-20 14:22' },
  { id:2, uid:'10002', name:'李四', groupId:1, isLeader:false, status:'启用', lines:{co:70,spot:50,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-01-15 10:15', updatedBy:'李主管', updatedAt:'2026-07-01 16:45' },
  { id:3, uid:'10003', name:'王五', groupId:2, isLeader:true, status:'启用', lines:{co:72,spot:52,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-02-03 10:15', updatedBy:'admin', updatedAt:'2026-02-03 10:15' },
  { id:5, uid:'10005', name:'孙七', groupId:5, isLeader:true, status:'启用', lines:{co:0,spot:0,deposit:0.7,card:0.6}, createdBy:'admin', createdAt:'2025-11-05 09:00', updatedBy:'admin', updatedAt:'2026-06-15 10:20' },
  { id:6, uid:'10006', name:'周八', groupId:5, isLeader:false, status:'禁用', lines:{co:0,spot:0,deposit:0.5,card:0.4}, createdBy:'admin', createdAt:'2026-03-10 14:00', updatedBy:'张经理', updatedAt:'2026-06-28 11:30' },
];

let agentData = [
  { id:1, name:'华东代理-李明', teamId:1, level:1, depth:3, coRate:40, rwaRate:35, spotRate:30, depositRate:25, cardRate:0.3, status:'启用', createdBy:'admin', createdAt:'2026-01-20 08:30', updatedBy:'admin', updatedAt:'2026-05-10 14:00' },
  { id:2, name:'华南代理-王芳', teamId:2, level:2, depth:2, coRate:35, rwaRate:30, spotRate:25, depositRate:20, cardRate:0.2, status:'启用', createdBy:'李主管', createdAt:'2026-03-15 10:00', updatedBy:'李主管', updatedAt:'2026-06-01 16:30' },
  { id:3, name:'卡商代理-陈伟', teamId:3, level:1, depth:5, coRate:50, rwaRate:45, spotRate:40, depositRate:35, cardRate:0.6, status:'启用', createdBy:'admin', createdAt:'2025-12-01 09:00', updatedBy:'张经理', updatedAt:'2026-07-05 11:20' },
];

// ── Helpers ──
function getTeamName(id) { const t = teamData.find(x => x.id === id); return t ? t.name : '未知'; }
function getTeam(id) { return teamData.find(x => x.id === id); }
function getGroupName(id) { const g = groupData.find(x => x.id === id); return g ? g.name : '未知'; }
function getAgentTeamType(agent) { const t = getTeam(agent.teamId); return t ? t.type : ''; }
function getBDTeamType(bd) { const g = groupData.find(x => x.id === bd.groupId); if (!g) return ''; const t = getTeam(g.teamId); return t ? t.type : ''; }
function getBDTeam(bd) { const g = groupData.find(x => x.id === bd.groupId); return g ? getTeam(g.teamId) : null; }
function now() { return new Date().toISOString().replace('T',' ').substring(0,16); }
function nextId(arr) { return Math.max(...arr.map(x => x.id), 0) + 1; }

function badge(type) {
  const map = { 'BD--代理商模式':'badge-indigo','BD--地推模式':'badge-amber','卡商--地推模式':'badge-amber','独立代理商模式':'badge-emerald' };
  return '<span class="badge ' + (map[type]||'badge-slate') + '">' + type + '</span>';
}

// ── Dynamic filter option updates ──
function updateGroupTeamOptions() {
  const sel = document.getElementById('gf-team-filter');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">全部团队</option>' + teamData.map(t => '<option value="' + t.id + '" ' + (String(t.id)===val?'selected':'') + '>' + t.name + '</option>').join('');
}

function updateBDGroupOptions() {
  const sel = document.getElementById('bf-group-filter');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">全部BD组</option>' + groupData.map(g => '<option value="' + g.id + '" ' + (String(g.id)===val?'selected':'') + '>' + g.name + '</option>').join('');
}

function updateAgentLevelOptions() {
  const sel = document.getElementById('af-level-filter');
  if (!sel) return;
  const val = sel.value;
  const levels = [...new Set(agentData.map(a => a.level))].sort();
  sel.innerHTML = '<option value="">全部层级</option>' + levels.map(l => '<option value="' + l + '" ' + (String(l)===val?'selected':'') + '>' + l + '级代理商</option>').join('');
}

