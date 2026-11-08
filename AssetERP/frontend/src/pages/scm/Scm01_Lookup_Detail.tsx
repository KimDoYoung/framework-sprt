/**
 * 개발의뢰 상세 창 (EE17) — 개발 목록의 "개발의뢰 상세보기" 아이콘이 연다(보기 전용)
 * AS-IS: myApp/client/vi/scm/Scm01_Lookup_Detail.java (198줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L125-175 (800×700, 라벨 90, 줄 사이 여백 20): 요청일 · 요청구분 / 요청자(요청사) + 요청자 · 등록자 / "요청내용 :" 링크 + HTML 보기(650×370) / 첨부파일(Scm01_Grid_ApprFile, 삭제 열 감춤)
 * [E0] 화면 열림 (생성자 L70-102) → settings(), getEditor(), show() + open(srModel) L65-68: retrieve() L177-180
 * [E2] anchor.MouseDown (L128) → Scm01_Lookup_SrContent.open(srContent) (보기 전용)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useState } from 'react';
import { Input } from 'antd';
import { Sr } from '@/types/scm';
import { HtmlView } from '@/components/form/HtmlView';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';
import { Scm01_Grid_ApprFile } from './Scm01_Grid_ApprFile';
import { Scm01_Lookup_SrContent } from './Scm01_Lookup_SrContent';

const LABEL: React.CSSProperties = { width: 90, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', margin: '10px 20px' };

interface Props {
  open: boolean;
  /** open(srModel) */
  sr: Sr | null;
  onClose: () => void;
}

export const Scm01_Lookup_Detail: React.FC<Props> = ({ open, sr, onClose }) => {
  const [contentOpen, setContentOpen] = useState(false);
  // 요청자 칸 둘: 요청사(corpName) + 요청자(requestor)
  const corpNm = (sr as (Sr & { corpNm?: string | null }) | null)?.corpNm ?? '';
  const srTypeNm = (sr as (Sr & { srTypeNm?: string | null }) | null)?.srTypeNm ?? '';
  const personNm = (sr as (Sr & { personNm?: string | null }) | null)?.personNm ?? '';

  return (
    <LookupModal
      open={open}
      title="개발의뢰 상세"
      width={800}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE, body: { padding: '0 2px', maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] cancelButton[닫기].Select (L117) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={ROW}>
        <span style={LABEL}>요청일</span>
        <Input readOnly style={{ width: 250 }} value={sr?.srDate ?? ''} />
        <span style={{ ...LABEL, marginLeft: 100 }}>요청구분</span>
        <Input readOnly style={{ width: 250 }} value={srTypeNm} />
      </div>
      <div style={ROW}>
        <span style={LABEL}>요청자</span>
        <Input readOnly style={{ width: 250 }} value={corpNm} />
        <Input readOnly style={{ width: 150, marginLeft: 5 }} value={sr?.requestor ?? ''} />
        <span style={{ ...LABEL, marginLeft: 100 }}>등록자</span>
        <Input readOnly style={{ width: 250 }} value={personNm} />
      </div>
      <div style={{ ...ROW, alignItems: 'flex-start' }}>
        <a style={{ ...LABEL, width: 95, cursor: 'pointer', textDecoration: 'none', color: 'inherit', paddingTop: 4 }}
           onClick={() => { if (sr) setContentOpen(true); }}>요청내용 :</a>
        <div style={{ width: 650, flex: 'none' }}><HtmlView html={sr?.srContent ?? ''} height={370} /></div>
      </div>
      <div style={{ ...ROW, alignItems: 'flex-start' }}>
        <span style={LABEL}>첨부파일</span>
        <div style={{ width: 650, height: 120, flex: 'none' }}>
          <Scm01_Grid_ApprFile parentId={sr?.srId ?? null} editable={false} />
        </div>
      </div>
      <Scm01_Lookup_SrContent open={contentOpen} srContent={sr?.srContent ?? ''} enabledYn={false} srId={sr?.srId ?? null}
        onResult={() => undefined} onClose={() => setContentOpen(false)} />
    </LookupModal>
  );
};
