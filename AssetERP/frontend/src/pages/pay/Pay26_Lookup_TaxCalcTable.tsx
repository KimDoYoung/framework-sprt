/**
 * 산출세액표 창 (S22) — Pay13_TabPage_RetireTax의 [산출세액표]가 연다.
 * AS-IS: myApp/client/vi/pay/Pay26_Lookup_TaxCalcTable.java (89줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L36-55: 1100×450 모달 "산출세액표", 읽기 전용 그리드(초과 150 · 이하 150 · 기본세액 150 · 초과금액 적용세율(%) 200 · 비고 500) + [닫기]
 * retrieve() L80-84: pay.Pay26_TaxCalcTable.selectByMonthId(monthId) — 급여 지급일 이전 가장 최근 적용일의 표
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { PayTaxCalc } from '@/types/pay';

const gb = gbFor<PayTaxCalc>();

/** buildGrid() */
const buildGrid = () => [
  gb.long('fromAmt', 150, '초과'),  // L71
  gb.long('toAmt', 150, '이하'),  // L72
  gb.long('basicTax', 150, '기본세액'),  // L73
  gb.double('rate', 200, '초과금액 적용세율(%)'),  // L74
  gb.text('note', 500, '비고'),  // L75
];

interface Props {
  /** open(monthId) — 값이 있으면 열리고 곧바로 조회한다 */
  monthId: number | null;
  onClose: () => void;
}

export const Pay26_Lookup_TaxCalcTable: React.FC<Props> = ({ monthId, onClose }) => {
  const [rows, setRows] = useState<PayTaxCalc[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 화면 열림 → settings(), show() · open() → retrieve()
  useEffect(() => {
    if (monthId === null) return;
    setRows([]);
    payApi.getRetireTaxCalcs(monthId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [monthId]);

  return (
    <LookupModal open={monthId !== null} title="산출세액표" width={1130} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330 }}><SingleGrid<PayTaxCalc> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.taxCalcTableId)} /></div>
    </LookupModal>
  );
};
