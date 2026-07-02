import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Times from './pages/Times.jsx'
import Jogadores from './pages/Jogadores.jsx'
import AdicionarJogador from './pages/AdicionarJogador.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/times" element={<Times />} />
      <Route path="/jogadores" element={<Jogadores />} />
      <Route path="/adicionar-jogador" element={<AdicionarJogador />} />
    </Routes>
  )
}
