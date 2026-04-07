/**
 * NextGEN Library - Main Application Logic
 */

// ============================================================================
// Mock Database
// ============================================================================

const mockData = {
    statistics: {
        totalBooks: 12450,
        activeMembers: 3204,
        borrowedBooks: 1842,
        overdueBooks: 45
    },

    recentTransactions: [
        { id: 'TRX-8921', bookId: 'B-104', title: 'The Design of Everyday Things', member: 'Alex Johnson', date: '2026-02-28', status: 'borrowed' },
        { id: 'TRX-8920', bookId: 'B-302', title: 'Clean Architecture', member: 'Sarah Smith', date: '2026-02-28', status: 'returned' },
        { id: 'TRX-8919', bookId: 'B-045', title: 'Dune', member: 'Michael Chen', date: '2026-02-27', status: 'overdue' },
        { id: 'TRX-8918', bookId: 'B-882', title: 'Atomic Habits', member: 'Emma Wilson', date: '2026-02-27', status: 'borrowed' },
        { id: 'TRX-8917', bookId: 'B-210', title: 'Sapiens', member: 'David Lee', date: '2026-02-26', status: 'returned' }
    ],

    aiRecommendations: [
        { id: 'B-901', title: 'Neuromancer', author: 'William Gibson', match: 98, cover: 'https://images.unsplash.com/photo-1614729939124-032f0b5689ce?w=300&q=80', tags: ['Sci-Fi', 'Cyberpunk'] },
        { id: 'B-902', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', match: 92, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80', tags: ['Psychology', 'Science'] },
        { id: 'B-903', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', match: 89, cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80', tags: ['Technology', 'Programming'] }
    ]
};

// ============================================================================
// Theme Management
// ============================================================================

const themeManager = {
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) return;

        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let currentTheme = 'light';
        if (savedTheme) {
            currentTheme = savedTheme;
        } else if (systemPrefersDark) {
            currentTheme = 'dark';
        }

        this.applyTheme(currentTheme);

        this.themeToggle.addEventListener('click', () => {
            currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            this.applyTheme(currentTheme);
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update toggle icon/text if needed
        const icon = this.themeToggle.querySelector('i');
        const text = this.themeToggle.querySelector('span');

        if (theme === 'dark') {
            if (icon) { icon.classList.remove('ph-moon'); icon.classList.add('ph-sun'); }
            if (text) text.textContent = 'Light Mode';
        } else {
            if (icon) { icon.classList.remove('ph-sun'); icon.classList.add('ph-moon'); }
            if (text) text.textContent = 'Dark Mode';
        }
    }
};

// Adding catalog data to mockData
mockData.catalog = [
    { id: 'C-001', title: 'The Design of Everyday Things', author: 'Don Norman', category: 'design', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80', description: 'A primer on how and why some products satisfy customers while others only frustrate them.', status: 'Available' },
    { id: 'C-002', title: 'Dune', author: 'Frank Herbert', category: 'sci-fi', cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&q=80', description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.', status: 'Borrowed' },
    { id: 'C-003', title: 'Clean Code', author: 'Robert C. Martin', category: 'technology', cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80', description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.', status: 'Available' },
    { id: 'C-004', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'science', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80', description: 'A brief history of humankind.', status: 'Available' },
    { id: 'C-005', title: 'Neuromancer', author: 'William Gibson', category: 'sci-fi', cover: 'https://images.unsplash.com/photo-1614729939124-032f0b5689ce?w=300&q=80', description: 'The Matrix is a world within the world, a global consensus-hallucination.', status: 'Available' },
    { id: 'C-006', title: 'Refactoring UI', author: 'Adam Wathan & Steve Schoger', category: 'design', cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&q=80', description: 'Learn how to design beautiful user interfaces by yourself using specific tactics explained from a developer\'s point-of-view.', status: 'Available' }
];

// ============================================================================
// Auth Guard
// ============================================================================
function checkAuth() {
    const token = localStorage.getItem('token');

    // Check if the current URL points to a protected path
    // Default to true if pathname is '/' or empty to protect root directory accesses
    const isProtectedPage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('catalog.html') ||
        window.location.pathname === '/' ||
        window.location.pathname === '';

    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!token && isProtectedPage) {
        // Not logged in and trying to access protected page
        // Redirect to login
        window.location.replace('login.html');
        return false;
    } else if (token && isLoginPage) {
        // Logged in but trying to access login page
        window.location.replace('index.html');
        return false;
    }

    // Update UI with user info if logged in and not on login page
    if (token && isProtectedPage) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // Try to find the avatar or username element to update
                const avatarImg = document.querySelector('.avatar img');
                if (avatarImg) {
                    // Make sure encodeURIComponent handles the space encoding properly
                    // e.g., "Test User" -> "Test+User" for use with ui-avatars.com
                    const nameParts = user.name.split(' ').join('+');
                    avatarImg.src = `https://ui-avatars.com/api/?name=${nameParts}&background=6366f1&color=fff`;
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }

    return true; // OK to proceed
}

// Add logout capability
function setupLogout() {
    // Add logout option to user profile
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        // Ensure it has a pointer style
        avatar.style.cursor = "pointer";
        avatar.title = "Click to log out";

        // Use capture phase for the click event to ensure it triggers before anything else.
        avatar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // prevent other click handlers
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.replace('login.html');
            }
        }, true);
    }
}

