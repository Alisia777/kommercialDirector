import re
from pathlib import Path

root = Path('/mnt/data/komdir_v6')
files = ['index.html','services.html','cases.html','demos.html']

header = '''<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="index.html">
      <span class="brand-mark">🦊</span>
      <span class="brand-name">Kommdir Systems</span>
      <span class="badge badge-glow">WB • Ozon • BI • Автоматизация</span>
    </a>

    <div class="nav" data-nav>
      <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" data-burger>☰</button>
      <nav class="nav-links" aria-label="Навигация">
        <a href="index.html">Главная</a>
        <a href="services.html">Услуги</a>
        <a href="cases.html">Кейсы</a>
        <a href="demos.html">Демо</a>
        <a href="index.html#contact">Контакты</a>
        <a class="btn small" href="tg.html?g=header">Написать</a>
      </nav>
    </div>
  </div>
</header>'''

for name in files:
    p = root / name
    s = p.read_text(encoding='utf-8')
    # Replace any header block at top: <header ...>...</header>
    # For demos.html, it might be <header class="topbar">...
    s2, n = re.subn(r'<header[^>]*>.*?</header>', header, s, count=1, flags=re.S|re.I)
    if n == 0:
        raise SystemExit(f'No header found in {name}')
    p.write_text(s2, encoding='utf-8')

print('headers updated')
