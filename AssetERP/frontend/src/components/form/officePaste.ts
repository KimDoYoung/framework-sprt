/**
 * Word·Excel에서 복사한 HTML을 Tiptap이 받을 수 있게 다듬는다 (TiptapEditor 전용 — Jodit 은 자체 정리를 쓴다).
 *  1) <style> 안의 클래스 규칙(.xl65, p.MsoNormal …)을 각 요소의 style로 옮긴다 — Excel은 셀 서식을 클래스로만 보낸다.
 *  2) Word 목록(mso-list 문단 + 글머리 span)을 진짜 <ul>/<ol>로 바꾼다.
 *  3) Excel <col width>를 첫 행 셀의 colwidth로 옮긴다(Tiptap 열 너비).
 *  4) mso-* 스타일, <o:p>·<v:*>, 주석, <style>/<meta>를 지우고 남길 스타일만 남긴다.
 */

/** Office에서 온 HTML인지 */
export function isOfficeHtml(html: string): boolean {
  return /urn:schemas-microsoft-com:office|class="?Mso|mso-|<o:p>/i.test(html);
}

/** 남길 CSS 속성 */
const KEEP = new Set([
  'color', 'background-color', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line',
  'text-align', 'vertical-align', 'font-size', 'font-family',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
]);

type Rule = { selector: string; decls: string; specificity: number };

function parseCss(cssText: string): Rule[] {
  const css = cssText
    .replace(/<!--|-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@[^{]+\{[^}]*\}/g, ''); // @page, @font-face, @list …
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    for (const sel of m[1].split(',')) {
      const selector = sel.trim();
      // 클래스가 있는 규칙만(td·p 같은 전체 규칙은 기본값이라 결과만 길어진다), 가상 클래스는 뺀다
      if (!selector.includes('.') || selector.includes(':')) continue;
      rules.push({ selector, decls: m[2].trim(), specificity: (selector.match(/\./g)?.length ?? 0) * 10 + (/^[a-z]/i.test(selector) ? 1 : 0) });
    }
  }
  return rules.sort((a, b) => a.specificity - b.specificity);
}

/** 1) 클래스 규칙 → 요소 style (요소에 이미 있던 style이 이긴다) */
function inlineClassStyles(doc: Document) {
  const rules = parseCss(Array.from(doc.querySelectorAll('style')).map(s => s.textContent ?? '').join('\n'));
  const fromRules = new Map<Element, string[]>();
  for (const r of rules) {
    let els: NodeListOf<Element>;
    try { els = doc.body.querySelectorAll(r.selector); } catch { continue; }
    els.forEach(el => {
      const list = fromRules.get(el) ?? [];
      list.push(r.decls);
      fromRules.set(el, list);
    });
  }
  fromRules.forEach((list, el) => {
    el.setAttribute('style', [...list, el.getAttribute('style') ?? ''].join(';'));
  });
}

const BULLET_ORDERED = /^\(?([0-9]+|[a-zA-Z]{1,4}|[가-힣])[.)]/;

/** 2) Word 목록 문단 → <ul>/<ol> */
function convertWordLists(doc: Document) {
  const isListP = (el: Element | null): el is HTMLElement =>
    !!el && el.tagName === 'P' && /mso-list:\s*l\d+\s+level\d+/i.test(el.getAttribute('style') ?? '');
  const done = new Set<Element>();
  doc.body.querySelectorAll('p').forEach(first => {
    if (done.has(first) || !isListP(first)) return;
    const group: HTMLElement[] = [];
    for (let el: Element | null = first; isListP(el); el = el.nextElementSibling) { group.push(el); done.add(el); }

    const anchor = doc.createElement('span');
    first.before(anchor);
    const stack: { list: HTMLElement; level: number }[] = [];
    for (const p of group) {
      const level = Number(/level(\d+)/i.exec(p.getAttribute('style') ?? '')?.[1] ?? 1);
      const marker = Array.from(p.querySelectorAll('span')).find(s => /mso-list:\s*ignore/i.test(s.getAttribute('style') ?? ''));
      const ordered = BULLET_ORDERED.test(marker?.textContent?.trim() ?? '');
      marker?.remove();
      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      if (!stack.length || stack[stack.length - 1].level < level) {
        const list = doc.createElement(ordered ? 'ol' : 'ul');
        const top = stack[stack.length - 1];
        if (top) (top.list.lastElementChild ?? top.list).appendChild(list);
        else anchor.before(list);
        stack.push({ list, level });
      }
      const li = doc.createElement('li');
      li.appendChild(p);
      stack[stack.length - 1].list.appendChild(li);
    }
    anchor.remove();
  });
}

