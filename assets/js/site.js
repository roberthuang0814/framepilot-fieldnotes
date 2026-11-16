/* FramePilot Field Notes — plain JavaScript, no build step. See AGENTS.md. */
(() => {
  'use strict';
  const CATEGORY_ORDER = ['全部', '攝影基礎', '夜景與街拍', '影片與運鏡', '設備與實作', '拍攝企劃'];
  const articles = Array.isArray(window.FRAMEPILOT_ARTICLES) ? window.FRAMEPILOT_ARTICLES : [];
  const $ = (id) => document.getElementById(id);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const hrefFor = (slug) => `article.html?slug=${encodeURIComponent(slug)}`;
  const setAccent = (node, accent) => { node.classList.add(`accent-${accent || 'aqua'}`); };

  function buildCard(article, index) {
    const a = el('a', 'article-card');
    a.href = hrefFor(article.slug);
    setAccent(a, article.accent);
    a.setAttribute('aria-label', `閱讀：${article.title}`);
    const top = el('div', 'card-top');
    top.append(el('span', 'card-index', String(index + 1).padStart(2, '0')),
               el('span', 'card-arrow', '↗'));
    const cat = el('div', 'card-category', article.category.toUpperCase());
    const title = el('h3', '', article.title);
    const summary = el('p', '', article.summary);
    const bottom = el('div', 'card-bottom');
    bottom.append(el('span', '', `${article.minutes} 分鐘閱讀`),
                  el('span', 'card-tag', (article.tags || []).slice(0, 2).join(' / ')));
    a.append(top, cat, title, summary, bottom);
    return a;
  }

  function initHome() {
    if (!$('article-grid')) return;
    let active = '全部';
    let term = '';
    const filterRoot = $('category-filters');
    const categories = CATEGORY_ORDER.filter(c => c === '全部' || articles.some(a => a.category === c));
    categories.forEach(category => {
      const btn = el('button', '', category);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', category === active ? 'true' : 'false');
      btn.addEventListener('click', () => {
        active = category;
        filterRoot.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        render();
      });
      filterRoot.appendChild(btn);
    });
    const search = $('search');
    search.addEventListener('input', () => { term = search.value.trim().toLocaleLowerCase('zh-Hant'); render(); });
    $('stat-articles').textContent = String(articles.length).padStart(2, '0');
    $('library-range').textContent = `01 — ${String(articles.length).padStart(2, '0')}`;
    $('stat-categories').textContent = String(new Set(articles.map(a => a.category)).size).padStart(2, '0');
    function render() {
      const list = articles.filter(a => {
        if (active !== '全部' && a.category !== active) return false;
        const haystack = [a.title, a.subtitle, a.category, a.summary, ...(a.tags || [])].join(' ').toLocaleLowerCase('zh-Hant');
        return !term || haystack.includes(term);
      });
      const grid = $('article-grid');
      grid.replaceChildren(...list.map((a, i) => buildCard(a, i)));
      $('results-count').textContent = `${list.length} 篇筆記`;
      $('empty-state').hidden = list.length > 0;
    }
    render();
  }

  function articleBlock(block, i, tocList) {
    switch (block.type) {
      case 'section': {
        const id = `section-${i + 1}`;
        const h = el('h2', '', block.text); h.id = id;
        const a = el('a', '', block.text); a.href = `#${id}`; tocList.push(a);
        return h;
      }
      case 'paragraph': return el('p', '', block.text);
      case 'bullets': {
        const ul = el('ul'); (block.items || []).forEach(s => ul.appendChild(el('li', '', s))); return ul;
      }
      case 'steps': {
        const group = el('div', 'article-steps');
        (block.items || []).forEach((it, j) => {
          const row = el('div', 'article-step');
          const texts = el('div'); texts.append(el('h3', '', it.title), el('p', '', it.text));
          row.append(el('span', 'step-num', String(j + 1).padStart(2, '0')), texts);
          group.appendChild(row);
        });
        return group;
      }
      case 'callout': {
        const note = el('div', 'callout' + (block.tone === 'caution' ? ' caution' : ''));
        note.append(el('strong', '', block.title), el('p', '', block.text)); return note;
      }
      case 'table': {
        const wrap = el('div', 'table-scroll');
        const table = el('table', 'article-table');
        const thead = el('thead'); const tr = el('tr');
        (block.columns || []).forEach(c => tr.appendChild(el('th', '', c)));
        thead.appendChild(tr); table.appendChild(thead);
        const tbody = el('tbody');
        (block.rows || []).forEach(row => {
          const trRow = el('tr'); row.forEach(c => trRow.appendChild(el('td', '', c))); tbody.appendChild(trRow);
        });
        table.appendChild(tbody); wrap.appendChild(table); return wrap;
      }
      default: return el('p', '', '');
    }
  }

  function initArticle() {
    const app = $('article-app'); if (!app) return;
    const slug = new URLSearchParams(window.location.search).get('slug');
    const found = articles.find(a => a.slug === slug);
    if (!found) {
      const fallback = el('div', 'article-notfound');
      fallback.append(el('h1', '', '找不到這篇攝影筆記'), el('p', '', '文章不存在，或網址可能輸入錯誤。'));
      const back = el('a', 'btn btn-primary', '返回全部筆記 ↗'); back.href = 'index.html#library';
      fallback.appendChild(back); app.replaceChildren(fallback); document.title = '找不到文章｜FramePilot';
      return;
    }
    document.title = `${found.title}｜FramePilot Field Notes`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', found.summary);
    const breadcrumb = el('nav', 'article-breadcrumb'); breadcrumb.setAttribute('aria-label', '麵包屑導航');
    const home = el('a', '', '攝影筆記'); home.href = 'index.html#library';
    breadcrumb.append(home, el('span', '', '/'), el('span', '', found.category));
    const heading = el('section', 'article-heading');
    heading.append(el('div', 'article-eyebrow', `FIELD NOTES / ${found.category.toUpperCase()}`), el('h1', '', found.title), el('p', 'article-subtitle', found.subtitle));
    const meta = el('div', 'article-meta');
    meta.append(el('span', '', `${found.minutes} 分鐘閱讀`), el('span', '', `更新 ${found.updated}`), el('span', '', (found.tags || []).join(' · ')));
    heading.appendChild(meta);
    const visual = el('div', 'article-visual');
    const visualText = el('div'); visualText.append(el('span', '', 'FRAMEPILOT / FIELD KNOWLEDGE'), el('strong', '', found.category));
    visual.appendChild(visualText);
    const layout = el('div', 'article-layout'); const content = el('article', 'article-content');
    const tocLinks = [];
    (found.blocks || []).forEach((block, i) => content.appendChild(articleBlock(block, i, tocLinks)));
    const end = el('div', 'article-end');
    const back = el('a', '', '← 返回所有筆記'); back.href = 'index.html#library'; end.appendChild(back);
    content.appendChild(end);
    const side = el('aside', 'article-side'); side.appendChild(el('p', 'side-title', '這篇文章會談到'));
    const nav = el('nav'); nav.setAttribute('aria-label', '本文目錄'); tocLinks.forEach(link => nav.appendChild(link));
    side.appendChild(nav);
    const asideNote = el('div', 'article-side-note');
    asideNote.append(el('strong', '', '關於本文'), document.createTextNode('本內容是攝影學習整理，設備設定請以實機及官方資料為準。'));
    side.appendChild(asideNote);
    layout.append(content, side);
    const related = el('section', 'article-related');
    const matches = articles.filter(a => a.slug !== found.slug && a.category === found.category).slice(0, 2);
    if (matches.length < 2) matches.push(...articles.filter(a => a.slug !== found.slug && !matches.includes(a)).slice(0, 2-matches.length));
    related.appendChild(el('h2', '', '接著讀這些筆記'));
    const relatedGrid = el('div', 'related-grid');
    matches.forEach(a => {
      const l = el('a', 'related-card'); l.href = hrefFor(a.slug);
      l.append(el('small', '', `${a.category} · ${a.minutes} 分鐘閱讀`), el('strong', '', a.title));
      relatedGrid.appendChild(l);
    });
    related.appendChild(relatedGrid);
    app.replaceChildren(breadcrumb, heading, visual, layout, related);
  }

  function initTools() {
    const root = $('fps-options'); if (!root) return;
    let fps = 24;
    const angle = $('shutter-angle');
    function render() {
      const deg = Number(angle.value);
      const shutter = deg / 360 / fps;
      const denom = Math.round(1 / shutter);
      $('angle-output').textContent = `${deg}°`;
      $('shutter-result').replaceChildren(document.createTextNode(`1/${denom} `), el('small', '', '秒'));
      $('shutter-explanation').textContent = `以 ${fps} FPS、${deg}° 快門角度計算，理論曝光時間約 ${shutter.toFixed(4)} 秒。`;
    }
    root.querySelectorAll('button[data-fps]').forEach(b => b.addEventListener('click', () => {
      fps = Number(b.dataset.fps);
      root.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === b)));
      render();
    }));
    angle.addEventListener('input', render);
    render();
  }

  if (document.body.dataset.page === 'home') initHome();
  if (document.body.dataset.page === 'article') initArticle();
  if (document.body.dataset.page === 'tools') initTools();
})();
