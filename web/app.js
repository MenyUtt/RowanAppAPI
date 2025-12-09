// Configura aquí la URL base de tu API (ajusta puerto si es necesario)
const API_BASE = window.API_BASE_URL || 'http://localhost:3000';

const loginForm = document.getElementById('login-form');
const codeForm = document.getElementById('code-form');
const step1Message = document.getElementById('step1-message');
const step2Message = document.getElementById('step2-message');
const step2Section = document.getElementById('step2-section');
const step1Section = document.getElementById('step1-section');
const profileSection = document.getElementById('profile-section');
const profilePre = document.getElementById('profile');
const logoutBtn = document.getElementById('logout-btn');

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  step1Message.textContent = '';
  const correo = document.getElementById('email').value;
  const contrasena = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login-step1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      step1Message.textContent = 'Error: ' + (err.message || res.statusText);
      return;
    }

    const body = await res.json();
    // Se espera que devuelva { userId, message } o similar
    document.getElementById('userId').value = body.userId || body.id || '';
    step1Message.textContent = body.message || 'Código enviado. Revisa tu correo.';
    hide(step1Section);
    show(step2Section);
  } catch (err) {
    step1Message.textContent = 'Error de conexión: ' + err.message;
  }
});

codeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  step2Message.textContent = '';
  const userId = document.getElementById('userId').value;
  const code = document.getElementById('code').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login-verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code })
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      step2Message.textContent = 'Error: ' + (err.message || res.statusText);
      return;
    }

    const body = await res.json();
    // Se espera { access_token: '...' } o similar
    const token = body.access_token || body.token || body.jwt;
    if (!token) {
      step2Message.textContent = 'Respuesta inválida del servidor.';
      return;
    }

    localStorage.setItem('jwt', token);
    step2Message.textContent = 'Login exitoso.';
    hide(step2Section);
    await loadProfile();
  } catch (err) {
    step2Message.textContent = 'Error de conexión: ' + err.message;
  }
});

async function loadProfile() {
  const token = localStorage.getItem('jwt');
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      profilePre.textContent = 'Error leyendo perfil';
      show(profileSection);
      return;
    }
    const user = await res.json();
    profilePre.textContent = JSON.stringify(user, null, 2);
    show(profileSection);
  } catch (err) {
    profilePre.textContent = 'Error de conexión: ' + err.message;
    show(profileSection);
  }
}

function logout() {
  localStorage.removeItem('jwt');
  hide(profileSection);
  hide(step2Section);
  show(step1Section);
}

logoutBtn.addEventListener('click', () => {
  logout();
});

// Si ya hay token, intentar cargar perfil
if (localStorage.getItem('jwt')) {
  hide(step1Section);
  hide(step2Section);
  loadProfile();
}
