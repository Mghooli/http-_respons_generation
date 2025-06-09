// Global state
let currentUser = null;
let currentToken = null;

// DOM Elements
const authButtons = document.getElementById('auth-buttons');
const authForms = document.getElementById('auth-forms');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const searchSection = document.getElementById('search-section');
const savedLists = document.getElementById('saved-lists');

// Event Listeners
document.getElementById('login-btn').addEventListener('click', () => {
    authForms.classList.remove('hidden');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

document.getElementById('signup-btn').addEventListener('click', () => {
    authForms.classList.remove('hidden');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

document.getElementById('login-form-element').addEventListener('submit', handleLogin);
document.getElementById('signup-form-element').addEventListener('submit', handleSignup);

// API Functions
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            currentToken = data.token;
            currentUser = data.user;
            showAuthenticatedUI();
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

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

        if (response.ok) {
            alert('Signup successful! Please login.');
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            alert('Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup.');
    }
}

function showAuthenticatedUI() {
    authForms.classList.add('hidden');
    authButtons.classList.add('hidden');
    searchSection.classList.remove('hidden');
    savedLists.classList.remove('hidden');
    loadSavedLists();
}

async function loadSavedLists() {
    try {
        const response = await fetch('/api/lists', {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        if (response.ok) {
            const lists = await response.json();
            displaySavedLists(lists);
        }
    } catch (error) {
        console.error('Error loading saved lists:', error);
    }
}

function displaySavedLists(lists) {
    const container = document.getElementById('lists-container');
    container.innerHTML = '';

    lists.forEach(list => {
        const listCard = document.createElement('div');
        listCard.className = 'list-card';
        listCard.innerHTML = `
            <h3>${list.name}</h3>
            <p>Created: ${new Date(list.createdAt).toLocaleDateString()}</p>
            <div class="list-actions">
                <button onclick="viewList(${list.id})">View</button>
                <button onclick="editList(${list.id})">Edit</button>
                <button onclick="deleteList(${list.id})">Delete</button>
            </div>
        `;
        container.appendChild(listCard);
    });
}

// Initialize the application
function init() {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        currentToken = token;
        showAuthenticatedUI();
    }
}

init(); 