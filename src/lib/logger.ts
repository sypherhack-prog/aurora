// Production-ready logger that suppresses output in production
// In production, logs should be sent to a proper logging service

const isProduction = process.env.NODE_ENV === 'production'

class Logger {
    info(message: string, ...args: unknown[]) {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[INFO] ${message}`, ...args)
        }
        // In production: send to logging service (e.g., Sentry, LogRocket)
    }

    warn(message: string, ...args: unknown[]) {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.warn(`[WARN] ${message}`, ...args)
        }
        // In production: send to logging service
    }

    error(message: string, error?: unknown) {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.error(`[ERROR] ${message}`, error || '')
        }
        // In production: send to error tracking service (e.g., Sentry)
    }

    debug(message: string, ...args: unknown[]) {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[DEBUG] ${message}`, ...args)
        }
    }
}

export const logger = new Logger()
