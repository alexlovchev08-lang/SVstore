// ===== product.js — страница одного товара =====
// Фото, описание, характеристики, кнопки «В корзину» и «Купить сейчас», похожие товары.

let pdQty = 1;
function viewProduct(id) {
  const p = findProduct(id);
  if (!p) { $("#app").innerHTML = `<div class="page"><h2>Товар не найден</h2><p style="margin-top:20px"><a class="btn btn-sm" href="#/">В каталог</a></p></div>`; return; }
 
  if (!productsReady) {
    $("#app").innerHTML = `
    <div class="page">
      <div class="skel" style="width:160px;height:42px;border-radius:999px;margin-bottom:28px"></div>
      <div class="pd">
        <div class="skel" style="height:500px;border-radius:32px"></div>
        <div style="display:grid;gap:16px">
          <div class="skel" style="height:14px;width:30%"></div>
          <div class="skel" style="height:36px;width:90%"></div>
          <div class="skel" style="height:36px;width:70%"></div>
          <div class="skel" style="height:16px;width:95%;margin-top:14px"></div>
          <div class="skel" style="height:44px;width:40%;margin-top:20px"></div>
        </div>
      </div>
    </div>`;
    const hash = location.hash;
    productsPromise.then(() => { if (location.hash === hash) viewProduct(id); });
    return;
  }
 
  bumpView(p.id);
  pdQty = 1;
 
  const similar = PRODUCTS.filter(x => x.id !== p.id)
    .sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 3);
  const views = getViews();
  const frequent = PRODUCTS.filter(x => x.id !== p.id && views[x.id])
    .sort((a, b) => (views[b.id] || 0) - (views[a.id] || 0)).slice(0, 3);
  const frequentFallback = frequent.length ? frequent : [...PRODUCTS].filter(x => x.id !== p.id).sort((a, b) => popularity(b) - popularity(a)).slice(0, 3);
 
  $("#app").innerHTML = `
  <div class="page">
    <button class="back" id="backBtn">${ARROW_LEFT} Назад к каталогу</button>
    <div class="crumbs"><a href="#/">Главная</a> / <a href="#/" data-go="catalog">${CAT_TITLE[p.cat]}</a> / ${esc(p.name)}</div>
    <div class="pd">
      ${mediaHTML(p, "pd-media")}
      <div>
        <span class="eyebrow">${CAT_TITLE[p.cat]}</span>
        <h1>${esc(p.name)}</h1>
        <p class="lead">${esc(p.desc)}</p>
        <div class="price">${money(p.price)}${p.old ? `<small>${money(p.old)}</small><span class="save">−${money(p.old - p.price)}</span>` : ""}</div>
        <div class="buy-row">
          <div class="qty-box">
            <button data-pd="-1" aria-label="Меньше">−</button>
            <span id="pdQty">1</span>
            <button data-pd="1" aria-label="Больше">+</button>
          </div>
          <button class="btn" id="pdAdd" style="flex:1">В корзину</button>
          <button class="btn btn-ghost" id="pdBuy">Купить сейчас</button>
        </div>
        <div class="perks">
          <div>Бесплатная доставка от 2 000 ₴</div>
          <div>Гарантия 2 года</div>
          <div>Возврат в течение 14 дней</div>
        </div>
      </div>
    </div>
 
    <div class="specs-wrap">
      <div class="specs">
        <h3>Характеристики</h3>
        ${p.specs.map(([k, v]) => `<div class="row"><span>${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}
      </div>
      <div class="about">
        <h3>Описание</h3>
        <p>${esc(p.desc)} Перед отправкой каждый товар проверяем. В комплекте инструкция и гарантийный талон.</p>
      </div>
    </div>
 
    <div class="rail">
      <h3>Похожие товары</h3>
      <div class="grid">${similar.map((x, i) => cardHTML(x, i, "in")).join("")}</div>
    </div>
    <div class="rail">
      <h3>${frequent.length ? "Часто смотрят" : "Популярное"}</h3>
      <div class="grid">${frequentFallback.map((x, i) => cardHTML(x, i, "in")).join("")}</div>
    </div>
  </div>`;
}
 
