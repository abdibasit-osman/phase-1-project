
// Utility: Show login/register only
function showLoginSection() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
}

// On page load, always show the login/register section
window.addEventListener('DOMContentLoaded', () => {
  showLoginSection();
});

// Show/Hide sections based on user role
function showBookingSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'block';
  document.getElementById('dashboard-section').style.display = 'none';
}

function showDashboardSection() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('booking-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
}