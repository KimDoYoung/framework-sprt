/**
 * 펀드보수 월말잔액 대사 창 (X24) — Icam12_Tab_OfficeMngFeeBook의 [ICAM 월말잔액 대사]에서 연다
 * AS-IS: myApp/client/vi/icam/Icam13_Lookup_FeeBookCheck.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate) L46-74: 모달 "펀드보수 월말잔액 대사" 1100×500, 위 = 툴바([잔액대사][조회] + 안내 라벨), 아래 = 결과 그리드(5열, 체크박스 없음), 가운데 [닫기]. 열자마자 retrieve()
 * 열 폭 합계 100+620+90+80+140 = 1030 (+행번호 약 60 + 여백 130) → 1100 (03 원칙 21: 1120 이하는 합계대로, AS-IS 1100보다 작게 하지 않는다)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeBookCheck } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<IcamFeeBookCheck>();

/** AS-IS buildGrid() L99-110 */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textArea('result', 620, '결과'),
  gb.double('diffAmt', 90, '차이금액'),
  gb.textCenter('workerName', 80, '작업자'),
  gb.text('workDateString', 140, '작업일시'),
];

interface Props {
  /** 기준일('yyyy-MM-dd', 월말) — 값이 있으면 열림 */
  stdDate: string | null;
  onClose: () => void;
}

export const Icam13_Lookup_FeeBookCheck: React.FC<Props> = ({ stdDate, onClose }) => {
  const [rows, setRows] = useState<IcamFeeBookCheck[]>([]);
  const [loading, setLoading] = useState(false);

  // [E1] retrieveButton[조회].Select (L78) → retrieve() L112-123: icam.Icam13_FeeBookCheck.selectByStdDate(companyId, stdDate)
  const retrieve = useCallback(async () => {
    if (!stdDate) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await icamApi.searchFeeBookChecks(stdDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [stdDate]);

  // open() 마지막 줄 retrieve()
  useEffect(() => {
    setRows([]);
    void retrieve();
  }, [retrieve]);

  // [E2] checkButton[잔액대사].Select (L84) → check() L125-142: grid.mask("처리중 입니다") → checkFeeBook → retrieve()
  const check = async () => {
    if (!stdDate) return;
    setLoading(true);
    try {
      await icamApi.checkFeeBook(stdDate);
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    } finally {
      setLoading(false);
    }
    await retrieve();
  };

  return (
    <LookupModal
      open={!!stdDate}
      title="펀드보수 월말잔액 대사"
      width={1100}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancelButton[닫기].Select (L91) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', height: 'min(420px, calc(100vh - 250px))', boxSizing: 'border-box' }}>
        <Space>
          <Button type="register" onClick={check}>잔액대사</Button>
          <Button type="search" onClick={retrieve}>조회</Button>
          <span style={{ color: '#646362' }}>기준일: {stdDate}</span>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamFeeBookCheck> rowData={rows} loading={loading} columnDefs={columnDefs} getRowId={p => `${p.data.stdDate}-${p.data.workDateString}-${p.data.result}`} />
        </div>
      </div>
    </LookupModal>
  );
};
