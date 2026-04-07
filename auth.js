// Auth Configuration
const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    if (!document.getElementById('loginForm')) return;

    // View Toggling
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    });

    // Form Event Listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

// Helper: Show Error
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

// Login Logic
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Save token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            showError('loginError', data.message || 'Login failed');
        }
    } catch (err) {
        showError('loginError', 'Cannot connect to server');
        console.error(err);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Registration Logic
async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('registerBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Save token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            showError('registerError', data.message || 'Registration failed');
        }
    } catch (err) {
        showError('registerError', 'Cannot connect to server');
        console.error(err);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
