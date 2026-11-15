// ===== checkout.js — оформление заказа =====
// Форма доставки и оплаты, расчёт итога со скидкой, сохранение заказа.

function viewCheckout() {
  const lines = cartLines();
  if (!lines.length) {
    $("#app").innerHTML = `<div class="page"><div class="panel" style="max-width:600px;margin:0 auto;text-align:center">
      <h2 class="head-lg" style="font-size:1.6rem;margin-bottom:14px">Корзина пуста</h2>
      <p style="color:var(--muted);margin:0 auto 26px">Добавьте товары из каталога, чтобы оформить заказ.</p>
      <a href="#/" class="btn">Перейти в каталог</a></div></div>`;
    return;
  }
  const u = currentUser();
  const total = cartTotal();
  const delivery = total >= 2000 ? 0 : 150;
  $("#app").innerHTML = `
  <div class="page">
    <div class="split" style="align-items:start">
      <div class="panel">
        <span class="eyebrow">Оформление</span>
        <h2 class="head-lg" style="font-size:1.6rem;margin:14px 0 26px">Данные для заказа</h2>
        <form id="checkoutForm" class="form-grid">
          <div class="row2">
            <div><label>Имя и фамилия</label><input name="name" required value="${u ? esc(u.name) : ""}"></div>
            <div><label>Телефон</label><input name="phone" required placeholder="+380 …" value="${u && u.phone ? esc(u.phone) : ""}"></div>
          </div>
          <div><label>Город</label><input name="city" required value="Одесса"></div>
          <div><label>Адрес или отделение</label><input name="address" required placeholder="Улица, дом или № отделения"></div>
          <div>
            <label>Доставка</label>
            <div class="radio-group">
              <label><span>Нова Пошта, отделение</span><span><input type="radio" name="delivery" value="np" checked></span></label>
              <label><span>Курьер по городу</span><span><input type="radio" name="delivery" value="courier"></span></label>
              <label><span>Самовывоз</span><span><input type="radio" name="delivery" value="pickup"></span></label>
            </div>
          </div>
          <div>
            <label>Оплата</label>
            <div class="radio-group">
              <label><span>Онлайн-оплата картой</span><span><input type="radio" name="pay" value="card" checked></span></label>
              <label><span>Наложенный платёж</span><span><input type="radio" name="pay" value="cod"></span></label>
            </div>
          </div>
          <div class="msg" id="formMsg"></div>
          <button class="btn btn-block" type="submit">Подтвердить заказ · ${money(total + delivery)}</button>
          ${u ? "" : `<p class="note">Вы оформляете заказ без аккаунта. <a href="#/account" style="color:var(--cyan)">Войдите</a>, чтобы сохранить историю.</p>`}
        </form>
      </div>
      <div class="panel">
        <span class="eyebrow">Ваш заказ</span>
        <h2 class="head-lg" style="font-size:1.6rem;margin:14px 0 22px">${lines.length} поз.</h2>
        ${lines.map(p => `
          <div class="result-item">
            <div class="swatch" style="background:radial-gradient(circle,${p.c1},${p.c2})"></div>
            <div class="info"><b>${esc(p.name)}</b><small>${p.qty} шт.</small></div>
            <div class="p">${money(p.price * p.qty)}</div>
          </div>`).join("")}
        <div style="margin-top:20px">
          <div class="sum-line"><span>Товары</span><span>${money(lines.reduce((s, p) => s + p.base * p.qty, 0))}</span></div>
          <div class="sum-line"><span>Скидка 15%</span><span style="color:#22c55e">−${money(lines.reduce((s, p) => s + (p.base - p.price) * p.qty, 0))}</span></div>
          <div class="sum-line"><span>Доставка</span><span>${delivery ? money(delivery) : "Бесплатно"}</span></div>
          <div class="sum-line total"><span>Итого</span><span>${money(total + delivery)}</span></div>
        </div>
      </div>
    </div>
  </div>`;
}
 
function showSuccess(order) {
  $("#app").innerHTML = `
  <div class="page">
    <div class="panel success" style="max-width:640px;margin:0 auto">
      <div class="check">✓</div>
      <h2>Заказ оформлен!</h2>
      <p>Номер заказа <b>${order.id}</b>. Мы свяжемся с вами по телефону, чтобы подтвердить доставку.<br>Сумма: ${money(order.total)}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="#/" class="btn">В каталог</a>
        <a href="#/account" class="btn btn-ghost">Мои заказы</a>
      </div>
    </div>
  </div>`;
}
 
