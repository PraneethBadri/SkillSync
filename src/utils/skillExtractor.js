const TECH_SKILLS_DB = [
    "python", "java", "javascript", "c++", "c#", "ruby", "php", "swift", "kotlin", "go",
    "rust", "typescript", "html", "css", "sql", "nosql", "react", "angular", "vue",
    "node.js", "express", "django", "flask", "spring", "ruby on rails", "asp.net",
    "docker", "kubernetes", "aws", "azure", "gcp", "google cloud", "git", "github",
    "gitlab", "ci/cd", "jenkins", "linux", "unix", "bash", "shell scripting", "machine learning",
    "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "keras",
    "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn", "data analysis",
    "data visualization", "big data", "hadoop", "spark", "agile", "scrum", "kanban",
    "jira", "confluence", "figma", "sketch", "adobe xd", "ui/ux", "product management",
    "project management", "leadership", "communication", "teamwork", "problem solving",
    "time management", "critical thinking", "design systems"
];

/**
 * Extracts skills from a raw chunk of text (e.g. Job Description).
 * Operates safely client-side via exact word boundary regex matches.
 * 
 * @param {string} text - Raw unformatted string
 * @returns {Array<string>} - Array of identified skills matching the local DB
 */
export const extractSkillsFromDescription = (text) => {
    if (!text) return [];
    
    // Normalize entire description to lowercase
    const normalizedText = text.toLowerCase();
    
    const extractedSet = new Set();
    
    TECH_SKILLS_DB.forEach(skill => {
        // Build robust word-boundary regex (handling 'c++' or 'node.js')
        // Uses \b to enforce exact word bounds, with special casing for symbols.
        let pattern;
        if (skill.includes('+') || skill.includes('#') || skill.includes('.')) {
             // For symbolic skills, escape regex chars but still enforce boundary logic loosely
             const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
             pattern = new RegExp(`(?:\\b|\\s)${escaped}(?:\\b|\\s|,)`);
        } else {
             // Standard boundary matching for alphabetic strings
             pattern = new RegExp(`\\b${skill}\\b`);
        }
        
        if (pattern.test(normalizedText)) {
            // Capitalize properly for React UI rendering
            const capitalized = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            extractedSet.add(capitalized);
        }
    });

    return Array.from(extractedSet);
};
