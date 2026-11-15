// ===== main.js — запуск сайта =====
// Эффекты, роутер (переключение страниц по #), обработка кликов и формы, живой поиск, таймер акции.
// Этот файл подключается последним, потому что сразу запускает сайт.

/* ===== Эффекты ===== */
function animateCount(el) {
  const target = +el.dataset.count, dur = 1400, start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function initParticles() {
  if (particleRAF) cancelAnimationFrame(particleRAF);
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, pts = [];
  const resize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: Math.min(90, Math.floor(w * h / 15000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.8 + .4
    }));
  };
  resize();
  const mouse = { x: -999, y: -999 };
  canvas.parentElement.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  const frame = () => {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, w, h);
    const light = document.documentElement.dataset.theme === "light";
    const dotColor = light ? "rgba(8,145,178,.6)" : "rgba(0,229,255,.7)";
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 120) * (light ? .5 : 1)})`; ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    });
    particleRAF = requestAnimationFrame(frame);
  };
  window.addEventListener("resize", resize);
  frame();
}
 
/* ===== Роутер ===== */
function route() {
  const h = location.hash.replace(/^#/, "") || "/";
  openCart(false);
  if (h.startsWith("/product/")) viewProduct(h.split("/")[2]);
  else if (h === "/account") viewAccount();
  else if (h === "/checkout") viewCheckout();
  else viewHome();
 
  updateCart();
  if (!h.startsWith("/product/") && savedScrollY !== null) {
    const y = savedScrollY; savedScrollY = null;
    requestAnimationFrame(() => window.scrollTo(0, y));
  } else if (pendingScroll) {
    const id = pendingScroll; pendingScroll = null;
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
  } else {
    window.scrollTo(0, 0);
  }
}
 
/* ===== События ===== */
document.addEventListener("click", e => {
  const t = e.target;
 
  if (t.closest("#backBtn")) { e.preventDefault(); location.hash = "#/"; return; }
 
  const faqQ = t.closest(".faq-q");
  if (faqQ) {
    const item = faqQ.parentElement;
    const open = item.classList.toggle("open");
    faqQ.setAttribute("aria-expanded", open);
    return;
  }
 
  if (t.closest("[data-dd-all]")) {
    closeSuggest();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (!t.closest(".search")) closeSuggest();
 
  const go = t.closest("[data-go]");
  if (go) {
    e.preventDefault();
    const target = go.dataset.go;
    if (target === "top") {
      if (location.hash !== "#/" && location.hash !== "") location.hash = "#/";
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (location.hash === "" || location.hash === "#/") {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    } else {
      pendingScroll = target;
      location.hash = "#/";
    }
    return;
  }
 
  const add = t.closest("[data-add]");
  if (add) { e.stopPropagation(); addToCart(add.dataset.add, 1, add); return; }
 
  const pc = t.closest("[data-go-product]");
  if (pc) {
    savedScrollY = window.scrollY;
    location.hash = "#/product/" + pc.dataset.goProduct;
    return;
  }
 
  if (t.closest("[data-reset]")) {
    filterState = { cat: "all", q: "", min: null, max: null };
    saveFilters(); syncToolbar(); renderGrid();
    return;
  }
 
  const f = t.closest(".filter");
  if (f) {
    filterState.cat = f.dataset.cat;
    saveFilters(); syncToolbar(); renderGrid();
    return;
  }
 
  const bud = t.closest("[data-budget]");
  if (bud) {
    build.budget = +bud.dataset.budget;
    $("#budgetInput").value = build.budget;
    saveBuild(); renderBuilderResult();
    return;
  }
 
  if (t.closest("#addBuild") && lastBuild) {
    lastBuild.picks.forEach(p => addToCart(p.id));
    openCart(true);
    return;
  }
 
  const pd = t.closest("[data-pd]");
  if (pd) {
    pdQty = Math.max(1, pdQty + +pd.dataset.pd);
    $("#pdQty").textContent = pdQty;
    return;
  }
  if (t.closest("#pdAdd")) { addToCart(location.hash.split("/")[2], pdQty); return; }
  if (t.closest("#pdBuy")) { addToCart(location.hash.split("/")[2], pdQty); location.hash = "#/checkout"; return; }
 
  const tab = t.closest("[data-tab]");
  if (tab) { authTab = tab.dataset.tab; viewAccount(); return; }
 
  if (t.closest("#logoutBtn")) {
    sessionEmail = null; store.del("sv_session");
    showToast("Вы вышли из аккаунта");
    viewAccount(); updateAccountBtn();
    return;
  }
 
  if (t.closest("#clearCart")) { clearCart(); return; }
 
  const m = t.closest("[data-minus]"), p = t.closest("[data-plus]");
  if (m) changeQty(m.dataset.minus, -1);
  if (p) changeQty(p.dataset.plus, 1);
});
 
document.addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("formMsg");
  const data = Object.fromEntries(new FormData(form));
 
  if (form.id === "regForm") {
    const email = data.email.trim().toLowerCase();
    if (users[email]) { msg.className = "msg err"; msg.textContent = "Аккаунт с таким email уже есть."; return; }
    users[email] = { name: data.name.trim(), password: data.password, orders: [], phone: "" };
    saveUsers();
    sessionEmail = email; store.set("sv_session", email);
    showToast("Аккаунт создан. Добро пожаловать!");
    viewAccount(); updateAccountBtn();
    return;
  }
 
  if (form.id === "loginForm") {
    const email = data.email.trim().toLowerCase();
    if (!users[email] || users[email].password !== data.password) { msg.className = "msg err"; msg.textContent = "Неверный email или пароль."; return; }
    sessionEmail = email; store.set("sv_session", email);
    showToast("Вы вошли в аккаунт");
    viewAccount(); updateAccountBtn();
    return;
  }
 
  if (form.id === "checkoutForm") {
    if (!/^\+?\d[\d\s()-]{8,}$/.test(data.phone.trim())) { msg.className = "msg err"; msg.textContent = "Проверьте номер телефона."; return; }
    const lines = cartLines();
    const subtotal = cartTotal();
    const delivery = subtotal >= 2000 ? 0 : 150;
    const order = {
      id: "SV-" + Date.now().toString().slice(-7),
      date: new Date().toLocaleDateString("ru-RU"),
      status: "Принят",
      total: subtotal + delivery,
      items: lines.map(p => ({ id: p.id, name: p.name, qty: p.qty, price: p.price })),
      contact: { name: data.name, phone: data.phone, city: data.city, address: data.address, delivery: data.delivery, pay: data.pay }
    };
    const u = currentUser();
    if (u) {
      u.orders = [order, ...(u.orders || [])];
      if (!u.phone) u.phone = data.phone;
      saveUsers();
    } else {
      store.set("sv_guest_orders", [order, ...store.get("sv_guest_orders", [])]);
    }
    cart = []; saveCart(); updateCart();
    showSuccess(order);
  }
});
 
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id === "search") { filterState.q = e.target.value; saveFilters(); renderGrid(); renderSuggest(); }
  if (id === "pMin" || id === "pMax") {
    const v = e.target.value === "" ? null : Math.max(0, +e.target.value);
    if (id === "pMin") filterState.min = v; else filterState.max = v;
    saveFilters(); renderGrid();
  }
  if (id === "budgetInput") {
    build.budget = Math.max(0, +e.target.value || 0);
    saveBuild(); renderBuilderResult();
  }
});
document.addEventListener("change", e => {
  if (e.target.closest && e.target.closest("#catChecks")) {
    build.cats = [...document.querySelectorAll("#catChecks input:checked")].map(i => i.value);
    saveBuild(); renderBuilderResult();
  }
});
 
document.addEventListener("mousemove", e => {
  const dot = $("#cursorDot"), glow = $("#cursorGlow");
  dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
  glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px";
  const card = e.target.closest && e.target.closest(".card");
  if (card) {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", (x * 100) + "%");
    card.style.setProperty("--my", (y * 100) + "%");
    card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 14}deg) translateY(-6px)`;
  }
});
document.addEventListener("mouseout", e => {
  const card = e.target.closest && e.target.closest(".card");
  if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
});
document.addEventListener("mouseover", e => {
  const el = e.target.closest && e.target.closest("a, button");
  $("#cursorDot").style.transform = el ? "translate(-50%,-50%) scale(2.5)" : "translate(-50%,-50%) scale(1)";
});
 
