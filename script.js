// Library Management System - JavaScript

// Theme Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save theme preference
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}

// Data Storage
let books = [];
let members = [];
let loans = [];
let recentActivity = [];

let bookIdCounter = 1;
let memberIdCounter = 1;
let loanIdCounter = 1;

// Initialize with seed data
function initializeData() {
    // Seed books
    addBook('The Alchemist', 'Paulo Coelho', 'Fiction', true);
    addBook('Clean Code', 'Robert C. Martin', 'Programming', true);
    addBook('Introduction to Algorithms', 'Cormen', 'Education', true);

    // Seed members
    addMember('Rahul', 'rahul@example.com', '9876543210', true);
    addMember('Priya', 'priya@example.com', '9123456780', true);

    updateDashboard();
    renderBooks();
    renderMembers();
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;

            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Tab Navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            const parent = btn.closest('.section');

            // Update active tab button
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active tab content
            parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');

    // Populate dropdowns if needed
    if (modalId === 'issue-book-modal') {
        populateBookDropdown();
        populateMemberDropdown();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');

    // Reset form
    const form = modal.querySelector('form');
    if (form) form.reset();
}

function setupModals() {
    // Open modal buttons
    document.getElementById('add-book-btn').addEventListener('click', () => openModal('add-book-modal'));
    document.getElementById('add-member-btn').addEventListener('click', () => openModal('add-member-modal'));
    document.getElementById('issue-book-btn').addEventListener('click', () => openModal('issue-book-modal'));

    // Close modal buttons
    document.querySelectorAll('.close-btn, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.dataset.modal;
            if (modalId) closeModal(modalId);
        });
    });

    // Close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Book Functions
function addBook(title, author, category, isSeed = false) {
    const book = {
        id: bookIdCounter++,
        title,
        author,
        category,
        available: true
    };

    books.push(book);

    if (!isSeed) {
        addActivity(`Added new book: "${title}" by ${author}`);
        showToast('Book added successfully!', 'success');
        updateDashboard();
        renderBooks();
    }

    return book;
}

function renderBooks(filteredBooks = null) {
    const booksList = document.getElementById('books-list');
    const booksToRender = filteredBooks || books;

    if (booksToRender.length === 0) {
        booksList.innerHTML = '<p class="empty-state">No books found</p>';
        return;
    }

    booksList.innerHTML = booksToRender.map(book => `
        <div class="book-card">
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ID:</strong> ${book.id}</p>
            <div>
                <span class="badge category">${book.category}</span>
                <span class="badge ${book.available ? 'available' : 'issued'}">
                    ${book.available ? 'Available' : 'Issued'}
                </span>
            </div>
        </div>
    `).join('');
}

function searchBooks(keyword) {
    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase()) ||
        book.author.toLowerCase().includes(keyword.toLowerCase())
    );
    renderBooks(filtered);
}

// Member Functions
function addMember(name, email, phone, isSeed = false) {
    const member = {
        id: memberIdCounter++,
        name,
        email,
        phone
    };

    members.push(member);

    if (!isSeed) {
        addActivity(`Added new member: ${name}`);
        showToast('Member added successfully!', 'success');
        updateDashboard();
        renderMembers();
    }

    return member;
}

function renderMembers(filteredMembers = null) {
    const membersList = document.getElementById('members-list');
    const membersToRender = filteredMembers || members;

    if (membersToRender.length === 0) {
        membersList.innerHTML = '<p class="empty-state">No members found</p>';
        return;
    }

    membersList.innerHTML = membersToRender.map(member => `
        <div class="member-card">
            <h4>${member.name}</h4>
            <p><strong>ID:</strong> ${member.id}</p>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
        </div>
    `).join('');
}

function searchMembers(keyword) {
    const filtered = members.filter(member =>
        member.name.toLowerCase().includes(keyword.toLowerCase()) ||
        member.email.toLowerCase().includes(keyword.toLowerCase())
    );
    renderMembers(filtered);
}