// ============================================================================
// DOM Content Loaded Handler
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first!
    if (!checkAuth()) return; // Stop initialization if redirecting

    themeManager.init();
    
    // Fetch real backend data for catalog if server is running
    try {
        const res = await fetch('http://localhost:5000/api/catalog');
        if (res.ok) {
            const rawBooks = await res.json();
            mockData.catalog = rawBooks.map(b => ({
                id: b._id,
                title: b.title,
                author: b.author,
                category: (b.genres && b.genres.length > 0) ? b.genres[0].toLowerCase() : 'all',
                cover: b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80',
                description: b.description || 'No description available.',
                status: b.availableCopies > 0 ? 'Available' : 'Borrowed'
            }));
            
            // Recompute stats
            mockData.statistics.totalBooks = mockData.catalog.length;
        }
    } catch (err) {
        console.error('Failed to connect to backend for catalog. Using mock data.', err);
    }

    dashboardManager.init();
    catalogManager.init();
    modalManager.init();
    myBooksManager.init();
    membersManager.init();
    reportsManager.init();
    spaRouter.init();
    setupLogout();
    console.log('NextGEN Library application initialized.');
});

// ============================================================================
// Dashboard Manager
// ============================================================================
const dashboardManager = {
    init() {
        if (!document.getElementById('statsGrid')) return; // Check if on dashboard
        this.renderStats();
        this.renderTransactions();
        this.renderRecommendations();
    },

    renderStats() {
        const grid = document.getElementById('statsGrid');
        const stats = mockData.statistics;

        grid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon books"><i class="ph ph-books"></i></div>
                <div class="stat-info">
                    <h3>Total Books</h3>
                    <div class="value">${stats.totalBooks.toLocaleString()}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon members"><i class="ph ph-users"></i></div>
                <div class="stat-info">
                    <h3>Active Members</h3>
                    <div class="value">${stats.activeMembers.toLocaleString()}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon borrowed"><i class="ph ph-bookmark-simple"></i></div>
                <div class="stat-info">
                    <h3>Borrowed Books</h3>
                    <div class="value">${stats.borrowedBooks.toLocaleString()}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon overdue"><i class="ph ph-warning-circle"></i></div>
                <div class="stat-info">
                    <h3>Overdue</h3>
                    <div class="value">${stats.overdueBooks.toLocaleString()}</div>
                </div>
            </div>
        `;
    },

    renderTransactions() {
        const tableContainer = document.getElementById('transactionsTable');
        const txs = mockData.recentTransactions;

        const rows = txs.map(tx => `
            <tr>
                <td><strong>${tx.id}</strong></td>
                <td>${tx.title}</td>
                <td>${tx.member}</td>
                <td>${tx.date}</td>
                <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
            </tr>
        `).join('');

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Trx ID</th>
                        <th>Book</th>
                        <th>Member</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    },

    async renderRecommendations() {
        const listContainer = document.getElementById('popularBooksList');
        if (!listContainer) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/recommendations/', {
                headers: { 'x-auth-token': token }
            });
            
            if (res.ok) {
                const results = await res.json();
                const books = results.data || [];
                
                if (books.length > 0) {
                    listContainer.innerHTML = books.map(book => `
                        <div class="book-item">
                            <img src="${book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80'}" alt="${book.title}" class="book-cover">
                            <div class="book-details">
                                <h4>${book.title}</h4>
                                <span class="author">${book.author}</span>
                                <div class="book-meta">
                                    <span class="ai-match" title="AI Source: ${results.source}"><i class="ph-fill ph-sparkle"></i> Recommended for You</span>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    return; // Exit successfully
                }
            }
        } catch (e) {
            console.error("AI Recommendations fetch failed, falling back to mock", e);
        }

        // Fallback functionality
        const books = mockData.aiRecommendations;
        listContainer.innerHTML = books.map(book => `
            <div class="book-item">
                <img src="${book.cover}" alt="${book.title}" class="book-cover">
                <div class="book-details">
                    <h4>${book.title}</h4>
                    <span class="author">${book.author}</span>
                    <div class="book-meta">
                        <span class="ai-match"><i class="ph-fill ph-sparkle"></i> ${book.match}% Match</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// ============================================================================
// Catalog Manager
// ============================================================================
const catalogManager = {
    currentCategory: 'all',
    searchQuery: '',

    init() {
        if (!document.getElementById('catalogContainer')) return;

        this.renderFilters();
        this.renderCatalog();
        this.setupEventListeners();
    },

    renderFilters() {
        const categories = ['all', 'sci-fi', 'technology', 'science', 'design'];
        const filterContainer = document.getElementById('categoryFilters');
        if (!filterContainer) return;

        filterContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${this.currentCategory === cat ? 'active' : ''}" data-category="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
        `).join('');
    },

    renderCatalog() {
        const container = document.getElementById('catalogContainer');
        if (!container) return;

        let filteredBooks = mockData.catalog.filter(book => {
            const matchesCategory = this.currentCategory === 'all' || book.category === this.currentCategory;
            const matchesSearch = book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredBooks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-magnifying-glass"></i>
                    <h2>No books found</h2>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredBooks.map(book => `
            <div class="catalog-book" onclick="modalManager.openBookModal('${book.id}')">
                <div class="cover-container">
                    <img src="${book.cover}" alt="${book.title}">
                </div>
                <div class="info">
                    <h4>${book.title}</h4>
                    <span class="author">${book.author}</span>
                    <div class="tags">
                        <span class="book-tag">${book.category}</span>
                        <span class="book-tag" style="background: ${book.status === 'Available' ? 'var(--success-bg)' : 'var(--warning-bg)'}; color: ${book.status === 'Available' ? 'var(--success)' : 'var(--warning)'}">${book.status}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners() {
        // Filters
        const filterContainer = document.getElementById('categoryFilters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.currentCategory = e.target.dataset.category;
                    this.renderFilters();
                    this.renderCatalog();
                }
            });
        }

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderCatalog();
            });
        }

        // View Toggles
        const btnGrid = document.getElementById('btnGridView');
        const btnList = document.getElementById('btnListView');
        const container = document.getElementById('catalogContainer');

        if (btnGrid && btnList && container) {
            btnGrid.addEventListener('click', () => {
                btnGrid.classList.add('active');
                btnList.classList.remove('active');
                container.classList.remove('list-view');
            });
            btnList.addEventListener('click', () => {
                btnList.classList.add('active');
                btnGrid.classList.remove('active');
                container.classList.add('list-view');
            });
        }
    }
};

// ============================================================================
// Modal Manager
// ============================================================================
const modalManager = {
    init() {
        this.modal = document.getElementById('bookModal');
        this.closeBtn = document.getElementById('closeModal');

        if (!this.modal || !this.closeBtn) return;

        this.closeBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    openBookModal(bookId) {
        const book = mockData.catalog.find(b => b.id === bookId);
        if (!book) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-book-details" id="modalBookDetailsView">
                <img src="${book.cover}" alt="${book.title}" class="modal-cover">
                <div class="modal-info">
                    <h2>${book.title}</h2>
                    <div class="author">By ${book.author}</div>
                    <div class="tags" style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
                        <span class="book-tag">${book.category}</span>
                        <span class="book-tag" style="background: ${book.status === 'Available' ? 'var(--success-bg)' : 'var(--warning-bg)'}; color: ${book.status === 'Available' ? 'var(--success)' : 'var(--warning)'}">${book.status}</span>
                    </div>
                    <p class="modal-desc">${book.description}</p>
                    <div class="modal-actions">
                        <button id="showBorrowFormBtn" class="btn-primary" ${book.status !== 'Available' ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Borrow Book</button>
                        <button class="btn-secondary">Add to Wishlist</button>
                    </div>
                </div>
            </div>

            <div id="modalBorrowFormView" style="display: none; width: 100%; max-width: 400px; margin: 0 auto; text-align: left;">
                <button id="backToBookDetailsBtn" class="btn-secondary" style="margin-bottom: 1.5rem; padding: 0.5rem;"><i class="ph ph-arrow-left"></i> Back</button>
                <div style="margin-bottom: 2rem;">
                    <h3>Borrowing Details</h3>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">You are borrowing: <strong>${book.title}</strong></p>
                </div>
                
                <div id="borrowResultMsg" style="margin-bottom: 1rem; padding: 1rem; border-radius: var(--radius-md); display: none;"></div>

                <form id="borrowBookForm">
                    <div style="margin-bottom: 1rem;">
                        <label for="borrowMemberId" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Library Member ID (e.g. M-101)</label>
                        <input type="text" id="borrowMemberId" required style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary);">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label for="borrowDuration" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Duration (Days)</label>
                        <select id="borrowDuration" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary);">
                            <option value="7">1 Week (7 Days)</option>
                            <option value="14" selected>2 Weeks (14 Days)</option>
                            <option value="30">1 Month (30 Days)</option>
                        </select>
                    </div>
                    <button type="submit" id="submitBorrowBtn" class="btn-primary" style="width: 100%; justify-content: center;">Confirm Borrow</button>
                </form>
            </div>
        `;

        // Setting up the views
        const detailsView = document.getElementById('modalBookDetailsView');
        const formView = document.getElementById('modalBorrowFormView');
        const showFormBtn = document.getElementById('showBorrowFormBtn');
        const backBtn = document.getElementById('backToBookDetailsBtn');
        const borrowForm = document.getElementById('borrowBookForm');

        if (showFormBtn) {
            showFormBtn.addEventListener('click', () => {
                detailsView.style.display = 'none';
                formView.style.display = 'block';
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                formView.style.display = 'none';
                detailsView.style.display = 'flex'; // flex is usually used on details
            });
        }

        if (borrowForm) {
            borrowForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitBorrowForm(book);
            });
        }

        this.modal.classList.add('active');
    },

    async submitBorrowForm(book) {
        const memberId = document.getElementById('borrowMemberId').value;
        const durationDays = document.getElementById('borrowDuration').value;
        const msgBox = document.getElementById('borrowResultMsg');
        const btn = document.getElementById('submitBorrowBtn');
        const originalBtnText = btn.textContent;

        btn.textContent = 'Processing...';
        btn.disabled = true;

        const token = localStorage.getItem('token');
        if (!token) {
            msgBox.style.display = 'block';
            msgBox.style.backgroundColor = 'var(--danger-bg)';
            msgBox.style.color = 'var(--danger)';
            msgBox.textContent = 'You must be logged in to borrow a book.';
            btn.textContent = originalBtnText;
            btn.disabled = false;
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/books/borrow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    bookId: book.id,
                    bookTitle: book.title,
                    memberId: memberId,
                    durationDays: durationDays
                })
            });

            const data = await res.json();

            msgBox.style.display = 'block';
            if (res.ok) {
                msgBox.style.backgroundColor = 'var(--success-bg)';
                msgBox.style.color = 'var(--success)';
                msgBox.textContent = 'Successfully Borrowed! Check the My Books page.';
                btn.style.display = 'none'; // hide submit if success
            } else {
                msgBox.style.backgroundColor = 'var(--danger-bg)';
                msgBox.style.color = 'var(--danger)';
                msgBox.textContent = data.msg || 'Transaction Failed';
                btn.textContent = originalBtnText;
                btn.disabled = false;
            }
        } catch (err) {
            console.error('Error borrowing:', err);
            msgBox.style.display = 'block';
            msgBox.style.backgroundColor = 'var(--danger-bg)';
            msgBox.style.color = 'var(--danger)';
            msgBox.textContent = 'A network error occurred connecting to the backend server.';
            btn.textContent = originalBtnText;
            btn.disabled = false;
        }
    },

    close() {
        this.modal.classList.remove('active');
    }
}

