(function () {
  function num(v) {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }

  function fmtRub(x) {
    const n = Math.round((Number.isFinite(x) ? x : 0) * 100) / 100;
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' ₽';
  }

  function fmtPct(x) {
    const n = Math.round((Number.isFinite(x) ? x : 0) * 100) / 100;
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' %';
  }

  // --- Unit economics calculator
  const unitForm = document.getElementById('unitCalc');
  if (unitForm) {
    const outProfit = document.getElementById('unit_profit');
    const outMargin = document.getElementById('unit_margin');
    const outCosts = document.getElementById('unit_costs');
    const outDrr = document.getElementById('unit_drr');

    function recalcUnit() {
      const price = num(unitForm.price.value);
      const commissionPct = num(unitForm.commissionPct.value);
      const logistics = num(unitForm.logistics.value);
      const cogs = num(unitForm.cogs.value);
      const pack = num(unitForm.pack.value);
      const adsPct = num(unitForm.adsPct.value);
      const returnsPct = num(unitForm.returnsPct.value);

      const commission = (price * commissionPct) / 100;
      const ads = (price * adsPct) / 100;
      const returns = (price * returnsPct) / 100;

      const costs = commission + logistics + cogs + pack + ads + returns;
      const profit = price - costs;
      const margin = price > 0 ? (profit / price) * 100 : 0;

      outProfit.textContent = fmtRub(profit);
      outCosts.textContent = fmtRub(costs);
      outMargin.textContent = fmtPct(margin);
      outDrr.textContent = fmtPct(adsPct);

      // Visual hint
      outProfit.parentElement.classList.toggle('isBad', profit < 0);
    }

    unitForm.addEventListener('input', recalcUnit);
    recalcUnit();
  }

  // --- Max DRR calculator
  const drrForm = document.getElementById('drrCalc');
  if (drrForm) {
    const outMaxAdsRub = document.getElementById('drr_max_ads_rub');
    const outMaxAdsPct = document.getElementById('drr_max_ads_pct');

    function recalcDrr() {
      const price = num(drrForm.price.value);
      const commissionPct = num(drrForm.commissionPct.value);
      const logistics = num(drrForm.logistics.value);
      const cogs = num(drrForm.cogs.value);
      const pack = num(drrForm.pack.value);
      const returnsPct = num(drrForm.returnsPct.value);
      const targetProfit = num(drrForm.targetProfit.value);

      const commission = (price * commissionPct) / 100;
      const returns = (price * returnsPct) / 100;

      const fixedCosts = commission + logistics + cogs + pack + returns;
      const maxAds = price - fixedCosts - targetProfit;
      const maxAdsPct = price > 0 ? (maxAds / price) * 100 : 0;

      outMaxAdsRub.textContent = fmtRub(maxAds);
      outMaxAdsPct.textContent = fmtPct(maxAdsPct);

      outMaxAdsRub.parentElement.classList.toggle('isBad', maxAds < 0);
    }

    drrForm.addEventListener('input', recalcDrr);
    recalcDrr();
  }
})();
