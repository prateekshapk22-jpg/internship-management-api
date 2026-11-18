
/* =========================================
   INTERNSHIP MANAGEMENT PORTAL
   Frontend JavaScript - Security Update
========================================= */

const API_URL = '/api/internships';

const form = document.getElementById('internshipForm');
const table = document.getElementById('internshipTable');
const searchInput = document.getElementById('searchInput');

let internships = [];
let editingId = null;
let toastTimer = null;

const fields = [
    'title',
    'company',
    'location',
    'duration',
    'stipend',
    'application_link',
    'eligibility',
    'description'
];


/* =========================================
   1. NOTIFICATION MESSAGE
========================================= */

function showToast(message) {
    const toast = document.getElementById('toast');

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


/* =========================================
   2. SQL INJECTION PATTERN CHECK
========================================= */

// This is an additional frontend filter.
// Real SQL injection protection MUST be implemented
// in the backend using parameterized SQL queries.

function containsSuspiciousSQL(value) {

    if (typeof value !== 'string') return false;

    const patterns = [
        /\bUNION\s+(ALL\s+)?SELECT\b/i,
        /\bSELECT\b[\s\S]*\bFROM\b/i,
        /\bINSERT\s+INTO\b/i,
        /\bUPDATE\s+\w+\s+SET\b/i,
        /\bDELETE\s+FROM\b/i,
        /\bDROP\s+(TABLE|DATABASE)\b/i,
        /\bALTER\s+TABLE\b/i,
        /\bCREATE\s+TABLE\b/i,
        /\bTRUNCATE\s+TABLE\b/i,
        /\bEXEC(?:UTE)?\s*\(/i,
        /(?:'|")\s*(?:OR|AND)\s+(?:'[^']*'|\d+)\s*=\s*(?:'[^']*'|\d+)/i,
        /--|\/\*|\*\//
    ];

    return patterns.some(pattern => pattern.test(value));
}


function checkInputSecurity(data) {

    for (const field of fields) {

        const value = data[field];

        if (value && containsSuspiciousSQL(String(value))) {

            showToast(
                `Invalid SQL-like input detected in ${field.replace('_', ' ')}.`
            );

            const input = form.elements[field];

            if (input) {
                input.focus();
            }

            return false;
        }
    }

    return true;
}


/* =========================================
   3. API REQUEST FUNCTION
========================================= */

async function apiRequest(url, options = {}) {

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error('Invalid response received from server');
    }

    if (!response.ok) {

        const validationMessage = Array.isArray(data.errors)
            ? data.errors.map(error =>
                `${error.field}: ${error.message}`
            ).join(', ')
            : '';

        throw new Error(
            validationMessage ||
            data.message ||
            'Something went wrong'
        );
    }

    return data;
}


/* =========================================
   4. CHECK API CONNECTION
========================================= */

async function checkConnection() {

    const status = document.getElementById('connectionStatus');
    const dot = document.querySelector('.status-dot');

    try {

        await apiRequest('/api/health');

        status.textContent = 'Connected';
        dot.style.background = '#16a34a';

    } catch (error) {

        status.textContent = 'Disconnected';
        dot.style.background = '#dc2626';

        console.error('API connection error:', error);
    }
}


/* =========================================
   5. FETCH INTERNSHIP RECORDS
========================================= */

async function loadInternships() {

    table.replaceChildren();

    const loadingRow = document.createElement('tr');
    const loadingCell = document.createElement('td');

    loadingCell.colSpan = 6;
    loadingCell.className = 'empty-state';
    loadingCell.textContent = 'Loading internships...';

    loadingRow.appendChild(loadingCell);
    table.appendChild(loadingRow);

    try {

        const data = await apiRequest(
            `${API_URL}?page=1&limit=100`
        );

        internships = data.internships || [];

        renderInternships();
        updateStatistics();

        document.getElementById('recordCount').textContent =
            `Showing ${internships.length} of ${data.totalRecords} records`;

    } catch (error) {

        console.error('Loading error:', error);

        table.replaceChildren();

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 6;
        cell.className = 'empty-state';
        cell.textContent = 'Unable to load internship records.';

        row.appendChild(cell);
        table.appendChild(row);

        showToast(error.message);
    }
}


/* =========================================
   6. UPDATE DASHBOARD STATISTICS
========================================= */

function updateStatistics() {

    const companies = new Set(
        internships.map(item =>
            (item.company || '').trim().toLowerCase()
        )
    );

    const locations = new Set(
        internships
            .map(item =>
                (item.location || '').trim().toLowerCase()
            )
            .filter(Boolean)
    );

    document.getElementById('totalCount').textContent =
        internships.length;

    document.getElementById('companyCount').textContent =
        companies.size;

    document.getElementById('locationCount').textContent =
        locations.size;
}


/* =========================================
   7. CREATE SAFE TABLE CELLS
========================================= */

function createCell(value, className = '') {

    const cell = document.createElement('td');
    const content = document.createElement('span');

    content.textContent =
        value === null || value === undefined || value === ''
            ? '—'
            : String(value);

    if (className) {
        content.className = className;
    }

    cell.appendChild(content);

    return cell;
}


/* =========================================
   8. DISPLAY INTERNSHIP RECORDS
========================================= */

function renderInternships() {

    const search = searchInput.value.trim().toLowerCase();

    const filtered = internships.filter(item => {

        return [
            item.title,
            item.company,
            item.location,
            item.duration,
            item.stipend
        ].some(value =>
            String(value || '').toLowerCase().includes(search)
        );

    });

    table.replaceChildren();

    if (filtered.length === 0) {

        const row = document.createElement('tr');
        const cell = document.createElement('td');

        cell.colSpan = 6;
        cell.className = 'empty-state';

        cell.textContent = search
            ? 'No matching internships found.'
            : 'No internships available. Add your first internship!';

        row.appendChild(cell);
        table.appendChild(row);
    }

    filtered.forEach(item => {

        const row = document.createElement('tr');

        row.appendChild(createCell(item.title));
        row.appendChild(createCell(item.company, 'company-name'));
        row.appendChild(createCell(item.location));
        row.appendChild(createCell(item.duration));
        row.appendChild(createCell(item.stipend));

        const actionCell = document.createElement('td');
        const actionGroup = document.createElement('div');

        actionGroup.className = 'action-group';

        const editButton = document.createElement('button');

        editButton.className = 'action-btn edit-btn';
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', () => {
            editInternship(item.id);
        });

        const deleteButton = document.createElement('button');

        deleteButton.className = 'action-btn delete-btn';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', () => {
            deleteInternship(item.id);
        });

        actionGroup.append(editButton, deleteButton);
        actionCell.appendChild(actionGroup);

        row.appendChild(actionCell);
        table.appendChild(row);

    });

    document.getElementById('recordCount').textContent =
        `Showing ${filtered.length} of ${internships.length} loaded records`;
}


