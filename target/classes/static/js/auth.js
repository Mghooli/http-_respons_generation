// Authentication functionality
let currentToken = localStorage.getItem('token');

// Show/hide auth buttons and forms
document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('auth-forms').classList.remove('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
});

document.getElementById('signup-btn').addEventListener('click', () => {
    document.getElementById('auth-forms').classList.remove('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
});

// Handle login form submission
document.getElementById('login-form-element').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentToken = data.token;
            localStorage.setItem('token', currentToken);
            handleSuccessfulAuth();
        } else {
            alert(data.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
});

// Handle signup form submission
document.getElementById('signup-form-element').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // After successful signup, automatically log in
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                currentToken = loginData.token;
                localStorage.setItem('token', currentToken);
                handleSuccessfulAuth();
            }
        } else {
            alert(data.error || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup.');
    }
});

// Handle successful authentication
function handleSuccessfulAuth() {
    // Hide auth forms and buttons
    document.getElementById('auth-forms').classList.add('hidden');
    document.getElementById('auth-buttons').classList.add('hidden');
    
    // Show main content
    document.getElementById('search-section').classList.remove('hidden');
    document.getElementById('saved-lists').classList.remove('hidden');
    
    // Show logout button
    document.getElementById('logout-btn').style.display = 'block';
    
    // Load saved lists
    if (typeof loadSavedLists === 'function') {
        loadSavedLists();
    }
}

// Add logout button to nav
const navContainer = document.querySelector('.nav-container');
const logoutBtn = document.createElement('button');
logoutBtn.id = 'logout-btn';
logoutBtn.textContent = 'Logout';
logoutBtn.style.display = 'none';
logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    currentToken = null;
    
    // Show auth buttons
    document.getElementById('auth-buttons').classList.remove('hidden');
    
    // Hide main content
    document.getElementById('search-section').classList.add('hidden');
    document.getElementById('saved-lists').classList.add('hidden');
    
    // Hide logout button
    logoutBtn.style.display = 'none';
    
    // Clear any existing data
    document.getElementById('results-container').innerHTML = '';
    document.getElementById('lists-container').innerHTML = '';
};
navContainer.appendChild(logoutBtn);

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (currentToken) {
        handleSuccessfulAuth();
    }
}); 