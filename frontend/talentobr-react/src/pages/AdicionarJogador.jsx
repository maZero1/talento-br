import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/adicionar-jogadores.css'

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
    { v: 'GOL', l: 'GOL — Goleiro' },
    { v: 'ZAG', l: 'ZAG — Zagueiro' },
    { v: 'LAT', l: 'LAT — Lateral' },
    { v: 'MEI', l: 'MEI — Meia' },
    { v: 'ALA', l: 'ALA — Ala' },
    { v: 'ATK', l: 'ATK — Atacante' },
  ],
  futsal: [
    { v: 'GOL', l: 'GOL — Goleiro' },
    { v: 'FIXO', l: 'FIXO — Fixo' },
    { v: 'ALE', l: 'ALE — Ala Esquerdo' },
    { v: 'ALD', l: 'ALD — Ala Direito' },
    { v: 'PIV', l: 'PIV — Pivô' },
  ],
  volei: [
    { v: 'LEV', l: 'LEV — Levantador' },
    { v: 'OPO', l: 'OPO — Oposto' },
    { v: 'PON', l: 'PON — Ponteiro' },
    { v: 'CEN', l: 'CEN — Central' },
    { v: 'LIB', l: 'LIB — Líbero' },
  ],
}

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
    { id: 'c-dribles-inc', label: 'Dribles Incompletos' },
    { id: 'c-passes-total', label: 'Passes (Total)' },
  ],
  volei: [
    { id: 'c-pontos', label: 'Pontos' },
    { id: 'c-aces', label: 'Aces' },
    { id: 'c-bloqueios', label: 'Bloqueios' },
    { id: 'c-erros', label: 'Erros' },
  ],
}

const NOMES_BADGE = { campo: 'Campo', society: 'Society', futsal: 'Futsal', volei: 'Vôlei' }

function modalidadeParaEsporte(modalidade) {
  if (!modalidade) return 'futebol'
  const m = modalidade.toLowerCase()
  if (m.includes('vôlei') || m.includes('volei')) return 'volei'
  return 'futebol'
}

function modalidadeParaChavePosicao(modalidade) {
  if (!modalidade) return 'campo'
  const m = modalidade.toLowerCase()
  if (m.includes('vôlei') || m.includes('volei')) return 'volei'
  if (m.includes('society')) return 'society'
  if (m.includes('futsal')) return 'futsal'
  return 'campo'
}

