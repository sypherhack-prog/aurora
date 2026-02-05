/**
 * Central logger. In production, no console output; use a logging service (e.g. Sentry) instead.
 */

const isProduction = process.env.NODE_ENV === 'production'

class Logger {
    info(message: string, ...args: unknown[]): void {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[INFO] ${message}`, ...args)
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.warn(`[WARN] ${message}`, ...args)
        }
    }

    error(message: string, error?: unknown): void {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.error(`[ERROR] ${message}`, error ?? '')
        }
    }

    debug(message: string, ...args: unknown[]): void {
        if (!isProduction) {
            // eslint-disable-next-line no-console
            console.log(`[DEBUG] ${message}`, ...args)
        }
    }
}

export const logger = new Logger()
