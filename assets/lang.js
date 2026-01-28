(function(){
  try{
    const p = location.pathname.split('/').pop() || 'index.html';
    const isEN = p.includes('-en.html');
    const ruBtn = document.querySelector('[data-lang="ru"]');
    const enBtn = document.querySelector('[data-lang="en"]');
    if(ruBtn) ruBtn.classList.toggle('active', !isEN);
    if(enBtn) enBtn.classList.toggle('active', isEN);

    // remember choice
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('[data-lang]');
      if(!a) return;
      localStorage.setItem('lang', a.getAttribute('data-lang') || 'ru');
    });

    // optional auto-redirect if user preference differs (only for main pages)
    const pref = localStorage.getItem('lang');
    if(pref && (pref==='ru' || pref==='en')){
      if(pref==='en' && !isEN){
        const map = { 'index.html':'index-en.html','services.html':'services-en.html','cases.html':'cases-en.html','demos.html':'demos-en.html' };
        if(map[p]) location.replace(map[p] + location.search + location.hash);
      }
      if(pref==='ru' && isEN){
        const map = { 'index-en.html':'index.html','services-en.html':'services.html','cases-en.html':'cases.html','demos-en.html':'demos.html' };
        if(map[p]) location.replace(map[p] + location.search + location.hash);
      }
    }
  }catch(e){}
})();