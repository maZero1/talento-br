const API_BASE = 'http://localhost:8080/api';

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0) === (tab === 'login'));
  });
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-error').style.display = 'none';
  document.getElementById('register-error').style.display = 'none';
  document.getElementById('register-success').style.display = 'none';
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      errEl.textContent = 'E-mail ou senha inválidos.';
      errEl.style.display = 'block';
      return;
    }

    const data = await res.json();
    sessionStorage.setItem('tb_token', data.token);
    sessionStorage.setItem('tb_user', JSON.stringify({
      name: data.nome,
      email: data.email,
      clube: data.nomeClube
    }));

    errEl.style.display = 'none';
    window.location.href = 'times.html';
  } catch (err) {
    errEl.textContent = 'Não foi possível conectar ao servidor.';
    errEl.style.display = 'block';
  }
}

async function doRegister() {
  const nome = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const nomeClube = document.getElementById('reg-clube').value.trim();
  const errEl = document.getElementById('register-error');
  const sucEl = document.getElementById('register-success');

  if (!nome || !email || password.length < 6 || !nomeClube) {
    errEl.textContent = 'Preencha todos os campos. A senha precisa ter ao menos 6 caracteres.';
    errEl.style.display = 'block';
    sucEl.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password, nomeClube })
    });

    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      errEl.textContent = erro.erro || erro.message || 'Não foi possível cadastrar.';
      errEl.style.display = 'block';
      sucEl.style.display = 'none';
      return;
    }

    errEl.style.display = 'none';
    sucEl.style.display = 'block';
    setTimeout(() => switchTab('login'), 1500);
  } catch (err) {
    errEl.textContent = 'Não foi possível conectar ao servidor.';
    errEl.style.display = 'block';
  }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('form-login').classList.contains('active')) doLogin();
  else doRegister();
});

if (sessionStorage.getItem('tb_token')) {
  window.location.href = 'times.html';
}