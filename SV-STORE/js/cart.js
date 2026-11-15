// ===== cart.js — корзина =====
// Добавление, удаление, изменение количества, очистка корзины и её отображение в боковой панели.

/* ===== Корзина ===== */
function addToCart(id, qty = 1, btn) {
  const p = findProduct(id);
  const item = cart.find(i => i.id === +id);
  if (item) item.qty += qty;
  else cart.push({ id: +id, qty });
  saveCart(); updateCart();
  if (btn) { btn.classList.remove("done"); void btn.offsetWidth; btn.classList.add("done"); }
  showToast(`${p.name} добавлен в корзину`);
}
function changeQty(id, delta) {
  const item = cart.find(i => i.id === +id);
  if (!item) return;
  item.qty += delta;
  cart = cart.filter(i => i.qty > 0);
  saveCart(); updateCart();
}
function clearCart() {
  if (!cart.length) { showToast("Корзина уже пуста"); return; }
  cart = []; saveCart(); updateCart();
  showToast("Корзина очищена");
}
const cartLines = () => cart.map(i => ({ ...findProduct(i.id), qty: i.qty })).filter(x => x.name);
const cartTotal = () => cartLines().reduce((s, p) => s + p.price * p.qty, 0);
 
function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = $("#cartCount");
  countEl.textContent = count;
  countEl.classList.toggle("show", count > 0);
  $("#cartTotal").textContent = money(cartTotal());
  const lines = cartLines();
  $("#cartItems").innerHTML = lines.length ? lines.map(p => `
    <div class="cart-item">
      ${p.img ? `<img class="cart-photo" src="${esc(p.img)}" alt="${esc(p.name)}" onerror="this.outerHTML='<div class=&quot;cart-swatch&quot; style=&quot;background:radial-gradient(circle,${p.c1},${p.c2})&quot;></div>'">` : `<div class="cart-swatch" style="background:radial-gradient(circle,${p.c1},${p.c2})"></div>`}
      <div class="cart-info">
        <b>${esc(p.name)}</b>
        <small class="cart-desc">${esc(p.desc)}</small>
        <span class="price-s">${money(p.price)} × ${p.qty} = ${money(p.price * p.qty)}</span>
        <div class="qty"><button data-minus="${p.id}">−</button><span>${p.qty}</span><button data-plus="${p.id}">+</button></div>
      </div>
    </div>`).join("")
    : `<p class="cart-empty">Корзина пока пуста.<br>Самое время что-нибудь выбрать ✨</p>`;
  $("#clearCart").style.display = lines.length ? "" : "none";
  updateAccountBtn();
}
function openCart(open) {
  $("#drawer").classList.toggle("open", open);
  $("#overlay").classList.toggle("open", open);
}
function updateAccountBtn() {
  const u = currentUser();
  $("#accountBtn").innerHTML = u
    ? `<span class="avatar">${esc(u.name[0].toUpperCase())}</span>${esc(u.name.split(" ")[0])}`
    : "Войти";
}
 
