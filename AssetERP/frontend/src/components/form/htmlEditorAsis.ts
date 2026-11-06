/**
 * HtmlEditor(Jodit)에 옮긴 AS-IS CKEditor 4 설정 — 원본 `webapp/ckeditor/`.
 *  - 툴바 3종: 'default' = index.html(config.js), 'client' = indexClient.html(configClient.js, 같은 버튼·접힌 채 시작), 'mail' = indexMail.html(configMail.js)
 *  - 붙여넣기 후처리: config.js / configClient.js 의 editor.on('paste') 를 그대로 옮김 (configMail.js 는 없음)
 *  - 표 우클릭 메뉴: CKEditor tabletools 의 행·열·셀 메뉴
 */
import type { IJodit } from 'jodit/esm/types/jodit';

export type HtmlEditorToolbar = 'default' | 'client' | 'mail';

/**
 * CKEditor 버튼 → Jodit 버튼. '\n' = CKEditor 의 '/'(툴바 줄바꿈).
 * default·client: toolbarGroups 에서 removeButtons 를 뺀 것 —
 *   NewPage | Paste PasteText (PasteFromWord) | Undo Redo | Find SelectAll | Bold Italic Underline Strike Subscript Superscript RemoveFormat | Image Table HorizontalRule SpecialChar
 *   / JustifyLeft·Center·Right·Block | NumberedList BulletedList | Outdent Indent | Font FontSize | TextColor BGColor | Link Unlink
 *   - PasteFromWord: Jodit 은 Ctrl+V 로 Word·Excel 을 알아서 정리하므로 버튼을 두지 않음
 *   - BidiLtr/BidiRtl(bidi), ExportPdf(클라우드 유료 기능)는 옮기지 않음
 *   - TextColor·BGColor: Jodit 'brush' 하나(글자색/배경색 탭)
 */
export const TOOLBAR_BUTTONS: Record<HtmlEditorToolbar, string[]> = {
  default: [
    'newpage', '|', 'paste', 'pastetext', '|', 'undo', 'redo', '|', 'find', 'selectall', '|',
    'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'eraser', '|',
    'image', 'table', 'hr', 'symbols', '\n',
    'left', 'center', 'right', 'justify', '|', 'ol', 'ul', '|', 'outdent', 'indent', '|',
    'font', 'fontsize', '|', 'brush', '|', 'link', 'unlink',
  ],
  client: [], // default 와 같음(아래에서 채움)
  mail: [
    'font', 'fontsize', '|', 'bold', 'underline', 'italic', '|', 'left', 'center', 'right', 'justify', '|',
    'ol', 'ul', '|', 'outdent', 'indent', '|', 'brush', '|', 'image', 'symbols',
  ],
};
TOOLBAR_BUTTONS.client = TOOLBAR_BUTTONS.default;

/** toolbarCanCollapse / toolbarStartupExpanded */
export const TOOLBAR_COLLAPSE: Record<HtmlEditorToolbar, { collapsible: boolean; startCollapsed: boolean }> = {
  default: { collapsible: true, startCollapsed: false },
  client: { collapsible: true, startCollapsed: true },
  mail: { collapsible: false, startCollapsed: false },
};

/** fontSize_sizes / font_names('맑은자산/NotoCustom') */
export const FONT_SIZES = ['8', '10', '12', '13', '14', '16', '18', '20', '24', '36', '48', '72'];
export const FONT_LIST = { NotoCustom: '맑은자산' };

// ───────────────────────── 붙여넣기 후처리 (config.js) ─────────────────────────

/** config.js convertPUAToUnicode — Word 기호 글꼴(사용자 영역 문자)을 일반 문자로 */
const PUA_MAP: Record<string, string> = {
  '': '→', '': '←', '': '↑', '': '↓',
  '': '①', '': '②', '': '③', '': '④', '': '⑤',
  '': '⑥', '': '⑦', '': '⑧', '': '⑨', '': '⑩',
  '': 'Ⅰ', '': 'Ⅱ', '': 'Ⅲ', '': 'Ⅳ', '': 'Ⅴ',
  '': '■', '': '●', '': '◆', '': '▲', '': '▼',
  '': '※', '': '☆', '': '★', '': '○', '': '◎', '': '◇',
};
const convertPUAToUnicode = (text: string) => text.replace(/[-]/g, c => PUA_MAP[c] ?? c);

function convertTextNodes(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) node.nodeValue = convertPUAToUnicode(node.nodeValue ?? '');
  else node.childNodes.forEach(convertTextNodes);
}

/**
 * config.js applyTableBorder — 테두리가 하나도 없는 셀에 1px 검정 테두리, 모든 셀 padding 4px·가운데 정렬(세로).
 * 원본의 applyBorderSide 는 같은 이름의 3인자 함수가 뒤에서 덮어써 실제로는 아무것도 하지 않는다 → 옮기지 않음.
 */
function applyTableBorder(root: HTMLElement) {
  const sandbox = document.createElement('div');
  Object.assign(sandbox.style, { position: 'absolute', left: '-99999px', top: '-99999px', visibility: 'hidden' });
  document.body.appendChild(sandbox);
  sandbox.appendChild(root);
  root.querySelectorAll('table').forEach(table => {
    table.style.borderCollapse = 'collapse';
    table.querySelectorAll<HTMLTableCellElement>('td, th').forEach(cell => {
      const computed = window.getComputedStyle(cell);
      const hasBorder = (['Top', 'Right', 'Bottom', 'Left'] as const)
        .some(side => computed[`border${side}Style`] !== 'none');
      if (!hasBorder) cell.style.border = '1px solid #000';
      cell.style.padding = '4px';
      cell.style.verticalAlign = 'middle';
    });
  });
  sandbox.remove();
}

