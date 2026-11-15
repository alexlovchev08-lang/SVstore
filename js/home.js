// ===== home.js — главная страница =====
// Шапка с заголовком, каталог, конструктор, блок «О магазине», доставка и оплата, FAQ, футер.

/* ===== Страницы ===== */
function viewHome() {
  $("#app").innerHTML = `
  <header class="hero" id="top">
    <canvas id="particles"></canvas>
    <div class="hero-blob blob-1"></div>
    <div class="hero-blob blob-2"></div>
    <div class="hero-content">
      <span class="tag">Новая коллекция 2026 · Доставка по Украине</span>
      <h1><span class="line"><span class="word">Идеальный</span> <span class="word">воркспейс.</span></span></h1>
      <p>Клавиатуры, мыши, хабы, подставки и всё, что превращает рабочий стол в <span class="hl">место, где хочется находиться</span>.</p>
      <div class="btns">
        <a href="#/" data-go="catalog" class="btn">Смотреть каталог</a>
        <a href="#/" data-go="builder" class="btn btn-ghost">Собрать сетап по бюджету</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="orbit"></div><div class="orbit two"></div>
      <div class="core"><span>SV</span></div>
      <div class="chip chip-1">⌨️ Механика</div>
      <div class="chip chip-2">🔌 USB-C 100W</div>
      <div class="chip chip-3">🖥️ 4K HDMI</div>
    </div>
  </header>
 
  <div class="marquee"><div class="marquee-track">${
    Array(2).fill(["Мыши","Клавиатуры","Хабы","Подставки","Накопители","Кабели"]
      .map(w => `<span>${w}</span>`).join("")).join("")
  }</div></div>
 
  <section id="popular-section">
    <div class="section-head"><span class="eyebrow">Популярное</span><h2 class="head-lg">Чаще всего выбирают</h2></div>
    <div class="grid" id="popular">${skeletonHTML(3)}</div>
  </section>
 
  <section id="catalog">
    <div class="section-head"><span class="eyebrow">Каталог</span><h2 class="head-lg">Выбери своё</h2></div>
    <div class="toolbar">
      <div class="search">
        ${SEARCH_ICON}
        <input id="search" type="search" placeholder="Найти: мышь, клавиатура, HDMI…" autocomplete="off" aria-label="Поиск по товарам">
        <div class="search-dd" id="searchDD"></div>
      </div>
      <div class="price-range">
        <input id="pMin" type="number" min="0" placeholder="от ₴" aria-label="Цена от">
        <span>—</span>
        <input id="pMax" type="number" min="0" placeholder="до ₴" aria-label="Цена до">
      </div>
    </div>
    <div class="filters">
      <button class="filter" data-cat="all">Все</button>
      ${CATEGORIES.map(c => `<button class="filter" data-cat="${c.key}">${c.title}</button>`).join("")}
    </div>
    <div class="result-meta" id="resultMeta"></div>
    <div class="grid" id="grid">${skeletonHTML()}</div>
  </section>
 
  <section id="builder">
    <div class="section-head"><span class="eyebrow">Конструктор сетапа</span></div>
    <div class="builder">
      <div class="builder-box">
        <h2>Сколько хотите потратить?</h2>
        <p>Введите сумму в гривнах и выберите категории. Подберём товары, которые уложатся в бюджет. Выбор сохраняется.</p>
        <div class="budget-input">
          <input type="number" id="budgetInput" value="${build.budget}" min="0" step="100" aria-label="Бюджет">
          <span>₴</span>
        </div>
        <div class="presets">
          ${[1000, 2000, 3000, 5000].map(v => `<button data-budget="${v}">${money(v)}</button>`).join("")}
        </div>
        <label>Что включить</label>
        <div class="cats" id="catChecks">
          ${BUILD_ORDER.map(k => `<label><input type="checkbox" value="${k}" ${build.cats.includes(k) ? "checked" : ""}>${CAT_TITLE[k]}</label>`).join("")}
        </div>
      </div>
      <div class="builder-box" id="buildResult"></div>
    </div>
  </section>
 
  <section id="why">
    <div class="section-head"><span class="eyebrow">О магазине</span><h2 class="head-lg">Без компромиссов</h2></div>
    <p class="about-lead">SV — магазин аксессуаров для ПК и ноутбуков. Подбираем клавиатуры, мыши, хабы, подставки, накопители и кабели, которые делают работу и игры удобнее. Отдельное внимание — кастомным клавиатурам: каждая сборка проверяется перед отправкой и аккуратно упаковывается.</p>
    <div class="features">
      <div class="feature"><div class="num" data-count="2">2</div><h4>года гарантии</h4><p>На все устройства. Заменим или вернём деньги без лишних вопросов.</p></div>
      <div class="feature"><div class="num" data-count="48">48</div><h4>часов доставки</h4><p>По Киеву, Одессе, Львову и Харькову. Самовывоз в день заказа.</p></div>
      <div class="feature"><div class="num" data-count="14">14</div><h4>дней на возврат</h4><p>Вернём товар, если он вам не подошёл, без лишних вопросов.</p></div>
    </div>
  </section>
 
  <section id="delivery">
    <div class="section-head"><span class="eyebrow">Информация</span><h2 class="head-lg">Доставка та оплата</h2></div>
    <p class="info-intro">Ми прагнемо зробити процес покупки максимально простим, швидким та зручним для кожного клієнта.</p>
    <div class="info-grid">
      <div class="info-card">
        <h3>🚚 Доставка</h3>
        <h4 class="info-sub">Нова пошта</h4>
        <ul>
          <li>Доставка по всій території України.</li>
          <li>Термін відправлення замовлення — 1–3 робочі дні.</li>
          <li>Доставка у відділення, поштомат або кур'єром.</li>
          <li>Після відправлення ви отримуєте номер ТТН для відстеження посилки.</li>
          <li>Вартість доставки розраховується за тарифами перевізника.</li>
        </ul>
        <h4 class="info-sub">Укрпошта</h4>
        <ul>
          <li>Доставка по всій Україні.</li>
          <li>Відправлення замовлення протягом 1–2 робочих днів.</li>
          <li>Вартість доставки відповідно до тарифів перевізника.</li>
        </ul>
      </div>
      <div class="info-card">
        <h3>💳 Способи оплати</h3>
        <p>Для вашої зручності доступні такі способи оплати:</p>
        <ul>
          <li>Оплата карткою — Visa або Mastercard.</li>
          <li>Післяплата — оплата під час отримання замовлення.</li>
          <li>Банківський переказ — оплата на картку перед відправленням.</li>
        </ul>
      </div>
      <div class="info-card">
        <h3>⌨️ Кастомні клавіатури</h3>
        <p>Ми приділяємо особливу увагу якості кожної збірки.</p>
        <ul>
          <li>Кожна клавіатура проходить перевірку перед відправленням.</li>
          <li>Товари надійно пакуються для безпечного транспортування.</li>
          <li>Термін виготовлення індивідуальних збірок узгоджується окремо.</li>
        </ul>
      </div>
      <div class="info-card">
        <h3>📦 Важлива інформація</h3>
        <ul>
          <li>Термін відправлення стандартних замовлень становить 1–3 робочих дні.</li>
          <li>Після відправлення ви отримуєте ТТН.</li>
          <li>Під час отримання рекомендуємо перевіряти цілісність упаковки.</li>
          <li>Якщо виникли питання, наша служба підтримки допоможе вам.</li>
        </ul>
      </div>
    </div>
  </section>
 
  <section id="faq">
    <div class="section-head"><span class="eyebrow">FAQ</span><h2 class="head-lg">Вопросы и ответы</h2></div>
    <div class="faq">
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Сколько идёт доставка?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>Новая Почта по Украине — 1–3 рабочих дня. Курьер по Одессе — на следующий день. Самовывоз из магазина — в день заказа, если товар в наличии.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Какая гарантия на товары?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>На все товары — 2 года гарантии. Если обнаружен заводской дефект, заменим товар или вернём деньги.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Какая гарантия на кастомные клавиатуры?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>На кастомные клавиатуры, которые мы собираем под заказ, — 12 месяцев на сборку, пайку и плату. На свитчи и кейкапы действует гарантия производителя.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Сколько времени занимает сборка кастома?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>Обычно 7–14 рабочих дней, в зависимости от наличия деталей. Точную дату сообщим после подтверждения заказа.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Можно ли вернуть товар?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>Да, в течение 14 дней, если товар не использовался и сохранил товарный вид и упаковку.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false">Какие способы оплаты?<span class="faq-ico">+</span></button>
        <div class="faq-a"><div>Онлайн-оплата картой, наложенный платёж при получении на Новой Почте или оплата частями.</div></div>
      </div>
    </div>
  </section>
 
  <footer>
    <div class="footer-grid">
      <div><span class="logo">SV</span><p>Аксессуары для ПК и ноутбуков, которые делают работу и игры удобнее.</p></div>
      <div><h5>Магазин</h5><a href="#/" data-go="catalog">Каталог</a><a href="#/" data-go="builder">Конструктор</a><a href="#/" data-go="why">О нас</a></div>
      <div><h5>Покупателям</h5><a href="#/account">Личный кабинет</a><a href="#/checkout">Оформление заказа</a><a href="#/" data-go="delivery">Доставка и оплата</a></div>
    </div>
    <p class="copy">© 2026 SV. Все права защищены.</p>
  </footer>`;
 
  syncToolbar();
  renderBuilderResult();
  initParticles();
  document.querySelectorAll(".feature").forEach(el => getObserver().observe(el));
  const paint = () => { renderGrid(); renderPopular(); };
  if (productsReady) paint(); else productsPromise.then(() => { if ($("#grid")) paint(); });
}
 
