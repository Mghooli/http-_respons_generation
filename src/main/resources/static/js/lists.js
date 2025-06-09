// List management functionality
let currentToken = localStorage.getItem('token');
let editingListId = null;
let editingCodes = [];

// Load saved lists when the page loads
window.addEventListener('DOMContentLoaded', function() {
    if (currentToken) {
        loadSavedLists();
    }
});

function loadSavedLists() {
    fetch('/api/lists', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
    })
    .then(res => res.json())
    .then(lists => {
        const container = document.getElementById('lists-container');
        container.innerHTML = '';
        
        lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.className = 'list-card';
            const creationDate = new Date(list.createdAt).toLocaleDateString();
            
            listElement.innerHTML = `
                <div class="list-header">
                    <h3>${list.name}</h3>
                    <span class="creation-date">Created: ${creationDate}</span>
                </div>
                <div class="list-actions">
                    <button onclick="viewList('${list.id}')">View</button>
                    <button onclick="editList('${list.id}')">Edit</button>
                    <button onclick="deleteList('${list.id}')" class="delete-btn">Delete</button>
                </div>
            `;
            container.appendChild(listElement);
        });
    });
}

window.viewList = function(listId) {
    fetch(`/api/lists/${listId}`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
    })
    .then(res => res.json())
    .then(list => {
        document.getElementById('view-list-name').textContent = list.name;
        document.getElementById('view-list-date').textContent = 
            `Created: ${new Date(list.createdAt).toLocaleDateString()}`;
        
        const container = document.getElementById('view-codes-container');
        container.innerHTML = '';
        
        list.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'view-item';
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="HTTP ${item.code}">
                <span>${item.code}</span>
            `;
            container.appendChild(itemElement);
        });
        
        document.getElementById('edit-view-btn').onclick = () => {
            document.getElementById('view-modal').classList.add('hidden');
            editList(listId);
        };
        
        document.getElementById('view-modal').classList.remove('hidden');
    });
};

window.editList = function(listId) {
    fetch(`/api/lists/${listId}`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
    })
    .then(res => res.json())
    .then(list => {
        editingListId = list.id;
        editingCodes = list.items.map(item => item.code);
        document.getElementById('edit-list-name').value = list.name;
        renderEditCodes();
        document.getElementById('edit-modal').classList.remove('hidden');
    });
};

function renderEditCodes() {
    const container = document.getElementById('edit-codes-container');
    container.innerHTML = '';
    editingCodes.forEach(code => {
        const div = document.createElement('div');
        div.className = 'edit-item';
        div.innerHTML = `
            <img src="https://http.dog/${code}.jpg" alt="${code}" />
            <span>${code}</span>
            <button onclick="removeEditCode('${code}')" class="remove-btn">Remove</button>
        `;
        container.appendChild(div);
    });
}

window.removeEditCode = function(code) {
    editingCodes = editingCodes.filter(c => c !== code);
    renderEditCodes();
};

document.getElementById('add-code-btn').onclick = function() {
    const code = document.getElementById('add-code-input').value.trim();
    if (code && !editingCodes.includes(code)) {
        editingCodes.push(code);
        renderEditCodes();
    }
    document.getElementById('add-code-input').value = '';
};

document.getElementById('close-edit-btn').onclick = function() {
    document.getElementById('edit-modal').classList.add('hidden');
};

document.getElementById('close-view-btn').onclick = function() {
    document.getElementById('view-modal').classList.add('hidden');
};

document.getElementById('save-edit-btn').onclick = function() {
    const name = document.getElementById('edit-list-name').value.trim();
    if (!name || editingCodes.length === 0) {
        alert('List name and at least one code required!');
        return;
    }
    
    fetch(`/api/lists/${editingListId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            items: editingCodes.map(code => ({
                code,
                imageUrl: `https://http.dog/${code}.jpg`
            }))
        })
    }).then(res => {
        if (res.ok) {
            document.getElementById('edit-modal').classList.add('hidden');
            loadSavedLists();
        } else {
            alert('Error saving changes');
        }
    });
};

window.deleteList = function(listId) {
    if (confirm('Are you sure you want to delete this list?')) {
        fetch(`/api/lists/${listId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        }).then(res => {
            if (res.ok) {
                loadSavedLists();
            } else {
                alert('Error deleting list');
            }
        });
    }
}; 