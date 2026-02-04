/**
 * Application Constants
 * All magic numbers and reusable constants should be defined here
 */

export const APP_CONSTANTS = {
    MAX_USERS: 100,
    MAX_FREE_GENERATIONS: 5,
    MAX_FREE_EXPORTS: 2,
    PDF_CONFIG: {
        MARGIN: 1,
        SCALE: 2,
        QUALITY: 0.98,
    },
    TIMEOUTS: {
        EXPORT: 600,
        NOTIFICATION: 3000,
        DEBOUNCE: 500,
        SCROLL: 100,
    },
    EDITOR: {
        AVG_READING_SPEED: 200, // words per minute
    },
    LIMITS: {
        MAX_AI_CONTENT_LENGTH: 50000,
    },
    PRICING: {
        BASIC: 10000,
        PRO: 20000,
        ANNUAL: 100000,
    },
    DEFAULT_CONTENT: {
        exam: "<h1>Sujet d'Examen</h1><p><strong>Matière :</strong> ...</p><p><strong>Durée :</strong> ...</p><h2>Exercice 1</h2><p>...</p>",
        notes: '<h1>Notes de Cours</h1><p><strong>Date :</strong> ...</p><h2>Introduction</h2><p>...</p>',
        report: '<h1>Rapport de Stage</h1><p><strong>Entreprise :</strong> ...</p><p><strong>Période :</strong> ...</p><h2>Introduction</h2><p>Ce rapport présente...</p><h2>Missions effectuées</h2><p>...</p><h2>Bilan</h2><p>...</p>',
        'cover-letter': '<p>Prénom Nom</p><p>Adresse</p><p>Tél</p><br><p>Entreprise</p><p>Adresse</p><br><p><strong>Objet : Candidature au poste de...</strong></p><br><p>Madame, Monsieur,</p><p>...</p><br><p>Cordialement,</p>',
        manuscript: "<h1>Titre du Roman</h1><h2>Chapitre 1</h2><p>C'était une nuit sombre et orageuse...</p>",
        blank: '',
    },
} as const

// Validation Constants
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    MAX_EMAIL_LENGTH: 255,
    MAX_NAME_LENGTH: 100,
} as const

// User Roles
export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
} as const

// Subscription Constants
export const SUBSCRIPTION = {
    PLANS: {
        STARTER: 'STARTER',
        PRO: 'PRO',
        BUSINESS: 'BUSINESS',
    },
    STATUSES: {
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
        EXPIRED: 'EXPIRED',
        CANCELLED: 'CANCELLED',
    },
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const

// UI Constants
export const STATUS_STYLES = {
    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
    EXPIRED: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    BLOCKED: 'bg-red-500/20 text-red-400 border-red-500/30',
} as const

export const STATUS_LABELS = {
    PENDING: 'En attente',
    ACTIVE: 'Actif',
    EXPIRED: 'Expiré',
    BLOCKED: 'Bloqué',
} as const
