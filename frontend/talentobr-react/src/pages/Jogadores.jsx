import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/jogadores.css'

const STATS_DISPLAY = {
  futebol: [
    { id: 'c-gols', label: 'Gols' },
    { id: 'c-assist', label: 'Assistências' },
    { id: 'c-passes-ok', label: 'Passes OK' },
    { id: 'c-chutes', label: 'Chutes a Gol' },
    { id: 'c-desarmes', label: 'Desarmes' },
    { id: 'c-dribles', label: 'Dribles' },
    { id: 'c-passes-ruim', label: 'Passes Ruim' },
    { id: 'c-bolas-perdidas', label: 'Bolas Perdidas' },
  ],
  volei: [
    { id: 'c-pontos', label: 'Pontos' },
    { id: 'c-aces', label: 'Aces' },
    { id: 'c-bloqueios', label: 'Bloqueios' },
    { id: 'c-erros', label: 'Erros' },
  ],
}

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol'
  const m = modalidade.toLowerCase()
  if (m.includes('vôlei') || m.includes('volei')) return 'volei'
  return 'futebol'
}

function iniciais(nome) {
  if (!nome) return '??'
  const p = nome.trim().split(' ')
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase()
}

function getVal(j, statId) {
  if (j.stats && j.stats[statId] !== undefined) return j.stats[statId]
  const legado = {
    'c-gols': j.gols,
    'c-assist': j.assistencias,
    'c-passes-ok': j.passesBemSucedidos,
    'c-passes-ruim': j.passesMalSucedidos,
    'c-desarmes': j.desarmes,
    'c-chutes': j.chutesAGol,
    'c-dribles': j.driblesConcluidos,
    'c-bolas-perdidas': j.bolasPerdidas,
  }
  return legado[statId] ?? 0
}

