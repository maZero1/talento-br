const userRaw = sessionStorage.getItem('tb_user');
if (!userRaw) window.location.href = 'index.html';
const user = JSON.parse(userRaw);

document.getElementById('user-name').textContent = user.name?.split(' ')[0] || 'Técnico';

const timeIdx = parseInt(sessionStorage.getItem('tb_time_idx') ?? '-1');
if (timeIdx < 0) window.location.href = 'times.html';

function getKey()     { return 'tb_times_' + (user.email || 'demo'); }
function getTimes()   { return JSON.parse(localStorage.getItem(getKey()) || '[]'); }
function saveTimes(t) { localStorage.setItem(getKey(), JSON.stringify(t)); }
function getTime()    { return getTimes()[timeIdx]; }

let selectedIdx = -1;

const STATS_DISPLAY = {
  futebol: [
    { id: 'c-gols',          label: 'Gols' },
    { id: 'c-assist',        label: 'Assistências' },
    { id: 'c-passes-ok',     label: 'Passes OK' },
    { id: 'c-chutes',        label: 'Chutes a Gol' },

    { id: 'c-desarmes',      label: 'Desarmes' },
    { id: 'c-dribles',       label: 'Dribles' },
    { id: 'c-passes-ruim',   label: 'Passes Ruim' },
    { id: 'c-bolas-perdidas',label: 'Bolas Perdidas' },
  ],

  volei: [
    { id: 'c-pontos',    label: 'Pontos' },
    { id: 'c-aces',      label: 'Aces' },
    { id: 'c-bloqueios', label: 'Bloqueios' },
    { id: 'c-erros',     label: 'Erros' },
  ],
};

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei') || m.includes('v\u00f4lei')) return 'volei';
  return 'futebol';
}

function iniciais(nome) {
  if (!nome) return '??';
  const p = nome.trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

function render() {
  const time = getTime();
  if (!time) { window.location.href = 'times.html'; return; }

  document.getElementById('time-nome').textContent       = time.nome.toUpperCase();
  document.getElementById('time-tecnico').textContent    = time.tecnico;
  document.getElementById('time-modalidade').textContent = time.modalidade;

  const jogadores = time.jogadores || [];
  document.getElementById('total-jogadores').textContent = jogadores.length;

  const mediaRating = jogadores.length
    ? (jogadores.reduce((a, j) => a + (parseFloat(j.rating) || 0), 0) / jogadores.length).toFixed(1)
    : '—';
  document.getElementById('media-rating').textContent = mediaRating;

  const list = document.getElementById('jogadores-list');

  if (jogadores.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding:2rem 1rem; color:var(--muted); font-size:13px;">
        Nenhum atleta ainda.<br>Adicione o primeiro abaixo.
      </div>`;
    return;
  }

  list.innerHTML = jogadores.map((j, i) => `
    <div class="jogador-item ${i === selectedIdx ? 'active' : ''}" onclick="selectJogador(${i})">
      <div class="jogador-avatar">
        ${j.foto ? `<img src="${j.foto}" alt="">` : iniciais(j.nome)}
      </div>
      <div class="jogador-info">
        <div class="jogador-nome">${j.nome}</div>
        <div class="jogador-meta">${j.posicao || '—'} · ${j.idade ? j.idade + ' anos' : '—'}</div>
      </div>
      <div class="jogador-rating">${j.rating || '—'}</div>
    </div>
  `).join('');
}

function selectJogador(idx) {
  selectedIdx = idx;
  render();

  const time    = getTime();
  const j       = time.jogadores[idx];
  const esporte = modalidadeParaEsporte(time.modalidade);

  document.getElementById('empty-content').style.display = 'none';

  const wrap = document.getElementById('inspect-wrap');
  wrap.classList.remove('show');
  void wrap.offsetWidth;
  wrap.classList.add('show');

  const av = document.getElementById('inspect-avatar');
  av.innerHTML = j.foto ? `<img src="${j.foto}" alt="">` : iniciais(j.nome);

  document.getElementById('inspect-nome').textContent = j.nome || '—';
  document.getElementById('inspect-sub').textContent  = [
    j.idade   ? j.idade   + ' anos' : null,
    j.posicao,
    j.altura  ? j.altura  + 'm'     : null,
    j.peso    ? j.peso    + 'kg'    : null,
  ].filter(Boolean).join(' · ');
  document.getElementById('inspect-desc').textContent = j.descricao || 'Sem descrição cadastrada.';

  document.getElementById('s-ultima-partida').textContent = j.ultimaPartida || '—';
  document.getElementById('s-rating').textContent         = j.rating || '—';

  const estadoEl = document.getElementById('s-estado-wrap');
  estadoEl.innerHTML = j.estado
    ? `<div class="estado-badge">● ${j.estado}</div>`
    : '';

  renderStatsInspect(esporte, j);
}

function renderStatsInspect(esporte, j) {
  const statsDisplay = STATS_DISPLAY[esporte] || STATS_DISPLAY.futebol;

  function getVal(statId) {
    
    if (j.stats && j.stats[statId] !== undefined) return j.stats[statId];
    
    const legado = {
      'c-gols':          j.gols,
      'c-assist':        j.assistencias,
      'c-passes-ok':     j.passesBemSucedidos,
      'c-passes-ruim':   j.passesMalSucedidos,
      'c-desarmes':      j.desarmes,
      'c-chutes':        j.chutesAGol,
      'c-dribles':       j.driblesConcluidos,
      'c-bolas-perdidas':j.bolasPerdidas,
    };
    return legado[statId] ?? 0;
  }

  const linha1 = statsDisplay.slice(0, 4);
  const linha2 = statsDisplay.slice(4, 8);

  const container1 = document.getElementById('stats-linha1');
  const container2 = document.getElementById('stats-linha2');

  container1.innerHTML = linha1.map(s => `
    <div class="stat-card-sm">
      <div class="lbl">${s.label}</div>
      <div class="val">${getVal(s.id)}</div>
    </div>
  `).join('');

  container2.innerHTML = linha2.map(s => `
    <div class="stat-card-sm">
      <div class="lbl">${s.label}</div>
      <div class="val">${getVal(s.id)}</div>
    </div>
  `).join('');
}

function editarAtual() {
  if (selectedIdx < 0) return;
  sessionStorage.setItem('tb_jogador_idx', selectedIdx);
  window.location.href = 'adicionar-jogador.html';
}

function deletarAtual() {
  if (selectedIdx < 0) return;
  const time = getTime();
  const nome = time.jogadores[selectedIdx].nome;
  if (!confirm(`Excluir ${nome} do time?`)) return;

  const times = getTimes();
  times[timeIdx].jogadores.splice(selectedIdx, 1);
  saveTimes(times);

  selectedIdx = -1;
  document.getElementById('inspect-wrap').classList.remove('show');
  document.getElementById('empty-content').style.display = 'flex';
  render();
  showToast('Atleta removido.');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

sessionStorage.removeItem('tb_jogador_idx');
render();