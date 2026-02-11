// Calculators (unit economics + max DRR)
// v20260211: align IDs with calculators.html (u_ads)

(function () {
  const moneyFmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  const pctFmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

  const fmtMoney = (n) => (Number.isFinite(n) ? `${moneyFmt.format(Math.round(n))} ₽` : '—');
  const fmtPct = (n) => (Number.isFinite(n) ? `${pctFmt.format(n)}%` : '—');

  const num = (el) => {
    if (!el) return 0;
    const v = Number(String(el.value ?? '').replace(',', '.'));
    return Number.isFinite(v) ? v : 0;
  };

  const bind = (inputs, fn) => {
    Object.values(inputs).forEach((el) => {
      if (!el) return;
      el.addEventListener('input', fn);
      el.addEventListener('change', fn);
    });
  };

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    // --- Unit economics (simplified)
    const u = {
      sale: $('u_price'),
      feePct: $('u_comm'),
      ship: $('u_log'),
      cogs: $('u_cogs'),
      pack: $('u_pack'),
      adsPct: $('u_ads'),
      returnsPct: $('u_ret'),
      other: $('u_other'), // optional field (may be absent)
    };

    const uOut = {
      profit: $('unit_profit'),
      costs: $('unit_costs'),
      margin: $('unit_margin'),
      drr: $('unit_drr'),
    };

    const refreshUnit = () => {
      if (!uOut.profit || !uOut.costs || !uOut.margin || !uOut.drr) return;

      const sale = num(u.sale);
      const fee = sale * (num(u.feePct) / 100);
      const ship = num(u.ship);
      const cogs = num(u.cogs);
      const pack = num(u.pack);
      const returns = sale * (num(u.returnsPct) / 100);
      const other = num(u.other);
      const ads = sale * (num(u.adsPct) / 100);

      const totalCosts = fee + ship + cogs + pack + returns + other + ads;
      const profit = sale - totalCosts;
      const margin = sale > 0 ? (profit / sale) * 100 : 0;
      const drr = sale > 0 ? (ads / sale) * 100 : 0;

      uOut.profit.textContent = fmtMoney(profit);
      uOut.costs.textContent = fmtMoney(totalCosts);
      uOut.margin.textContent = fmtPct(margin);
      uOut.drr.textContent = fmtPct(drr);
    };

    bind(u, refreshUnit);
    refreshUnit();

    // --- Max DRR for target profit
    const d = {
      sale: $('d_price'),
      feePct: $('d_comm'),
      ship: $('d_log'),
      cogs: $('d_cogs'),
      pack: $('d_pack'),
      returnsPct: $('d_ret'),
      other: $('d_other'),
      targetProfit: $('d_profit'),
    };

    const dOut = {
      maxAdsRub: $('drr_max_ads_rub'),
      maxAdsPct: $('drr_max_ads_pct'),
      delta: $('drr_delta'),
      comment: $('drr_comment'),
      deltaBox: $('drr_delta_box'),
    };

    const refreshDRR = () => {
      if (!dOut.maxAdsRub || !dOut.maxAdsPct) return;

      const sale = num(d.sale);
      const fee = sale * (num(d.feePct) / 100);
      const ship = num(d.ship);
      const cogs = num(d.cogs);
      const pack = num(d.pack);
      const returns = sale * (num(d.returnsPct) / 100);
      const other = num(d.other);
      const targetProfit = num(d.targetProfit);

      const baseCosts = fee + ship + cogs + pack + returns + other;
      const delta = sale - baseCosts - targetProfit; // can be negative
      const maxAdsRub = Math.max(0, delta);
      const maxAdsPct = sale > 0 ? (maxAdsRub / sale) * 100 : 0;

      dOut.maxAdsRub.textContent = fmtMoney(maxAdsRub);
      dOut.maxAdsPct.textContent = fmtPct(maxAdsPct);

      if (dOut.delta) dOut.delta.textContent = fmtMoney(delta);

      if (dOut.comment) {
        dOut.comment.textContent =
          delta < 0
            ? 'При этих вводных целевая прибыль не достигается даже без рекламы. Пересоберите цену/COGS/логистику/комиссию/возвраты.'
            : 'Это запас до цели. Его можно направить на рекламу, не падая ниже целевой прибыли.';
      }

      if (dOut.deltaBox) dOut.deltaBox.classList.toggle('isBad', delta < 0);
    };

    bind(d, refreshDRR);
    refreshDRR();
  });
})();
