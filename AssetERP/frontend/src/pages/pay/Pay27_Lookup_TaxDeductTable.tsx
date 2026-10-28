/**
 * 산출기준 창 (S22) — Pay13_TabPage_RetireTax의 [산출기준]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay27_Lookup_TaxDeductTable.java (134줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-71: 1100×700 모달 "산출기준", 위 "세액공제" 제목(50) + 그리드 250(초과 130 · 이하 130 · 기본공제 130 · 적용율(%) 130 · 비고 500) +
 *   "세액공제 한도" 제목(50) + 그리드(초과 130 · 이하 130 · 최소한도 130 · 최대한도 130 · 적용율(%) 130 · 비고 500) + [닫기]. 둘 다 읽기 전용
 * retrieve() L111-129: pay.Pay27_TaxDeductTable.selectByMonthId(monthId) · pay.Pay28_TaxDeductLimit.selectByMonthId(monthId) — 급여 지급일 이전 가장 최근 적용일의 표
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayTaxDeduct, PayTaxDeductLimit } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayTaxDeduct>();
const gbLimit = gbFor<PayTaxDeductLimit>();

/** buildGrid() L82-94 */
const buildGrid = () => [
  gb.long('fromAmt', 130, '초과'),  // L87
  gb.long('toAmt', 130, '이하'),  // L88
  gb.long('deductAmt', 130, '기본공제'),  // L89
  gb.double('rate', 130, '적용율(%)'),  // L90
  gb.text('note', 500, '비고'),  // L91
];

/** buildLimitGrid() L96-109 */
const buildLimitGrid = () => [
  gbLimit.long('fromAmt', 130, '초과'),  // L101
  gbLimit.long('toAmt', 130, '이하'),  // L102
  gbLimit.long('minLimit', 130, '최소한도'),  // L103
  gbLimit.long('maxLimit', 130, '최대한도'),  // L104
  gbLimit.double('rate', 130, '적용율(%)'),  // L105
  gbLimit.text('note', 500, '비고'),  // L106
];

const TITLE: React.CSSProperties = { height: 50, display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 700, paddingLeft: 8, flexShrink: 0 };

interface Props {
  /** open(monthId) — 값이 있으면 열리고 곧바로 조회한다 */
  monthId: number | null;
  onClose: () => void;
}

export const Pay27_Lookup_TaxDeductTable: React.FC<Props> = ({ monthId, onClose }) => {
  const [deducts, setDeducts] = useState<PayTaxDeduct[]>([]);
  const [limits, setLimits] = useState<PayTaxDeductLimit[]>([]);
  const columnDefs = useMemo(buildGrid, []);
  const limitColumnDefs = useMemo(buildLimitGrid, []);

  // [E0] 화면 열림 (생성자 L42-71) → settings(), show() · open() → retrieve() L111-129
  useEffect(() => {
    if (monthId === null) return;
    setDeducts([]);
    setLimits([]);
    payApi.getRetireTaxDeduct(monthId).then(res => { setDeducts(res.deducts); setLimits(res.limits); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [monthId]);

  return (
    <LookupModal open={monthId !== null} title="산출기준" width={1130} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select (L74) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 580, display: 'flex', flexDirection: 'column' }}>
        <div style={TITLE}>세액공제</div>
        <div style={{ height: 250, flexShrink: 0 }}><SingleGrid<PayTaxDeduct> rowData={deducts} columnDefs={columnDefs} getRowId={p => String(p.data.taxDeductTableId)} /></div>
        <div style={TITLE}>세액공제 한도</div>
        <div style={{ flex: 1, minHeight: 0 }}><SingleGrid<PayTaxDeductLimit> rowData={limits} columnDefs={limitColumnDefs} getRowId={p => String(p.data.taxDeductLimitId)} /></div>
      </div>
    </LookupModal>
  );
};
