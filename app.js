// --- Section Show/Hide Functions ---

function showLoginSection() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
  clearMessage();
}

function showBookingSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'block';
  clearMessage();
}

function showDashboardSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
  document.getElementById('thankyou-section').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'block';
  clearMessage();
  renderBookingsDashboard();
}

function showThankYouSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('thankyou-section').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'block';
  clearMessage();
}

// --- Message Display System (Error & Info) ---

function showMessage(message, type = 'error') {
  let msg = document.getElementById('errorMsg');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'errorMsg';
    document.body.insertBefore(msg, document.body.firstChild);
  }
  msg.textContent = message;
  msg.className = type === 'error' ? 'error-message' : 'info-message';
}

function clearMessage() {
  let msg = document.getElementById('errorMsg');
  if (msg) msg.textContent = '';
}

// --- On page load, always show the login section and setup logout ---

window.addEventListener('DOMContentLoaded', () => {
  // Add logout button if not present
  if (!document.getElementById('logoutBtn')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.display = 'none';
    logoutBtn.style.position = 'fixed';
    logoutBtn.style.top = '10px';
    logoutBtn.style.right = '10px';
    logoutBtn.style.zIndex = '1000';
    document.body.appendChild(logoutBtn);
    logoutBtn.addEventListener('click', logoutUser);
  }

  // Add navigation buttons logic for clients
  document.getElementById('viewBookingsBtn').addEventListener('click', function() {
    showDashboardSection();
  });
  document.getElementById('makeBookingBtn').addEventListener('click', function() {
    showBookingSection();
  });

  showLoginSection();
});

// --- AUTHENTICATION LOGIC USING json-server ---

const API_URL = 'http://localhost:3000';

// Find user by email from json-server
async function findUserByEmail(email) {
  try {
    const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Network error');
    const users = await res.json();
    return users[0]; // returns user or undefined
  } catch (err) {
    showMessage('Unable to connect to server. Please try again later.');
    throw err;
  }
}

// Register a new user in json-server
async function registerUser(user) {
  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    showMessage('Unable to register. Please try again.');
    throw err;
  }
}

// Handle login/register form submit
document.getElementById('authForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  clearMessage();

  // Validate form
  const name = document.getElementById('authName').value.trim();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  const role = document.getElementById('authRole').value;

  if (!name || !email || !password || !role) {
    showMessage('All fields are required.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage('Please enter a valid email address.');
    return;
  }
  if (password.length < 4) {
    showMessage('Password must be at least 4 characters.');
    return;
  }

  let user;
  try {
    user = await findUserByEmail(email);
  } catch (err) {
    // Error already shown
    return;
  }

  if (user) {
    // Login
    if (user.password === password) {
      // Success
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      if (user.role === 'client') {
        showBookingSection(); // Show booking form by default for clients
      } else if (user.role === 'houseworker') {
        showDashboardSection();
      }
    } else {
      showMessage('Incorrect password.');
      return;
    }
  } else {
    // Redundant check, but double safety for race conditions
    try {
      const dupe = await findUserByEmail(email);
      if (dupe) {
        showMessage('An account with this email already exists.');
        return;
      }
      user = await registerUser({ name, email, password, role });
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      if (user.role === 'client') {
        showBookingSection();
      } else if (user.role === 'houseworker') {
        showDashboardSection();
      }
    } catch (err) {
      // Error already shown
    }
  }
});

// Clear message when user interacts with the login form
document.getElementById('authForm').addEventListener('input', function() {
  clearMessage();
});

async function createBooking(booking) {
  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    showMessage('Failed to create booking. Please try again.');
    throw err;
  }
}

// Booking form submit event
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  clearMessage();

  // Validate form
  const address = document.getElementById('address').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const instructions = document.getElementById('instructions').value;

  if (!address || !service || !date) {
    showMessage('Please fill in all required fields.');
    return;
  }
  // Date validation: must be in the future
  const now = new Date();
  const bookingDate = new Date(date);
  if (bookingDate <= now) {
    showMessage('Please select a future date and time.');
    return;
  }

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    showMessage("You are not logged in. Please log in again.");
    showLoginSection();
    return;
  }

  const booking = {
    clientId: loggedInUser.id,
    service,
    address,
    date,
    instructions,
    status: 'Pending'
  };

  try {
    await createBooking(booking);
    e.target.reset();
    showThankYouSection();
  } catch (err) {
    // Error already shown
  }
});

