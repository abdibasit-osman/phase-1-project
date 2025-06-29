<!-- README.md for Housekeeping on Demand -->

<h1>Housekeeping on Demand</h1>
<p><strong>Author:</strong> Abdibasit Osman</p>

## https://abdibasit-osman.github.io/phase-1-project/

<hr />

<h2>Description</h2>
<p>
  <b>Housekeeping on Demand</b> is a single-page web application that connects clients with reliable houseworkers for cleaning, laundry, and cooking tasks. Users can register, submit or accept bookings, and track jobs in real time.
</p>

<h2>Problem Statement</h2>
<p>
  Many people find it challenging to quickly request reliable houseworkers for tasks such as cleaning, cooking, or laundry.
</p>

<h2>Solution Statement</h2>
<p>
  This application provides a simple way for clients to request housekeeping services and for houseworkers to find and accept jobs. All requests and status updates happen in real time, with a dashboard for both sides.
</p>

<h2>Project Features</h2>
<ol>
  <li>
    <b>User Registration and Login</b><br/>
    <ul>
      <li>Clients and houseworkers create accounts using their name, email, and password.</li>
      <li>Clients can submit service requests.</li>
      <li>Houseworkers can view and accept available jobs.</li>
    </ul>
  </li>
  <li>
    <b>Booking Request Form</b><br/>
    <ul>
      <li>Clients fill out a form including name, address, service type (cleaning, laundry, cooking, etc.), preferred date/time.</li>
      <li>On submission, requests appear in the houseworker dashboard as "New Requests".</li>
    </ul>
  </li>
  <li>
    <b>Houseworker Dashboard (View and Accept Requests)</b><br/>
    <ul>
      <li>Houseworkers see all new booking requests with client details and can accept them with one click.</li>
      <li>Accepted requests are assigned and their status updates to "Accepted".</li>
    </ul>
  </li>
  <li>
    <b>Booking Status Updates (Real-time Tracking)</b><br/>
    <ul>
      <li>Every booking has a status: Pending, Accepted, In Progress, Completed, or Cancelled.</li>
      <li>Status changes are reflected instantly for both clients and houseworkers.</li>
      <li>Clients see when a job is accepted and can mark it as "Completed" when finished.</li>
    </ul>
  </li>
</ol>

<h1>User story</h1>

<ul>
  <li>Users register or log in as either a client or a houseworker.</li>
  <li>Clients see a booking form to request housekeeping services and track their bookings' statuses.</li>
  <li>Houseworkers see a dashboard with new booking requests, can accept jobs, and update the status (e.g., Accepted, In Progress, Completed).</li>
  <li>Status updates are visible in real time to both clients and houseworkers.</li>
  <li>Users can log out to return to the login screen at any time.</li>
</ul>

<h2>Setup Instructions</h2>
<ol>
  <li>Clone the repository:<br />
    <code>git clone https://github.com/abdibasit-osman/phase-1-project.git</code>
  </li>
  <li>Open <code>index.html</code> in your browser.</li>
  <li>
    <b>Live page:</b>
    <a href="https://abdibasit-osman.github.io/phase-1-project.git/">https://abdibasit-osman.github.io/phase-1-project.git/</a>
  </li>
</ol>

<h2>API Usage</h2>
<p>
  This project uses an API for data storage ( JSON-server ). All communication is asynchronous and uses JSON.
</p>

<h2>License</h2>
<p>MIT License<br/>
&copy; 2025 Abdibasit Osman</p>