/* =========================================
   9. ADD / UPDATE INTERNSHIP
========================================= */

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const isEditing = editingId !== null;

    const internshipData = {};

    fields.forEach(field => {

        const value = form.elements[field].value.trim();

        internshipData[field] = value || null;

    });

    // Additional SQL-like input check

    if (!checkInputSecurity(internshipData)) {
        return;
    }

    const submitButton = document.getElementById('submitBtn');

    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';

    try {

        if (isEditing) {

            await apiRequest(`${API_URL}/${editingId}`, {
                method: 'PUT',
                body: JSON.stringify(internshipData)
            });

            showToast('Internship updated successfully!');

        } else {

            await apiRequest(API_URL, {
                method: 'POST',
                body: JSON.stringify(internshipData)
            });

            showToast('Internship added successfully!');

        }

        resetForm();

        await loadInternships();

    } catch (error) {

        console.error('Save error:', error);

        showToast(error.message);

    } finally {

        submitButton.disabled = false;

        submitButton.textContent = isEditing
            ? 'Save Changes'
            : '+ Add Internship';

    }

});


/* =========================================
   10. EDIT INTERNSHIP
========================================= */

function editInternship(id) {

    const item = internships.find(
        internship => internship.id === id
    );

    if (!item) {

        showToast('Internship not found');

        return;
    }

    editingId = id;

    fields.forEach(field => {

        form.elements[field].value = item[field] || '';

    });

    document.getElementById('formTitle').textContent =
        'Update Internship';

    document.getElementById('formBadge').textContent =
        'EDITING';

    document.getElementById('submitBtn').textContent =
        'Save Changes';

    document.getElementById('cancelBtn').hidden = false;

    document.getElementById('internship-form').scrollIntoView({
        behavior: 'smooth'
    });

}


/* =========================================
   11. DELETE INTERNSHIP
========================================= */

async function deleteInternship(id) {

    const item = internships.find(
        internship => internship.id === id
    );

    if (!item) return;

    const confirmed = confirm(
        `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    try {

        await apiRequest(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        showToast('Internship deleted successfully!');

        await loadInternships();

    } catch (error) {

        console.error('Delete error:', error);

        showToast(error.message);

    }

}


/* =========================================
   12. RESET FORM
========================================= */

function resetForm() {

    form.reset();

    editingId = null;

    document.getElementById('formTitle').textContent =
        'Add New Internship';

    document.getElementById('formBadge').textContent =
        'NEW ENTRY';

    document.getElementById('submitBtn').textContent =
        '+ Add Internship';

    document.getElementById('cancelBtn').hidden = true;

}


/* =========================================
   13. CANCEL EDITING
========================================= */

document.getElementById('cancelBtn').addEventListener(
    'click',
    resetForm
);


/* =========================================
   14. SEARCH INTERNSHIPS
========================================= */

searchInput.addEventListener('input', () => {

    renderInternships();

});


/* =========================================
   15. REFRESH DASHBOARD
========================================= */

document.getElementById('refreshBtn').addEventListener(
    'click',
    async () => {

        await checkConnection();

        await loadInternships();

        showToast('Dashboard refreshed successfully!');

    }
);


/* =========================================
   16. INITIALIZE APPLICATION
========================================= */

async function initializeApp() {

    console.log('Internship Management Portal initialized');

    await checkConnection();

    await loadInternships();

}

initializeApp();
