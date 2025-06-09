// Search functionality
document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('save-list-btn').addEventListener('click', handleSaveList);

async function handleSearch() {
    const input = document.getElementById('status-code-input').value.trim();
    if (!input) return;

    try {
        const response = await fetch(`/api/search?code=${encodeURIComponent(input)}`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        if (response.ok) {
            const results = await response.json();
            displayResults(results);
            document.getElementById('save-list-section').classList.remove('hidden');
        } else {
            alert('Error searching for status codes.');
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('An error occurred during search.');
    }
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'status-card';
        card.innerHTML = `
            <h3>Status Code: ${result.code}</h3>
            <img src="${result.imageUrl}" alt="HTTP ${result.code}">
            <p>${result.description}</p>
        `;
        container.appendChild(card);
    });
}

async function handleSaveList() {
    const listName = document.getElementById('list-name').value.trim();
    if (!listName) {
        alert('Please enter a list name');
        return;
    }

    const results = Array.from(document.querySelectorAll('.status-card')).map(card => ({
        code: card.querySelector('h3').textContent.split(': ')[1],
        imageUrl: card.querySelector('img').src
    }));

    try {
        const response = await fetch('/api/lists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: listName,
                items: results
            })
        });

        if (response.ok) {
            alert('List saved successfully!');
            document.getElementById('list-name').value = '';
            document.getElementById('save-list-section').classList.add('hidden');
            loadSavedLists();
        } else {
            alert('Error saving list.');
        }
    } catch (error) {
        console.error('Save list error:', error);
        alert('An error occurred while saving the list.');
    }
}

// Pattern matching function for status codes
function matchesPattern(code, pattern) {
    if (pattern.includes('x')) {
        const regexPattern = pattern.replace(/x/g, '\\d');
        return new RegExp(`^${regexPattern}$`).test(code);
    }
    return code === pattern;
} 