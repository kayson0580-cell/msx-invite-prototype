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

// ── Floating hover panels (tooltips / tier popovers) ──
// Positioned via position:fixed + JS instead of CSS :hover, so they escape
// overflow:auto/hidden ancestors (modals, scrollable tables) instead of being clipped or overlapping nearby UI.
(function initFloatingPanels() {
  let activePanel = null, activeTrigger = null;

  function getPanel(trigger) {
    return trigger.querySelector('.hover-tip, .tier-popover');
  }

  function positionPanel(trigger, panel) {
    panel.style.display = 'block';
    panel.style.left = '-9999px';
    panel.style.top = '-9999px';
    const tRect = trigger.getBoundingClientRect();
    const pRect = panel.getBoundingClientRect();
    let left = tRect.left + tRect.width / 2 - pRect.width / 2;
    let top = tRect.top - pRect.height - 8;
    if (top < 8) top = tRect.bottom + 8;
    if (left < 8) left = 8;
    if (left + pRect.width > window.innerWidth - 8) left = window.innerWidth - pRect.width - 8;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  function hidePanel() {
    if (activePanel) activePanel.style.display = 'none';
    activePanel = null; activeTrigger = null;
  }

  document.addEventListener('mouseover', function(e) {
    const trigger = e.target.closest('.hover-tip-wrap, .tier-badge');
    if (!trigger || trigger === activeTrigger) return;
    const panel = getPanel(trigger);
    if (!panel) return;
    hidePanel();
    positionPanel(trigger, panel);
    activePanel = panel; activeTrigger = trigger;
  });
  document.addEventListener('mouseout', function(e) {
    if (!activeTrigger) return;
    if (activeTrigger.contains(e.relatedTarget)) return;
    hidePanel();
  });
  document.addEventListener('scroll', hidePanel, true);
  window.addEventListener('resize', hidePanel);
})();

const cycleMap = { daily:'日结算', monthly:'月结算' };
const revCycleMap = { '日结算':'daily', '月结算':'monthly' };

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
  { id:3, name:'卡商渠道组', type:'卡商--地推模式', depth:5, requireCard:true, extraFee:true, cycle:'月结算', status:'enabled',
    lines: {
      co: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'tier',
        tiers:[{amount:50000000,rate:20},{amount:200000000,rate:25},{amount:500000000,rate:30},{amount:1000000000,rate:35},{amount:0,rate:40}] }),
      spot: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'flat', rate:60 }),
      deposit: emptyTeamLine({ enabled:true, requireActive:true, requireAmount:true, silverLimit:200, goldLimit:800, blackLimit:2500, mode:'flat', rate:0.8 }),
      card: emptyTeamLine({ enabled:true, mode:'tier',
        tiers:[{amount:50000000,rate:10},{amount:200000000,rate:15},{amount:500000000,rate:20},{amount:1000000000,rate:25},{amount:0,rate:30}] }),
    },
    createdBy:'张经理', createdAt:'2026-03-10 14:00', updatedBy:'张经理', updatedAt:'2026-06-28 11:30' },
  { id:6, name:'旧华东BD组', type:'BD--地推模式', depth:2, requireCard:false, extraFee:false, cycle:'日结算', status:'disabled',
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
  { id:1, name:'张三', groupId:1, isLeader:true, status:'启用', lines:{co:75,spot:55,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-01-15 09:30', updatedBy:'admin', updatedAt:'2026-06-20 14:22' },
  { id:2, name:'李四', groupId:2, isLeader:true, status:'启用', lines:{co:70,spot:50,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-01-15 10:15', updatedBy:'李主管', updatedAt:'2026-07-01 16:45' },
  { id:3, name:'王五', groupId:3, isLeader:true, status:'启用', lines:{co:72,spot:52,deposit:0,card:0}, createdBy:'admin', createdAt:'2026-02-03 10:15', updatedBy:'admin', updatedAt:'2026-02-03 10:15' },
  { id:5, name:'孙七', groupId:5, isLeader:true, status:'启用', lines:{co:0,spot:55,deposit:0.7,card:0}, createdBy:'admin', createdAt:'2025-11-05 09:00', updatedBy:'admin', updatedAt:'2026-06-15 10:20' },
  { id:6, name:'周八', groupId:5, isLeader:false, status:'禁用', lines:{co:0,spot:50,deposit:0.5,card:0}, createdBy:'admin', createdAt:'2026-03-10 14:00', updatedBy:'张经理', updatedAt:'2026-06-28 11:30' },
];

let agentData = [
  { id:1, name:'华东代理-李明', teamId:1, level:1, depth:3, coRate:40, rwaRate:35, spotRate:30, depositRate:0.3, cardRate:25, status:'启用', createdBy:'admin', createdAt:'2026-01-20 08:30', updatedBy:'admin', updatedAt:'2026-05-10 14:00', uid:'20001', bdId:1, region:'中国', applicant:'李明', email:'liming@example.com', regEmail:'liming_reg@msx.com', wallet:'0x8f3a...c92e', phone:'13800000001', wechat:'liming_wx', tg:'@liming_tg', expUsers:500, expVolume:2000000, reviewStatus:'已通过', reviewedBy:'admin', reviewedAt:'2026-01-21 10:00', reviewNote:'资料齐全，通过', approvedCoRate:40, approvedSpotRate:30, approvedDepositRate:0.3, approvedCardRate:25, reviewAttachments:['资质证明.pdf','身份证正反面.jpg'] },
  { id:2, name:'华南代理-王芳', teamId:2, level:2, depth:2, coRate:35, rwaRate:30, spotRate:25, depositRate:0.2, cardRate:20, status:'启用', createdBy:'李主管', createdAt:'2026-03-15 10:00', updatedBy:'李主管', updatedAt:'2026-06-01 16:30', uid:'20002', bdId:3, region:'中国香港', applicant:'王芳', email:'wangfang@example.com', regEmail:'wangfang_reg@msx.com', wallet:'0x1c7d...4a1f', expUsers:200, expVolume:800000, reviewStatus:'已通过', reviewedBy:'李主管', reviewedAt:'2026-03-16 09:30', reviewNote:'', approvedCoRate:35, approvedSpotRate:25, approvedDepositRate:0.2, approvedCardRate:20 },
  { id:3, name:'卡商代理-陈伟', teamId:3, level:1, depth:5, coRate:50, rwaRate:45, spotRate:40, depositRate:0.6, cardRate:35, status:'启用', createdBy:'admin', createdAt:'2025-12-01 09:00', updatedBy:'张经理', updatedAt:'2026-07-05 11:20', uid:'20003', bdId:5, region:'越南', applicant:'陈伟', email:'chenwei@example.com', tg:'@chenwei_tg', expUsers:1200, expVolume:5000000, reviewStatus:'未审核' },
  { id:4, name:'华北代理-赵磊', teamId:1, level:1, depth:3, coRate:60, rwaRate:0, spotRate:50, depositRate:0.4, cardRate:40, status:'启用', createdBy:'李主管', createdAt:'2026-06-10 09:15', updatedBy:'李主管', updatedAt:'2026-06-12 17:00', uid:'20004', bdId:2, region:'中国', applicant:'赵磊', email:'zhaolei@example.com', phone:'13800000004', wechat:'zhaolei_wx', expUsers:80, expVolume:300000, reviewStatus:'已拒绝', reviewedBy:'李主管', reviewedAt:'2026-06-13 11:00', reviewNote:'期望返佣比例明显高于团队授权上限，资料不完整',
    socials:[{platform:'Twitter/X', link:'https://x.com/zhaolei_agent', count:4300, desc:'币圈行情号，粉丝以国内交易者为主'}, {platform:'Telegram频道', link:'https://t.me/zhaolei_channel', count:1800, desc:'北方交流群，日活较高'}] },
  { id:5, name:'华南代理-陈静', teamId:2, level:1, depth:2, coRate:65, rwaRate:0, spotRate:48, depositRate:0, cardRate:0, status:'启用', createdBy:'张经理', createdAt:'2026-04-01 10:00', updatedBy:'张经理', updatedAt:'2026-04-10 09:00', uid:'20005', bdId:3, region:'新加坡', applicant:'陈静', email:'chenjing@example.com', regEmail:'chenjing_reg@msx.com', wallet:'0x4b2e...77d0', phone:'13800000005', expUsers:320, expVolume:1200000, reviewStatus:'已通过', reviewedBy:'张经理', reviewedAt:'2026-04-10 09:00', approvedCoRate:65, approvedSpotRate:48, approvedDepositRate:0, approvedCardRate:0 },
  { id:6, name:'卡商代理-林涛', teamId:3, level:2, depth:5, coRate:0, rwaRate:0, spotRate:48, depositRate:0.45, cardRate:0, status:'启用', createdBy:'张经理', createdAt:'2026-04-20 09:00', updatedBy:'张经理', updatedAt:'2026-05-02 14:00', uid:'20006', bdId:6, region:'菲律宾', applicant:'林涛', email:'lintao@example.com', wechat:'lintao_wx', expUsers:600, expVolume:2500000, reviewStatus:'已通过', reviewedBy:'张经理', reviewedAt:'2026-05-02 14:00', approvedSpotRate:48, approvedDepositRate:0.45 },
  { id:7, name:'华北代理-孙悦', teamId:1, level:2, depth:2, coRate:68, rwaRate:0, spotRate:48, depositRate:0, cardRate:0, status:'禁用', createdBy:'李主管', createdAt:'2026-05-15 09:00', updatedBy:'李主管', updatedAt:'2026-05-20 11:00', uid:'20007', bdId:2, region:'中国', applicant:'孙悦', email:'sunyue@example.com', tg:'@sunyue_tg', expUsers:150, expVolume:600000, reviewStatus:'已通过', reviewedBy:'李主管', reviewedAt:'2026-05-20 11:00', approvedCoRate:68, approvedSpotRate:48, approvedDepositRate:0, approvedCardRate:0 },
];

// ── 全局国家/地区表（实际由平台统一维护，此处为原型模拟数据）──
const COUNTRY_LIST = [
  '中国','中国香港','中国澳门','中国台湾','新加坡','马来西亚','印度尼西亚','越南','菲律宾','泰国','柬埔寨','缅甸','老挝','文莱',
  '日本','韩国','印度','巴基斯坦','孟加拉国','斯里兰卡','尼泊尔','哈萨克斯坦','乌兹别克斯坦','蒙古',
  '阿联酋','沙特阿拉伯','卡塔尔','科威特','巴林','阿曼','以色列','土耳其','伊朗','伊拉克','约旦','黎巴嫩',
  '英国','爱尔兰','法国','德国','荷兰','比利时','卢森堡','瑞士','奥地利','意大利','西班牙','葡萄牙','希腊',
  '瑞典','挪威','丹麦','芬兰','冰岛','波兰','捷克','斯洛伐克','匈牙利','罗马尼亚','保加利亚','克罗地亚','塞尔维亚',
  '乌克兰','俄罗斯','白俄罗斯','立陶宛','拉脱维亚','爱沙尼亚','塞浦路斯','马耳他',
  '美国','加拿大','墨西哥','巴西','阿根廷','智利','哥伦比亚','秘鲁','委内瑞拉','厄瓜多尔','乌拉圭','巴拉圭','玻利维亚',
  '巴拿马','哥斯达黎加','危地马拉','多米尼加','古巴','牙买加',
  '澳大利亚','新西兰','斐济','巴布亚新几内亚',
  '南非','埃及','尼日利亚','肯尼亚','摩洛哥','阿尔及利亚','突尼斯','加纳','埃塞俄比亚','坦桑尼亚','乌干达','安哥拉',
  '其他',
];

function populateCountrySelect(selectId, selectedValue) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">请选择</option>' + COUNTRY_LIST.map(function(c) {
    return '<option value="' + c + '"' + (c === selectedValue ? ' selected' : '') + '>' + c + '</option>';
  }).join('');
}

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

function updateBDTeamFilterOptions() {
  const sel = document.getElementById('bf-team-filter');
  if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">全部所属团队</option>' + teamData.map(t => '<option value="' + t.id + '" ' + (String(t.id)===val?'selected':'') + '>' + t.name + '</option>').join('');
}

function updateBDGroupOptions() {
  const teamId = document.getElementById('bf-team-filter')?.value || '';
  const sel = document.getElementById('bf-group-filter');
  if (!sel) return;
  const val = sel.value;
  const groups = teamId ? groupData.filter(g => g.teamId === parseInt(teamId)) : groupData;
  sel.innerHTML = '<option value="">全部BD组</option>' + groups.map(g => '<option value="' + g.id + '" ' + (String(g.id)===val && groups.some(x=>String(x.id)===val)?'selected':'') + '>' + g.name + '</option>').join('');
}

function updateAgentLevelOptions() {
  const sel = document.getElementById('af-level-filter');
  if (!sel) return;
  const val = sel.value;
  const levels = [...new Set(agentData.map(a => a.level))].sort();
  sel.innerHTML = '<option value="">全部层级</option>' + levels.map(l => '<option value="' + l + '" ' + (String(l)===val?'selected':'') + '>' + l + '级代理商</option>').join('');
}

