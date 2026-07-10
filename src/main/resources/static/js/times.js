const API_BASE = 'http://localhost:8080/api';

const token = sessionStorage.getItem('tb_token');
const userRaw = sessionStorage.getItem('tb_user');
if (!token || !userRaw) window.location.href = 'index.html';
const user = JSON.parse(userRaw);

document.getElementById('user-name').textContent = user.name?.split(' ')[0] || 'Técnico';
document.getElementById('clube-nome').textContent = user.clube || 'Meu Clube';

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

let times = [];

async function carregarTimes() {
  const res = await apiFetch('/times/meus');
  times = await res.json();
  renderTimes();
}

function renderTimes() {
  const grid = document.getElementById('times-grid');
  const empty = document.getElementById('empty-state');

  if (times.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = times.map((t) => `
    <div class="time-card" onclick="irParaTime('${t.id}')">
      <div class="time-card-actions">
        <div class="btn-icon" onclick="deletarTime(event, '${t.id}')" title="Excluir">x</div>
      </div>
      <div class="time-escudo">${t.nome.substring(0, 2).toUpperCase()}</div>
      <div class="time-nome">${t.nome}</div>
      <div class="time-tecnico">Técnico: ${t.tecnico} - ${t.modalidade}</div>
      <div class="time-stats">
        <div class="time-stat">
          <div class="time-stat-num">0</div>
          <div class="time-stat-label">Atletas</div>
        </div>
        <div class="time-stat">
          <div class="time-stat-num">${t.modalidade === 'Futsal' ? 5 : 11}</div>
          <div class="time-stat-label">Titulares</div>
        </div>
      </div>
    </div>
  `).join('');
}

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('time-nome').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('time-nome').value = '';
  document.getElementById('time-tecnico').value = '';
  document.getElementById('time-descricao').value = '';
}

async function criarTime() {
  const nome = document.getElementById('time-nome').value.trim();
  const tecnico = document.getElementById('time-tecnico').value.trim();
  const modalidade = document.getElementById('time-modalidade').value;
  const descricao = document.getElementById('time-descricao').value.trim();

  if (!nome || !tecnico) { alert('Preencha nome do time e do técnico.'); return; }

  await apiFetch('/times', {
    method: 'POST',
    body: JSON.stringify({ nome, tecnico, modalidade, descricao })
  });

  closeModal();
  await carregarTimes();
}

function irParaTime(id) {
  sessionStorage.setItem('tb_time_id', id);
  window.location.href = 'jogadores.html';
}

async function deletarTime(e, id) {
  e.stopPropagation();
  if (!confirm('Excluir este time e todos os atletas?')) return;
  await apiFetch(`/times/${id}`, { method: 'DELETE' });
  await carregarTimes();
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

carregarTimes();