/** 3) Excel <col width> → 첫 행 셀 colwidth */
function applyColWidths(doc: Document) {
  doc.body.querySelectorAll('table').forEach(table => {
    const widths: number[] = [];
    table.querySelectorAll(':scope > col, :scope > colgroup > col').forEach(col => {
      const w = parseInt(col.getAttribute('width') ?? '', 10);
      const span = parseInt(col.getAttribute('span') ?? '1', 10) || 1;
      for (let i = 0; i < span; i++) widths.push(Number.isFinite(w) ? w : 0);
    });
    const firstRow = table.querySelector('tr');
    if (!widths.length || !firstRow) return;
    let idx = 0;
    Array.from(firstRow.children).forEach(cell => {
      const span = parseInt(cell.getAttribute('colspan') ?? '1', 10) || 1;
      const ws = widths.slice(idx, idx + span);
      if (ws.length === span && ws.every(w => w > 0)) cell.setAttribute('colwidth', ws.join(','));
      idx += span;
    });
  });
}

/** 4) style 속성에서 남길 것만 남긴다 */
function cleanStyle(style: string): string {
  const out = new Map<string, string>();
  for (const decl of style.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    let prop = decl.slice(0, i).trim().toLowerCase();
    let value = decl.slice(i + 1).trim().replace(/windowtext/gi, '#000000').replace(/\s+/g, ' ');
    if (!value || prop.startsWith('mso-')) continue;
    if (prop === 'background') { prop = 'background-color'; value = value.split(' ')[0]; }
    if (!KEEP.has(prop)) continue;
    if (prop.startsWith('border') && /^none\b/i.test(value)) continue;
    if (prop === 'text-align' && value === 'general') continue;
    if (prop === 'background-color' && /^(transparent|none|auto)$/i.test(value)) continue;
    out.set(prop, value);
  }
  return Array.from(out, ([k, v]) => `${k}:${v}`).join(';');
}

function stripJunk(doc: Document) {
  // 주석(조건부 주석 <!--[if …]>, <![endif]> 포함)
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach(c => c.parentNode?.removeChild(c));

  doc.body.querySelectorAll('style, meta, link, title, script, xml').forEach(el => el.remove());
  doc.body.querySelectorAll('*').forEach(el => {
    const tag = el.tagName.toLowerCase();
    if (!tag.includes(':')) return;
    if (tag === 'o:p') el.replaceWith(...Array.from(el.childNodes)); // <o:p>&nbsp;</o:p> 내용은 남긴다
    else el.remove(); // v:shape, w:sdt …
  });
  // Excel 숫자 칸은 align="right"(속성)로 온다 — Tiptap 은 속성을 버리므로 style 로 옮긴다
  doc.body.querySelectorAll('td[align], th[align], p[align]').forEach(el => {
    el.setAttribute('style', `text-align:${el.getAttribute('align')};${el.getAttribute('style') ?? ''}`);
    el.removeAttribute('align');
  });
  doc.body.querySelectorAll('[style]').forEach(el => {
    const s = cleanStyle(el.getAttribute('style') ?? '');
    if (s) el.setAttribute('style', s); else el.removeAttribute('style');
  });
  doc.body.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
  doc.body.querySelectorAll('[lang]').forEach(el => el.removeAttribute('lang'));
}

export function cleanOfficeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // DOMParser는 <head>의 <style>을 head에 둔다 — 규칙은 문서 전체에서 읽는다
  const styleText = Array.from(doc.querySelectorAll('style')).map(s => s.textContent ?? '').join('\n');
  if (styleText) {
    const holder = doc.createElement('style');
    holder.textContent = styleText;
    doc.body.prepend(holder);
    doc.head.querySelectorAll('style').forEach(s => s.remove());
  }
  inlineClassStyles(doc);
  convertWordLists(doc);
  applyColWidths(doc);
  stripJunk(doc);
  return doc.body.innerHTML;
}
