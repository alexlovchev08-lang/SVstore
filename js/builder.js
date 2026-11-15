// ===== builder.js — конструктор сетапа по бюджету =====
// Подбирает товары из выбранных категорий так, чтобы сумма не превышала бюджет.

/* ===== Конструктор ===== */
function generateSetup(budget, cats) {
  const cheapest = c => Math.min(...PRODUCTS.filter(p => p.cat === c).map(p => p.price));
  const ordered = BUILD_ORDER.filter(c => cats.includes(c));
  let remaining = budget;
  const picks = [];
  const fairShare = budget / Math.max(ordered.length, 1) * 1.8;
  ordered.forEach((c, i) => {
    const reserve = ordered.slice(i + 1).reduce((s, k) => s + cheapest(k), 0);
    const fits = PRODUCTS.filter(p => p.cat === c && p.price <= remaining - reserve);
    if (!fits.length) return;
    const good = fits.filter(p => p.price <= fairShare).sort((a, b) => b.price - a.price);
    const pick = good[0] || fits.reduce((a, b) => (a.price < b.price ? a : b));
    picks.push(pick);
    remaining -= pick.price;
  });
  return { picks, left: remaining, skipped: ordered.filter(c => !picks.some(p => p.cat === c)) };
}
function renderBuilderResult() {
  const box = $("#buildResult");
  if (!box) return;
  const budget = Math.max(0, +build.budget || 0);
  if (!build.cats.length) { box.innerHTML = `<p class="empty-note">Выберите хотя бы одну категорию.</p>`; lastBuild = null; return; }
  const res = generateSetup(budget, build.cats);
  lastBuild = res;
  if (!res.picks.length) {
    box.innerHTML = `<p class="empty-note">Бюджет слишком маленький для выбранных категорий.<br>Увеличьте сумму.</p>`;
    return;
  }
  const spent = budget - res.left;
  const pct = Math.min(100, Math.round(spent / budget * 100));
  box.innerHTML = `
    <div class="bar"><div style="width:${pct}%"></div></div>
    <div class="summary"><span class="left">Потратите</span><strong>${money(spent)}</strong></div>
    <div class="summary" style="margin-top:0"><span class="left">Остаток</span><span style="font-weight:800">${money(res.left)}</span></div>
    <div style="margin:22px 0">
      ${res.picks.map((p, i) => `
        <a href="#/product/${p.id}" class="result-item" style="animation-delay:${i * 80}ms">
          <div class="swatch" style="background:radial-gradient(circle,${p.c1},${p.c2})"></div>
          <div class="info"><small>${CAT_TITLE[p.cat]}</small><b>${esc(p.name)}</b></div>
          <div class="p">${money(p.price)}</div>
        </a>`).join("")}
    </div>
    ${res.skipped.length ? `<p class="note">Не поместились: ${res.skipped.map(c => CAT_TITLE[c].toLowerCase()).join(", ")}</p>` : ""}
    <button class="btn btn-block" id="addBuild" style="margin-top:14px">Добавить комплект в корзину · ${money(spent)}</button>`;
}
 
