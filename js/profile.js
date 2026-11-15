// ===== profile.js — личный кабинет (вход, регистрация, история заказов) =====
// Данные пользователей хранятся в браузере (localStorage), это не настоящая база данных.

function viewAccount() {
  const u = currentUser();
  if (u) {
    const orders = u.orders || [];
    $("#app").innerHTML = `
    <div class="page">
      <div class="split">
        <div class="panel">
          <div class="profile-card">
            <div class="big-avatar">${esc(u.name[0].toUpperCase())}</div>
            <div><h3>${esc(u.name)}</h3><p>${esc(sessionEmail)}</p></div>
          </div>
          <p style="color:var(--muted);margin-bottom:24px;line-height:1.7">Вход сохраняется на этом устройстве, пока вы не выйдете.</p>
          <button class="btn btn-ghost btn-block" id="logoutBtn">Выйти из аккаунта</button>
        </div>
        <div class="panel">
          <span class="eyebrow">История заказов</span>
          <h2 class="head-lg" style="font-size:1.5rem;margin:12px 0 24px">Ваши покупки</h2>
          ${orders.length ? orders.map(o => `
            <div class="order">
              <div class="order-head"><span>№ ${o.id}</span><span class="status">${o.status}</span></div>
              <small style="color:var(--muted)">${o.date} · ${money(o.total)}</small>
              <p style="margin-top:8px">${o.items.map(i => `${esc(i.name)} × ${i.qty}`).join("<br>")}</p>
            </div>`).join("")
          : `<p class="empty-note">Заказов пока нет. Самое время выбрать первый 🚀</p>`}
          <a href="#/" class="btn btn-ghost btn-sm" style="margin-top:10px">В каталог</a>
        </div>
      </div>
    </div>`;
    return;
  }
  $("#app").innerHTML = `
  <div class="page">
    <div class="split" style="max-width:1100px;margin:0 auto">
      <div class="panel">
        <span class="eyebrow">Аккаунт SV</span>
        <h2 class="head-lg" style="font-size:1.8rem;margin:14px 0 14px">Один вход — все заказы</h2>
        <p style="color:var(--muted);line-height:1.75">Сохраняйте данные для доставки, отслеживайте заказы и быстрее оформляйте покупки.</p>
      </div>
      <div class="panel">
        <div class="tabs">
          <button data-tab="login" class="${authTab === "login" ? "active" : ""}">Вход</button>
          <button data-tab="register" class="${authTab === "register" ? "active" : ""}">Регистрация</button>
        </div>
        ${authTab === "login" ? `
        <form id="loginForm" class="form-grid">
          <div><label>Email</label><input type="email" name="email" required placeholder="you@mail.com"></div>
          <div><label>Пароль</label><input type="password" name="password" required placeholder="••••••"></div>
          <div class="msg" id="formMsg"></div>
          <button class="btn btn-block" type="submit">Войти</button>
        </form>` : `
        <form id="regForm" class="form-grid">
          <div><label>Имя</label><input name="name" required placeholder="Как к вам обращаться"></div>
          <div><label>Email</label><input type="email" name="email" required placeholder="you@mail.com"></div>
          <div><label>Пароль (минимум 6 символов)</label><input type="password" name="password" required minlength="6"></div>
          <div class="msg" id="formMsg"></div>
          <button class="btn btn-block" type="submit">Создать аккаунт</button>
        </form>`}
      </div>
    </div>
  </div>`;
}
 
