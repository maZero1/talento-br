import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/times.css'

function getKey(user) {
  return 'tb_times_' + (user.email || 'demo')
}
function loadTimes(user) {
  return JSON.parse(localStorage.getItem(getKey(user)) || '[]')
}
function persistTimes(user, times) {
  localStorage.setItem(getKey(user), JSON.stringify(times))
}

export default function Times() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [times, setTimes] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const [nome, setNome] = useState('')
  const [tecnico, setTecnico] = useState('')
  const [modalidade, setModalidade] = useState('Futebol de Campo')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('tb_user')
    if (!raw) {
      navigate('/')
      return
    }
    const u = JSON.parse(raw)
    setUser(u)
    setTimes(loadTimes(u))
  }, [navigate])

  function criarTime() {
    if (!nome.trim() || !tecnico.trim()) {
      alert('Preencha nome do time e do técnico.')
      return
    }
    const novo = {
      nome: nome.trim(),
      tecnico: tecnico.trim(),
      modalidade,
      descricao: descricao.trim(),
      jogadores: [],
      criadoEm: new Date().toLocaleDateString('pt-BR'),
    }
    const atualizados = [...times, novo]
    setTimes(atualizados)
    persistTimes(user, atualizados)
    closeModal()
  }

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setNome('')
    setTecnico('')
    setModalidade('Futebol de Campo')
    setDescricao('')
  }

  function irParaTime(idx) {
    sessionStorage.setItem('tb_time_idx', idx)
    navigate('/jogadores')
  }

  function deletarTime(e, idx) {
    e.stopPropagation()
    if (!confirm('Excluir este time e todos os atletas?')) return
    const atualizados = times.filter((_, i) => i !== idx)
    setTimes(atualizados)
    persistTimes(user, atualizados)
  }

  function logout() {
    sessionStorage.clear()
    navigate('/')
  }

  if (!user) return null

  return (
    <>
      <nav>
        <div className="nav-logo">
          <img src="/Logo_sem_nome.png" alt="TalentoBR" />
          <span className="nav-logo-text">TalentoBR</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">
            Olá, <strong>{user.name?.split(' ')[0] || 'Técnico'}</strong>
          </span>
          <button className="btn-logout" onClick={logout}>
            Sair
          </button>
        </div>
      </nav>

      <main>
        <div className="page-header">
          <div>
            <div className="page-title">MEUS TIMES</div>
            <div className="page-subtitle">{user.clube || 'Meu Clube'}</div>
          </div>
          {times.length > 0 && (
            <button className="btn-primary" onClick={openModal}>
              + CRIAR TIME
            </button>
          )}
        </div>

        {times.length > 0 ? (
          <div className="times-grid">
            {times.map((t, i) => (
              <div className="time-card" key={i} onClick={() => irParaTime(i)}>
                <div className="time-card-actions">
                  <div className="btn-icon" onClick={(e) => deletarTime(e, i)} title="Excluir">
                    ✕
                  </div>
                </div>
                <div className="time-escudo">{t.nome.substring(0, 2).toUpperCase()}</div>
                <div className="time-nome">{t.nome}</div>
                <div className="time-tecnico">
                  Técnico: {t.tecnico} · {t.modalidade}
                </div>
                <div className="time-stats">
                  <div className="time-stat">
                    <div className="time-stat-num">{(t.jogadores || []).length}</div>
                    <div className="time-stat-label">Atletas</div>
                  </div>
                  <div className="time-stat">
                    <div className="time-stat-num">{t.modalidade === 'Futsal' ? 5 : 11}</div>
                    <div className="time-stat-label">Titulares</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>Nenhum time criado ainda</h3>
            <p>Crie seu primeiro time para começar a gerenciar seus atletas.</p>
            <button className="btn-primary" onClick={openModal}>
              + CRIAR PRIMEIRO TIME
            </button>
          </div>
        )}
      </main>

      <div
        className={`modal-overlay ${modalOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal()
        }}
      >
        <div className="modal">
          <div className="modal-title">CRIAR TIME</div>

          <div className="field">
            <label>Nome do Time</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Sub-15 Furacões" />
          </div>
          <div className="field">
            <label>Nome do Técnico</label>
            <input type="text" value={tecnico} onChange={(e) => setTecnico(e.target.value)} placeholder="Ex: Carlos Silva" />
          </div>
          <div className="field">
            <label>Modalidade</label>
            <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              <option value="Futebol de Campo">Futebol de Campo</option>
              <option value="Futebol Society">Futebol Society</option>
              <option value="Futsal">Futsal</option>
              <option value="Futebol Feminino">Futebol Feminino</option>
              <option value="Vôlei">Vôlei</option>
            </select>
          </div>
          <div className="field">
            <label>Descrição (opcional)</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição do time..."
            ></textarea>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={closeModal}>
              CANCELAR
            </button>
            <button className="btn-primary-modal" onClick={criarTime}>
              CRIAR TIME
            </button>
          </div>
        </div>
      </div>
    </>
  )
}