$("#cartBtn").onclick = () => openCart(true);
$("#closeCart").onclick = () => openCart(false);
$("#overlay").onclick = () => openCart(false);
$("#drawerCheckout").addEventListener("click", () => openCart(false));
 
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  $("#progress").style.width = (h > 0 ? scrollY / h * 100 : 0) + "%";
  $("#nav").classList.toggle("scrolled", scrollY > 40);
}, { passive: true });
 
window.addEventListener("hashchange", route);
 
/* ===== Живой поиск: подсказки с миниатюрами и ценами ===== */
function renderSuggest() {
  const box = document.getElementById("searchDD");
  if (!box) return;
  const q = filterState.q.trim().toLowerCase();
  if (!q) { closeSuggest(); return; }
  const list = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || CAT_TITLE[p.cat].toLowerCase().includes(q));
  const top = list.slice(0, 5);
  box.innerHTML = top.length
    ? top.map(p => `
        <a class="dd-item" href="#/product/${p.id}">
          <div class="dd-thumb" style="--c1:${p.c1};--c2:${p.c2}">
            ${p.img ? `<img src="${esc(p.img)}" alt="" onerror="this.remove()">` : ""}
            <span>${esc(p.label)}</span>
          </div>
          <div class="dd-info"><b>${esc(p.name)}</b><small>${CAT_TITLE[p.cat]}</small></div>
          <div class="dd-price">${money(p.price)}</div>
        </a>`).join("") + (list.length > 5 ? `<div class="dd-more" data-dd-all>Показать все (${list.length}) в каталоге</div>` : "")
    : `<div class="dd-empty">Ничего не найдено по запросу «${esc(filterState.q)}»</div>`;
  box.classList.add("open");
}
function closeSuggest() {
  const box = document.getElementById("searchDD");
  if (box) box.classList.remove("open");
}
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSuggest(); });
document.addEventListener("focusin", e => { if (e.target.id === "search" && filterState.q.trim()) renderSuggest(); });
 
/* ===== Промо-плашка: обратный отсчёт ===== */
const PROMO_KEY = "sv_promo_end";
const PROMO_DURATION_S = 2 * 3600 + 14 * 60 + 59; // длительность акции, секунд — меняйте здесь
function initPromo() {
  const promo = document.getElementById("promo");
  if (!promo) return;
  let end = store.get(PROMO_KEY, null);
  if (!end || end < Date.now()) { end = Date.now() + PROMO_DURATION_S * 1000; store.set(PROMO_KEY, end); }
  const pad = n => String(n).padStart(2, "0");
  let timer = null;
  const tick = () => {
    const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
    if (left <= 0) {
      clearInterval(timer);
      promo.remove();
      document.body.classList.add("no-promo");
      return;
    }
    document.getElementById("promoTime").textContent =
      `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left % 3600 / 60))}:${pad(left % 60)}`;
  };
  tick();
  timer = setInterval(tick, 1000);
}
 
initPromo();
applyTheme(document.documentElement.dataset.theme || "dark");
updateAccountBtn();
route();
