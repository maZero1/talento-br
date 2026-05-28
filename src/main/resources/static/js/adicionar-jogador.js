const userRaw = sessionStorage.getItem('tb_user');
if (!userRaw) window.location.href = 'index.html';
const user = JSON.parse(userRaw);

const timeIdx   = parseInt(sessionStorage.getItem('tb_time_idx')    ?? '-1');
if (timeIdx < 0) window.location.href = 'times.html';

const jogadorIdx = parseInt(sessionStorage.getItem('tb_jogador_idx') ?? '-1');
const isEdit     = jogadorIdx >= 0;

document.title = isEdit ? 'TalentoBR — Editar Jogador' : 'TalentoBR — Adicionar Jogador';

function getKey()     { return 'tb_times_' + (user.email || 'demo'); }
function getTimes()   { return JSON.parse(localStorage.getItem(getKey()) || '[]'); }
function saveTimes(t) { localStorage.setItem(getKey(), JSON.stringify(t)); }

let fotoBase64 = null;

const POSICOES = {
  campo: [
    { v: 'GOL', l: 'GOL — Goleiro' },
    { v: 'ZAG', l: 'ZAG — Zagueiro' },
    { v: 'LAT', l: 'LAT — Lateral' },
    { v: 'VOL', l: 'VOL — Volante' },
    { v: 'MEI', l: 'MEI — Meia' },
    { v: 'ALA', l: 'ALA — Ala' },
    { v: 'ATK', l: 'ATK — Atacante' },
    { v: 'ATA', l: 'ATA — Centroavante' },
  ],
  society: [
    { v: 'GOL',  l: 'GOL — Goleiro' },
    { v: 'ZAG',  l: 'ZAG — Zagueiro' },
    { v: 'LAT',  l: 'LAT — Lateral' },
    { v: 'MEI',  l: 'MEI — Meia' },
    { v: 'ALA',  l: 'ALA — Ala' },
    { v: 'ATK',  l: 'ATK — Atacante' },
  ],
  futsal: [
    { v: 'GOL',  l: 'GOL — Goleiro' },
    { v: 'FIXO', l: 'FIXO — Fixo' },
    { v: 'ALE',  l: 'ALE — Ala Esquerdo' },
    { v: 'ALD',  l: 'ALD — Ala Direito' },
    { v: 'PIV',  l: 'PIV — Pivô' },
  ],
  volei: [
    { v: 'LEV',  l: 'LEV — Levantador' },
    { v: 'OPO',  l: 'OPO — Oposto' },
    { v: 'PON',  l: 'PON — Ponteiro' },
    { v: 'CEN',  l: 'CEN — Central' },
    { v: 'LIB',  l: 'LIB — Líbero' },
  ],
};

const STATS_CONFIG = {
  futebol: [
    { id: 'c-gols',          label: 'Gols' },
    { id: 'c-assist',        label: 'Assistências' },
    { id: 'c-passes-ok',     label: 'Passes Bem-sucedidos' },
    { id: 'c-passes-ruim',   label: 'Passes Mal-sucedidos' },
    { id: 'c-desarmes',      label: 'Desarmes' },
    { id: 'c-chutes',        label: 'Chutes a Gol' },
    { id: 'c-dribles',       label: 'Dribles Concluídos' },
    { id: 'c-bolas-perdidas',label: 'Bolas Perdidas' },
    { id: 'c-dribles-inc',   label: 'Dribles Incompletos' },
    { id: 'c-passes-total',  label: 'Passes (Total)' },
  ],

  volei: [
    { id: 'c-pontos',      label: 'Pontos' },
    { id: 'c-aces',        label: 'Aces' },
    { id: 'c-bloqueios',   label: 'Bloqueios' },
    { id: 'c-erros',       label: 'Erros' },
  ],
};

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei') || m.includes('v\u00f4lei')) return 'volei';
  return 'futebol';
}

function modalidadeParaChavePosicao(modalidade) {
  if (!modalidade) return 'campo';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei')) return 'volei';
  if (m.includes('society')) return 'society';
  if (m.includes('futsal'))  return 'futsal';
  return 'campo';
}

const modalidadeTime = getTimes()[timeIdx]?.modalidade || '';
const esporte        = modalidadeParaEsporte(modalidadeTime);
const chavePosicao   = modalidadeParaChavePosicao(modalidadeTime);

function carregarPosicoes(chavePosicao, valorAtual) {
  const lista  = POSICOES[chavePosicao] || POSICOES.campo;
  const sel    = document.getElementById('f-posicao');
  const badge  = document.getElementById('modalidade-badge');

  const nomesBadge = {
    campo:   'Campo',
    society: 'Society',
    futsal:  'Futsal',
    volei:   'Vôlei',
  };
  badge.textContent = nomesBadge[chavePosicao] || 'Campo';

  const atual = valorAtual ?? sel.value;
  sel.innerHTML = '<option value="">Selecionar</option>';
  lista.forEach(p => {
    const opt       = document.createElement('option');
    opt.value       = p.v;
    opt.textContent = p.l;
    sel.appendChild(opt);
  });

  if (lista.find(p => p.v === atual)) sel.value = atual;
}