// ============================================================================
// My Books Manager
// ============================================================================
const myBooksManager = {
    async init() {
        const container = document.getElementById('transactionsContainer');
        if (!container) return; // Not on My Books page

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:5000/api/books/my-books', {
                headers: {
                    'x-auth-token': token
                }
            });

            if (!res.ok) throw new Error('Failed to fetch transactions');

            const transactions = await res.json();

            if (transactions.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1; display:flex; flex-direction:column; align-items:center; gap: 1rem;">
                        <i class="ph ph-books" style="font-size: 3rem; color: var(--text-tertiary);"></i>
                        <h3>No books borrowed yet</h3>
                        <a href="catalog.html" class="btn-primary" style="text-decoration: none; margin-top: 0.5rem;">Browse Catalog</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = transactions.map(t => {
                const borrowDate = new Date(t.borrowDate).toLocaleDateString();
                const dueDate = new Date(t.dueDate).toLocaleDateString();

                let statusClass = 'status-borrowed';
                if (t.status === 'Returned') statusClass = 'status-returned';
                if (t.status === 'Overdue') statusClass = 'status-overdue';

                return `
                    <div class="transaction-card">
                        <div class="transaction-header">
                            <div>
                                <div class="transaction-title">${t.bookTitle}</div>
                                <div style="font-size: 0.875rem; color: var(--text-tertiary);">Member ID: ${t.memberId}</div>
                            </div>
                            <span class="transaction-status ${statusClass}">${t.status}</span>
                        </div>
                        
                        <div class="transaction-details">
                            <div class="detail-item">
                                <span class="detail-label">Borrowed On</span>
                                <span>${borrowDate}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Due Date</span>
                                <span style="font-weight: 500; color: var(--text-primary);">${dueDate}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (err) {
            console.error(err);
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; color: var(--danger);">
                    Failed to load your transaction history. Ensure the backend server is running.
                </div>
            `;
        }
    }
};

