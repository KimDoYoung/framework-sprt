/**
 * 근로소득 공제표 창 (S22) — Pay13_TabPage_RetireTax의 [근로소득공제표]가 연다.
 * AS-IS: myApp/client/vi/pay/Pay24_Lookup_DeductTable.java (131줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-66: 1100×450 모달 "근로소득 공제표", 위 툴바(공제한도 {limitAmt}) + 읽기 전용 그리드(초과 100 · 이하 100 · 기본공제금액 140 · 공제율(%) 140 · 비고 500) + [닫기]
 * retrieve() L94-122: pay.Pay24_DeductTable.selectByMonthId(monthId, dataCode 1) 첫 행의 limitAmt(없으면 0) + 같은 서비스(dataCode 2)로 그리드. 급여 지급일 이전 가장 최근 적용일의 표
 */
import React, { useEffect, useMemo, useState } from 'react';
import { InputNumber, message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { PayDeductTable } from '@/types/pay';

const gb = gbFor<PayDeductTable>();

/** buildGrid() */
const buildGrid = () => [
  gb.long('fromAmt', 100, '초과'),  // L85
  gb.long('toAmt', 100, '이하'),  // L86
  gb.long('deductAmt', 140, '기본공제금액'),  // L87
  gb.double('deductRate', 140, '공제율(%)'),  // L88
  gb.text('note', 500, '비고'),  // L89
];

interface Props {
  /** open(monthId) — 값이 있으면 열리고 곧바로 조회한다 */
  monthId: number | null;
  onClose: () => void;
}

export const Pay24_Lookup_DeductTable: React.FC<Props> = ({ monthId, onClose }) => {
  const [limitAmt, setLimitAmt] = useState<number>(0);
  const [rows, setRows] = useState<PayDeductTable[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 화면 열림 → settings(), show() · open() → retrieve()
  useEffect(() => {
    if (monthId === null) return;
    setRows([]);
    setLimitAmt(0);
    payApi.getRetireDeductTable(monthId).then(res => { setLimitAmt(res.limitAmt ?? 0); setRows(res.rows); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [monthId]);

  return (
    <LookupModal open={monthId !== null} title="근로소득 공제표" width={1130} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 14 }}>공제한도</span>
          <InputNumber value={limitAmt} readOnly controls={false} style={{ width: 200 }} formatter={v => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}><SingleGrid<PayDeductTable> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.deductTableId)} /></div>
      </div>
    </LookupModal>
  );
};
