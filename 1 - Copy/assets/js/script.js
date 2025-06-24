/**
 * SIMPLIFIED MINDS - MAIN JAVASCRIPT
 * Enhanced functionality for the educational platform
 */

// Global Configuration
const CONFIG = {
    questionsPerPage: 5,
    animationDelay: 100,
    searchDebounce: 300,
    particleCount: 50,
    statsAnimationDuration: 2000
};

// Global State
let currentQuestions = [];
let filteredQuestions = [];
let currentPage = 1;
let totalPages = 1;
let searchTimeout = null;
let theme = localStorage.getItem('theme') || 'dark';

// DOM Elements Cache
const elements = {
    header: null,
    progressBar: null,
    searchInput: null,
    searchClear: null,
    difficultyFilter: null,
    typeFilter: null,
    questionsContainer: null,
    pagination: null,
    pageNumbers: null,
    prevPage: null,
    nextPage: null,
    loadingSpinner: null,
    scrollToTop: null,
    themeToggle: null,
    imageModal: null,
    modalImage: null,
    modalCaption: null,
    modalClose: null,
    mobileMenuToggle: null,
    navMenu: null,
    overlay: null,
    hamburger: null,
    tags: null,
    particles: null
};

/**
 * ==============================
 * INITIALIZATION
 * ==============================
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeTheme();
    initializeEventListeners();
    initializeParticles();
    initializeStats();
    loadQuestions();
    
    // Initialize scroll effects
    window.addEventListener('scroll', handleScroll);
    
    // Initialize resize handler
    window.addEventListener('resize', handleResize);
    
    console.log('SimplifiedMinds initialized successfully');
});

/**
 * Cache DOM elements for better performance
 */
function initializeElements() {
    elements.header = document.getElementById('header');
    elements.progressBar = document.getElementById('progressBar');
    elements.searchInput = document.getElementById('searchInput');
    elements.searchClear = document.getElementById('searchClear');
    elements.difficultyFilter = document.getElementById('difficultyFilter');
    elements.typeFilter = document.getElementById('typeFilter');
    elements.questionsContainer = document.getElementById('questionsContainer');
    elements.pagination = document.getElementById('pagination');
    elements.pageNumbers = document.getElementById('pageNumbers');
    elements.prevPage = document.getElementById('prevPage');
    elements.nextPage = document.getElementById('nextPage');
    elements.loadingSpinner = document.getElementById('loadingSpinner');
    elements.scrollToTop = document.getElementById('scrollToTop');
    elements.themeToggle = document.getElementById('themeToggle');
    elements.imageModal = document.getElementById('imageModal');
    elements.modalImage = document.getElementById('modalImage');
    elements.modalCaption = document.getElementById('modalCaption');
    elements.modalClose = document.getElementById('modalClose');
    elements.mobileMenuToggle = document.getElementById('mobileMenuToggle');
    elements.navMenu = document.getElementById('navMenu');
    elements.overlay = document.getElementById('overlay');
    elements.hamburger = document.getElementById('hamburger');
    elements.tags = document.querySelectorAll('.tag');
    elements.particles = document.getElementById('particles');
}

/**
 * ==============================
 * THEME MANAGEMENT
 * ==============================
 */
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon();
    
    // Add smooth transition effect
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    const icon = elements.themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'ri-sun-line';
    } else {
        icon.className = 'ri-moon-line';
    }
}

/**
 * ==============================
 * EVENT LISTENERS
 * ==============================
 */
