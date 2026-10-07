const STORAGE_KEY = 'meterzero.session';

const DEMO_ACCOUNT = { username: 'demo', password: 'demo' };

export function signIn(username, password) {
  const ok = username.trim().toLowerCase() === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password;
  if (ok) localStorage.setItem(STORAGE_KEY, DEMO_ACCOUNT.username);
  return ok;
}

export function signOut() {
  localStorage.removeItem(STORAGE_KEY);
}

export function currentUser() {
  return localStorage.getItem(STORAGE_KEY);
}
