/**
 * 게시판 등록·수정 창의 본문 (EE81·EE82 공통) — AS-IS Bbs01_Lookup_BoardInsert.getEditor() L93-129 · Bbs01_Lookup_BoardUpdate.getEditor() L112-142
 * 위에서 제목 / [구분 콤보 150(BoardTypeCode) · 작성자 읽기 전용 · 작성일] / 내용(HtmlEditor) / 첨부파일(`Sys10_Lookup_SelectMulti` 패널 120)
 */
import React from 'react';
import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Sys10_Lookup_SelectMulti } from '@/components/lookup/Sys10_Lookup_SelectMulti';

export interface BoardFormValue {
  boardId: number;
  typeCode: string | null;
  title: string;
  content: string;
  writeUserName: string;
  writeDate: string;
}

const LABEL: React.CSSProperties = { width: 50, flex: 'none', textAlign: 'right', paddingRight: 10, fontSize: 12, fontWeight: 'bold' };

interface Props {
  value: BoardFormValue;
  onChange: (patch: Partial<BoardFormValue>) => void;
  /** 첨부파일 칸 이름: 등록 "파일:" / 수정 "첨부파일" */
  fileLabel: string;
  /** 편집기를 다시 만드는 열쇠(열릴 때마다) */
  editorKey: string;
  /** 처음 내용 (편집기는 만들 때 한 번만 반영) */
  initialContent?: string | null;
}

export const Bbs01_BoardForm: React.FC<Props> = ({ value, onChange, fileLabel, editorKey, initialContent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 2px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={LABEL}>제목</span>
      <Input value={value.title} onChange={e => onChange({ title: e.target.value })} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>구분</span>
        {/* [E1] typeName[구분].Collapse → typeCode.setValue(typeName.getCode()) */}
        <SystemCodeComboBox kindCd="BoardTypeCode" style={{ width: 150 }} value={value.typeCode ?? undefined} onChange={c => onChange({ typeCode: c ?? null })} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>작성자</span>
        <Input readOnly style={{ width: 150 }} value={value.writeUserName} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>작성일</span>
        <DatePicker style={{ width: 150 }} allowClear={false} format="YYYY-MM-DD" value={value.writeDate ? dayjs(value.writeDate) : null}
          onChange={d => d && onChange({ writeDate: d.format('YYYY-MM-DD') })} />
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      <span style={LABEL}>내용</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <HtmlEditor key={editorKey} value={initialContent} onChange={c => onChange({ content: c })} height={330} />
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      <span style={{ ...LABEL, width: 60 }}>{fileLabel}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sys10_Lookup_SelectMulti parentId={value.boardId} editYn height={120} />
      </div>
    </div>
  </div>
);
