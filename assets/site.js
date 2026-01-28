(function(){
  const nav = document.querySelector('[data-nav]');
  const btn = document.querySelector('[data-nav-toggle]');
  if(nav && btn){
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e)=>{
      if(!nav.contains(e.target) && nav.classList.contains('open')) nav.classList.remove('open');
    });
  }
})();