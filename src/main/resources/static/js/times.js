const userRaw = sessionStorage.getItem('tb_user');
if (!userRaw) window.location.href = 'index.html';
const user = JSON.parse(userRaw);

document.getElementById('user-name').textContent  = user.name?.split(' ')[0] || 'Técnico';
document.getElementById('clube-nome').textContent = user.clube || 'Meu Clube';

function getKey()       { return 'tb_times_' + (user.email || 'demo'); }
function getTimes()     { return JSON.parse(localStorage.getItem(getKey()) || '[]'); }
function saveTimes(t)   { localStorage.setItem(getKey(), JSON.stringify(t)); }

function renderTimes() {
  const times = getTimes();
  const grid  = document.getElementById('times-grid');
  const empty = document.getElementById('empty-state');

  if (times.length === 0) {
    grid.innerHTML      = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = times.map((t, i) => `
    <div class="time-card" onclick="irParaTime(${i})">
      <div class="time-card-actions">
        <div class="btn-icon" onclick="deletarTime(event, ${i})" title="Excluir">✕</div>
      </div>
      <div class="time-escudo">${t.nome.substring(0, 2).toUpperCase()}</div>
      <div class="time-nome">${t.nome}</div>
      <div class="time-tecnico">Técnico: ${t.tecnico} · ${t.modalidade}</div>
      <div class="time-stats">
        <div class="time-stat">
          <div class="time-stat-num">${(t.jogadores || []).length}</div>
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
  document.getElementById('time-nome').value       = '';
  document.getElementById('time-tecnico').value    = '';
  document.getElementById('time-descricao').value  = '';
}

function criarTime() {
  const nome       = document.getElementById('time-nome').value.trim();
  const tecnico    = document.getElementById('time-tecnico').value.trim();
  const modalidade = document.getElementById('time-modalidade').value;
  const descricao  = document.getElementById('time-descricao').value.trim();

  if (!nome || !tecnico) { alert('Preencha nome do time e do técnico.'); return; }

  const times = getTimes();
  times.push({
    nome, tecnico, modalidade, descricao,
    jogadores: [],
    criadoEm: new Date().toLocaleDateString('pt-BR'),
  });
  saveTimes(times);
  closeModal();
  renderTimes();
}

function irParaTime(idx) {
  sessionStorage.setItem('tb_time_idx', idx);
  window.location.href = 'jogadores.html';
}

function deletarTime(e, idx) {
  e.stopPropagation();
  if (!confirm('Excluir este time e todos os atletas?')) return;
  const times = getTimes();
  times.splice(idx, 1);
  saveTimes(times);
  renderTimes();
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

renderTimes();