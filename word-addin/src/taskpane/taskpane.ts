/*
 * Aurora AI Word Add-in
 * Main taskpane logic for login and AI formatting
 */

/* global document, Office, Word */

// Configuration - Update this with your production API URL
const API_BASE_URL = 'https://aurora-ai.vercel.app'; // Change to your deployed URL

// State
let authToken: string | null = null;
let userName: string | null = null;

// DOM Elements
let loginSection: HTMLElement;
let mainPanel: HTMLElement;
let emailInput: HTMLInputElement;
let passwordInput: HTMLInputElement;
let loginBtn: HTMLButtonElement;
let loginError: HTMLElement;
let logoutBtn: HTMLButtonElement;
let userNameEl: HTMLElement;
let loadingIndicator: HTMLElement;
let actionError: HTMLElement;
let actionSuccess: HTMLElement;

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    initializeApp();
  }
});

function initializeApp() {
  // Get DOM elements
  loginSection = document.getElementById('login-section') as HTMLElement;
  mainPanel = document.getElementById('main-panel') as HTMLElement;
  emailInput = document.getElementById('email') as HTMLInputElement;
  passwordInput = document.getElementById('password') as HTMLInputElement;
  loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginError = document.getElementById('login-error') as HTMLElement;
  logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  userNameEl = document.getElementById('user-name') as HTMLElement;
  loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;
  actionError = document.getElementById('action-error') as HTMLElement;
  actionSuccess = document.getElementById('action-success') as HTMLElement;

  // Event listeners
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);

  // Add action button listeners
  const actionBtns = document.querySelectorAll('.aurora-action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = (btn as HTMLElement).dataset.action;
      if (action) handleAIAction(action);
    });
  });

  // Check for stored session
  const storedToken = localStorage.getItem('aurora_token');
  const storedUser = localStorage.getItem('aurora_user');
  if (storedToken && storedUser) {
    authToken = storedToken;
    userName = storedUser;
    showMainPanel();
  }
}

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showLoginError('Veuillez remplir tous les champs');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Connexion...';
  hideLoginError();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur de connexion');
    }

    // Store session
    authToken = data.token || 'session';
    userName = data.user?.name || email.split('@')[0];
    localStorage.setItem('aurora_token', authToken!);
    localStorage.setItem('aurora_user', userName!);

    showMainPanel();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
    showLoginError(errorMessage);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Se connecter';
  }
}

function handleLogout() {
  authToken = null;
  userName = null;
  localStorage.removeItem('aurora_token');
  localStorage.removeItem('aurora_user');
  showLoginSection();
}

function showLoginSection() {
  loginSection.style.display = 'block';
  mainPanel.style.display = 'none';
  emailInput.value = '';
  passwordInput.value = '';
}

function showMainPanel() {
  loginSection.style.display = 'none';
  mainPanel.style.display = 'block';
  userNameEl.textContent = userName || 'Utilisateur';
}

function showLoginError(message: string) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function hideLoginError() {
  loginError.style.display = 'none';
}

function showActionError(message: string) {
  actionError.textContent = message;
  actionError.style.display = 'block';
  actionSuccess.style.display = 'none';
  setTimeout(() => { actionError.style.display = 'none'; }, 5000);
}

function showActionSuccess(message: string) {
  actionSuccess.textContent = message;
  actionSuccess.style.display = 'block';
  actionError.style.display = 'none';
  setTimeout(() => { actionSuccess.style.display = 'none'; }, 3000);
}

function setLoading(loading: boolean) {
  loadingIndicator.style.display = loading ? 'flex' : 'none';
  const btns = document.querySelectorAll('.aurora-action-btn') as NodeListOf<HTMLButtonElement>;
  btns.forEach(btn => btn.disabled = loading);
}

async function handleAIAction(action: string) {
  setLoading(true);
  actionError.style.display = 'none';
  actionSuccess.style.display = 'none';

  try {
    // Get selected text from Word
    const selectedText = await getSelectedText();

    if (!selectedText && action !== 'continue-writing') {
      throw new Error('Veuillez sélectionner du texte dans le document');
    }

    // Call Aurora AI API
    const response = await fetch(`${API_BASE_URL}/api/ai/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        action,
        content: selectedText,
        selection: selectedText,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du traitement');
    }

    // Insert result into Word
    if (data.result) {
      await replaceSelectedText(data.result);
      showActionSuccess('Texte mis à jour avec succès !');
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    showActionError(errorMessage);
  } finally {
    setLoading(false);
  }
}

async function getSelectedText(): Promise<string> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.load('text');
    await context.sync();
    return selection.text;
  });
}

async function replaceSelectedText(newText: string): Promise<void> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.insertText(newText, Word.InsertLocation.replace);
    await context.sync();
  });
}
