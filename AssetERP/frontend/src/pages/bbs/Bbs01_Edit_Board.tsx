/**
 * 자유게시판 읽기 전용 편집 패널 (U2-01) — 자유게시판(Bbs01_Tab_Board·Bbs01_Tab_BoardManager) 오른쪽 칸
 * AS-IS: myApp/client/vi/bbs/Bbs01_Edit_Board.java (138줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L56-106: 제목(읽기 전용) / 구분 150·작성자·작성일(모두 읽기 전용) / 내용 / 파일(Sys10_Lookup_SelectMulti editYn "N" · 높이 100)
 * [E0] 화면 열림 (생성자 L48-54) → getEditor(). 목록에서 고른 글(retrieve L116)로 채우고, 고른 글이 없으면 비운다(init L135)
 * 내용 칸은 AS-IS가 HtmlEditor지만 저장 단추가 없는 보기용이라 HtmlView로 보여 준다.
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { Input } from 'antd';
import { BbsBoard } from '@/types/bbs';
import { HtmlView } from '@/components/form/HtmlView';
import { Sys10_Lookup_SelectMulti } from '@/components/lookup/Sys10_Lookup_SelectMulti';

const LABEL: React.CSSProperties = { width: 50, flex: 'none', textAlign: 'right', paddingRight: 8, fontSize: 12, fontWeight: 'bold' };

interface Props {
  /** 목록에서 고른 글. 없으면 빈 칸 */
  board: BbsBoard | null;
}

export const Bbs01_Edit_Board: React.FC<Props> = ({ board }) => (
  <div style={{ height: '100%', overflowY: 'auto', boxSizing: 'border-box', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={LABEL}>제목</span>
      <Input readOnly value={board?.title ?? ''} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>구분</span>
        <Input readOnly style={{ width: 150 }} value={board?.typeName ?? ''} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>작성자</span>
        <Input readOnly style={{ width: 150 }} value={board?.writeUserName ?? ''} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>작성일</span>
        <Input readOnly style={{ width: 150 }} value={board?.writeDate ?? ''} />
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      <span style={LABEL}>내용</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <HtmlView key={board?.boardId ?? 'none'} html={board?.content} height={330} />
      </div>
    </div>
    <div style={{ display: 'flex' }}>
      <span style={{ ...LABEL, width: 60 }}>파일:</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sys10_Lookup_SelectMulti parentId={board?.boardId ?? null} height={100} />
      </div>
    </div>
  </div>
);
