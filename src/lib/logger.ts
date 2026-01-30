type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const isDev = process.env.NODE_ENV === 'development'

class Logger {
    info(message: string, ...args: any[]) {
        if (isDev) {
            console.log(`[INFO] ${message}`, ...args)
        }
    }

    warn(message: string, ...args: any[]) {
        console.warn(`[WARN] ${message}`, ...args)
    }

    error(message: string, error?: any) {
        console.error(`[ERROR] ${message}`, error || '')
    }

    debug(message: string, ...args: any[]) {
        if (isDev) {
            console.log(`[DEBUG] ${message}`, ...args)
        }
    }
}

export const logger = new Logger()