// ============================================================================
// Members Manager
// ============================================================================
const membersManager = {
    async init() {
        const container = document.getElementById('membersGrid');
        if (!container) return; // Not on Members page
        
        // Boilerplate code to fetch members data from API
        try {
            // const res = await fetch('http://localhost:5000/api/users'); 
            // const members = await res.json();
            console.log('Members Manager initialized - ready for API connections');
        } catch (e) {
            console.error('Failed to load members', e);
        }
    }
};

// ============================================================================
// Internal SPA Router
// ============================================================================
const spaRouter = {
    init() {
        document.body.addEventListener('click', async (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;
            
            // Allow external links or hash links to pass normally
            if (link.origin !== window.location.origin) return;
            if (link.getAttribute('href') === '#') return;
            
            // Don't intercept login flows or target blank
            if (link.href.includes('login.html')) return;
            if (link.target === '_blank') return;

            // Intercept local HTML routing for a seamless Single Page Application experience
            e.preventDefault();
            this.navigate(link.href);
        });

        window.addEventListener('popstate', () => {
            this.navigate(window.location.href, false);
        });
    },

    async navigate(url, pushState = true) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Fetch failed');
            const html = await res.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Replace Main Content
            const newMain = doc.querySelector('.main-content');
            const currentMain = document.querySelector('.main-content');
            if (newMain && currentMain) {
                currentMain.innerHTML = newMain.innerHTML;
            }

            // Update Active link in Sidebar
            const allLinks = document.querySelectorAll('.nav-links a');
            allLinks.forEach(a => a.classList.remove('active'));
            
            const pathname = new URL(url).pathname.split('/').pop() || 'index.html';
            allLinks.forEach(a => {
                const aPath = new URL(a.href).pathname.split('/').pop();
                if (aPath === pathname) a.classList.add('active');
            });

            // Re-run initialization for page-specific logic
            dashboardManager.init();
            catalogManager.init();
            myBooksManager.init();
            membersManager.init();
            reportsManager.init();
            
            // Fix dynamically replaced modals if needed by re-initializing it
            modalManager.init();

            if (pushState) {
                window.history.pushState({}, '', url);
            }
        } catch (e) {
            console.error('SPA routing failed, falling back to basic navigation:', e);
            window.location.href = url; // Fallback to full load
        }
    }
};