/** config.js fixFontAndSize — 모든 요소 글꼴 NotoCustom, 글자 크기가 없으면 13px, 서식 없는 글자는 span 으로 감쌈 */
function fixFontAndSizeDefault(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const findFontSize = (node: HTMLElement | null) => {
    for (let cur = node; cur; cur = cur.parentElement) {
      if (cur.style.fontSize && cur.style.fontSize.trim() !== '') return cur.style.fontSize;
    }
    return null;
  };
  const wrapTextNode = (textNode: Node) => {
    const span = document.createElement('span');
    span.style.setProperty('font-family', "'NotoCustom'");
    span.style.setProperty('font-size', '13px');
    textNode.parentNode!.insertBefore(span, textNode);
    span.appendChild(textNode);
  };
  // 원본은 applyStyle ↔ setFixFontStyle 를 한 단계씩 번갈아 부른다(그대로 옮김)
  const setFixFontStyle = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    (node as HTMLElement).style.setProperty('font-family', "'NotoCustom'");
    Array.from(node.childNodes).forEach(applyStyle);
  };
  function applyStyle(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      el.style.setProperty('font-family', "'NotoCustom'");
      if (!findFontSize(el)) el.style.fontSize = '13px';
      Array.from(el.childNodes).forEach(setFixFontStyle);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode as HTMLElement | null;
      if ((node.textContent ?? '').trim().length > 0 && parent
        && !parent.hasAttribute('style') && !parent.hasAttribute('class')) wrapTextNode(node);
    }
  }
  Array.from(tempDiv.childNodes).forEach(applyStyle);
  return tempDiv.innerHTML;
}

/** configClient.js fixFontAndSize — 모든 요소 글꼴 NotoCustom(!important), 그 요소에 크기가 없으면 13px */
function fixFontAndSizeClient(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const applyStyle = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const style = (node as HTMLElement).style;
    style.setProperty('font-family', "'NotoCustom'", 'important');
    if (!style.fontSize) style.setProperty('font-size', '13px');
    node.childNodes.forEach(applyStyle);
  };
  tempDiv.childNodes.forEach(applyStyle);
  return tempDiv.innerHTML;
}

/** Jodit beforePasteInsert 에서 부른다 (Jodit 의 Word·Excel 정리가 끝난 HTML) */
export function asisPasteProcess(toolbar: HtmlEditorToolbar, html: string): string {
  if (toolbar === 'mail') return html;
  if (toolbar === 'client') return fixFontAndSizeClient(html);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  convertTextNodes(tempDiv);
  applyTableBorder(tempDiv);
  return fixFontAndSizeDefault(tempDiv.innerHTML);
}

// ───────────────────────── 표 우클릭 메뉴 (CKEditor tabletools) ─────────────────────────

type TableModule = {
  getAllSelectedCells(): HTMLTableCellElement[];
  addSelection(td: HTMLTableCellElement): void;
  removeSelection(td: HTMLTableCellElement): void;
};
type ContextMenuCtor = new (j: IJodit) => { show(x: number, y: number, actions: Array<false | { icon?: string; title?: string; exec?: () => void }>): void };

/** 표 칸에서 우클릭하면 행·열·셀 메뉴. 표 밖은 브라우저 기본 메뉴(복사·붙여넣기) 그대로 */
export function attachTableContextMenu(editor: IJodit, JoditStatic: { modules: { Table: unknown; ContextMenu: unknown } }) {
  const ContextMenu = JoditStatic.modules.ContextMenu as ContextMenuCtor;
  let menu: InstanceType<ContextMenuCtor> | undefined;
  editor.e.on(editor.editor, 'contextmenu', (e: MouseEvent) => {
    const cell = (e.target as HTMLElement | null)?.closest?.('td, th') as HTMLTableCellElement | null;
    if (!cell || !editor.editor.contains(cell)) return;
    const table = cell.closest('table');
    if (!table) return;
    e.preventDefault();
    const tm = editor.getInstance(JoditStatic.modules.Table as never, editor.o) as unknown as TableModule;
    const selected = tm.getAllSelectedCells();
    if (!selected.includes(cell)) {
      selected.forEach(td => tm.removeSelection(td));
      tm.addSelection(cell);
    }
    const multi = tm.getAllSelectedCells().length > 1;
    const run = (cmd: string) => () => { editor.execCommand(cmd, false, table); editor.synchronizeValues(); };
    menu ??= new ContextMenu(editor);
    menu.show(e.clientX, e.clientY, [
      { icon: 'addrow', title: '위에 행 삽입', exec: run('tableaddrowbefore') },
      { icon: 'addrow', title: '아래에 행 삽입', exec: run('tableaddrowafter') },
      { icon: 'bin', title: '행 삭제', exec: run('tablebinrow') },
      { icon: 'addcolumn', title: '왼쪽에 열 삽입', exec: run('tableaddcolumnbefore') },
      { icon: 'addcolumn', title: '오른쪽에 열 삽입', exec: run('tableaddcolumnafter') },
      { icon: 'bin', title: '열 삭제', exec: run('tablebincolumn') },
      multi && { icon: 'merge', title: '셀 병합', exec: run('tablemerge') },
      { icon: 'splitv', title: '셀 수직 분할', exec: run('tablesplitv') },
      { icon: 'splitg', title: '셀 수평 분할', exec: run('tablesplitg') },
      { icon: 'bin', title: '표 삭제', exec: run('tablebin') },
    ]);
  });
}
