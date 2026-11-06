/**
 * Tiptap HTML 편집기 (MIT, 예비 — 업무 화면은 Jodit 기반 HtmlEditor 를 쓴다. 사용자 결정 2026-11-06: Tiptap 도 남긴다).
 * 표(병합·열 너비·셀 서식 유지), 글자색·배경색·글꼴 크기, 정렬, 이미지(base64), Word·Excel 붙여넣기 정리(officePaste.ts).
 * value 는 만들 때 한 번만 넣는다(HtmlEditor 와 같은 약속 — 다시 열려면 key 를 바꾼다).
 *   <TiptapEditor value={note} onChange={setNote} />
 */
import React from 'react';
import { Button, ColorPicker, Divider, Select, Space } from 'antd';
import {
  AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, BgColorsOutlined, BoldOutlined, ClearOutlined,
  DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, FontColorsOutlined, InsertRowBelowOutlined,
  InsertRowRightOutlined, ItalicOutlined, MergeCellsOutlined, OrderedListOutlined, RedoOutlined, SplitCellsOutlined,
  StrikethroughOutlined, TableOutlined, UnderlineOutlined, UndoOutlined, UnorderedListOutlined,
} from '@ant-design/icons';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TableCell, TableHeader, TableKit } from '@tiptap/extension-table';
import { TextStyleKit } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { cleanOfficeHtml, isOfficeHtml } from './officePaste';
import './TiptapEditor.css';

/** 셀의 style(테두리·배경·정렬·글자색)을 그대로 들고 다닌다 — 기본 TableCell 은 버린다 */
const styleAttr = {
  style: {
    default: null as string | null,
    parseHTML: (el: HTMLElement) => el.getAttribute('style'),
    renderHTML: (a: Record<string, unknown>) => (a.style ? { style: a.style as string } : {}),
  },
};
const StyledCell = TableCell.extend({ addAttributes() { return { ...this.parent?.(), ...styleAttr }; } });
const StyledHeader = TableHeader.extend({ addAttributes() { return { ...this.parent?.(), ...styleAttr }; } });

const FONT_SIZES = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '24pt'];

interface Props {
  value?: string | null;
  onChange?: (html: string) => void;
  /** 없으면 부모 높이(100%)를 채운다 */
  height?: number;
}

export const TiptapEditor: React.FC<Props> = ({ value, onChange, height }) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TextStyleKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true }),
      TableKit.configure({ table: { resizable: true }, tableCell: false, tableHeader: false }),
      StyledCell,
      StyledHeader,
    ],
    content: value ?? '',
    editorProps: {
      transformPastedHTML: html => (isOfficeHtml(html) ? cleanOfficeHtml(html) : html),
    },
    onUpdate: ({ editor: e }) => onChange?.(e.isEmpty ? '' : e.getHTML()),
  });

  if (!editor) return null;
  const c = () => editor.chain().focus();
  const btn = (icon: React.ReactNode, active: boolean, run: () => void, title: string, disabled = false) => (
    <Button size="small" type={active ? 'primary' : 'text'} icon={icon} title={title} onClick={run} disabled={disabled} />
  );
  const inTable = editor.isActive('table');

  return (
    <div className="tiptap-plus" style={height ? { height } : undefined}>
      <Space size={2} wrap className="tiptap-plus-toolbar">
        {btn(<BoldOutlined />, editor.isActive('bold'), () => c().toggleBold().run(), '굵게')}
        {btn(<ItalicOutlined />, editor.isActive('italic'), () => c().toggleItalic().run(), '기울임')}
        {btn(<UnderlineOutlined />, editor.isActive('underline'), () => c().toggleUnderline().run(), '밑줄')}
        {btn(<StrikethroughOutlined />, editor.isActive('strike'), () => c().toggleStrike().run(), '취소선')}
        <Select size="small" style={{ width: 76 }} placeholder="크기" allowClear
          value={(editor.getAttributes('textStyle').fontSize as string | undefined) ?? null}
          options={FONT_SIZES.map(s => ({ value: s, label: s }))}
          onChange={(v: string | null) => (v ? c().setFontSize(v).run() : c().unsetFontSize().run())} />
        <ColorPicker size="small" disabledAlpha onChangeComplete={col => c().setColor(col.toHexString()).run()}>
          <Button size="small" type="text" icon={<FontColorsOutlined />} title="글자색" />
        </ColorPicker>
        <ColorPicker size="small" disabledAlpha onChangeComplete={col => c().setBackgroundColor(col.toHexString()).run()}>
          <Button size="small" type="text" icon={<BgColorsOutlined />} title="배경색" />
        </ColorPicker>
        {btn(<ClearOutlined />, false, () => c().unsetAllMarks().run(), '서식 지우기')}
        <Divider type="vertical" />
        {btn(<AlignLeftOutlined />, editor.isActive({ textAlign: 'left' }), () => c().setTextAlign('left').run(), '왼쪽')}
        {btn(<AlignCenterOutlined />, editor.isActive({ textAlign: 'center' }), () => c().setTextAlign('center').run(), '가운데')}
        {btn(<AlignRightOutlined />, editor.isActive({ textAlign: 'right' }), () => c().setTextAlign('right').run(), '오른쪽')}
        {btn(<UnorderedListOutlined />, editor.isActive('bulletList'), () => c().toggleBulletList().run(), '글머리 기호')}
        {btn(<OrderedListOutlined />, editor.isActive('orderedList'), () => c().toggleOrderedList().run(), '번호 매기기')}
        <Divider type="vertical" />
        {btn(<TableOutlined />, false, () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run(), '표 넣기(3×3)')}
        {btn(<InsertRowBelowOutlined />, false, () => c().addRowAfter().run(), '아래에 행 추가', !inTable)}
        {btn(<InsertRowRightOutlined />, false, () => c().addColumnAfter().run(), '오른쪽에 열 추가', !inTable)}
        {btn(<DeleteRowOutlined />, false, () => c().deleteRow().run(), '행 삭제', !inTable)}
        {btn(<DeleteColumnOutlined />, false, () => c().deleteColumn().run(), '열 삭제', !inTable)}
        {btn(<MergeCellsOutlined />, false, () => c().mergeCells().run(), '셀 합치기', !editor.can().mergeCells())}
        {btn(<SplitCellsOutlined />, false, () => c().splitCell().run(), '셀 나누기', !editor.can().splitCell())}
        {btn(<DeleteOutlined />, false, () => c().deleteTable().run(), '표 삭제', !inTable)}
        <Divider type="vertical" />
        {btn(<UndoOutlined />, false, () => c().undo().run(), '실행 취소')}
        {btn(<RedoOutlined />, false, () => c().redo().run(), '다시 실행')}
      </Space>
      <EditorContent editor={editor} className="tiptap-plus-content" />
    </div>
  );
};
