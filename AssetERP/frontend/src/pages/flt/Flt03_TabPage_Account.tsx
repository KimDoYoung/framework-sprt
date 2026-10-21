/**
 * 임직원계좌신고내역 (J08) — 책임자보고 `Flt10_Tab_CeoReport`의 첫 번째 탭
 * AS-IS: myApp/client/vi/flt/Flt03_TabPage_Account.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L24-28: center = grid 하나(체크박스 다중). 부모가 retrieve(말일, 1일, 재직구분 코드)를 부른다.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { FltCeoAccount, FltCeoTabHandle } from '@/types/flt';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<FltCeoAccount>();

export const Flt03_TabPage_Account = forwardRef<FltCeoTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<FltCeoAccount> | null>(null);
  const [rows, setRows] = useState<FltCeoAccount[]>([]);

  // [E0] 화면 열림 (생성자 L24-28) → 초기화

  // buildGrid01() L30-43
  const columnDefs = useMemo(() => [
    gb.date('apprEffectDate', 90, '신고일자'),  // L33 (원본 100 → UX-08)
    gb.textCenter('checkCycleName', 80, '보고주기'),  // L34
    gb.textCenter('personName', 80, '이름'),  // L35
    gb.text('orgName', 150, '소속'),  // L36
    gb.text('corpName', 180, '증권사'),  // L37
    gb.text('accountNoDec', 200, '계좌번호'),  // L38
    gb.textCenter('accountName', 100, '계좌명'),  // L39
    gb.textCenter('familyRelateName', 80, '관계'),  // L40
  ], []);

  // retrieve() L45-69: 서비스 flt.Flt03_Account.selectByStdDate(companyId, stdDate, startDate, transCode) → 끝나면 첫 행 선택
  useImperativeHandle(ref, () => ({
    retrieve: async (stdDate, startDate, transCode) => {
      setRows(await fltApi.searchCeoAccounts(stdDate, startDate, transCode));
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    },
  }), []);

  return (
    <MultiGrid<FltCeoAccount>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.accountId)}
    />
  );
});
Flt03_TabPage_Account.displayName = 'Flt03_TabPage_Account';
