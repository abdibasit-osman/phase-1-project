// --- Section Show/Hide Functions ---

function showLoginSection() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'none';
}

function showBookingSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'none';
}

function showDashboardSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
  document.getElementById('thankyou-section').style.display = 'none';
}

function showThankYouSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'block';
}

// On page load, always show the login section
window.addEventListener('DOMContentLoaded', () => {
  showLoginSection();
});

// --- AUTHENTICATION LOGIC USING json-server ---

const API_URL = 'http://localhost:3000';

// Find user by email from json-server
async function findUserByEmail(email) {
  const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
  const users = await res.json();
  return users[0]; // returns user or undefined
}

// Register a new user in json-server
async function registerUser(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return await res.json();
}

// Handle login/register form submit
document.getElementById('authForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  const role = document.getElementById('authRole').value;

  let user = await findUserByEmail(email);

  if (user) {
    // Login
    if (user.password === password) {
      alert('Login successful!');
    } else {
      alert('Incorrect password.');
      return;
    }
  } else {
    // Register new user
    user = await registerUser({ name, email, password, role });
    alert('Registration successful! You are now logged in.');
  }

  // Save logged in user in localStorage
  localStorage.setItem('loggedInUser', JSON.stringify(user));

  // Show appropriate section
  if (user.role === 'client') {
    showBookingSection();
  } else if (user.role === 'houseworker') {
    showDashboardSection();
  }
});

