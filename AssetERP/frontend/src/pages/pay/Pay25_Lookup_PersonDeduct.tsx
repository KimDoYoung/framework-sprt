/**
 * 인적공제금액 창 (S22) — Pay13_TabPage_RetireTax의 [인적공제금액]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay25_Lookup_PersonDeduct.java (84줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L34-53: 1100×450 모달 "인적공제금액", 읽기 전용 그리드(구분 200 · 공제금액 100 · 비고 800) + [닫기]
 * retrieve() L75-79: pay.Pay25_PersonDeduct.selectByMonthId(monthId) — 급여 지급일 이전 가장 최근 적용일의 표
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { PayPersonDeduct } from '@/types/pay';

const gb = gbFor<PayPersonDeduct>();

/** buildGrid() */
const buildGrid = () => [
  gb.text('personDeductName', 200, '구분'),  // L68
  gb.long('deductAmt', 100, '공제금액'),  // L69
  gb.text('note', 800, '비고'),  // L70
];

interface Props {
  /** open(monthId) — 값이 있으면 열리고 곧바로 조회한다 */
  monthId: number | null;
  onClose: () => void;
}

export const Pay25_Lookup_PersonDeduct: React.FC<Props> = ({ monthId, onClose }) => {
  const [rows, setRows] = useState<PayPersonDeduct[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 화면 열림 → settings(), show() · open() → retrieve()
  useEffect(() => {
    if (monthId === null) return;
    setRows([]);
    payApi.getRetirePersonDeducts(monthId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [monthId]);

  return (
    <LookupModal open={monthId !== null} title="인적공제금액" width={1130} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330 }}><SingleGrid<PayPersonDeduct> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.personDeductId)} /></div>
    </LookupModal>
  );
};
