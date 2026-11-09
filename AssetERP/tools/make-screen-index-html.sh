#!/usr/bin/env bash
# yunhee screen-capture 결과(.yunhee/screen-capture/<화면번호_클래스명>/*.png)를 한눈에 보는 index.html 생성.
#   왼쪽: 화면번호 목록(메뉴 경로가 있으면 함께, 검색 가능) / 오른쪽: 고른 화면의 이미지를 파일명과 함께 표시
# 사용: tools/make-screen-index-html.sh [캡쳐폴더]   (기본 .yunhee/screen-capture, AssetERP 어디서 실행해도 된다)
#   → <캡쳐폴더>/index.html (이미지는 상대 경로라 폴더째 옮겨도 열린다). 브라우저에서 file:// 로 연다.
# 메뉴 경로: docs/as-is/menus.tsv (화면번호<TAB>메뉴경로<TAB>클래스<TAB>사용) 가 있으면 왼쪽 목록에 보여 준다.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="${1:-$ROOT/.yunhee/screen-capture}"
MENUS="$ROOT/docs/as-is/menus.tsv"
OUT="$DIR/index.html"

[ -d "$DIR" ] || { echo "캡쳐 폴더가 없다: $DIR" >&2; exit 1; }

json_str() { # JSON 문자열 이스케이프(백슬래시·따옴표)
  local s="${1//\\/\\\\}"; s="${s//\"/\\\"}"; printf '"%s"' "$s"
}

