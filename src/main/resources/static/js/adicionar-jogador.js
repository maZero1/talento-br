const API_BASE = 'http://localhost:8080/api';

const token = sessionStorage.getItem('tb_token');
const userRaw = sessionStorage.getItem('tb_user');
if (!token || !userRaw) window.location.href = 'index.html';

const timeId = sessionStorage.getItem('tb_time_id');
if (!timeId) window.location.href = 'times.html';

const atletaId = sessionStorage.getItem('tb_atleta_id');
const isEdit = !!atletaId;

document.title = isEdit ? 'TalentoBR - Editar Jogador' : 'TalentoBR - Adicionar Jogador';

let fotoBase64 = null;
let timeAtual = null;

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

const POSICOES = {
  campo: [
    { v: 'GOL', l: 'GOL - Goleiro' },
    { v: 'ZAG', l: 'ZAG - Zagueiro' },
    { v: 'LAT', l: 'LAT - Lateral' },
    { v: 'VOL', l: 'VOL - Volante' },
    { v: 'MEI', l: 'MEI - Meia' },
    { v: 'ALA', l: 'ALA - Ala' },
    { v: 'ATK', l: 'ATK - Atacante' },
    { v: 'ATA', l: 'ATA - Centroavante' },
  ],
  society: [
    { v: 'GOL', l: 'GOL - Goleiro' },
    { v: 'ZAG', l: 'ZAG - Zagueiro' },
    { v: 'LAT', l: 'LAT - Lateral' },
    { v: 'MEI', l: 'MEI - Meia' },
    { v: 'ALA', l: 'ALA - Ala' },
    { v: 'ATK', l: 'ATK - Atacante' },
  ],
  futsal: [
    { v: 'GOL', l: 'GOL - Goleiro' },
    { v: 'FIXO', l: 'FIXO - Fixo' },
    { v: 'ALE', l: 'ALE - Ala Esquerdo' },
    { v: 'ALD', l: 'ALD - Ala Direito' },
    { v: 'PIV', l: 'PIV - Pivô' },
  ],
  volei: [
    { v: 'LEV', l: 'LEV - Levantador' },
    { v: 'OPO', l: 'OPO - Oposto' },
    { v: 'PON', l: 'PON - Ponteiro' },
    { v: 'CEN', l: 'CEN - Central' },
    { v: 'LIB', l: 'LIB - Líbero' },
  ],
};

const STATS_CONFIG = {
  futebol: [
    { id: 'c-gols', label: 'Gols' },
    { id: 'c-assist', label: 'Assistências' },
    { id: 'c-passes-ok', label: 'Passes Bem-sucedidos' },
    { id: 'c-passes-ruim', label: 'Passes Mal-sucedidos' },
    { id: 'c-desarmes', label: 'Desarmes' },
    { id: 'c-chutes', label: 'Chutes a Gol' },
    { id: 'c-dribles', label: 'Dribles Concluídos' },
    { id: 'c-bolas-perdidas', label: 'Bolas Perdidas' },
  ],
  volei: [
    { id: 'c-pontos', label: 'Pontos' },
    { id: 'c-aces', label: 'Aces' },
    { id: 'c-bloqueios', label: 'Bloqueios' },
    { id: 'c-erros', label: 'Erros' },
  ],
};

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei')) return 'volei';
  return 'futebol';
}

function modalidadeParaChavePosicao(modalidade) {
  if (!modalidade) return 'campo';
  const m = modalidade.toLowerCase();
  if (m.includes('vôlei') || m.includes('volei')) return 'volei';
  if (m.includes('society')) return 'society';
  if (m.includes('futsal')) return 'futsal';
  return 'campo';
}

