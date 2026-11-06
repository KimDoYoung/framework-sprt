/**
 * 테스트매뉴 > HTML 편집기 비교 — AS-IS 원본 없음. CKEditor 대체 편집기 시험 화면.
 * 왼쪽: TiptapEditor(예비) / 오른쪽: HtmlEditor(Jodit, 업무 화면이 쓰는 것 — AS-IS CKEditor 툴바 3종).
 * 보는 것: Word·Excel 붙여넣기(표·병합·테두리·배경·목록), 편집 기능, 저장 후 다시 열기(왕복), AS-IS(CKEditor 4) HTML 읽기.
 * 붙여넣은 클립보드 원본 HTML 은 [원본] 창에서 복사·파일 저장 → data/samples/ 에 두면 정리 규칙을 고칠 때 쓴다.
 */
import React, { useRef, useState } from 'react';
import { Button as AntButton, Checkbox, Input, Modal, Select, Space, Typography } from 'antd';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { TiptapEditor } from '@/components/form/TiptapEditor';
import type { HtmlEditorToolbar } from '@/components/form/htmlEditorAsis';

type Side = 'tiptap' | 'jodit';

/** AS-IS CKEditor 4 가 저장했을 법한 HTML (표·병합·테두리·배경·글자색·목록) */
const SAMPLE_HTML = `<p><strong>AS-IS 저장 HTML 예시</strong> — <span style="color:#e74c3c">빨간 글자</span>, <span style="background-color:#f1c40f">노란 배경</span></p>
<table border="1" cellpadding="1" cellspacing="1" style="width:500px">
<tbody>
<tr><td colspan="2" style="background-color:#d9e1f2; text-align:center"><strong>구분</strong></td><td style="text-align:center">금액</td></tr>
<tr><td rowspan="2">운용</td><td>주식</td><td style="text-align:right">1,000,000</td></tr>
<tr><td>채권</td><td style="text-align:right; color:#0000ff">2,500,000</td></tr>
</tbody>
</table>
<ul><li>첫째</li><li>둘째<ol><li>하위 1</li></ol></li></ul>`;

const panel: React.CSSProperties = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 };

