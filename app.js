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

   renderBookingsDashboard();
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

async function createBooking(booking) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  return await res.json();
}

// Booking form submit event
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    alert("You are not logged in. Please log in again.");
    showLoginSection();
    return;
  }

  const service = document.getElementById('service').value;
  const address = document.getElementById('address').value;
  const date = document.getElementById('date').value;
  const instructions = document.getElementById('instructions').value;

  const booking = {
    clientId: loggedInUser.id,
    service,
    address,
    date,
    instructions,
    status: 'Pending'
  };

  await createBooking(booking);

  e.target.reset();
  
  showThankYouSection();
});

// Handle 'Make Another Booking' button
document.getElementById('makeAnotherBookingBtn').addEventListener('click', function() {
  showBookingSection();
});


// Fetch all bookings from the server
async function fetchAllBookings() {
  const res = await fetch(`${API_URL}/posts`);
  return await res.json();
}

// Fetch all users from the server
async function fetchAllUsers() {
  const res = await fetch(`${API_URL}/users`);
  return await res.json();
}

// Render bookings in the dashboard, including client name/email for houseworkers
async function renderBookingsDashboard() {
  const bookingsList = document.getElementById('bookingsList');
  bookingsList.innerHTML = '<p>Loading bookings...</p>';
  const bookings = await fetchAllBookings();
  const users = await fetchAllUsers();

  // Create a lookup: userId -> user object
  const userMap = {};
  users.forEach(user => {
    userMap[user.id] = user;
  });

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Filter bookings for client, or show all for houseworker
  let filteredBookings = bookings;
  if (loggedInUser && loggedInUser.role === 'client') {
    filteredBookings = bookings.filter(b => b.clientId === loggedInUser.id);
  }

  if (!filteredBookings.length) {
    bookingsList.innerHTML = '<p>No bookings found.</p>';
    return;
  }

  // Render each booking
  bookingsList.innerHTML = filteredBookings.map(booking => {
    const client = userMap[booking.clientId];
    const isHouseworker = loggedInUser.role === 'houseworker';
    const isClient = loggedInUser.role === 'client';

      let actionButtons = '';

      if (isHouseworker) {
        if (booking.status === 'Pending') {
          actionButtons = `<button onclick="acceptBooking(${booking.id})">Accept</button>`;
        } else if (booking.status === 'Accepted') {
          actionButtons = `<button onclick="startJob(${booking.id})">Start Job</button>`;
        }
      }

      if (isClient && booking.status === 'In Progress') {
        actionButtons = `
          <button onclick="finishBooking(${booking.id})">Mark Completed</button>
          <button onclick="cancelBooking(${booking.id})">Cancel</button>
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


async function updateBookingStatus(bookingId, newStatus) {
  const res = await fetch(`${API_URL}/posts/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  return await res.json();
}

window.acceptBooking = async function(bookingId) {
  await updateBookingStatus(bookingId, 'Accepted');
  renderBookingsDashboard();
};

window.startJob = async function(bookingId) {
  await updateBookingStatus(bookingId, 'In Progress');
  renderBookingsDashboard();
};

window.finishBooking = async function(bookingId) {
  await updateBookingStatus(bookingId, 'Completed');
  renderBookingsDashboard();
};

window.cancelBooking = async function(bookingId) {
  await updateBookingStatus(bookingId, 'Cancelled');
  renderBookingsDashboard();
};