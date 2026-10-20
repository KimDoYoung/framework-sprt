/**
 * 내규 상세내용 창 (E13-3) — Icr01_Lookup_SelectMulti 그리드의 상세 아이콘에서 연다.
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_Content.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L81-90: 모달 650×680, 상세내용 입력(640×590), 아래 가운데 [닫기]. view() L38-45는 읽기 전용 "내규 상세내용"에 저장 버튼 없음
 * open() L47-52("내규 상세내용 수정")와 [저장]은 부르는 화면이 아직 없어 만들지 않았다(다음 단계)
 */
import React from 'react';
import { Input } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { IcrClassTreeLookup } from '@/types/icr';
import { Button } from '@/components/button';

interface Props {
  /** view(selectModel, callback) L38 — 값이 있으면 열린다 */
  row: Pick<IcrClassTreeLookup, 'content'> | null;
  onClose: () => void;
}

export const Icr01_Lookup_Content: React.FC<Props> = ({ row, onClose }) => (
  // [E0] 화면 열림 (생성자 L54-79) → getEditor(), show()
  <LookupModal
    open={!!row}
    title="내규 상세내용"
    width={690}
    maskClosable={false}
    onCancel={onClose}
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1 생략] updateButton[저장].Select (L60) → update() L92-108: 편집 모드(open())에서만 보이는데 부르는 화면이 없다. view()는 [저장]을 숨긴다 */}
        {/* [E2] closeButton[닫기].Select (L66) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <Input.TextArea style={{ height: 590, resize: 'none' }} readOnly value={row?.content ?? ''} />
  </LookupModal>
);
