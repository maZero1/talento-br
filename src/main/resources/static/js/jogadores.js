const API_BASE = 'http://localhost:8080/api';

const token = sessionStorage.getItem('tb_token');
const userRaw = sessionStorage.getItem('tb_user');
if (!token || !userRaw) window.location.href = 'index.html';
const user = JSON.parse(userRaw);

document.getElementById('user-name').textContent = user.name?.split(' ')[0] || 'Técnico';

const timeId = sessionStorage.getItem('tb_time_id');
if (!timeId) window.location.href = 'times.html';

let timeAtual = null;
let jogadores = [];
let selectedId = null;

const STATS_DISPLAY = {
  futebol: [
    { field: 'gols', label: 'Gols' },
    { field: 'assistencias', label: 'Assistências' },
    { field: 'passesOk', label: 'Passes OK' },
    { field: 'chutesGol', label: 'Chutes a Gol' },
    { field: 'desarmes', label: 'Desarmes' },
    { field: 'driblesOk', label: 'Dribles' },
    { field: 'passesMal', label: 'Passes Ruim' },
    { field: 'bolasPerdidas', label: 'Bolas Perdidas' },
  ],
  volei: [
    { field: 'pontos', label: 'Pontos' },
    { field: 'aces', label: 'Aces' },
    { field: 'bloqueios', label: 'Bloqueios' },
    { field: 'erros', label: 'Erros' },
  ],
};

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei')) return 'volei';
  return 'futebol';
}

function iniciais(nome) {
  if (!nome) return '??';
  const p = nome.trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  if (res.status === 401 || res.status === 403) {
    sessionStorage.clear();
    window.location.href = 'index.html';
    throw new Error('Sessão expirada');
  }
  return res;
}

function render() {
  document.getElementById('time-nome').textContent = timeAtual.nome.toUpperCase();
  document.getElementById('time-tecnico').textContent = timeAtual.tecnico;
  document.getElementById('time-modalidade').textContent = timeAtual.modalidade;

  document.getElementById('total-jogadores').textContent = jogadores.length;

  const mediaRating = jogadores.length
    ? (jogadores.reduce((a, j) => a + (parseFloat(j.rating) || 0), 0) / jogadores.length).toFixed(1)
    : '-';
  document.getElementById('media-rating').textContent = mediaRating;

  const list = document.getElementById('jogadores-list');

  if (jogadores.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding:2rem 1rem; color:var(--muted); font-size:13px;">
        Nenhum atleta ainda.<br>Adicione o primeiro abaixo.
      </div>`;
    return;
  }

  list.innerHTML = jogadores.map((j) => `
    <div class="jogador-item ${j.id === selectedId ? 'active' : ''}" onclick="selectJogador('${j.id}')">
      <div class="jogador-avatar">
        ${j.fotoBase64 ? `<img src="${j.fotoBase64}" alt="">` : iniciais(j.nome)}
      </div>
      <div class="jogador-info">
        <div class="jogador-nome">${j.nome}</div>
        <div class="jogador-meta">${j.posicao || '-'} · ${j.idade ? j.idade + ' anos' : '-'}</div>
      </div>
      <div class="jogador-rating">${j.rating || '-'}</div>
    </div>
  `).join('');
}

async function selectJogador(id) {
  selectedId = id;
  render();

  const j = jogadores.find(x => x.id === id);
  const esporte = modalidadeParaEsporte(timeAtual.modalidade);

  document.getElementById('empty-content').style.display = 'none';

  const wrap = document.getElementById('inspect-wrap');
  wrap.classList.remove('show');
  void wrap.offsetWidth;
  wrap.classList.add('show');

  const av = document.getElementById('inspect-avatar');
  av.innerHTML = j.fotoBase64 ? `<img src="${j.fotoBase64}" alt="">` : iniciais(j.nome);

  document.getElementById('inspect-nome').textContent = j.nome || '-';
  document.getElementById('inspect-sub').textContent = [
    j.idade ? j.idade + ' anos' : null, j.posicao,
    j.altura ? j.altura + 'm' : null, j.peso ? j.peso + 'kg' : null,
  ].filter(Boolean).join(' · ');
  document.getElementById('inspect-desc').textContent = j.descricao || 'Sem descrição cadastrada.';

  const estadoEl = document.getElementById('s-estado-wrap');
  estadoEl.innerHTML = j.estadoForma ? `<div class="estado-badge">${j.estadoForma}</div>` : '';

  document.getElementById('s-rating').textContent = j.rating || '-';

  const statsRes = await apiFetch(`/estatisticas?atletaId=${id}`);
  const statsList = await statsRes.json();
  const ultimaStat = statsList[statsList.length - 1] || {};

  document.getElementById('s-ultima-partida').textContent = ultimaStat.dataPartida || '-';
  renderStatsInspect(esporte, ultimaStat);
}

function renderStatsInspect(esporte, stat) {
  const statsDisplay = STATS_DISPLAY[esporte] || STATS_DISPLAY.futebol;
  const linha1 = statsDisplay.slice(0, 4);
  const linha2 = statsDisplay.slice(4, 8);

  document.getElementById('stats-linha1').innerHTML = linha1.map(s => `
    <div class="stat-card-sm">
      <div class="lbl">${s.label}</div>
      <div class="val">${stat[s.field] ?? 0}</div>
    </div>
  `).join('');

  document.getElementById('stats-linha2').innerHTML = linha2.map(s => `
    <div class="stat-card-sm">
      <div class="lbl">${s.label}</div>
      <div class="val">${stat[s.field] ?? 0}</div>
    </div>
  `).join('');
}

function editarAtual() {
  if (!selectedId) return;
  sessionStorage.setItem('tb_atleta_id', selectedId);
  window.location.href = 'adicionar-jogador.html';
}

async function deletarAtual() {
  if (!selectedId) return;
  const j = jogadores.find(x => x.id === selectedId);
  if (!confirm(`Excluir ${j.nome} do time?`)) return;

  await apiFetch(`/atletas/${selectedId}`, { method: 'DELETE' });

  selectedId = null;
  document.getElementById('inspect-wrap').classList.remove('show');
  document.getElementById('empty-content').style.display = 'flex';
  await carregarJogadores();
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

async function carregarJogadores() {
  const res = await apiFetch(`/atletas?timeId=${timeId}`);
  jogadores = await res.json();
  render();
}

async function init() {
  const timeRes = await apiFetch(`/times/${timeId}`);
  timeAtual = await timeRes.json();
  await carregarJogadores();
}

sessionStorage.removeItem('tb_atleta_id');
init();