/**
 * SIMPLIFIED MINDS - CONFIGURATION FILE
 * Customize the appearance and behavior of your educational platform
 */

const SITE_CONFIG = {
    // ==================
    // SITE INFORMATION
    // ==================
    site: {
        name: "SimplifiedMinds",
        tagline: "SSLC Physics",
        description: "Helping SSLC students master concepts through simplified explanations, interactive learning materials, and comprehensive question banks.",
        author: "SimplifiedMinds Team",
        version: "1.0.0",
        url: "https://sslctoppers.com"
    },

    // ==================
    // CURRENT CHAPTER
    // ==================
    chapter: {
        title: "Master Electric Current Concepts",
        subtitle: "Comprehensive solutions, step-by-step examples, and practice questions to help you excel in your SSLC Physics examinations.",
        subject: "Physics",
        class: "SSLC",
        icon: "ri-flashlight-line",
        badge: "SSLC Physics",
        dataFile: "assets/data/electric-current.json" // Path to questions JSON file
    },

    // ==================
    // DISPLAY SETTINGS
    // ==================
    display: {
        questionsPerPage: 5,
        enableDarkMode: true,
        showProgressBar: true,
        showParticleAnimation: true,
        particleCount: 50,
        enableStatsAnimation: true,
        statsAnimationDuration: 2000,
        enableImageModal: true,
        enableKeyboardNavigation: true
    },

    // ==================
    // SEARCH & FILTER
    // ==================
    filters: {
        searchDebounceDelay: 300,
        enableDifficultyFilter: true,
        enableTypeFilter: true,
        enableTagFilter: true,
        difficulties: [
            { value: "all", label: "All Difficulty" },
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" }
        ],
        types: [
            { value: "all", label: "All Types" },
            { value: "numerical", label: "Numerical" },
            { value: "conceptual", label: "Conceptual" },
            { value: "derivation", label: "Derivation" }
        ]
    },

    // ==================
    // ANIMATIONS
    // ==================
    animations: {
        cardAnimationDelay: 100,
        scrollAnimationDuration: 800,
        hoverTransitionDuration: 300,
        modalTransitionDuration: 300,
        enableSmoothScroll: true,
        enableHoverEffects: true
    }
};

// ==================
// UTILITY FUNCTIONS
// ==================
const ConfigUtils = {
    get(path, defaultValue = null) {
        const keys = path.split('.');
        let current = SITE_CONFIG;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return defaultValue;
            }
            current = current[key];
        }
        
        return current;
    },

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = SITE_CONFIG;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
    },

    init() {
        console.log('Configuration initialized successfully');
    }
};

// ==================
// EXPORT FOR USE
// ==================
if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
    window.ConfigUtils = ConfigUtils;
}