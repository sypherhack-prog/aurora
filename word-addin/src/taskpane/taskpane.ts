/*
 * Aurora AI Word Add-in
 * Main taskpane logic for login and AI formatting
 */

/* global document, Office, Word */

// Import CSS styles
import './taskpane.css'

// Injecté au build (webpack DefinePlugin) ; sinon fallback
const API_BASE_URL =
  (typeof process !== 'undefined' &&
    (process as { env?: { API_BASE_URL?: string } }).env?.API_BASE_URL) ||
  'https://aurora-omega.vercel.app'

type AuroraAction =
  | 'auto-format'
  | 'fix-errors'
  | 'continue-writing'
  | 'suggest-ideas'
  | 'summarize'
  | 'generate-table'
  | 'improve-paragraph'
  | 'smart-heading'
  | 'improve-spacing'
  | 'translate'
  | 'translate-selection'

interface AuroraSession {
  token: string
  userName: string
}

interface TaskpaneDOM {
  loginSection: HTMLElement
  mainPanel: HTMLElement
  emailInput: HTMLInputElement
  passwordInput: HTMLInputElement
  loginBtn: HTMLButtonElement
  loginError: HTMLElement
  logoutBtn: HTMLButtonElement
  userNameEl: HTMLElement
  loadingIndicator: HTMLElement
  actionError: HTMLElement
  actionSuccess: HTMLElement
}

let currentSession: AuroraSession | null = null
let dom: TaskpaneDOM | null = null

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  // eslint-disable-next-line no-console
  console.error('Aurora Add-in: Uncaught error', event.error)
  showGlobalError('Erreur de chargement. Vérifiez la console pour plus de détails.')
})

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  // eslint-disable-next-line no-console
  console.error('Aurora Add-in: Unhandled promise rejection', event.reason)
  showGlobalError('Erreur réseau ou serveur. Vérifiez votre connexion.')
})

