/**
 * 전표확인 (S18) — Pay10_Tab_List의 [전표확인]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_Journal.java (156줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-89: 툴바 50 = [조회], 체크 다중 그리드(차변: 계정코드 120 · 계정과목 200 · 금액 120 · 관리계좌 150 / 대변 같은 열) + 아래 [닫기].
 * open(payDate, payType) L49-54가 바로 조회한다(act.Act03_JournalDtl.selectPayMonth). 열 합계 1180+60+130이 약 1120을 넘어 가로 스크롤을 허용한다(03 원칙 21)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalPayMonth } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<JournalPayMonth>();

interface Props {
  /** open(payDate, payType) — 값이 있으면 열린다 (payDate 'yyyy-MM-dd', payType = 지급구분 코드) */
  target: { payDate: string; payType: string } | null;
  onClose: () => void;
}

export const Pay10_Lookup_Journal: React.FC<Props> = ({ target, onClose }) => {
  const [rows, setRows] = useState<JournalPayMonth[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid(): 체크 다중(setChecked MULTI), 행번호 있음. 차변·대변 열이 같은 모양
  const columnDefs = useMemo(() => [
    gb.textCenter('drAccountCode', 120, '계정코드'),
    gb.textArea('drAccountName', 200, '계정과목'),
    gb.long('drAmt', 120, '금액'),
    gb.text('drAstName', 150, '관리계좌'),
    gb.textCenter('crAccountCode', 120, '계정코드'),
    gb.textArea('crAccountName', 200, '계정과목'),
    gb.long('crAmt', 120, '금액'),
    gb.text('crAstName', 150, '관리계좌'),
  ], []);

  // [E1] retrieveButton[조회].Select (L63) → retrieve() L117-134: companyId·payDate·payType → act.Act03_JournalDtl.selectPayMonth
  const retrieve = useCallback(async () => {
    if (target == null) return;
    setLoading(true);
    try {
      setRows(await actApi.searchPayMonthJournals(target.payDate, target.payType));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target]);

  // [E0] 화면 열림 (생성자 L56-89) → show(), open(payDate, payType) L49-54 → retrieve()
  useEffect(() => {
    if (target == null) return;
    setRows([]);
    void retrieve();
  }, [target, retrieve]);

  return (
    <LookupModal
      open={target != null}
      title="전표확인"
      width={1250}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] cancleButton[닫기].Select (L69) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button type="search" loading={loading} onClick={retrieve}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<JournalPayMonth>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.journalDtlId)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
