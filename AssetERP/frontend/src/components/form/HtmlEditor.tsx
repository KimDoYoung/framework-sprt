import React, { useMemo, useRef, useState } from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import JoditEditor, { Jodit, type JoditEditorProps } from 'jodit-react';
import type { IJodit } from 'jodit/esm/types/jodit';
import ko from 'jodit/esm/langs/ko.js';
import {
  FONT_LIST, FONT_SIZES, TOOLBAR_BUTTONS, TOOLBAR_COLLAPSE, asisPasteProcess, attachTableContextMenu, type HtmlEditorToolbar,
} from './htmlEditorAsis';
import './HtmlEditor.css';

(Jodit as unknown as { lang: Record<string, unknown> }).lang.ko = ko;

/**
 * HTML 편집기 — Jodit(MIT). AS-IS iframe `ckeditor/index*.html` 의 setHtmlText()/getHtmlText()·sendToServer() 대체
 * (사용자 결정 2026-11-06: Tiptap → Jodit. Tiptap 판은 TiptapEditor 로 남김).
 * 툴바·붙여넣기 처리·표 우클릭 메뉴는 AS-IS CKEditor 설정을 옮긴 것(htmlEditorAsis.ts).
 * `value`는 만들 때 한 번 편집기에 넣는다(AS-IS setHtmlText) — 다른 값으로 다시 열려면 부르는 쪽이 key를 바꿔 새로 만든다.
 * 바뀔 때마다 onChange(html), 빈 문서는 ''.
 *   <HtmlEditor value={note} onChange={setNote} height={520} />
 *   <HtmlEditor toolbar="client" … />  AS-IS indexClient.html(툴바 접힌 채 시작) · toolbar="mail" indexMail.html(메일 툴바)
 */
interface Props {
  value?: string | null;
  onChange?: (html: string) => void;
  /** px 또는 '100%'(부모 높이를 채움), 기본 480 */
  height?: number | string;
  /** AS-IS 가 연 ckeditor 페이지: 'default' index.html · 'client' indexClient.html · 'mail' indexMail.html */
  toolbar?: HtmlEditorToolbar;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** CKEditor PasteText(텍스트로 붙여넣기) 아이콘 — Jodit 에 없음 */
const PASTE_TEXT_ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="12" rx="1" fill="none" stroke="#444"/><rect x="5.5" y="1" width="5" height="3" fill="#444"/><text x="8" y="12.5" font-size="8" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#444">T</text></svg>',
)}`;

export const HtmlEditor: React.FC<Props> = ({ value, onChange, height = 480, toolbar = 'default' }) => {
  const [initial] = useState(() => value ?? '');
  const { collapsible, startCollapsed } = TOOLBAR_COLLAPSE[toolbar];
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const editorRef = useRef<IJodit | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const config = useMemo<JoditEditorProps['config']>(() => ({
    language: 'ko',
    height: '100%',
    allowResizeY: false, // resize_enabled = false
    statusbar: false, // removePlugins elementspath
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: TOOLBAR_BUTTONS[toolbar],
    enter: 'br', // enterMode = ENTER_BR
    autofocus: toolbar !== 'mail', // startupFocus = true (configMail.js 에는 없음)
    defaultFontSizePoints: 'px',
    style: { fontSize: '13px' }, // fontSize_defaultLabel
    hidePoweredByJodit: true,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: ['ai-assistant', 'speech-recognize', 'powered-by-jodit'],
    // 붙여넣기: 묻지 않고 서식 유지(CKEditor pastefromword 처럼) → AS-IS paste 후처리
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    uploader: { insertImageAsBase64URI: true },
    controls: {
      font: { list: Jodit.atom(FONT_LIST) },
      fontsize: { list: Jodit.atom(FONT_SIZES) },
      newpage: {
        name: 'newpage', icon: 'file', tooltip: '새 문서',
        exec: (editor: IJodit) => { editor.value = ''; },
      },
      pastetext: {
        name: 'pastetext', iconURL: PASTE_TEXT_ICON, tooltip: '텍스트로 붙여넣기',
        exec: (editor: IJodit) => {
          if (!navigator.clipboard?.readText) { editor.message.info('Ctrl+Shift+V 로 붙여 넣으세요'); return; }
          navigator.clipboard.readText()
            .then(t => editor.s.insertHTML(escapeHtml(t).replace(/\r?\n/g, '<br>')))
            .catch(() => editor.message.info('Ctrl+Shift+V 로 붙여 넣으세요'));
        },
      },
    },
    events: {
      afterInit: (editor: IJodit) => {
        editorRef.current = editor;
        attachTableContextMenu(editor, Jodit as never);
      },
      beforePasteInsert: (html: string | Node) => (typeof html === 'string' ? asisPasteProcess(toolbar, html) : html),
    },
  } as JoditEditorProps['config']), [toolbar]);

  const toggle = () => {
    setCollapsed(c => !c);
    setTimeout(() => editorRef.current?.e.fire('resize'), 0);
  };

  return (
    <div className={`html-editor${collapsible ? ' is-collapsible' : ''}${collapsed ? ' is-collapsed' : ''}`} style={{ height }}>
      {collapsible && (
        <button type="button" className="html-editor-collapser" title={collapsed ? '툴바 펼치기' : '툴바 접기'} onClick={toggle}>
          {collapsed ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </button>
      )}
      <JoditEditor value={initial} config={config} onChange={html => onChangeRef.current?.(html)} />
    </div>
  );
};