data=""
count=0
shopt -s nullglob
for d in "$DIR"/*/; do
  name="$(basename "$d")"
  imgs=("$d"*.png "$d"*.jpg "$d"*.jpeg)
  [ ${#imgs[@]} -gt 0 ] || continue
  id="${name%%_*}"; cls="${name#*_}"
  menu=""
  if [ -f "$MENUS" ]; then
    menu="$(awk -F'\t' -v id="$id" '$1==id {print $2; exit}' "$MENUS")"
  fi
  files=""
  for f in "${imgs[@]}"; do
    files+="$(json_str "$(basename "$f")"),"
  done
  data+="{\"id\":$(json_str "$id"),\"cls\":$(json_str "$cls"),\"dir\":$(json_str "$name"),\"menu\":$(json_str "$menu"),\"files\":[${files%,}]},"$'\n'
  count=$((count+1))
done

cat > "$OUT" <<HTML
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>화면 캡쳐 색인</title>
<style>
  :root { --bg:#fff; --fg:#1f2328; --muted:#6b7280; --line:#d9d9d9; --side:#f6f8fa; --sel:#dbeafe; --hover:#eef2f7; --accent:#1677ff; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#16181d; --fg:#e6e8eb; --muted:#9aa3af; --line:#33373f; --side:#1d2026; --sel:#1e3a5f; --hover:#262a32; --accent:#69b1ff; }
  }
  * { box-sizing: border-box; }
  html, body { height:100%; margin:0; }
  body { display:flex; background:var(--bg); color:var(--fg); font:14px/1.45 system-ui, "Noto Sans KR", sans-serif; }
  nav { width:340px; flex:none; display:flex; flex-direction:column; background:var(--side); border-right:1px solid var(--line); }
  nav header { padding:12px 12px 8px; border-bottom:1px solid var(--line); }
  nav h1 { margin:0 0 8px; font-size:15px; }
  nav input { width:100%; padding:6px 8px; border:1px solid var(--line); border-radius:4px; background:var(--bg); color:var(--fg); }
  nav ul { list-style:none; margin:0; padding:0; overflow-y:auto; flex:1; }
  nav li a { display:block; padding:7px 12px; color:inherit; text-decoration:none; border-bottom:1px solid var(--line); }
  nav li a:hover { background:var(--hover); }
  nav li a.sel { background:var(--sel); }
  nav .id { font-weight:600; }
  nav .cls, nav .menu { display:block; font-size:12px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  nav .n { float:right; font-size:12px; color:var(--muted); }
  main { flex:1; min-width:0; overflow-y:auto; padding:16px 24px 48px; }
  main h2 { margin:0 0 2px; font-size:18px; }
  main .sub { color:var(--muted); margin-bottom:16px; }
  figure { margin:0 0 28px; }
  figcaption { font-weight:600; margin-bottom:6px; font-family:ui-monospace, monospace; font-size:13px; }
  figure img { max-width:100%; border:1px solid var(--line); border-radius:4px; display:block; background:#fff; }
  .empty { color:var(--muted); padding:40px 0; }
  @media (max-width: 720px) { body { flex-direction:column; } nav { width:100%; height:38vh; border-right:0; border-bottom:1px solid var(--line); } }
</style>
</head>
<body>
<nav>
  <header>
    <h1>화면 캡쳐 색인 (${count}개 화면)</h1>
    <input id="q" type="search" placeholder="화면번호·클래스·메뉴 검색" autofocus>
  </header>
  <ul id="list"></ul>
</nav>
<main id="view"><div class="empty">왼쪽에서 화면을 고르세요. (↑↓ 키로 이동)</div></main>
<script>
const SCREENS = [
${data}];
const list = document.getElementById('list'), view = document.getElementById('view'), q = document.getElementById('q');
SCREENS.sort((a, b) => (+a.id || 0) - (+b.id || 0) || a.id.localeCompare(b.id));
let shown = [];

function esc(s) { return s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c])); }

function renderList() {
  const t = q.value.trim().toLowerCase();
  shown = SCREENS.filter(s => !t || (s.id + ' ' + s.cls + ' ' + s.menu).toLowerCase().includes(t));
  list.innerHTML = shown.map(s =>
    '<li><a href="#' + esc(s.id) + '" data-id="' + esc(s.id) + '">' +
    '<span class="n">' + s.files.length + '장</span><span class="id">#' + esc(s.id) + '</span>' +
    (s.menu ? '<span class="menu">' + esc(s.menu) + '</span>' : '') +
    '<span class="cls">' + esc(s.cls) + '</span></a></li>').join('');
  markSelected();
}

function markSelected() {
  const id = decodeURIComponent(location.hash.slice(1));
  list.querySelectorAll('a').forEach(a => {
    const on = a.dataset.id === id;
    a.classList.toggle('sel', on);
    if (on) a.scrollIntoView({ block: 'nearest' });
  });
}

function renderView() {
  const id = decodeURIComponent(location.hash.slice(1));
  const s = SCREENS.find(x => x.id === id);
  if (!s) { view.innerHTML = '<div class="empty">왼쪽에서 화면을 고르세요. (↑↓ 키로 이동)</div>'; return; }
  view.innerHTML = '<h2>#' + esc(s.id) + ' ' + esc(s.cls) + '</h2>' +
    '<div class="sub">' + (s.menu ? esc(s.menu) + ' · ' : '') + esc(s.dir) + '/</div>' +
    s.files.map(f => '<figure><figcaption>' + esc(f) + '</figcaption><a href="' + encodeURI(s.dir + '/' + f) + '" target="_blank"><img loading="lazy" src="' + encodeURI(s.dir + '/' + f) + '" alt="' + esc(f) + '"></a></figure>').join('');
  view.scrollTop = 0;
  markSelected();
}

function move(d) {
  if (!shown.length) return;
  const id = decodeURIComponent(location.hash.slice(1));
  const i = shown.findIndex(s => s.id === id);
  const n = shown[Math.min(shown.length - 1, Math.max(0, (i < 0 ? (d > 0 ? 0 : shown.length - 1) : i + d)))];
  location.hash = '#' + n.id;
}

q.addEventListener('input', renderList);
window.addEventListener('hashchange', renderView);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
});
renderList();
renderView();
</script>
</body>
</html>
HTML

echo "만들었다: $OUT (화면 ${count}개)"
echo "열기: file://$OUT"
