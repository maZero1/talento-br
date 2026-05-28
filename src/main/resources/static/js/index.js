const DEMO = {
  email: 'demo@talentobr.com',
  password: 'talento123',
  name: 'Técnico Demo',
  clube: 'Escolinha Demo',
};

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0) === (tab === 'login'));
  });
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-error').style.display    = 'none';
  document.getElementById('register-error').style.display = 'none';
  document.getElementById('register-success').style.display = 'none';
}

function doLogin() {
  const email  = document.getElementById('login-email').value.trim();
  const pass   = document.getElementById('login-password').value;
  const errEl  = document.getElementById('login-error');

  const stored = JSON.parse(localStorage.getItem('tb_users') || '[]');
  const found  = stored.find(u => u.email === email && u.password === pass);
  const isDemo = (email === DEMO.email && pass === DEMO.password);

  if (isDemo || found) {
    const user = isDemo ? DEMO : found;
    sessionStorage.setItem('tb_user', JSON.stringify(user));
    errEl.style.display = 'none';
    window.location.href = 'times.html';
  } else {
    errEl.style.display = 'block';
  }
}

function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-password').value;
  const clube = document.getElementById('reg-clube').value.trim();
  const errEl = document.getElementById('register-error');
  const sucEl = document.getElementById('register-success');

  if (!name || !email || pass.length < 6 || !clube) {
    errEl.style.display = 'block';
    sucEl.style.display = 'none';
    return;
  }

  const users = JSON.parse(localStorage.getItem('tb_users') || '[]');
  users.push({ name, email, password: pass, clube });
  localStorage.setItem('tb_users', JSON.stringify(users));

  errEl.style.display = 'none';
  sucEl.style.display = 'block';
  setTimeout(() => switchTab('login'), 1500);
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('form-login').classList.contains('active')) doLogin();
  else doRegister();
});

if (sessionStorage.getItem('tb_user')) {
  window.location.href = 'times.html';
}