export default function AdicionarJogador() {
  const navigate = useNavigate()
  const fotoInputRef = useRef(null)

  const [user, setUser] = useState(null)
  const [times, setTimes] = useState([])
  const [timeIdx, setTimeIdx] = useState(-1)
  const [jogadorIdx, setJogadorIdx] = useState(-1)
  const [toast, setToast] = useState('')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [idade, setIdade] = useState('')
  const [posicao, setPosicao] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [rating, setRating] = useState('')
  const [estado, setEstado] = useState('')
  const [ultimaPartida, setUltimaPartida] = useState('')
  const [tempoJogo, setTempoJogo] = useState('')
  const [foto, setFoto] = useState(null)
  const [stats, setStats] = useState({})

  useEffect(() => {
    const raw = sessionStorage.getItem('tb_user')
    if (!raw) {
      navigate('/')
      return
    }
    const u = JSON.parse(raw)
    const tIdx = parseInt(sessionStorage.getItem('tb_time_idx') ?? '-1')
    if (tIdx < 0) {
      navigate('/times')
      return
    }
    setUser(u)
    setTimeIdx(tIdx)

    const t = JSON.parse(localStorage.getItem('tb_times_' + (u.email || 'demo')) || '[]')
    setTimes(t)

    const jIdx = parseInt(sessionStorage.getItem('tb_jogador_idx') ?? '-1')
    setJogadorIdx(jIdx)

    if (jIdx >= 0) {
      const j = t[tIdx]?.jogadores?.[jIdx]
      if (j) {
        setNome(j.nome || '')
        setDescricao(j.descricao || '')
        setIdade(j.idade || '')
        setPosicao(j.posicao || '')
        setAltura(j.altura || '')
        setPeso(j.peso || '')
        setRating(j.rating || '')
        setEstado(j.estado || '')
        setUltimaPartida(j.ultimaPartida || '')
        setTempoJogo(j.tempoJogo || '')
        setFoto(j.foto || null)
        setStats(j.stats || {})
      }
    }
  }, [navigate])

  const isEdit = jogadorIdx >= 0
  const time = times[timeIdx]
  const modalidadeTime = time?.modalidade || ''
  const esporte = modalidadeParaEsporte(modalidadeTime)
  const chavePosicao = modalidadeParaChavePosicao(modalidadeTime)
  const listaPosicoes = POSICOES[chavePosicao] || POSICOES.campo
  const statsConfig = STATS_CONFIG[esporte] || STATS_CONFIG.futebol

  function getStat(id) {
    return stats[id] ?? 0
  }
  function setStat(id, val) {
    setStats((prev) => ({ ...prev, [id]: Math.max(0, val) }))
  }
  function increment(id) {
    setStat(id, (parseInt(getStat(id)) || 0) + 1)
  }
  function decrement(id) {
    setStat(id, (parseInt(getStat(id)) || 0) - 1)
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function removerFoto() {
    setFoto(null)
    if (fotoInputRef.current) fotoInputRef.current.value = ''
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function voltar() {
    sessionStorage.removeItem('tb_jogador_idx')
    navigate('/jogadores')
  }

  function salvarJogador() {
    if (!nome.trim()) {
      showToast('⚠️ Informe o nome do atleta.')
      return
    }

    const statsFinal = {}
    statsConfig.forEach((s) => {
      statsFinal[s.id] = parseInt(stats[s.id]) || 0
    })

    const jogador = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      idade,
      posicao,
      altura,
      peso,
      rating,
      estado,
      ultimaPartida,
      tempoJogo,
      esporte,
      stats: statsFinal,
      foto,
    }

    const t = [...times]
    const jogadoresAtual = [...(t[timeIdx].jogadores || [])]
    if (isEdit) jogadoresAtual[jogadorIdx] = jogador
    else jogadoresAtual.push(jogador)
    t[timeIdx] = { ...t[timeIdx], jogadores: jogadoresAtual }

    localStorage.setItem('tb_times_' + (user.email || 'demo'), JSON.stringify(t))
    sessionStorage.removeItem('tb_jogador_idx')

    showToast(isEdit ? '✓ Atleta atualizado!' : '✓ Atleta adicionado!')
    setTimeout(() => navigate('/jogadores'), 900)
  }

  if (!user || !time) return null

  const sub = [posicao || null, idade ? idade + ' anos' : null, altura ? altura + 'm' : null, peso ? peso + 'kg' : null]
    .filter(Boolean)
    .join(' · ')

  const partes = nome.trim().split(' ')
  const inits = nome.trim() ? (partes[0][0] + (partes[1] ? partes[1][0] : '')).toUpperCase() : '?'

  return (
    <>
      <nav>
        <div className="nav-left">
          <button className="btn-back" onClick={voltar}>
            ← Jogadores
          </button>
          <span className="nav-logo-text">TalentoBR</span>
        </div>
      </nav>

      <main>
        <div className="player-preview">
          <div className="preview-avatar" onClick={() => fotoInputRef.current.click()}>
            {foto ? <img src={foto} alt="" /> : <span className="preview-initials">{inits}</span>}
          </div>

          <div className="preview-info">
            <div className="preview-nome">{nome.trim() || 'Nome do Atleta'}</div>
            <div className="preview-sub">{sub || 'Posição · Idade · Altura · Peso'}</div>
          </div>

          <div className="preview-rating-wrap">
            <div className="preview-rating">{rating || '—'}</div>
            <div className="preview-rating-lbl">Rating</div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">Dados Pessoais</div>
          <div className="fields-grid">
            <div className="field full">
              <label>Nome completo do Atleta</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Marlon dos Santos" />
            </div>

            <div className="field full">
              <label>Descrição / Observação</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Atleta com grande potencial e visão de jogo."
              ></textarea>
            </div>

            <div className="field">
              <label>Idade</label>
              <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Ex: 20" min="10" max="45" />
            </div>

            <div className="field">
              <label>
                Posição
                <span
                  style={{
                    fontSize: 10,
                    background: 'var(--green-dim)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '1px 7px',
                    color: 'var(--green)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    marginLeft: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {NOMES_BADGE[chavePosicao] || 'Campo'}
                </span>
              </label>
              <select value={posicao} onChange={(e) => setPosicao(e.target.value)}>
                <option value="">Selecionar</option>
                {listaPosicoes.map((p) => (
                  <option key={p.v} value={p.v}>
                    {p.l}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Altura (m)</label>
              <input type="text" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ex: 1.74" />
            </div>

            <div className="field">
              <label>Peso (kg)</label>
              <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ex: 75" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">Avaliação</div>
          <div className="fields-grid">
            <div className="field">
              <label>Rating Geral</label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Ex: 8.5"
                min="1"
                max="10"
                step="0.1"
              />
            </div>

            <div className="field">
              <label>Estado de Forma</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Selecionar</option>
                <option>Excelente</option>
                <option>Bem</option>
                <option>Regular</option>
                <option>Lesionado</option>
                <option>Em Observação</option>
              </select>
            </div>

            <div className="field">
              <label>Última Partida</label>
              <input type="date" value={ultimaPartida} onChange={(e) => setUltimaPartida(e.target.value)} />
            </div>

            <div className="field">
              <label>Tempo médio de jogo (min)</label>
              <input
                type="number"
                value={tempoJogo}
                onChange={(e) => setTempoJogo(e.target.value)}
                placeholder="Ex: 15"
                min="0"
                max="90"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">{esporte === 'volei' ? 'Estatísticas de Vôlei' : 'Estatísticas de Campo'}</div>
          <div className="fields-grid">
            {statsConfig.map((s) => (
              <div className="counter-field" key={s.id}>
                <div className="counter-label">{s.label}</div>
                <div className="counter">
                  <button type="button" className="counter-btn" onClick={() => decrement(s.id)}>
                    −
                  </button>
                  <input
                    className="counter-val"
                    type="number"
                    value={getStat(s.id)}
                    min="0"
                    onChange={(e) => setStat(s.id, parseInt(e.target.value) || 0)}
                  />
                  <button type="button" className="counter-btn" onClick={() => increment(s.id)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">Foto do Atleta</div>
          {!foto ? (
            <div className="foto-area" onClick={() => fotoInputRef.current.click()}>
              <div className="foto-area-text">
                <strong>+</strong>
                Clique para adicionar foto do atleta
              </div>
              <input ref={fotoInputRef} type="file" accept="image/*" onChange={handleFoto} />
            </div>
          ) : (
            <div className="foto-preview-wrap" style={{ display: 'block' }}>
              <img src={foto} alt="Preview" />
              <button className="foto-remove" onClick={removerFoto}>
                ✕
              </button>
              <input ref={fotoInputRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={voltar}>
            CANCELAR
          </button>
          <button className="btn-finalizar" onClick={salvarJogador}>
            ✓ FINALIZAR
          </button>
        </div>
      </main>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
