(function(){
  const dict = {
    ru: {
      brand_badge: "WB • Ozon • BI • Автоматизация",
      nav_home:"Главная", nav_services:"Услуги", nav_cases:"Кейсы", nav_demo:"Демо", nav_contacts:"Контакты", nav_write:"Написать",
      hero_title:"Внешний коммерческий директор маркетплейсов",
      hero_sub:"Системы, BI и контроль прибыли — без хаоса и слива маржи",
      hero_lead:"Если оборот есть, но прибыль не управляется: DRR прыгает, остатки то 0 то «2 месяца», команда работает по чату. Я собираю контур: P&L, BI, ритм решений 30/60/90 и KPI.",
      cta_main:"Написать в Telegram",
      cta_secondary:"Посмотреть услуги",
      services_title:"Услуги и форматы подключения",
      cases_title:"Кейсы",
      demos_title:"Демо",
      tg_open:"Открыть Telegram"
    },
    en: {
      brand_badge:"WB • Ozon • BI • Automation",
      nav_home:"Home", nav_services:"Services", nav_cases:"Cases", nav_demo:"Demo", nav_contacts:"Contacts", nav_write:"Message",
      hero_title:"Fractional Marketplace Commercial Director",
      hero_sub:"Systems, BI and profit control — no chaos, no margin burn",
      hero_lead:"If you have revenue but profit isn’t controlled: ad spend swings, stockouts happen, the team works via chats. I build the control layer: P&L, BI, a 30/60/90 cadence and KPIs.",
      cta_main:"Message on Telegram",
      cta_secondary:"View services",
      services_title:"Services & engagement models",
      cases_title:"Cases",
      demos_title:"Demos",
      tg_open:"Open Telegram"
    }
  };

  function getLang(){
    const qs = new URLSearchParams(location.search);
    const ql = qs.get('lang');
    if(ql && (ql==='ru' || ql==='en')) return ql;
    const ls = localStorage.getItem('lang');
    if(ls==='ru' || ls==='en') return ls;
    return 'ru';
  }
  function setLang(lang){ localStorage.setItem('lang', lang); }

  function apply(lang){
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      const v = dict[lang] && dict[lang][k];
      if(typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-lang-btn]').forEach(b=>{
      b.classList.toggle('active', b.getAttribute('data-lang-btn')===lang);
    });
  }

  document.addEventListener('click', (e)=>{
    const b = e.target.closest('[data-lang-btn]');
    if(!b) return;
    const lang = b.getAttribute('data-lang-btn');
    if(lang!=='ru' && lang!=='en') return;
    setLang(lang);
    apply(lang);
  });

  const lang = getLang();
  setLang(lang);
  apply(lang);
})();