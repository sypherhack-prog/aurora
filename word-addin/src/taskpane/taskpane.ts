/*
 * Aurora AI Word Add-in
 * Même fonctionnalités que le SaaS - extension Word
 */

/* global document, Office, Word */

import './taskpane.css'

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

type InsertMode = 'replace' | 'append' | 'insert'

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
  translationLang: HTMLSelectElement
}

let currentSession: AuroraSession | null = null
let dom: TaskpaneDOM | null = null

// Paramètres par défaut (comme SaaS)
const DEFAULT_THEME = 'general'
const DEFAULT_DOC_TYPE = 'document'

window.addEventListener('error', (event) => {
  console.error('Aurora Add-in: Uncaught error', event.error)
  showGlobalError('Erreur de chargement. Vérifiez la console pour plus de détails.')
})

window.addEventListener('unhandledrejection', (event) => {
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
        <button onclick="location.reload()" style="padding: 8px 16px; background: #22d3ee; color: white; border: none; border-radius: 6px; cursor: pointer;">Recharger</button>
      </div>
    `
  }
}

Office.onReady((info) => {
  try {
    if (info.host === Office.HostType.Word) {
      initializeApp()
    } else {
      showGlobalError('Cette extension fonctionne uniquement dans Microsoft Word.')
    }
  } catch (error: unknown) {
    console.error('Aurora Add-in: Initialization error', error)
    showGlobalError("Erreur lors de l'initialisation de l'extension.")
  }
})

const initializeApp = (): void => {
  dom = queryDomElements()
  if (!dom) {
    console.error('Aurora Add-in: DOM elements not found')
    return
  }

  const { loginSection, mainPanel, emailInput, passwordInput, loginBtn, loginError, logoutBtn, userNameEl } = dom

  loginBtn.addEventListener('click', handleLogin)
  logoutBtn.addEventListener('click', handleLogout)

  document.querySelectorAll<HTMLButtonElement>('.aurora-action-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action as AuroraAction | undefined
      const mode = (btn.dataset.mode || 'replace') as InsertMode
      if (action) void handleAIAction(action, mode)
    })
  })

  const storedSession = loadSession()
  if (storedSession) {
    currentSession = storedSession
    userNameEl.textContent = storedSession.userName
    loginSection.style.display = 'none'
    mainPanel.style.display = 'block'
    loginError.style.display = 'none'
    dom.actionError.style.display = 'none'
    dom.actionSuccess.style.display = 'none'
    dom.loadingIndicator.style.display = 'none'
    emailInput.value = ''
    passwordInput.value = ''
  }
}

const queryDomElements = (): TaskpaneDOM | null => {
  const get = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null

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
  const translationLang = get<HTMLSelectElement>('translation-lang')

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
    !actionSuccess ||
    !translationLang
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
    translationLang,
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
    /* ignore */
  }
}

const clearSession = (): void => {
  try {
    localStorage.removeItem('aurora_token')
    localStorage.removeItem('aurora_user')
  } catch {
    /* ignore */
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
      throw new Error(
        data?.user ? 'Erreur de connexion' : (data as { error?: string })?.error || 'Erreur de connexion'
      )
    }

    const token = data.token ?? 'session'
    const computedUserName = data.user?.name || email.split('@')[0]

    currentSession = { token, userName: computedUserName }
    saveSession(currentSession)
    showMainPanel()
  } catch (error: unknown) {
    showLoginError(error instanceof Error ? error.message : 'Erreur de connexion')
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
  dom.loginError.textContent = message
  dom.loginError.style.display = 'block'
}

const hideLoginError = (): void => {
  if (!dom) return
  dom.loginError.style.display = 'none'
}

const showActionError = (message: string): void => {
  if (!dom) return
  dom.actionError.textContent = message
  dom.actionError.style.display = 'block'
  dom.actionSuccess.style.display = 'none'
  setTimeout(() => {
    dom!.actionError.style.display = 'none'
  }, 5000)
}

const showActionSuccess = (message: string): void => {
  if (!dom) return
  dom.actionSuccess.textContent = message
  dom.actionSuccess.style.display = 'block'
  dom.actionError.style.display = 'none'
  setTimeout(() => {
    dom!.actionSuccess.style.display = 'none'
  }, 3000)
}

const setLoading = (loading: boolean): void => {
  if (!dom) return
  dom.loadingIndicator.style.display = loading ? 'flex' : 'none'
  document.querySelectorAll<HTMLButtonElement>('.aurora-action-btn').forEach((btn) => {
    btn.disabled = loading
  })
}

// ============ Logique alignée SaaS ============

const FULL_DOC_ACTIONS: AuroraAction[] = ['auto-format', 'fix-errors', 'improve-spacing']
const SELECTION_REQUIRED_ACTIONS: AuroraAction[] = ['improve-paragraph', 'smart-heading', 'translate-selection']

const handleAIAction = async (action: AuroraAction, insertMode: InsertMode): Promise<void> => {
  if (!dom) return
  if (!currentSession) {
    showActionError('Veuillez vous connecter avant de lancer une action')
    return
  }

  setLoading(true)
  dom.actionError.style.display = 'none'
  dom.actionSuccess.style.display = 'none'

  try {
    const { content, useSelection } = await getContentForAction(action)

    if (SELECTION_REQUIRED_ACTIONS.includes(action) && !useSelection) {
      throw new Error('Veuillez sélectionner le texte.')
    }
    if (
      !content &&
      action !== 'continue-writing' &&
      action !== 'suggest-ideas' &&
      action !== 'generate-table'
    ) {
      throw new Error('Le document est vide. Écrivez du texte ou sélectionnez une partie.')
    }

    const theme =
      action === 'translate' || action === 'translate-selection'
        ? dom.translationLang.value
        : DEFAULT_THEME

    const response = await fetch(`${API_BASE_URL}/api/ai/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentSession.token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        action,
        content: content || '',
        selection: content || '',
        theme,
        documentType: DEFAULT_DOC_TYPE,
      }),
    })

    let data: { error?: string; result?: string } = {}
    try {
      data = await response.json()
    } catch {
      if (!response.ok) {
        throw new Error('Erreur serveur. Vérifiez votre connexion ou réessayez plus tard.')
      }
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Erreur lors du traitement')
    }

    if (data.result) {
      await replaceContent(data.result, useSelection, insertMode)
      showActionSuccess('Terminé !')
    }
  } catch (error: unknown) {
    showActionError(error instanceof Error ? error.message : 'Erreur inconnue')
  } finally {
    setLoading(false)
  }
}