function carregarPosicoes(chavePosicao, valorAtual) {
  const lista = POSICOES[chavePosicao] || POSICOES.campo;
  const sel = document.getElementById('f-posicao');
  const badge = document.getElementById('modalidade-badge');

  const nomesBadge = { campo: 'Campo', society: 'Society', futsal: 'Futsal', volei: 'Vôlei' };
  badge.textContent = nomesBadge[chavePosicao] || 'Campo';

  const atual = valorAtual ?? sel.value;
  sel.innerHTML = '<option value="">Selecionar</option>';
  lista.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.v;
    opt.textContent = p.l;
    sel.appendChild(opt);
  });
  if (lista.find(p => p.v === atual)) sel.value = atual;
}

function renderizarStats(esporte, valoresAtual) {
  const statsConfig = STATS_CONFIG[esporte] || STATS_CONFIG.futebol;
  const container = document.getElementById('stats-campos');
  container.innerHTML = '';

  statsConfig.forEach(stat => {
    const valorAtual = valoresAtual ? (valoresAtual[stat.id] ?? 0) : 0;
    container.innerHTML += `
      <div class="counter-field">
        <div class="counter-label">${stat.label}</div>
        <div class="counter">
          <button class="counter-btn" onclick="decrement('${stat.id}')">-</button>
          <input class="counter-val" type="number" id="${stat.id}" value="${valorAtual}" min="0">
          <button class="counter-btn" onclick="increment('${stat.id}')">+</button>
        </div>
      </div>
    `;
  });
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
  const nome = document.getElementById('f-nome').value.trim() || 'Nome do Atleta';
  const pos = document.getElementById('f-posicao').value;
  const idade = document.getElementById('f-idade').value;
  const altura = document.getElementById('f-altura').value;
  const peso = document.getElementById('f-peso').value;
  const rating = document.getElementById('f-rating').value;

  document.getElementById('preview-nome').textContent = nome;
  document.getElementById('preview-rating').textContent = rating || '-';

  const sub = [pos || null, idade ? idade + ' anos' : null, altura ? altura + 'm' : null, peso ? peso + 'kg' : null]
    .filter(Boolean).join(' · ');
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
    document.getElementById('foto-area').style.display = 'none';
    document.getElementById('foto-preview-wrap').style.display = 'block';
    document.getElementById('foto-preview-img').src = fotoBase64;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

function handleFotoHidden(e) { handleFoto(e); }

function removerFoto() {
  fotoBase64 = null;
  document.getElementById('foto-area').style.display = 'block';
  document.getElementById('foto-preview-wrap').style.display = 'none';
  document.getElementById('foto-input').value = '';
  updatePreview();
}

async function salvarJogador() {
  const nome = document.getElementById('f-nome').value.trim();
  if (!nome) { showToast('Informe o nome do atleta.'); return; }

  const atletaPayload = {
    nome,
    descricao: document.getElementById('f-descricao').value.trim(),
    idade: document.getElementById('f-idade').value || null,
    posicao: document.getElementById('f-posicao').value,
    altura: document.getElementById('f-altura').value || null,
    peso: document.getElementById('f-peso').value || null,
    rating: document.getElementById('f-rating').value || null,
    estadoForma: document.getElementById('f-estado').value,
    fotoBase64: fotoBase64,
  };

  try {
    let atletaSalvo;
    if (isEdit) {
      const res = await apiFetch(`/atletas/${atletaId}`, {
        method: 'PUT',
        body: JSON.stringify(atletaPayload)
      });
      atletaSalvo = await res.json();
    } else {
      const res = await apiFetch(`/atletas?timeId=${timeId}`, {
        method: 'POST',
        body: JSON.stringify(atletaPayload)
      });
      atletaSalvo = await res.json();
    }

    await salvarEstatisticas(atletaSalvo.id);

    sessionStorage.removeItem('tb_atleta_id');
    showToast(isEdit ? 'Atleta atualizado!' : 'Atleta adicionado!');
    setTimeout(() => window.location.href = 'jogadores.html', 900);
  } catch (err) {
    showToast('Erro ao salvar. Tente novamente.');
  }
}

async function salvarEstatisticas(idAtleta) {
  const esporte = modalidadeParaEsporte(timeAtual?.modalidade);

  const stats = esporte === 'volei'
    ? {
        pontos: numVal('c-pontos'),
        aces: numVal('c-aces'),
        bloqueios: numVal('c-bloqueios'),
        erros: numVal('c-erros'),
      }
    : {
        gols: numVal('c-gols'),
        assistencias: numVal('c-assist'),
        passesOk: numVal('c-passes-ok'),
        passesMal: numVal('c-passes-ruim'),
        desarmes: numVal('c-desarmes'),
        chutesGol: numVal('c-chutes'),
        driblesOk: numVal('c-dribles'),
        bolasPerdidas: numVal('c-bolas-perdidas'),
      };

  stats.dataPartida = document.getElementById('f-ultima-partida').value || null;
  stats.tempoJogoMin = document.getElementById('f-tempo-jogo').value || null;

  // Se estiver editando, remove estatística anterior antes de gravar a nova
  if (isEdit) {
    const existentesRes = await apiFetch(`/estatisticas?atletaId=${idAtleta}`);
    const existentes = await existentesRes.json();
    for (const e of existentes) {
      await apiFetch(`/estatisticas/${e.id}`, { method: 'DELETE' });
    }
  }

  await apiFetch(`/estatisticas?atletaId=${idAtleta}`, {
    method: 'POST',
    body: JSON.stringify(stats)
  });
}

function numVal(id) {
  const el = document.getElementById(id);
  return el ? (parseInt(el.value) || 0) : 0;
}

function voltar() {
  sessionStorage.removeItem('tb_atleta_id');
  window.location.href = 'jogadores.html';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

async function init() {
  const timeRes = await apiFetch(`/times/${timeId}`);
  timeAtual = await timeRes.json();

  const esporte = modalidadeParaEsporte(timeAtual.modalidade);
  const chavePosicao = modalidadeParaChavePosicao(timeAtual.modalidade);

  carregarPosicoes(chavePosicao);
  renderizarStats(esporte);

  if (isEdit) {
    const atletaRes = await apiFetch(`/atletas/${atletaId}`);
    const j = await atletaRes.json();

    document.getElementById('f-nome').value = j.nome || '';
    document.getElementById('f-descricao').value = j.descricao || '';
    document.getElementById('f-idade').value = j.idade || '';
    carregarPosicoes(chavePosicao, j.posicao || '');
    document.getElementById('f-altura').value = j.altura || '';
    document.getElementById('f-peso').value = j.peso || '';
    document.getElementById('f-rating').value = j.rating || '';
    document.getElementById('f-estado').value = j.estadoForma || '';

    const statsRes = await apiFetch(`/estatisticas?atletaId=${atletaId}`);
    const statsList = await statsRes.json();
    const ultimaStat = statsList[statsList.length - 1];

    if (ultimaStat) {
      document.getElementById('f-ultima-partida').value = ultimaStat.dataPartida || '';
      document.getElementById('f-tempo-jogo').value = ultimaStat.tempoJogoMin || '';
      renderizarStats(esporte, {
        'c-gols': ultimaStat.gols, 'c-assist': ultimaStat.assistencias,
        'c-passes-ok': ultimaStat.passesOk, 'c-passes-ruim': ultimaStat.passesMal,
        'c-desarmes': ultimaStat.desarmes, 'c-chutes': ultimaStat.chutesGol,
        'c-dribles': ultimaStat.driblesOk, 'c-bolas-perdidas': ultimaStat.bolasPerdidas,
        'c-pontos': ultimaStat.pontos, 'c-aces': ultimaStat.aces,
        'c-bloqueios': ultimaStat.bloqueios, 'c-erros': ultimaStat.erros,
      });
    }

    if (j.fotoBase64) {
      fotoBase64 = j.fotoBase64;
      document.getElementById('foto-area').style.display = 'none';
      document.getElementById('foto-preview-wrap').style.display = 'block';
      document.getElementById('foto-preview-img').src = j.fotoBase64;
    }
  }

  updatePreview();
}

init();