// Loan Functions
function issueBook(bookId, memberId) {
    const book = books.find(b => b.id === parseInt(bookId));
    const member = members.find(m => m.id === parseInt(memberId));

    if (!book) {
        showToast('Book not found!', 'error');
        return;
    }

    if (!member) {
        showToast('Member not found!', 'error');
        return;
    }

    if (!book.available) {
        showToast('Book is already issued!', 'error');
        return;
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

    const loan = {
        id: loanIdCounter++,
        bookId: book.id,
        bookTitle: book.title,
        memberId: member.id,
        memberName: member.name,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returned: false
    };

    loans.push(loan);
    book.available = false;

    addActivity(`Issued "${book.title}" to ${member.name}`);
    showToast('Book issued successfully!', 'success');
    updateDashboard();
    renderBooks();
    renderLoans();
}

function returnBook(loanId) {
    const loan = loans.find(l => l.id === loanId);

    if (!loan) {
        showToast('Loan not found!', 'error');
        return;
    }

    if (loan.returned) {
        showToast('This book is already returned!', 'error');
        return;
    }

    loan.returned = true;
    const book = books.find(b => b.id === loan.bookId);
    if (book) {
        book.available = true;
    }

    addActivity(`Returned "${loan.bookTitle}" from ${loan.memberName}`);
    showToast('Book returned successfully!', 'success');
    updateDashboard();
    renderBooks();
    renderLoans();
}

function renderLoans() {
    renderActiveLoans();
    renderAllLoans();
}

function renderActiveLoans() {
    const activeLoansContainer = document.getElementById('active-loans-list');
    const activeLoans = loans.filter(loan => !loan.returned);

    if (activeLoans.length === 0) {
        activeLoansContainer.innerHTML = '<p class="empty-state">No active loans</p>';
        return;
    }

    activeLoansContainer.innerHTML = activeLoans.map(loan => `
        <div class="loan-card">
            <div class="loan-info">
                <h4>${loan.bookTitle}</h4>
                <p><strong>Member:</strong> ${loan.memberName} (ID: ${loan.memberId})</p>
                <p><strong>Loan ID:</strong> ${loan.id}</p>
                <div class="loan-dates">
                    <span><strong>Issue Date:</strong> ${loan.issueDate}</span>
                    <span><strong>Due Date:</strong> ${loan.dueDate}</span>
                </div>
            </div>
            <div class="loan-actions">
                <button class="btn btn-success" onclick="returnBook(${loan.id})">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Return
                </button>
            </div>
        </div>
    `).join('');
}

function renderAllLoans() {
    const allLoansContainer = document.getElementById('all-loans-list');

    if (loans.length === 0) {
        allLoansContainer.innerHTML = '<p class="empty-state">No loan records</p>';
        return;
    }

    allLoansContainer.innerHTML = loans.map(loan => `
        <div class="loan-card">
            <div class="loan-info">
                <h4>${loan.bookTitle}</h4>
                <p><strong>Member:</strong> ${loan.memberName} (ID: ${loan.memberId})</p>
                <p><strong>Loan ID:</strong> ${loan.id}</p>
                <div class="loan-dates">
                    <span><strong>Issue Date:</strong> ${loan.issueDate}</span>
                    <span><strong>Due Date:</strong> ${loan.dueDate}</span>
                    <span><strong>Status:</strong> ${loan.returned ? 'Returned' : 'Active'}</span>
                </div>
            </div>
            ${!loan.returned ? `
                <div class="loan-actions">
                    <button class="btn btn-success" onclick="returnBook(${loan.id})">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Return
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function populateBookDropdown() {
    const select = document.getElementById('issue-book-id');
    const availableBooks = books.filter(book => book.available);

    select.innerHTML = '<option value="">Choose a book...</option>' +
        availableBooks.map(book =>
            `<option value="${book.id}">${book.title} by ${book.author} (ID: ${book.id})</option>`
        ).join('');
}

function populateMemberDropdown() {
    const select = document.getElementById('issue-member-id');

    select.innerHTML = '<option value="">Choose a member...</option>' +
        members.map(member =>
            `<option value="${member.id}">${member.name} (ID: ${member.id})</option>`
        ).join('');
}

// Dashboard Functions
function updateDashboard() {
    document.getElementById('total-books').textContent = books.length;
    document.getElementById('total-members').textContent = members.length;
    document.getElementById('active-loans').textContent = loans.filter(l => !l.returned).length;
    document.getElementById('available-books').textContent = books.filter(b => b.available).length;

    renderRecentActivity();
}

function addActivity(message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    recentActivity.unshift({
        message,
        time: timeString
    });

    // Keep only last 5 activities
    if (recentActivity.length > 5) {
        recentActivity = recentActivity.slice(0, 5);
    }

    renderRecentActivity();
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity-list');

    if (recentActivity.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }

    container.innerHTML = recentActivity.map(activity => `
        <div class="activity-item">
            <div>${activity.message}</div>
            <div class="time">${activity.time}</div>
        </div>
    `).join('');
}

// Form Handlers
function setupForms() {
    // Add Book Form
    document.getElementById('add-book-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const category = document.getElementById('book-category').value;

        addBook(title, author, category);
        closeModal('add-book-modal');
    });

    // Add Member Form
    document.getElementById('add-member-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('member-name').value;
        const email = document.getElementById('member-email').value;
        const phone = document.getElementById('member-phone').value;

        addMember(name, email, phone);
        closeModal('add-member-modal');
    });

    // Issue Book Form
    document.getElementById('issue-book-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const bookId = document.getElementById('issue-book-id').value;
        const memberId = document.getElementById('issue-member-id').value;

        if (!bookId || !memberId) {
            showToast('Please select both book and member!', 'error');
            return;
        }

        issueBook(bookId, memberId);
        closeModal('issue-book-modal');
    });
}

// Search Handlers
function setupSearch() {
    document.getElementById('search-books').addEventListener('input', (e) => {
        searchBooks(e.target.value);
    });

    document.getElementById('search-members').addEventListener('input', (e) => {
        searchMembers(e.target.value);
    });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupNavigation();
    setupTabs();
    setupModals();
    setupForms();
    setupSearch();
    initializeData();

    console.log('Library Management System initialized successfully!');
});