export default function Jogadores() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [times, setTimes] = useState([])
  const [timeIdx, setTimeIdx] = useState(-1)
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('tb_user')
    if (!raw) {
      navigate('/')
      return
    }
    const u = JSON.parse(raw)
    const idx = parseInt(sessionStorage.getItem('tb_time_idx') ?? '-1')
    if (idx < 0) {
      navigate('/times')
      return
    }
    sessionStorage.removeItem('tb_jogador_idx')
    setUser(u)
    setTimeIdx(idx)
    setTimes(JSON.parse(localStorage.getItem('tb_times_' + (u.email || 'demo')) || '[]'))
  }, [navigate])

  function persist(t) {
    localStorage.setItem('tb_times_' + (user.email || 'demo'), JSON.stringify(t))
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function editarAtual() {
    if (selectedIdx < 0) return
    sessionStorage.setItem('tb_jogador_idx', selectedIdx)
    navigate('/adicionar-jogador')
  }

  function deletarAtual() {
    if (selectedIdx < 0 || !times[timeIdx]) return
    const nome = times[timeIdx].jogadores[selectedIdx].nome
    if (!confirm(`Excluir ${nome} do time?`)) return

    const atualizados = [...times]
    atualizados[timeIdx] = {
      ...atualizados[timeIdx],
      jogadores: atualizados[timeIdx].jogadores.filter((_, i) => i !== selectedIdx),
    }
    setTimes(atualizados)
    persist(atualizados)
    setSelectedIdx(-1)
    showToast('Atleta removido.')
  }

  function logout() {
    sessionStorage.clear()
    navigate('/')
  }

  const time = times[timeIdx]
  if (!user || !time) return null

  const jogadores = time.jogadores || []
  const mediaRating = jogadores.length
    ? (jogadores.reduce((a, j) => a + (parseFloat(j.rating) || 0), 0) / jogadores.length).toFixed(1)
    : '—'

  const jSel = selectedIdx >= 0 ? jogadores[selectedIdx] : null
  const esporte = modalidadeParaEsporte(time.modalidade)
  const statsDisplay = STATS_DISPLAY[esporte] || STATS_DISPLAY.futebol
  const linha1 = statsDisplay.slice(0, 4)
  const linha2 = statsDisplay.slice(4, 8)

  return (
    <>
      <nav>
        <div className="nav-left">
          <button className="btn-back" onClick={() => navigate('/times')}>
            ← Times
          </button>
          <span className="nav-logo-text">TalentoBR</span>
        </div>
        <div className="nav-right">
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            Olá, <strong style={{ color: 'var(--text)' }}>{user.name?.split(' ')[0] || 'Técnico'}</strong>
          </span>
          <button className="btn-logout" onClick={logout}>
            Sair
          </button>
        </div>
      </nav>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="time-badge">
              <span>{time.modalidade}</span>
            </div>
            <div className="sidebar-title">{time.nome.toUpperCase()}</div>
            <div className="sidebar-desc">
              Técnico: <span>{time.tecnico}</span>
            </div>
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-num">{jogadores.length}</div>
                <div className="stat-lbl">Atletas</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">{mediaRating}</div>
                <div className="stat-lbl">Rating Médio</div>
              </div>
            </div>
          </div>

          <div className="sidebar-list">
            {jogadores.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--muted)', fontSize: 13 }}>
                Nenhum atleta ainda.
                <br />
                Adicione o primeiro abaixo.
              </div>
            ) : (
              jogadores.map((j, i) => (
                <div
                  key={i}
                  className={`jogador-item ${i === selectedIdx ? 'active' : ''}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <div className="jogador-avatar">{j.foto ? <img src={j.foto} alt="" /> : iniciais(j.nome)}</div>
                  <div className="jogador-info">
                    <div className="jogador-nome">{j.nome}</div>
                    <div className="jogador-meta">
                      {j.posicao || '—'} · {j.idade ? j.idade + ' anos' : '—'}
                    </div>
                  </div>
                  <div className="jogador-rating">{j.rating || '—'}</div>
                </div>
              ))
            )}
          </div>

          <button className="btn-add-jogador" onClick={() => navigate('/adicionar-jogador')}>
            + Adicionar Jogador
          </button>
        </aside>

        <div className="content">
          {!jSel ? (
            <div className="empty-content">
              <h3>Selecione um atleta</h3>
              <p>Clique em um jogador da lista para ver suas estatísticas detalhadas.</p>
            </div>
          ) : (
            <div className="inspect-wrap show">
              <div className="inspect-header">
                <div className="inspect-avatar">{jSel.foto ? <img src={jSel.foto} alt="" /> : iniciais(jSel.nome)}</div>
                <div className="inspect-info">
                  <div className="inspect-nome">{jSel.nome || '—'}</div>
                  <div className="inspect-sub">
                    {[
                      jSel.idade ? jSel.idade + ' anos' : null,
                      jSel.posicao,
                      jSel.altura ? jSel.altura + 'm' : null,
                      jSel.peso ? jSel.peso + 'kg' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  <div className="inspect-desc">{jSel.descricao || 'Sem descrição cadastrada.'}</div>
                </div>
                <div className="inspect-edit" onClick={editarAtual} title="Editar">
                  ✏️
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-label">Última Partida</div>
                  <div className="stat-card-value" style={{ fontSize: 22 }}>
                    {jSel.ultimaPartida || '—'}
                  </div>
                </div>
                <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div>
                    <div className="stat-card-label">Rating</div>
                    <div className="stat-card-value big">{jSel.rating || '—'}</div>
                  </div>
                  {jSel.estado && <div className="estado-badge">● {jSel.estado}</div>}
                </div>
              </div>

              <p className="section-title">ESTATÍSTICAS DE CAMPO</p>

              <div className="stats-grid-4">
                {linha1.map((s) => (
                  <div className="stat-card-sm" key={s.id}>
                    <div className="lbl">{s.label}</div>
                    <div className="val">{getVal(jSel, s.id)}</div>
                  </div>
                ))}
              </div>
              <div className="stats-grid-4">
                {linha2.map((s) => (
                  <div className="stat-card-sm" key={s.id}>
                    <div className="lbl">{s.label}</div>
                    <div className="val">{getVal(jSel, s.id)}</div>
                  </div>
                ))}
              </div>

              <div className="inspect-actions">
                <button className="btn-danger" onClick={deletarAtual}>
                  EXCLUIR ATLETA
                </button>
                <button className="btn-edit-full" onClick={editarAtual}>
                  EDITAR DADOS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
