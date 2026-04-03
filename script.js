// ===== SAFEMIND CLINIC - MAIN JAVASCRIPT =====
// This file handles all interactive features

// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. CONTACT FORM VALIDATION
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop normal form submission
            
            // Get the values user entered
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            let errors = [];
            
            // Check if name is valid (at least 2 characters)
            if (!name || name.length < 2) {
                errors.push('❌ Please enter a valid name (at least 2 characters)');
            }
            
            // Check if email is valid (must have @ and .)
            if (!email || !email.includes('@') || !email.includes('.')) {
                errors.push('❌ Please enter a valid email address');
            }
            
            // Check if message is long enough
            if (!message || message.length < 10) {
                errors.push('❌ Please enter a message (at least 10 characters)');
            }
            
            // If there are errors, show them
            if (errors.length > 0) {
                showMessage(errors.join('<br>'), 'error');
                return;
            }
            
            // If no errors, show success and submit
            showMessage('✅ Message sent successfully! We\'ll respond within 24 hours.', 'success');
            setTimeout(() => {
                contactForm.submit();
            }, 1500);
        });
    }
    
    // ============================================
    // 2. APPOINTMENT BOOKING SYSTEM
    // ============================================
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get all form values
            const name = document.getElementById('appt_name')?.value.trim();
            const email = document.getElementById('appt_email')?.value.trim();
            const phone = document.getElementById('appt_phone')?.value.trim();
            const date = document.getElementById('appt_date')?.value;
            const time = document.getElementById('appt_time')?.value;
            const therapist = document.getElementById('appt_therapist')?.value;
            const sessionType = document.getElementById('appt_type')?.value;
            
            let errors = [];
            
            // Validate each field
            if (!name || name.length < 2) errors.push('❌ Please enter your full name');
            if (!email || !email.includes('@')) errors.push('❌ Please enter a valid email');
            if (!phone || phone.length < 10) errors.push('❌ Please enter a valid phone number');
            if (!date) errors.push('❌ Please select a date');
            if (!time) errors.push('❌ Please select a time');
            if (!therapist) errors.push('❌ Please select a therapist');
            
            // Show errors if any
            if (errors.length > 0) {
                showMessage(errors.join('<br>'), 'error');
                return;
            }
            
            // Create a booking object
            const booking = {
                id: Date.now(), // Unique ID using timestamp
                name: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                therapist: therapist,
                sessionType: sessionType,
                status: 'pending',
                bookedOn: new Date().toLocaleString()
            };
            
            // Save to localStorage (browser storage)
            let bookings = JSON.parse(localStorage.getItem('safemind_bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('safemind_bookings', JSON.stringify(bookings));
            
            // Show success message
            showMessage('✅ Appointment booked successfully! Check your dashboard.', 'success');
            
            // Clear the form
            appointmentForm.reset();
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
    
    // ============================================
    // 3. LOGIN SYSTEM (Demo)
    // ============================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login_email')?.value.trim();
            const password = document.getElementById('login_password')?.value;
            
            // Demo login - any email/password works for testing
            if (email && password) {
                // Save user info to localStorage
                localStorage.setItem('safemind_user', JSON.stringify({
                    email: email,
                    name: email.split('@')[0], // Use part before @ as name
                    loggedIn: true,
                    loginTime: new Date().toLocaleString()
                }));
                
                showMessage('✅ Login successful! Redirecting to dashboard...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage('❌ Please enter both email and password', 'error');
            }
        });
    }
    
    // ============================================
    // 4. DASHBOARD - LOAD BOOKINGS
    // ============================================
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboard();
    }
    
    // ============================================
    // 5. LOGOUT FUNCTION
    // ============================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('safemind_user'); // Remove user data
            showMessage('You have been logged out', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // ============================================
    // 6. CHECK IF USER IS LOGGED IN (Protected Pages)
    // ============================================
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const user = JSON.parse(localStorage.getItem('safemind_user') || '{}');
        if (!user.loggedIn) {
            showMessage('Please login to access this page', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Function to show popup messages (success/error)
function showMessage(message, type) {
    // Check if message div already exists
    let messageDiv = document.getElementById('formMessage');
    
    // If not, create it
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'formMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 9999;
            max-width: 350px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(messageDiv);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set colors based on message type
    if (type === 'success') {
        messageDiv.style.background = '#c6f6d5';
        messageDiv.style.color = '#22543d';
        messageDiv.style.borderLeft = '4px solid #38a169';
    } else {
        messageDiv.style.background = '#fed7d7';
        messageDiv.style.color = '#742a2a';
        messageDiv.style.borderLeft = '4px solid #e53e3e';
    }
    
    // Set the message text
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.style.animation = '';
        }, 300);
    }, 5000);
}

// Function to load dashboard data
function loadDashboard() {
    // Get user data from storage
    const user = JSON.parse(localStorage.getItem('safemind_user') || '{}');
    const bookings = JSON.parse(localStorage.getItem('safemind_bookings') || '[]');
    
    // Update user name in dashboard
    const userNameSpan = document.getElementById('userName');
    if (userNameSpan && user.name) {
        userNameSpan.textContent = user.name;
    }
    
    // Filter bookings for current user (by email)
    const myBookings = bookings.filter(booking => booking.email === user.email);
    
    // Load bookings into table
    const bookingsTable = document.getElementById('bookingsTable');
    if (bookingsTable) {
        if (myBookings.length > 0) {
            let html = `
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr>
                            <th style="padding:12px; background:#fff5f8; text-align:left;">Date</th>
                            <th style="padding:12px; background:#fff5f8; text-align:left;">Time</th>
                            <th style="padding:12px; background:#fff5f8; text-align:left;">Therapist</th>
                            <th style="padding:12px; background:#fff5f8; text-align:left;">Type</th>
                            <th style="padding:12px; background:#fff5f8; text-align:left;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            myBookings.forEach(booking => {
                let statusColor = '';
                if (booking.status === 'pending') statusColor = '#ed8936';
                else if (booking.status === 'confirmed') statusColor = '#38a169';
                else statusColor = '#718096';
                
                html += `
                    <tr>
                        <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${booking.date}</td>
                        <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${booking.time}</td>
                        <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${booking.therapist}</td>
                        <td style="padding:12px; border-bottom:1px solid #e2e8f0;">${booking.sessionType || 'In-Person'}</td>
                        <td style="padding:12px; border-bottom:1px solid #e2e8f0;">
                            <span style="background:${statusColor}; color:white; padding:4px 10px; border-radius:20px; font-size:0.8rem;">
                                ${booking.status}
                            </span>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
                <p style="margin-top:1rem; text-align:center;">
                    <a href="appointment.html" class="cta-btn" style="margin-top:1rem;">+ Book Another Appointment</a>
                </p>
            `;
            bookingsTable.innerHTML = html;
        } else {
            bookingsTable.innerHTML = `
                <div style="text-align:center; padding:2rem; background:#f7fafc; border-radius:16px;">
                    <p style="font-size:1.2rem; margin-bottom:1rem;">📅 No appointments yet</p>
                    <p>Ready to start your wellness journey?</p>
                    <a href="appointment.html" class="cta-btn" style="margin-top:1rem; display:inline-block;">Book Your First Session</a>
                </div>
            `;
        }
    }
}