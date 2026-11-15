// ===== utils.js — вспомогательные функции и хранилище =====
// Работа с localStorage (сохранение корзины, аккаунтов, фильтров), форматирование цены, тема, уведомления.

/* ===== Хранилище ===== */
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  del(key) { try { localStorage.removeItem(key); } catch {} }
};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => n.toLocaleString("ru-RU") + " ₴";
const findProduct = id => PRODUCTS.find(p => p.id === +id);
const discount = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
const mediaHTML = (p, cls = "") => `
  <div class="media ${cls}" style="--c1:${p.c1};--c2:${p.c2}">
    ${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" onerror="this.remove()">` : ""}
    <span class="ph">${esc(p.label)}</span>
  </div>`;
const ARROW_LEFT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
const SEARCH_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;
 
let cart = store.get("sv_cart", []);
let users = store.get("sv_users", {});
let sessionEmail = store.get("sv_session", null);
let build = store.get("sv_build", { budget: 5000, cats: DEFAULT_BUILD_CATS });
let filterState = store.get("sv_filters", { cat: "all", q: "", min: null, max: null });
let authTab = "login";
let pendingScroll = null;
let savedScrollY = null;
let lastBuild = null;
let particleRAF = null;
let productsReady = false;
const productsPromise = new Promise(res => setTimeout(() => { productsReady = true; res(); }, 1100));
 
const saveCart = () => store.set("sv_cart", cart);
const saveUsers = () => store.set("sv_users", users);
const saveBuild = () => store.set("sv_build", build);
const saveFilters = () => store.set("sv_filters", filterState);
const currentUser = () => (sessionEmail && users[sessionEmail]) ? users[sessionEmail] : null;
 
/* ===== Тема ===== */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $("#themeBtn").textContent = t === "light" ? "☀️" : "🌙";
  try { localStorage.setItem("sv_theme", t); } catch {}
}
$("#themeBtn").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});
 
/* ===== Уведомления ===== */
const TOAST_MS = 3000;
const TOAST_MAX = 4;
function showToast(text) {
  const wrap = $("#toasts");
  while (wrap.children.length >= TOAST_MAX) wrap.firstElementChild.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="toast-icon">✓</span><span class="toast-text">${esc(text)}</span><span class="toast-bar"></span>`;
  wrap.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
  setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hide");
    setTimeout(() => el.remove(), 450);
  }, TOAST_MS);
}
 
