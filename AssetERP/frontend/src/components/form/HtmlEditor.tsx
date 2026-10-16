import React from 'react';
import { Button, Divider, Space } from 'antd';
import {
  BoldOutlined, ItalicOutlined, OrderedListOutlined, RedoOutlined, StrikethroughOutlined, UnderlineOutlined, UndoOutlined, UnorderedListOutlined,
} from '@ant-design/icons';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/**
 * HTML 편집기 (AS-IS iframe `ckeditor/indexClient.html`의 sendToServer()/setHtmlText() 대체 — 사용자 결정 2026-10-13: Tiptap).
 * `value`는 HTML 문자열이고 만들 때 한 번 편집기에 넣는다(AS-IS setHtmlText) — 다른 값으로 다시 열려면 부르는 쪽이 key를 바꿔 새로 만든다.
 * 바뀔 때마다 onChange(html) — AS-IS는 저장할 때 getHtmlText()를 불렀다.
 *   <HtmlEditor value={note} onChange={setNote} height={520} />
 */
interface Props {
  value?: string | null;
  onChange?: (html: string) => void;
  height?: number;
}

export const HtmlEditor: React.FC<Props> = ({ value, onChange, height = 480 }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value ?? '',
    onUpdate: ({ editor: e }) => onChange?.(e.isEmpty ? '' : e.getHTML()),
  });

  if (!editor) return null;
  const btn = (icon: React.ReactNode, active: boolean, run: () => void, title: string) => (
    <Button size="small" type={active ? 'primary' : 'text'} icon={icon} title={title} onClick={run} />
  );

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, display: 'flex', flexDirection: 'column', height }}>
      <Space size={2} style={{ padding: 4, borderBottom: '1px solid #f0f0f0', flex: 'none', flexWrap: 'wrap' }}>
        {btn(<BoldOutlined />, editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), '굵게')}
        {btn(<ItalicOutlined />, editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), '기울임')}
        {btn(<UnderlineOutlined />, editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), '밑줄')}
        {btn(<StrikethroughOutlined />, editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), '취소선')}
        <Divider type="vertical" />
        {btn(<UnorderedListOutlined />, editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '글머리 기호')}
        {btn(<OrderedListOutlined />, editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '번호 매기기')}
        <Divider type="vertical" />
        {btn(<UndoOutlined />, false, () => editor.chain().focus().undo().run(), '실행 취소')}
        {btn(<RedoOutlined />, false, () => editor.chain().focus().redo().run(), '다시 실행')}
      </Space>
      <EditorContent editor={editor} style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 8 }} />
    </div>
  );
};