function renderizarStats(esporte, valoresAtual) {
  const statsConfig = STATS_CONFIG[esporte] || STATS_CONFIG.futebol;
  const container   = document.getElementById('stats-campos');
  container.innerHTML = '';

  statsConfig.forEach(stat => {
    const valorAtual = valoresAtual ? (valoresAtual[stat.id] ?? 0) : 0;
    container.innerHTML += `
      <div class="counter-field">
        <div class="counter-label">${stat.label}</div>
        <div class="counter">
          <button class="counter-btn" onclick="decrement('${stat.id}')">−</button>
          <input class="counter-val" type="number" id="${stat.id}" value="${valorAtual}" min="0">
          <button class="counter-btn" onclick="increment('${stat.id}')">+</button>
        </div>
      </div>
    `;
  });
}

carregarPosicoes(chavePosicao);
renderizarStats(esporte);

if (isEdit) {
  const j = getTimes()[timeIdx]?.jogadores?.[jogadorIdx];
  if (j) {
    document.getElementById('f-nome').value            = j.nome             || '';
    document.getElementById('f-descricao').value       = j.descricao        || '';
    document.getElementById('f-idade').value           = j.idade            || '';
    carregarPosicoes(chavePosicao, j.posicao || '');
    document.getElementById('f-altura').value          = j.altura           || '';
    document.getElementById('f-peso').value            = j.peso             || '';
    document.getElementById('f-rating').value          = j.rating           || '';
    document.getElementById('f-estado').value          = j.estado           || '';
    document.getElementById('f-ultima-partida').value  = j.ultimaPartida    || '';
    document.getElementById('f-tempo-jogo').value      = j.tempoJogo        || '';

    // Carrega estatísticas salvas para o esporte correto
    renderizarStats(esporte, j.stats || {});

    if (j.foto) {
      fotoBase64 = j.foto;
      document.getElementById('foto-area').style.display         = 'none';
      document.getElementById('foto-preview-wrap').style.display = 'block';
      document.getElementById('foto-preview-img').src            = j.foto;
    }

    updatePreview();
  }
}

function increment(id) {
  const el = document.getElementById(id);
  if (el) el.value = Math.max(0, parseInt(el.value || 0) + 1);
}

function decrement(id) {
  const el = document.getElementById(id);
  if (el) el.value = Math.max(0, parseInt(el.value || 0) - 1);
}

function updatePreview() {
  const nome   = document.getElementById('f-nome').value.trim() || 'Nome do Atleta';
  const pos    = document.getElementById('f-posicao').value;
  const idade  = document.getElementById('f-idade').value;
  const altura = document.getElementById('f-altura').value;
  const peso   = document.getElementById('f-peso').value;
  const rating = document.getElementById('f-rating').value;

  document.getElementById('preview-nome').textContent   = nome;
  document.getElementById('preview-rating').textContent = rating || '—';

  const sub = [
    pos    || null,
    idade  ? idade  + ' anos' : null,
    altura ? altura + 'm'     : null,
    peso   ? peso   + 'kg'    : null,
  ].filter(Boolean).join(' · ');

  document.getElementById('preview-sub').textContent = sub || 'Posição · Idade · Altura · Peso';

  const av = document.getElementById('preview-avatar');
  if (fotoBase64) {
    av.innerHTML = `<img src="${fotoBase64}" alt="">`;
  } else {
    const parts = nome.trim().split(' ');
    const inits = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    av.innerHTML = `<span class="preview-initials">${inits}</span>`;
  }
}

function handleFoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    fotoBase64 = ev.target.result;
    document.getElementById('foto-area').style.display         = 'none';
    document.getElementById('foto-preview-wrap').style.display = 'block';
    document.getElementById('foto-preview-img').src            = fotoBase64;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function handleFotoHidden(e) { handleFoto(e); }

function removerFoto() {
  fotoBase64 = null;
  document.getElementById('foto-area').style.display         = 'block';
  document.getElementById('foto-preview-wrap').style.display = 'none';
  document.getElementById('foto-input').value                = '';
  updatePreview();
}

function salvarJogador() {
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) { showToast('⚠️ Informe o nome do atleta.'); return; }

  // Coleta as estatísticas dinamicamente conforme o esporte
  const statsConfig = STATS_CONFIG[esporte] || STATS_CONFIG.futebol;
  const stats = {};
  statsConfig.forEach(stat => {
    const el = document.getElementById(stat.id);
    stats[stat.id] = el ? (parseInt(el.value) || 0) : 0;
  });

  const jogador = {
    nome,
    descricao:     document.getElementById('f-descricao').value.trim(),
    idade:         document.getElementById('f-idade').value,
    posicao:       document.getElementById('f-posicao').value,
    altura:        document.getElementById('f-altura').value,
    peso:          document.getElementById('f-peso').value,
    rating:        document.getElementById('f-rating').value,
    estado:        document.getElementById('f-estado').value,
    ultimaPartida: document.getElementById('f-ultima-partida').value,
    tempoJogo:     document.getElementById('f-tempo-jogo').value,
    esporte,
    stats,
    foto:          fotoBase64,
  };

  const times = getTimes();
  if (!times[timeIdx].jogadores) times[timeIdx].jogadores = [];

  if (isEdit) {
    times[timeIdx].jogadores[jogadorIdx] = jogador;
  } else {
    times[timeIdx].jogadores.push(jogador);
  }

  saveTimes(times);
  sessionStorage.removeItem('tb_jogador_idx');

  showToast(isEdit ? '✓ Atleta atualizado!' : '✓ Atleta adicionado!');
  setTimeout(() => window.location.href = 'jogadores.html', 900);
}

function voltar() {
  sessionStorage.removeItem('tb_jogador_idx');
  window.location.href = 'jogadores.html';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

updatePreview();