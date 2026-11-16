#!/usr/bin/env python3
"""Offline structural validation for FramePilot Field Notes. No third-party packages."""
from pathlib import Path
import json, re, sys
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/js/articles.js'
CATEGORIES={'攝影基礎','夜景與街拍','影片與運鏡','設備與實作','拍攝企劃'}
ACCENTS={'aqua','violet','amber','mint','coral','blue','lavender','sunset'}
TYPES={'paragraph','section','bullets','steps','callout','table'}
errors=[]
def chk(ok,msg):
    if not ok: errors.append(msg)
raw=SRC.read_text(encoding='utf-8')
m=re.search(r'window\.FRAMEPILOT_ARTICLES\s*=\s*(\[.*\])\s*;',raw,re.S)
if not m:
    print('✗ 找不到 window.FRAMEPILOT_ARTICLES = [...];')
    sys.exit(1)
try: articles=json.loads(m.group(1))
except Exception as exc:
    print(f'✗ 文章資料不是合法 JSON 物件語法：{exc}')
    sys.exit(1)
chk(isinstance(articles,list) and len(articles)>0,'文章陣列必須有內容')
slugs=set()
for i,a in enumerate(articles):
    label=f'文章 {i+1} ({a.get("slug", "缺少 slug")})'
    for key in ('slug','title','subtitle','category','minutes','summary','tags','accent','featured','updated','blocks'):
        chk(key in a,f'{label} 缺少 {key}')
    slug=a.get('slug','')
    chk(bool(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',slug)),f'{label} slug 格式錯誤')
    chk(slug not in slugs, f'{label} slug 重複')
    slugs.add(slug)
    for key in ('title','subtitle','summary'):
        chk(isinstance(a.get(key),str) and bool(a.get(key).strip()),f'{label} {key} 必須是非空文字')
    chk(a.get('category') in CATEGORIES,f'{label} 未定義分類：{a.get("category")}')
    chk(type(a.get('minutes')) is int and a['minutes']>0,f'{label} minutes 必須正整數')
    chk(isinstance(a.get('tags'),list) and 1<=len(a.get('tags',[]))<=4 and all(isinstance(t,str) and t.strip() for t in a.get('tags',[])),f'{label} tags 須為 1～4 個字串')
    chk(a.get('accent') in ACCENTS,f'{label} accent 不合法')
    chk(type(a.get('featured')) is bool,f'{label} featured 必須是 boolean')
    chk(bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',a.get('updated',''))),f'{label} updated 日期格式錯誤')
    blocks=a.get('blocks',[])
    chk(isinstance(blocks,list) and len(blocks)>=4,f'{label} blocks 至少四個')
    if not isinstance(blocks,list): continue
    chk(sum(b.get('type')=='section' for b in blocks)>=2,f'{label} 至少兩個 section')
    for j,b in enumerate(blocks):
        which=f'{label} block {j+1}'
        typ=b.get('type')
        chk(typ in TYPES,f'{which} 未知 block 類型：{typ}')
        if typ in ('paragraph','section'):
            chk(isinstance(b.get('text'),str) and bool(b['text'].strip()),f'{which} text 必須是文字')
        if typ=='bullets':
            chk(isinstance(b.get('items'),list) and len(b['items'])>0 and all(isinstance(s,str) for s in b['items']),f'{which} bullets.items 格式錯誤')
        if typ=='steps':
            chk(isinstance(b.get('items'),list) and bool(b['items']) and all(isinstance(s,dict) and s.get('title') and s.get('text') for s in b['items']),f'{which} steps.items 格式錯誤')
        if typ=='callout':
            chk(b.get('tone') in ('tip','caution') and bool(b.get('title')) and bool(b.get('text')),f'{which} callout 欄位錯誤')
        if typ=='table':
            cols=b.get('columns');rows=b.get('rows')
            chk(isinstance(cols,list) and len(cols)>1 and isinstance(rows,list) and bool(rows) and all(isinstance(row,list) and len(row)==len(cols) for row in rows),f'{which} table 格式錯誤')
for path in ('AGENTS.md','README.md','index.html','article.html','tools.html','about.html','assets/css/style.css','assets/js/site.js','assets/img/nightwalk.svg'):
    chk((ROOT/path).is_file(),f'缺少檔案 {path}')
for path in ROOT.glob('*.html'):
    html=path.read_text(encoding='utf-8')
    chk('lang="zh-Hant"' in html,f'{path.name} 缺少繁體中文語系')
    for m in re.finditer(r'(?:href|src)="(?!https?:|#|mailto:)([^"?]+)',html):
        target=m.group(1).split('#',1)[0]
        chk((ROOT/target).exists(),f'{path.name} 連結檔案不存在：{target}')
if errors:
    print(f'✗ 驗證失敗，共 {len(errors)} 個問題：')
    for e in errors: print('  -',e)
    sys.exit(1)
print(f'✓ 驗證通過：{len(articles)} 篇文章，{len(slugs)} 個唯一 slug，所有核心檔案與靜態連結存在。')