function initializeEventListeners() {
    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Overlay click
    if (elements.overlay) {
        elements.overlay.addEventListener('click', closeMobileMenu);
    }
    
    // Search functionality
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
        elements.searchInput.addEventListener('focus', showSearchClear);
        elements.searchInput.addEventListener('blur', hideSearchClear);
    }
    
    if (elements.searchClear) {
        elements.searchClear.addEventListener('click', clearSearch);
    }
    
    // Filter functionality
    if (elements.difficultyFilter) {
        elements.difficultyFilter.addEventListener('change', applyFilters);
    }
    
    if (elements.typeFilter) {
        elements.typeFilter.addEventListener('change', applyFilters);
    }
    
    // Tag functionality
    elements.tags.forEach(tag => {
        tag.addEventListener('click', handleTagClick);
    });
    
    // Pagination
    if (elements.prevPage) {
        elements.prevPage.addEventListener('click', () => goToPage(currentPage - 1));
    }
    
    if (elements.nextPage) {
        elements.nextPage.addEventListener('click', () => goToPage(currentPage + 1));
    }
    
    // Scroll to top
    if (elements.scrollToTop) {
        elements.scrollToTop.addEventListener('click', scrollToTop);
    }
    
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Image modal
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeImageModal);
    }
    
    if (elements.imageModal) {
        elements.imageModal.addEventListener('click', (e) => {
            if (e.target === elements.imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * ==============================
 * MOBILE MENU
 * ==============================
 */
function toggleMobileMenu() {
    elements.hamburger.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
    elements.overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    elements.hamburger.classList.remove('active');
    elements.navMenu.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

/**
 * ==============================
 * SEARCH FUNCTIONALITY
 * ==============================
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Show/hide clear button
    if (searchTerm) {
        elements.searchClear.classList.add('visible');
    } else {
        elements.searchClear.classList.remove('visible');
    }
    
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters();
    }, CONFIG.searchDebounce);
}

function showSearchClear() {
    if (elements.searchInput.value) {
        elements.searchClear.classList.add('visible');
    }
}

function hideSearchClear() {
    setTimeout(() => {
        elements.searchClear.classList.remove('visible');
    }, 150);
}

function clearSearch() {
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');
    applyFilters();
    elements.searchInput.focus();
}

/**
 * ==============================
 * FILTERING SYSTEM
 * ==============================
 */
function handleTagClick(e) {
    // Remove active class from all tags
    elements.tags.forEach(tag => tag.classList.remove('active'));
    
    // Add active class to clicked tag
    e.target.classList.add('active');
    
    // Apply filters
    applyFilters();
}

function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const selectedDifficulty = elements.difficultyFilter.value;
    const selectedType = elements.typeFilter.value;
    const selectedTag = document.querySelector('.tag.active').getAttribute('data-tag');
    
    // Show loading
    showLoading();
    
    // Filter questions
    filteredQuestions = currentQuestions.filter(question => {
        const matchesSearch = !searchTerm || 
            question.text.toLowerCase().includes(searchTerm) ||
            question.solution.toLowerCase().includes(searchTerm);
        
        const matchesDifficulty = selectedDifficulty === 'all' || 
            question.difficulty === selectedDifficulty;
        
        const matchesType = selectedType === 'all' || 
            question.type === selectedType;
        
        const matchesTag = selectedTag === 'all' || 
            question.tags.includes(selectedTag);
        
        return matchesSearch && matchesDifficulty && matchesType && matchesTag;
    });
    
    // Update pagination
    totalPages = Math.ceil(filteredQuestions.length / CONFIG.questionsPerPage);
    currentPage = 1;
    
    // Render questions with animation
    setTimeout(() => {
        renderQuestions();
        updatePagination();
        hideLoading();
    }, 300);
}

/**
 * ==============================
 * QUESTIONS MANAGEMENT
 * ==============================
 */
async function loadQuestions() {
    try {
        showLoading();
        
        // Try to load from JSON file
        const dataFile = window.SITE_CONFIG?.chapter?.dataFile || 'assets/data/electric-current.json';
        
        console.log('Attempting to load:', dataFile);
        
        try {
            const response = await fetch(dataFile);
            console.log('Fetch response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ JSON data loaded successfully!');
                console.log('Raw JSON data:', data);
                
                // Transform complex JSON structure to simple structure
                if (data.questions && Array.isArray(data.questions)) {
                    currentQuestions = data.questions.map(q => transformQuestion(q));
                    console.log('✅ Questions transformed:', currentQuestions.length);
                } else {
                    throw new Error('Invalid JSON structure - questions array not found');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (fetchError) {
            console.warn('❌ Could not load external JSON:', fetchError.message);
            console.log('🔄 Using embedded questions instead');
            currentQuestions = getEmbeddedQuestions();
        }
        
        filteredQuestions = [...currentQuestions];
        totalPages = Math.ceil(filteredQuestions.length / CONFIG.questionsPerPage);
        
        // Update stats with actual question count
        updateStatsDisplay();
        
        setTimeout(() => {
            renderQuestions();
            updatePagination();
            hideLoading();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        showError('Failed to load questions. Please try again.');
    }
}

/**
 * Transform complex JSON question to simple structure
 */
function transformQuestion(complexQuestion) {
    return {
        id: complexQuestion.id,
        text: complexQuestion.text,
        difficulty: complexQuestion.difficulty,
        type: complexQuestion.type,
        tags: complexQuestion.tags,
        solution: complexQuestion.solution?.approach || "Solution approach",
        steps: extractSteps(complexQuestion.solution?.steps || []),
        formula: complexQuestion.solution?.formula || "N/A",
        answer: complexQuestion.solution?.answer || "Answer not provided",
        image: complexQuestion.image,
    };
}

/**
 * Extract simple steps from complex JSON structure
 */
function extractSteps(complexSteps) {
    if (!Array.isArray(complexSteps)) return [];
    
    return complexSteps.map(step => {
        if (typeof step === 'string') return step;
        
        let stepText = step.description || '';
        
        if (step.calculation && Array.isArray(step.calculation)) {
            stepText += '\n' + step.calculation.join('\n');
        }
        
        if (step.equation) {
            stepText += '\n' + step.equation;
        }
        
        return stepText;
    });
}

/**
 * Update stats display with actual loaded question count
 */
function updateStatsDisplay() {
    const questionCountElement = document.querySelector('[data-target="25"]');
    if (questionCountElement) {
        questionCountElement.setAttribute('data-target', currentQuestions.length.toString());
    }
}

/**
 * Get embedded questions (full 8 questions)
 */
function getEmbeddedQuestions() {
    return [
        {
            id: 1,
            text: "A conductor has a resistance of 5 Ω and a current of 2 A flows through it. What is the potential difference across the conductor?",
            difficulty: "easy",
            type: "numerical",
            tags: ["ohms-law"],
            solution: "According to Ohm's Law, V = I × R",
            steps: [
                "Apply Ohm's Law: V = I × R",
                "Given: R = 5 Ω, I = 2 A",
                "V = 2 A × 5 Ω = 10 V"
            ],
            formula: "V = I × R",
            answer: "10 V",
            image: null
        },
        {
            id: 2,
            text: "Calculate the resistivity of a material of a wire that has a resistance of 20 Ω, length 10 m, and cross-sectional area 2 × 10⁻⁶ m².",
            difficulty: "medium",
            type: "numerical",
            tags: ["resistivity"],
            solution: "Use the resistivity formula ρ = RA/L",
            steps: [
                "Use formula: ρ = RA/L",
                "Given: R = 20 Ω, A = 2 × 10⁻⁶ m², L = 10 m",
                "ρ = 20 × (2 × 10⁻⁶) / 10 = 4 × 10⁻⁶ Ω·m"
            ],
            formula: "ρ = RA/L",
            answer: "4 × 10⁻⁶ Ω·m",
            image: null
        },
        {
            id: 3,
            text: "Three resistors of 2 Ω, 3 Ω, and 5 Ω are connected in series. Calculate the equivalent resistance of the circuit.",
            difficulty: "medium",
            type: "numerical",
            tags: ["series-circuit"],
            solution: "In series, resistances add up",
            steps: [
                "For series: R_eq = R₁ + R₂ + R₃",
                "Given: R₁ = 2 Ω, R₂ = 3 Ω, R₃ = 5 Ω",
                "R_eq = 2 + 3 + 5 = 10 Ω"
            ],
            formula: "R_eq = R₁ + R₂ + R₃",
            answer: "10 Ω",
            image: null
        },
        {
            id: 4,
            text: "Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel. Find the equivalent resistance of the combination.",
            difficulty: "hard",
            type: "numerical",
            tags: ["parallel-circuit"],
            solution: "Use parallel resistance formula",
            steps: [
                "For parallel: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃",
                "1/R_eq = 1/4 + 1/6 + 1/12",
                "1/R_eq = 3/12 + 2/12 + 1/12 = 6/12 = 1/2",
                "R_eq = 2 Ω"
            ],
            formula: "1/R_eq = 1/R₁ + 1/R₂ + 1/R₃",
            answer: "2 Ω",
            image: null
        },
        {
            id: 5,
            text: "An electric bulb is rated at 60 W, 220 V. Find the current passing through it and its resistance.",
            difficulty: "medium",
            type: "numerical",
            tags: ["power"],
            solution: "Use power formulas P = VI and V = IR",
            steps: [
                "Given: P = 60 W, V = 220 V",
                "Find current: I = P/V = 60/220 = 0.273 A",
                "Find resistance: R = V/I = 220/0.273 = 806.6 Ω"
            ],
            formula: "P = VI, R = V/I",
            answer: "I = 0.273 A, R = 807 Ω",
            image: null
        },
        {
            id: 6,
            text: "A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes. Find the amount of electric charge that flows through the circuit.",
            difficulty: "easy",
            type: "numerical",
            tags: ["current", "charge"],
            solution: "Use the relationship between current, charge and time",
            steps: [
                "Electric current: I = Q/t, so Q = I × t",
                "Convert time: 10 minutes = 10 × 60 = 600 seconds",
                "Q = 0.5 A × 600 s = 300 C"
            ],
            formula: "Q = I × t",
            answer: "300 C",
            image: null
        },
        {
            id: 7,
            text: "The potential difference between the terminals of an electric heater is 60 V when it draws a current of 4 A from the source. What current will the heater draw if the potential difference is increased to 120 V?",
            difficulty: "medium",
            type: "numerical",
            tags: ["ohms-law", "proportionality"],
            solution: "First find resistance, then use Ohm's law for new conditions",
            steps: [
                "Find resistance: R = V₁/I₁ = 60 V / 4 A = 15 Ω",
                "For new voltage: I₂ = V₂/R = 120 V / 15 Ω = 8 A",
                "Verify: I₂ = I₁ × (V₂/V₁) = 4 × (120/60) = 8 A"
            ],
            formula: "V = I × R",
            answer: "8 A",
            image: null
        },
        {
            id: 8,
            text: "How much energy is consumed in 2 hours by an electrical appliance of 100 W?",
            difficulty: "easy",
            type: "numerical",
            tags: ["power", "energy"],
            solution: "Use the relationship between power, energy and time",
            steps: [
                "Energy consumed: E = P × t",
                "Given: P = 100 W, t = 2 hours",
                "E = 100 W × 2 h = 200 Wh = 0.2 kWh"
            ],
            formula: "E = P × t",
            answer: "200 Wh or 0.2 kWh",
            image: null
        },
        {
            id: 9,
            text: "How much energy is consumed in 2 hours by an electrical appliance of 100 W?",
            difficulty: "easy",
            type: "numerical",
            tags: ["power", "energy"],
            solution: "Use the relationship between power, energy and time",
            steps: [
                "Energy consumed: E = P × t",
                "Given: P = 100 W, t = 2 hours",
                "E = 100 W × 2 h = 200 Wh = 0.2 kWh"
            ],
            formula: "E = P × t",
            answer: "200 Wh or 0.2 kWh",
            image: null
        }
    ];
}

function renderQuestions() {
    const startIndex = (currentPage - 1) * CONFIG.questionsPerPage;
    const endIndex = startIndex + CONFIG.questionsPerPage;
    const questionsToShow = filteredQuestions.slice(startIndex, endIndex);
    
    if (questionsToShow.length === 0) {
        elements.questionsContainer.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 3rem;">
                <i class="ri-search-line" style="font-size: 3rem; color: var(--neutral-400); margin-bottom: 1rem;"></i>
                <h3>No questions found</h3>
                <p>Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }
    
    elements.questionsContainer.innerHTML = questionsToShow.map((question, index) => 
        createQuestionCard(question, startIndex + index + 1)
    ).join('');
    
    // Add event listeners to question headers
    const questionHeaders = elements.questionsContainer.querySelectorAll('.question-header');
    questionHeaders.forEach(header => {
        header.addEventListener('click', handleQuestionToggle);
    });
    
    // Add event listeners to images
    const images = elements.questionsContainer.querySelectorAll('.solution-image');
    images.forEach(img => {
        img.addEventListener('click', () => openImageModal(img.src, img.alt));
    });
    
    // Animate question cards
    animateQuestionCards();
}

function createQuestionCard(question, number) {
    const imageHtml = question.image ? `
        <div class="image-container">
            <img src="${question.image}" alt="Diagram for question ${number}" class="solution-image">
            <div class="image-caption">Click to enlarge</div>
        </div>
    ` : '';
    
    const stepsHtml = question.steps.map((step, index) => `
        <div class="step">
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <p style="white-space: pre-line;">${step}</p>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="question-card" data-tags="${question.tags.join(' ')}" data-difficulty="${question.difficulty}">
            <div class="question-header" data-target="solution${question.id}">
                <span class="question-number">${number}</span>
                <h3 class="question-text">${question.text}</h3>
                <span class="question-difficulty ${question.difficulty}">${capitalizeFirst(question.difficulty)}</span>
                <i class="ri-arrow-down-s-line toggle-icon"></i>
            </div>
            <div class="solution-content" id="solution${question.id}">
                <div class="solution-inner">
                    <div class="solution-header">
                        <span class="solution-badge">Solution</span>
                        <span class="solution-meta">${question.type} Problem</span>
                    </div>
                    
                    <div class="formula-block">
                        ${question.formula}
                    </div>

                    <div class="steps-container">
                        ${stepsHtml}
                    </div>
                    
                    ${imageHtml}
                    
                    <p><strong>Answer: ${question.answer}</strong></p>
                    
                    <div class="solution-tags">
                        ${question.tags.map(tag => `<span class="solution-tag">${formatTag(tag)}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function animateQuestionCards() {
    const cards = elements.questionsContainer.querySelectorAll('.question-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * CONFIG.animationDelay);
    });
}

function handleQuestionToggle(e) {
    const targetId = e.currentTarget.getAttribute('data-target');
    const solutionContent = document.getElementById(targetId);
    const questionCard = e.currentTarget.closest('.question-card');
    
    if (questionCard.classList.contains('active')) {
        // Close the current card
        questionCard.classList.remove('active');
        solutionContent.style.height = '0';
    } else {
        // Close any open card first
        const activeCard = document.querySelector('.question-card.active');
        if (activeCard) {
            activeCard.classList.remove('active');
            const activeSolution = activeCard.querySelector('.solution-content');
            activeSolution.style.height = '0';
        }
        
        // Open the clicked card
        questionCard.classList.add('active');
        solutionContent.style.height = solutionContent.scrollHeight + 'px';
        
        // Scroll to question if needed
        setTimeout(() => {
            questionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

/**
 * ==============================
 * PAGINATION
 * ==============================
 */
function updatePagination() {
    // Update page numbers
    elements.pageNumbers.innerHTML = generatePageNumbers();
    
    // Update navigation buttons
    elements.prevPage.disabled = currentPage === 1;
    elements.nextPage.disabled = currentPage === totalPages;
    
    // Add event listeners to page numbers
    const pageButtons = elements.pageNumbers.querySelectorAll('.page-button');
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(button.dataset.page);
            if (page && page !== currentPage) {
                goToPage(page);
            }
        });
    });
}

function generatePageNumbers() {
    let pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }
    
    return pages.map(page => {
        if (page === '...') {
            return '<span class="page-ellipsis">...</span>';
        }
        
        const isActive = page === currentPage ? 'active' : '';
        return `<button class="page-button ${isActive}" data-page="${page}">${page}</button>`;
    }).join('');
}

function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    currentPage = page;
    renderQuestions();
    updatePagination();
    
    // Scroll to questions section
    document.getElementById('questions').scrollIntoView({ behavior: 'smooth' });
}

/**
 * ==============================
 * IMAGE MODAL
 * ==============================
 */
function openImageModal(src, caption) {
    elements.modalImage.src = src;
    elements.modalCaption.textContent = caption || '';
    elements.imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    elements.imageModal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * ==============================
 * LOADING & ERROR STATES
 * ==============================
 */
function showLoading() {
    if (elements.loadingSpinner) {
        elements.loadingSpinner.style.display = 'flex';
    }
}

function hideLoading() {
    if (elements.loadingSpinner) {
        elements.loadingSpinner.style.display = 'none';
    }
}

function showError(message) {
    elements.questionsContainer.innerHTML = `
        <div class="error-state" style="text-align: center; padding: 3rem;">
            <i class="ri-error-warning-line" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="loadQuestions()">
                <i class="ri-refresh-line"></i>
                Try Again
            </button>
        </div>
    `;
}

/**
 * ==============================
 * SCROLL EFFECTS
 * ==============================
 */
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header scroll effect
    if (scrollY > 50) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }
    
    // Progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollY / windowHeight) * 100;
    elements.progressBar.style.width = scrolled + '%';
    
    // Scroll to top button
    if (scrollY > 500) {
        elements.scrollToTop.classList.add('visible');
    } else {
        elements.scrollToTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * ==============================
 * PARTICLES ANIMATION
 * ==============================
 */
function initializeParticles() {
    if (!elements.particles) return;
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 40 + 20;
        const delay = Math.random() * 10;
        
        // Apply styles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + 'vw';
        particle.style.top = posY + 'vh';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Animation
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        elements.particles.appendChild(particle);
    }
}

/**
 * ==============================
 * STATS ANIMATION
 * ==============================
 */
function initializeStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / (CONFIG.statsAnimationDuration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            stat.textContent = Math.floor(current);
            
            // Add + suffix for percentage
            if (stat.parentElement.textContent.includes('Success Rate')) {
                stat.textContent = Math.floor(current) + '%';
            }
        }, 16);
    });
}

/**
 * ==============================
 * KEYBOARD NAVIGATION
 * ==============================
 */
function handleKeyboardNavigation(e) {
    // Escape key - close modals
    if (e.key === 'Escape') {
        closeImageModal();
        closeMobileMenu();
    }
    
    // Arrow keys for pagination
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            e.preventDefault();
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            e.preventDefault();
            goToPage(currentPage + 1);
        }
    }
    
    // Search shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }
}

/**
 * ==============================
 * RESIZE HANDLER
 * ==============================
 */
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 1023) {
        closeMobileMenu();
    }
    
    // Recalculate solution heights for open questions
    const openQuestions = document.querySelectorAll('.question-card.active .solution-content');
    openQuestions.forEach(solution => {
        solution.style.height = 'auto';
        solution.style.height = solution.scrollHeight + 'px';
    });
}

/**
 * ==============================
 * UTILITY FUNCTIONS
 * ==============================
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTag(tag) {
    return tag.split('-').map(word => capitalizeFirst(word)).join(' ');
}

/**
 * ==============================
 * PUBLIC API (for external use)
 * ==============================
 */
window.SimplifiedMinds = {
    loadQuestions,
    goToPage,
    applyFilters,
    toggleTheme,
    openImageModal,
    closeImageModal,
    
    // Expose for testing
    getCurrentQuestions: () => filteredQuestions,
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages
};