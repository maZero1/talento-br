import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/index.css'

const DEMO = {
  email: 'demo@talentobr.com',
  password: 'talento123',
  name: 'Técnico Demo',
  clube: 'Escolinha Demo',
}

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regClube, setRegClube] = useState('')
  const [regError, setRegError] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('tb_user')) navigate('/times')
  }, [navigate])

  function switchTab(novaAba) {
    setTab(novaAba)
    setLoginError(false)
    setRegError(false)
    setRegSuccess(false)
  }

  function doLogin() {
    const stored = JSON.parse(localStorage.getItem('tb_users') || '[]')
    const found = stored.find((u) => u.email === loginEmail && u.password === loginPassword)
    const isDemo = loginEmail === DEMO.email && loginPassword === DEMO.password

    if (isDemo || found) {
      const user = isDemo ? DEMO : found
      sessionStorage.setItem('tb_user', JSON.stringify(user))
      setLoginError(false)
      navigate('/times')
    } else {
      setLoginError(true)
    }
  }

  function doRegister() {
    if (!regName.trim() || !regEmail.trim() || regPassword.length < 6 || !regClube.trim()) {
      setRegError(true)
      setRegSuccess(false)
      return
    }

    const users = JSON.parse(localStorage.getItem('tb_users') || '[]')
    users.push({ name: regName.trim(), email: regEmail.trim(), password: regPassword, clube: regClube.trim() })
    localStorage.setItem('tb_users', JSON.stringify(users))

    setRegError(false)
    setRegSuccess(true)
    setTimeout(() => switchTab('login'), 1500)
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    if (tab === 'login') doLogin()
    else doRegister()
  }

  return (
    <div className="login-page">
      <div className="container" onKeyDown={handleKeyDown}>
        <div className="logo-wrap">
          <img src="/Logo_com_nome.png" alt="TalentoBR" />
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
              Entrar
            </button>
            <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
              Cadastrar
            </button>
          </div>

          <div className={`form-section ${tab === 'login' ? 'active' : ''}`}>
            {loginError && (
              <div className="error-msg" style={{ display: 'block' }}>
                E-mail ou senha incorretos. Tente novamente.
              </div>
            )}

            <div className="field">
              <label>E-mail</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tecnico@talentobr.com"
              />
            </div>
            <div className="field">
              <label>Senha</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button className="btn-primary" onClick={doLogin}>
              ENTRAR NO SISTEMA
            </button>

          </div>

          <div className={`form-section ${tab === 'register' ? 'active' : ''}`}>
            {regSuccess && (
              <div className="success-msg" style={{ display: 'block' }}>
                Conta criada! Agora faça login com seu e-mail.
              </div>
            )}
            {regError && (
              <div className="error-msg" style={{ display: 'block' }}>
                Preencha todos os campos corretamente.
              </div>
            )}

            <div className="field">
              <label>Nome completo</label>
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Carlos Técnico" />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="voce@email.com" />
            </div>
            <div className="field">
              <label>Senha</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
              />
              <div className="hint">
                Mínimo <span>6 caracteres</span>
              </div>
            </div>
            <div className="field">
              <label>Nome do Clube / Escolinha</label>
              <input
                type="text"
                value={regClube}
                onChange={(e) => setRegClube(e.target.value)}
                placeholder="Ex: Escolinha Campeões do Amanhã"
              />
            </div>

            <button className="btn-primary" onClick={doRegister}>
              CRIAR CONTA
            </button>
          </div>
        </div>

        <div className="footer-text">TalentoBR &copy; 2026 — MarMi Solutions</div>
      </div>
    </div>
  )
}