const showGlobalError = (message: string): void => {
  const container = document.querySelector('.aurora-container')
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #fca5a5;">
        <h2 style="color: #ef4444; margin-bottom: 12px;">Erreur</h2>
        <p style="margin-bottom: 16px;">${message}</p>
        <button onclick="location.reload()" style="padding: 8px 16px; background: #22d3ee; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Recharger
        </button>
      </div>
    `
  }
}

Office.onReady((info) => {
  try {
    if (info.host === Office.HostType.Word) {
      initializeApp()
    } else {
      // eslint-disable-next-line no-console
      console.warn('Aurora Add-in: Not running in Word host', info.host)
      showGlobalError('Cette extension fonctionne uniquement dans Microsoft Word.')
    }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Aurora Add-in: Initialization error', error)
    showGlobalError('Erreur lors de l\'initialisation de l\'extension.')
  }
})

const initializeApp = (): void => {
  dom = queryDomElements()
  if (!dom) {
    // If the DOM is not ready, avoid crashing the add-in
    // eslint-disable-next-line no-console
    console.error('Aurora Add-in: DOM elements not found')
    return
  }

  const {
    loginSection,
    mainPanel,
    emailInput,
    passwordInput,
    loginBtn,
    loginError,
    logoutBtn,
    userNameEl,
    loadingIndicator,
    actionError,
    actionSuccess,
  } = dom

  // Event listeners
  loginBtn.addEventListener('click', handleLogin)
  logoutBtn.addEventListener('click', handleLogout)

  // Add action button listeners
  const actionBtns = document.querySelectorAll<HTMLButtonElement>('.aurora-action-btn')
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action as AuroraAction | undefined
      if (action) {
        void handleAIAction(action)
      }
    })
  })

  // Restore stored session
  const storedSession = loadSession()
  if (storedSession) {
    currentSession = storedSession
    userNameEl.textContent = storedSession.userName
    loginSection.style.display = 'none'
    mainPanel.style.display = 'block'
    loginError.style.display = 'none'
    loadingIndicator.style.display = 'none'
    actionError.style.display = 'none'
    actionSuccess.style.display = 'none'
    emailInput.value = ''
    passwordInput.value = ''
  }
}

const queryDomElements = (): TaskpaneDOM | null => {
  const get = <T extends HTMLElement>(id: string): T | null =>
    document.getElementById(id) as T | null

  const loginSection = get<HTMLElement>('login-section')
  const mainPanel = get<HTMLElement>('main-panel')
  const emailInput = get<HTMLInputElement>('email')
  const passwordInput = get<HTMLInputElement>('password')
  const loginBtn = get<HTMLButtonElement>('login-btn')
  const loginError = get<HTMLElement>('login-error')
  const logoutBtn = get<HTMLButtonElement>('logout-btn')
  const userNameEl = get<HTMLElement>('user-name')
  const loadingIndicator = get<HTMLElement>('loading-indicator')
  const actionError = get<HTMLElement>('action-error')
  const actionSuccess = get<HTMLElement>('action-success')

  if (
    !loginSection ||
    !mainPanel ||
    !emailInput ||
    !passwordInput ||
    !loginBtn ||
    !loginError ||
    !logoutBtn ||
    !userNameEl ||
    !loadingIndicator ||
    !actionError ||
    !actionSuccess
  ) {
    return null
  }

  return {
    loginSection,
    mainPanel,
    emailInput,
    passwordInput,
    loginBtn,
    loginError,
    logoutBtn,
    userNameEl,
    loadingIndicator,
    actionError,
    actionSuccess,
  }
}

const loadSession = (): AuroraSession | null => {
  try {
    const token = localStorage.getItem('aurora_token')
    const userName = localStorage.getItem('aurora_user')
    if (!token || !userName) return null
    return { token, userName }
  } catch {
    return null
  }
}

const saveSession = (session: AuroraSession): void => {
  try {
    localStorage.setItem('aurora_token', session.token)
    localStorage.setItem('aurora_user', session.userName)
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

const clearSession = (): void => {
  try {
    localStorage.removeItem('aurora_token')
    localStorage.removeItem('aurora_user')
  } catch {
    // ignore
  }
}

const handleLogin = async (): Promise<void> => {
  if (!dom) return

  const { emailInput, passwordInput, loginBtn } = dom
  const email = emailInput.value.trim()
  const password = passwordInput.value

  if (!email || !password) {
    showLoginError('Veuillez remplir tous les champs')
    return
  }

  loginBtn.disabled = true
  loginBtn.textContent = 'Connexion...'
  hideLoginError()

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data: { token?: string; user?: { name?: string } } = await response.json()

    if (!response.ok) {
      throw new Error(data?.user ? 'Erreur de connexion' : (data as { error?: string })?.error || 'Erreur de connexion')
    }

    const token = data.token ?? 'session'
    const computedUserName = data.user?.name || email.split('@')[0]

    currentSession = { token, userName: computedUserName }
    saveSession(currentSession)

    showMainPanel()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
    showLoginError(errorMessage)
  } finally {
    loginBtn.disabled = false
    loginBtn.textContent = 'Se connecter'
  }
}

const handleLogout = (): void => {
  currentSession = null
  clearSession()
  showLoginSection()
}

const showLoginSection = (): void => {
  if (!dom) return
  const { loginSection, mainPanel, emailInput, passwordInput } = dom
  loginSection.style.display = 'block'
  mainPanel.style.display = 'none'
  emailInput.value = ''
  passwordInput.value = ''
}

const showMainPanel = (): void => {
  if (!dom) return
  const { loginSection, mainPanel, userNameEl } = dom
  loginSection.style.display = 'none'
  mainPanel.style.display = 'block'
  userNameEl.textContent = currentSession?.userName ?? 'Utilisateur'
}

const showLoginError = (message: string): void => {
  if (!dom) return
  const { loginError } = dom
  loginError.textContent = message
  loginError.style.display = 'block'
}

const hideLoginError = (): void => {
  if (!dom) return
  const { loginError } = dom
  loginError.style.display = 'none'
}

const showActionError = (message: string): void => {
  if (!dom) return
  const { actionError, actionSuccess } = dom
  actionError.textContent = message
  actionError.style.display = 'block'
  actionSuccess.style.display = 'none'
  setTimeout(() => {
    actionError.style.display = 'none'
  }, 5000)
}

const showActionSuccess = (message: string): void => {
  if (!dom) return
  const { actionError, actionSuccess } = dom
  actionSuccess.textContent = message
  actionSuccess.style.display = 'block'
  actionError.style.display = 'none'
  setTimeout(() => {
    actionSuccess.style.display = 'none'
  }, 3000)
}

const setLoading = (loading: boolean): void => {
  if (!dom) return
  const { loadingIndicator } = dom
  loadingIndicator.style.display = loading ? 'flex' : 'none'
  const btns = document.querySelectorAll<HTMLButtonElement>('.aurora-action-btn')
  btns.forEach((btn) => {
    btn.disabled = loading
  })
}

const handleAIAction = async (action: AuroraAction): Promise<void> => {
  if (!dom) return
  if (!currentSession) {
    showActionError('Veuillez vous connecter avant de lancer une action')
    return
  }

  const { actionError, actionSuccess } = dom

  setLoading(true)
  actionError.style.display = 'none'
  actionSuccess.style.display = 'none'

  try {
    const selectedText = await getSelectedText()

    if (!selectedText && action !== 'continue-writing') {
      throw new Error('Veuillez sélectionner du texte dans le document')
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentSession.token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        action,
        content: selectedText,
        selection: selectedText,
      }),
    })

    const data: { error?: string; result?: string } = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du traitement')
    }

    if (data.result) {
      await replaceSelectedText(data.result)
      showActionSuccess('Texte mis à jour avec succès !')
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    showActionError(errorMessage)
  } finally {
    setLoading(false)
  }
}

const getSelectedText = async (): Promise<string> =>
  Word.run(async (context) => {
    const selection = context.document.getSelection()
    selection.load('text')
    await context.sync()
    return selection.text
  })

const replaceSelectedText = async (newText: string): Promise<void> =>
  Word.run(async (context) => {
    const selection = context.document.getSelection()
    selection.insertText(newText, Word.InsertLocation.replace)
    await context.sync()
  })

