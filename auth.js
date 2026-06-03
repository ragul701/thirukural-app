// Simple client-side auth for static pages (demo purpose only).
const AUTH_KEY = "thirukural_auth_v1";

function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  const auth = getAuth();
  return !!(auth && auth.user);
}

function login(user) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ user, loggedInAt: Date.now() })
  );
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

function requireLogin(options = {}) {
  const {
    loginPage = "login.html",
    allowOnLoginPage = true,
    current = location.pathname.split("/").pop() || "index.html",
  } = options;

  if (allowOnLoginPage && current.toLowerCase() === loginPage.toLowerCase()) {
    return;
  }

  if (!isLoggedIn()) {
    const returnTo = encodeURIComponent(current);
    location.replace(`${loginPage}?returnTo=${returnTo}`);
  }
}

function redirectIfLoggedIn(options = {}) {
  const {
    defaultTo = "index.html",
    current = location.pathname.split("/").pop() || "index.html",
  } = options;

  if (isLoggedIn() && current.toLowerCase() === "login.html") {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo");
    location.replace(returnTo ? decodeURIComponent(returnTo) : defaultTo);
  }
}