// Handle 'Make Another Booking' button
document.getElementById('makeAnotherBookingBtn').addEventListener('click', function() {
  showBookingSection();
});

// Logout logic
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  document.getElementById('authForm').reset();
  showLoginSection();
  showMessage("You have been logged out.", "info");
}

// Fetch all bookings from the server
async function fetchAllBookings() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    showMessage('Failed to load bookings. Please try again.');
    return [];
  }
}

// Fetch all users from the server
async function fetchAllUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    showMessage('Failed to load users. Please try again.');
    return [];
  }
}

// Render bookings in the dashboard, including client name/email for houseworkers
async function renderBookingsDashboard() {
  const bookingsList = document.getElementById('bookingsList');
  bookingsList.innerHTML = '<p>Loading bookings...</p>';
  const bookings = await fetchAllBookings();
  const users = await fetchAllUsers();

  const userMap = {};
  users.forEach(user => userMap[user.id] = user);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  let filteredBookings = bookings;
  if (loggedInUser && loggedInUser.role === 'client') {
    filteredBookings = bookings.filter(b => b.clientId === loggedInUser.id);
  }

  if (!filteredBookings.length) {
    bookingsList.innerHTML = '<p>No bookings found.</p>';
    return;
  }

  bookingsList.innerHTML = filteredBookings.map(booking => {
    const client = userMap[booking.clientId];
    const isHouseworker = loggedInUser.role === 'houseworker';
    const isClient = loggedInUser.role === 'client';

    let actionButtons = '';
    if (isHouseworker) {
      if (booking.status === 'Pending') {
        actionButtons = `<button class="accept-btn" data-id="${booking.id}">Accept</button>`;
      } else if (booking.status === 'Accepted') {
        actionButtons = `<button class="start-btn" data-id="${booking.id}">Start Job</button>`;
      }
    }
    if (isClient && booking.status === 'In Progress') {
      actionButtons = `
        <button class="finish-btn" data-id="${booking.id}">Mark Completed</button>
        <button class="cancel-btn" data-id="${booking.id}">Cancel</button>
      `;
    }

    return `
      <div class="booking-card">
        <strong>Service:</strong> ${booking.service}<br>
        <strong>Address:</strong> ${booking.address}<br>
        <strong>Date:</strong> ${new Date(booking.date).toLocaleString()}<br>
        <strong>Instructions:</strong> ${booking.instructions || 'None'}<br>
        <strong>Status:</strong> ${booking.status}<br>
        ${loggedInUser.role === 'houseworker' && client ? `
          <hr>
          <strong>Client Name:</strong> ${client.name}<br>
          <strong>Client Email:</strong> ${client.email}<br>
        ` : ''}
        ${actionButtons}
      </div>
      <hr>
    `;
  }).join('');
}

document.getElementById('bookingsList').addEventListener('click', async function(e) {
  const id = e.target.dataset.id; // leave as string!
  if (e.target.classList.contains('accept-btn')) {
    await updateBookingStatus(id, 'Accepted');
    renderBookingsDashboard();
  }
  if (e.target.classList.contains('start-btn')) {
    await updateBookingStatus(id, 'In Progress');
    renderBookingsDashboard();
  }
  if (e.target.classList.contains('finish-btn')) {
    await updateBookingStatus(id, 'Completed');
    renderBookingsDashboard();
  }
  if (e.target.classList.contains('cancel-btn')) {
    await updateBookingStatus(id, 'Cancelled');
    renderBookingsDashboard();
  }
});

async function updateBookingStatus(bookingId, newStatus) {
  try {
    const res = await fetch(`${API_URL}/posts/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    showMessage('Failed to update booking status. Please try again.');
    throw err;
  }
}

async function acceptBooking(bookingId) {
  await updateBookingStatus(bookingId, 'Accepted');
  renderBookingsDashboard();
}
async function startJob(bookingId) {
  await updateBookingStatus(bookingId, 'In Progress');
  renderBookingsDashboard();
}
async function finishBooking(bookingId) {
  await updateBookingStatus(bookingId, 'Completed');
  renderBookingsDashboard();
}
async function cancelBooking(bookingId) {
  await updateBookingStatus(bookingId, 'Cancelled');
  renderBookingsDashboard();
}

