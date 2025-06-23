// Login Page JavaScript

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    setupEventListeners();
});

// Initialize login page components
function initializeLoginPage() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        redirectToMain();
    }
    
    showNotification('Welcome to Water Distribution Optimization', 'success');
}

// Setup event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    console.log('Setting up event listeners...'); // Debug log
    console.log('Login form found:', !!loginForm); // Debug log
    console.log('Signup form found:', !!signupForm); // Debug log
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener added'); // Debug log
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('Signup form event listener added'); // Debug log
    }
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate inputs
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading
    showLoadingOverlay();
    
    // Simulate authentication (replace with real authentication)
    setTimeout(() => {
        hideLoadingOverlay();
        
        // For demo purposes, accept any email/password combination
        if (email && password) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('rememberMe', remember);
            
            showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect to main page
            setTimeout(() => {
                redirectToMain();
            }, 1000);
        } else {
            showNotification('Invalid credentials', 'error');
        }
    }, 2000);
}

// Backup click handler for signup button
function handleSignupClick(event) {
    event.preventDefault();
    console.log('Signup button clicked directly'); // Debug log
    handleSignup(event);
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    console.log('Signup form submitted'); // Debug log
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    console.log('Form data:', { firstName, lastName, email, password: '***', confirmPassword: '***', terms }); // Debug log
    
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    // Show loading
    showLoadingOverlay();
    
    // Simulate account creation
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Store user data (in real app, this would be sent to server)
        const userData = {
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to main page
        setTimeout(() => {
            redirectToMain();
        }, 1000);
    }, 2000);
}

// Handle social login
function handleSocialLogin(event) {
    event.preventDefault();
    
    const provider = event.currentTarget.classList.contains('google') ? 'Google' : 'Microsoft';
    
    showLoadingOverlay();
    
    // Simulate social login
    setTimeout(() => {
        hideLoadingOverlay();
        
        // For demo purposes, simulate successful social login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', `user@${provider.toLowerCase()}.com`);
        localStorage.setItem('loginProvider', provider);
        
        showNotification(`${provider} login successful! Redirecting...`, 'success');
        
        setTimeout(() => {
            redirectToMain();
        }, 1000);
    }, 1500);
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = passwordInput.parentNode.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

function toggleSignupPassword() {
    const passwordInput = document.getElementById('signupPassword');
    const toggleBtn = passwordInput.parentNode.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

function toggleConfirmPassword() {
    const passwordInput = document.getElementById('confirmPassword');
    const toggleBtn = passwordInput.parentNode.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Show signup form
function showSignup() {
    document.querySelector('.login-card').classList.add('hidden');
    document.getElementById('signupCard').classList.remove('hidden');
}

// Show login form
function showLogin() {
    document.getElementById('signupCard').classList.add('hidden');
    document.querySelector('.login-card').classList.remove('hidden');
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
}

// Redirect to main page
function redirectToMain() {
    window.location.href = 'index.html';
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationArea = document.getElementById('notificationArea');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-exclamation-triangle';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    
    notificationArea.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Handle forgot password
function handleForgotPassword() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showNotification('Please enter your email address first', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showLoadingOverlay();
    
    // Simulate password reset
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Password reset link sent to your email', 'success');
    }, 2000);
}

// Export functions for global access
window.togglePassword = togglePassword;
window.toggleSignupPassword = toggleSignupPassword;
window.toggleConfirmPassword = toggleConfirmPassword;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.handleForgotPassword = handleForgotPassword;
window.handleSignupClick = handleSignupClick; 