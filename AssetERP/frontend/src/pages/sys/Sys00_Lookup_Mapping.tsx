/**
 * Mapping 창 (EE67) — 기본설정(MySetting)의 [특정양식 지정 (연봉계약서)](관리자만 보인다)이 연다. 계약서 양식과 사원구분을 짝짓는다
 * AS-IS: myApp/client/vi/sys/Sys00_Lookup_Mapping.java (79줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L31-49: 1200×400 모달 "Mapping", 탭 패널(탭은 "계약서" 하나 — "퇴직정산서" 탭은 AS-IS 주석 L42), 푸터 가운데 [저장][닫기]
 * open() L25-29: 탭을 조회. [저장] update() L66-74: 활성 탭의 updateCheck()
 */
import React, { useRef } from 'react';
import { Space, Tabs } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Pay06_TabPage_ActMapping, Pay06_TabPage_ActMappingHandle } from '../pay/Pay06_TabPage_ActMapping';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sys00_Lookup_Mapping: React.FC<Props> = ({ open, onClose }) => {
  const tab01 = useRef<Pay06_TabPage_ActMappingHandle>(null);

  return (
    // 열 폭 합계 150+100+400+60+400 = 1110 + 체크·행번호 60 + 여백 130 → 약 1300, 1120을 넘으므로 AS-IS 1200보다 조금 크게 1250 + 스크롤 (03 원칙 21)
    <LookupModal open={open} title="Mapping" width={1250} maskClosable={false} destroyOnHidden onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] updateButton[저장].Select (L52) → update() → 활성 탭 updateCheck() */}
            <Button type="save" onClick={() => tab01.current?.updateCheck()}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L58) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Tabs
        style={{ height: 340 }}
        items={[{
          key: 'tab01', label: '계약서',
          children: <div style={{ height: 290 }}><Pay06_TabPage_ActMapping ref={tab01} active={open} /></div>,
        }]}
      />
    </LookupModal>
  );
};
