# TalentoBr — Sistema SaaS de Avaliação de Atletas

**TalentoBr** é uma plataforma web para escolinhas e clubes amadores profissionalizarem a avaliação de atletas, manterem histórico de desempenho e gerarem materiais compartilháveis (cards) para divulgação.

---

## Visão rápida
Centralizar avaliações por **clube** com **isolamento de dados** (`clube_id`), interface mobile‑first e exportação de cards para redes sociais.

---

## Arquitetura & Stack
**Arquitetura:** MVC

**Componente** | **Tecnologia**
---|---:
**Backend** | Python (FastAPI)
**Banco / Auth** | Supabase (Postgres + Auth)
**Frontend** | HTML5, CSS3, JavaScript (Vanilla) + Jinja
**Gráficos** | Chart.js

---

## Funcionalidades principais
- **Autenticação por clube** (Supabase Auth) e filtro por `clube_id`.  
- **CRUD** de Atletas e Avaliações (validação notas 1–10).  
- **Nota Geral**: Técnico 40% / Tático 30% / Físico 30%.  
- **Dashboard**: cards resumo, gráfico radar e feed de avaliações.  
- **Perfil do Atleta**: evolução, histórico de lesões e parecer técnico.  
- **Comparativo Versus** e **Exportação de Card**.  
- **Gestão de Planos**: Free / Pro / Elite (limites e upgrade).
