/**
 * 문서구분 창 (EE89) — AS-IS는 기획 일정 탭 Pln02_TabPage_Plan의 [등록]·문서구분 셀이 연다 (TOBE에 Pln 화면이 없어 연결 안 함)
 * AS-IS: myApp/client/vi/pln/Pln00_Popup_ClassTree.java (65줄) — 1000×600 모달 "문서구분", 안에 Pln00_Lookup_ClassTree, 아래 가운데 [확인][닫기]
 * open(baseDate, callback) L25-53 → [확인] confirm() L55-59: 고른 행들을 callback.execute(selectList) 뒤 hide()
 *   호출처(Pln02_TabPage_Plan L112·L151)는 list.get(0)를 쓰므로 고른 행이 없으면 AS-IS는 호출처에서 예외 → 아무 일 없이 창을 열어 둔다(Dcr00_Lookup_FundPlan과 같게)
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useRef } from 'react';
import { Space } from 'antd';
import { DcrFundPlanLookup } from '@/types/dcr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Pln00_Lookup_ClassTree, Pln00ClassTreeHandle } from './Pln00_Lookup_ClassTree';

interface Props {
  open: boolean;
  /** callback.execute(selectList) — 고른 문서구분들 */
  onResult: (list: DcrFundPlanLookup[]) => void;
  onClose: () => void;
}

export const Pln00_Popup_ClassTree: React.FC<Props> = ({ open, onResult, onClose }) => {
  const panel = useRef<Pln00ClassTreeHandle>(null);

  // oKButton[확인].Select (L34) → confirm()
  const confirm = () => {
    const list = panel.current?.getSelectList() ?? [];
    if (list.length === 0) return;
    onResult(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="문서구분"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* cancelButton[닫기].Select (L42) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 480 }}>
        <Pln00_Lookup_ClassTree ref={panel} active={open} />
      </div>
    </LookupModal>
  );
};