export const Test_Tab_EditorCompare: React.FC = () => {
  /** 편집기에 넣을 값과 다시 만들 key (넣을 때마다 key++) */
  const [initial, setInitial] = useState<Record<Side, { html: string; key: number }>>({
    tiptap: { html: '', key: 0 }, jodit: { html: '', key: 0 },
  });
  const [output, setOutput] = useState<Record<Side, string>>({ tiptap: '', jodit: '' });
  const [raw, setRaw] = useState<Record<Side, string>>({ tiptap: '', jodit: '' });
  const [showHtml, setShowHtml] = useState(false);
  const [toolbar, setToolbar] = useState<HtmlEditorToolbar>('default');
  const [loadOpen, setLoadOpen] = useState(false);
  const [loadText, setLoadText] = useState(SAMPLE_HTML);
  const [rawView, setRawView] = useState<Side>();
  const outputRef = useRef(output);
  outputRef.current = output;

  const load = (side: Side, html: string) => {
    setInitial(p => ({ ...p, [side]: { html, key: p[side].key + 1 } }));
    setOutput(p => ({ ...p, [side]: html }));
  };
  const loadBoth = (html: string) => { load('tiptap', html); load('jodit', html); };


  const capture = (side: Side) => (e: React.ClipboardEvent) => {
    const html = e.clipboardData.getData('text/html');
    if (html) setRaw(p => ({ ...p, [side]: html }));
  };

  const header = (side: Side, title: string, extra?: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Typography.Text strong>{title}</Typography.Text>
      {extra}
      <Typography.Text type="secondary" style={{ marginLeft: 'auto' }}>
        붙여넣은 원본 {raw[side].length.toLocaleString()}자 → 결과 {output[side].length.toLocaleString()}자
      </Typography.Text>
      <AntButton size="small" disabled={!raw[side]} onClick={() => setRawView(side)}>원본</AntButton>
      <AntButton size="small" title="지금 결과 HTML 로 편집기를 새로 연다(저장 후 다시 열기)"
        onClick={() => load(side, outputRef.current[side])}>다시 열기</AntButton>
      <AntButton size="small" title="결과 HTML 을 다른 편집기에 넣는다"
        onClick={() => load(side === 'tiptap' ? 'jodit' : 'tiptap', outputRef.current[side])}>
        {side === 'tiptap' ? '→ Jodit' : '← Tiptap'}
      </AntButton>
    </div>
  );

  const htmlBox = (side: Side) => showHtml && (
    <Input.TextArea readOnly value={output[side]} style={{ height: 160, flex: 'none', fontFamily: 'monospace', fontSize: 12 }} />
  );

  const downloadRaw = (side: Side) => {
    const url = URL.createObjectURL(new Blob([raw[side]], { type: 'text/html' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipboard-${side}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Typography.Text type="secondary">
        HTML 편집기 비교 (둘 다 MIT, 오른쪽이 업무 화면용) — Word·Excel 에서 복사해 양쪽에 붙여 넣어 보세요. 표 병합·테두리·배경·열 너비·목록이 살아 있는지,
        [다시 열기](저장 후 다시 열기)와 [→ Jodit]/[← Tiptap](서로 읽기)에서 깨지지 않는지 봅니다. Word 안의 그림은 PC 파일 경로라 둘 다 안 들어옵니다.
      </Typography.Text>
      <Space wrap>
        <AntButton onClick={() => setLoadOpen(true)}>HTML 넣기 (AS-IS 저장값)</AntButton>
        <AntButton onClick={() => loadBoth('')}>양쪽 비우기</AntButton>
        <Checkbox checked={showHtml} onChange={e => setShowHtml(e.target.checked)}>결과 HTML 보기</Checkbox>
        <Typography.Text>Jodit 툴바(AS-IS):</Typography.Text>
        <Select style={{ width: 260 }} value={toolbar} onChange={setToolbar} options={[
          { value: 'default', label: '기본 — index.html' },
          { value: 'client', label: '접힌 툴바 — indexClient.html' },
          { value: 'mail', label: '메일 — indexMail.html' },
        ]} />
      </Space>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12 }}>
        <div style={panel}>
          {header('tiptap', 'TiptapEditor (예비)')}
          <div style={{ flex: 1, minHeight: 0 }} onPasteCapture={capture('tiptap')}>
            <TiptapEditor key={initial.tiptap.key} value={initial.tiptap.html}
              onChange={html => setOutput(p => ({ ...p, tiptap: html }))} />
          </div>
          {htmlBox('tiptap')}
        </div>
        <div style={panel}>
          {header('jodit', 'HtmlEditor (Jodit)')}
          <div style={{ flex: 1, minHeight: 0 }} onPasteCapture={capture('jodit')}>
            <HtmlEditor key={`${initial.jodit.key}-${toolbar}`} value={initial.jodit.html} toolbar={toolbar} height="100%"
              onChange={html => setOutput(p => ({ ...p, jodit: html }))} />
          </div>
          {htmlBox('jodit')}
        </div>
      </div>

      <Modal title="HTML 넣기" open={loadOpen} width={800} onCancel={() => setLoadOpen(false)}
        footer={[
          <AntButton key="s" onClick={() => setLoadText(SAMPLE_HTML)}>예시로 되돌리기</AntButton>,
          <AntButton key="c" onClick={() => setLoadOpen(false)}>닫기</AntButton>,
          <AntButton key="o" type="primary" onClick={() => { loadBoth(loadText); setLoadOpen(false); }}>양쪽에 넣기</AntButton>,
        ]}>
        <Typography.Paragraph type="secondary">
          AS-IS DB 에 저장된 본문(양식·게시글 등)을 붙여 넣으면, 지금 저장된 HTML 을 두 편집기가 어떻게 읽는지 볼 수 있습니다.
        </Typography.Paragraph>
        <Input.TextArea value={loadText} onChange={e => setLoadText(e.target.value)}
          style={{ height: 360, fontFamily: 'monospace', fontSize: 12 }} />
      </Modal>

      <Modal title={`붙여넣은 클립보드 원본 (${rawView === 'tiptap' ? 'Tiptap' : 'Jodit'} 쪽)`} open={!!rawView} width={900}
        onCancel={() => setRawView(undefined)}
        footer={rawView && [
          <AntButton key="c" onClick={() => navigator.clipboard.writeText(raw[rawView])}>복사</AntButton>,
          <AntButton key="d" onClick={() => downloadRaw(rawView)}>파일로 저장</AntButton>,
          <AntButton key="x" type="primary" onClick={() => setRawView(undefined)}>닫기</AntButton>,
        ]}>
        <Input.TextArea readOnly value={rawView ? raw[rawView] : ''} style={{ height: 420, fontFamily: 'monospace', fontSize: 12 }} />
      </Modal>
    </div>
  );
};