// ============================================================================
// Reports Manager
// ============================================================================
const reportsManager = {
    sortDirection: {},
    tableData: [],

    async init() {
        const spinner = document.getElementById('reportsLoadingSpinner');
        const container = document.getElementById('reportsDynamicContainer');
        if (!spinner || !container) return; // Not on the Reports page
        
        try {
            // Give slightly realistic delay for spinner
            await new Promise(r => setTimeout(r, 600));

            const res = await fetch('http://localhost:5000/api/reports');
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            
            // Populate KPIs
            document.getElementById('kpiTotalBooks').textContent = data.kpis.totalBooks.toLocaleString();
            document.getElementById('kpiActiveMembers').textContent = data.kpis.activeMembers.toLocaleString();
            document.getElementById('kpiNewSignups').textContent = data.kpis.newSignups.toLocaleString();
            
            // Render Chart
            this.renderChart(data.chartData);
            
            // Render Table
            this.tableData = data.activities;
            this.renderTable();
            this.setupSorting();
            
            // Setup CSV Download
            this.setupCsvDownload();
            
            // Hide spinner, show content
            spinner.style.display = 'none';
            container.style.display = 'flex';

        } catch (e) {
            console.error('Reports load failed', e);
            spinner.innerHTML = `<p style="color:var(--danger)">Failed to load reports data. Is the backend running?</p>`;
        }
    },

    renderChart(chartData) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('userGrowthChart').getContext('2d');
        if (window.reportsChart) window.reportsChart.destroy();
        
        window.reportsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'User Growth',
                    data: chartData.data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    renderTable() {
        const tbody = document.getElementById('reportsTableBody');
        tbody.innerHTML = this.tableData.map(row => `
            <tr>
                <td>${row.date}</td>
                <td>${row.activity}</td>
                <td>${row.user}</td>
                <td><span class="status-badge status-${row.status.toLowerCase()}">${row.status}</span></td>
            </tr>
        `).join('');
    },

    setupSorting() {
        document.querySelectorAll('#analyticsTable th').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                this.sortDirection[column] = !this.sortDirection[column];
                
                this.tableData.sort((a, b) => {
                    const valA = String(a[column] || '').toLowerCase();
                    const valB = String(b[column] || '').toLowerCase();
                    if (valA < valB) return this.sortDirection[column] ? -1 : 1;
                    if (valA > valB) return this.sortDirection[column] ? 1 : -1;
                    return 0;
                });
                
                // Update icon directions (optional visual polish)
                document.querySelectorAll('#analyticsTable th i').forEach(i => {
                    i.classList.remove('ph-caret-down');
                    i.classList.add('ph-caret-up');
                });
                const icon = th.querySelector('i');
                if (icon) {
                    if (!this.sortDirection[column]) {
                        icon.classList.remove('ph-caret-up');
                        icon.classList.add('ph-caret-down');
                    }
                }

                this.renderTable();
            });
        });
    },

    setupCsvDownload() {
        const btn = document.getElementById('downloadCsvBtn');
        if (!btn) return;
        btn.onclick = () => {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Date,Activity,User,Status\\n";
            csvContent += this.tableData.map(e => `${e.date},${e.activity},${e.user},${e.status}`).join("\\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "nextgen-reports.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }
};