const getContentForAction = async (
  action: AuroraAction
): Promise<{ content: string; useSelection: boolean }> => {
  const selectedText = await getSelectedText()
  const hasSelection = Boolean(selectedText && selectedText.trim())

  if (hasSelection) {
    return { content: selectedText, useSelection: true }
  }

  if (FULL_DOC_ACTIONS.includes(action)) {
    const bodyText = await getDocumentBodyText()
    return { content: bodyText, useSelection: false }
  }

  if (action === 'continue-writing' || action === 'suggest-ideas' || action === 'generate-table') {
    const bodyText = await getDocumentBodyText()
    return { content: bodyText, useSelection: false }
  }

  if (action === 'translate') {
    const bodyText = await getDocumentBodyText()
    return { content: bodyText, useSelection: false }
  }

  if (SELECTION_REQUIRED_ACTIONS.includes(action)) {
    return { content: '', useSelection: false }
  }

  const bodyText = await getDocumentBodyText()
  return { content: bodyText, useSelection: false }
}

const getSelectedText = async (): Promise<string> =>
  Word.run(async (context) => {
    const selection = context.document.getSelection()
    selection.load('text')
    await context.sync()
    return normalizeTextForApi(selection.text)
  })

const getDocumentBodyText = async (): Promise<string> =>
  Word.run(async (context) => {
    const body = context.document.body
    const range = body.getRange()
    range.load('text')
    await context.sync()
    let text = normalizeTextForApi(range.text || '')
    if (!text.trim()) {
      const paragraphs = body.paragraphs
      paragraphs.load('items')
      await context.sync()
      const ranges: Word.Range[] = []
      for (let i = 0; i < paragraphs.items.length; i++) {
        const r = paragraphs.items[i].getRange()
        r.load('text')
        ranges.push(r)
      }
      await context.sync()
      text = normalizeTextForApi(ranges.map((r) => r.text).join('\n'))
    }
    return text
  })

const normalizeTextForApi = (text: string): string => {
  if (!text) return ''
  return text.replace(/\u2019/g, "'").replace(/\u2018/g, "'")
}

/** Nettoie la réponse IA : enlève blocs markdown et extrait le fragment HTML pour insertion Word */
function normalizeAiResultForWord(raw: string): string {
  if (!raw || !raw.trim()) return raw
  let s = raw
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
  const firstBracket = s.indexOf('<')
  const lastBracket = s.lastIndexOf('>')
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    s = s.slice(firstBracket, lastBracket + 1)
  }
  return s
}

/** Remplace ou insère le contenu selon le mode. HTML toujours inséré via insertHtml pour un rendu correct. */
const replaceContent = async (
  newText: string,
  useSelection: boolean,
  insertMode: InsertMode
): Promise<void> =>
  Word.run(async (context) => {
    const content = normalizeAiResultForWord(newText)
    const isHtml = /<[a-z][\s\S]*>/i.test(content)

    if (insertMode === 'append') {
      const body = context.document.body
      if (isHtml) {
        body.insertHtml(content, Word.InsertLocation.end)
      } else {
        body.insertText(content, Word.InsertLocation.end)
      }
    } else if (insertMode === 'insert') {
      const selection = context.document.getSelection()
      if (isHtml) {
        selection.insertHtml(content, Word.InsertLocation.end)
      } else {
        selection.insertText(content, Word.InsertLocation.end)
      }
    } else {
      if (useSelection) {
        const selection = context.document.getSelection()
        if (isHtml) {
          selection.insertHtml(content, Word.InsertLocation.replace)
        } else {
          selection.insertText(content, Word.InsertLocation.replace)
        }
      } else {
        const body = context.document.body
        if (isHtml) {
          body.clear()
          body.insertHtml(content, Word.InsertLocation.end)
        } else {
          body.clear()
          body.insertText(content, Word.InsertLocation.end)
        }
      }
    }
    await context.sync()
  })
