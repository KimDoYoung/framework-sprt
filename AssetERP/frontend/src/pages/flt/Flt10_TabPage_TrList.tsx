/**
 * 임직원매매명세 (J08) — 책임자보고 `Flt10_Tab_CeoReport`의 세 번째 탭
 * AS-IS: myApp/client/vi/flt/Flt10_TabPage_TrList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L28-32: center = grid 하나(체크박스 다중, 이름·소속·보고주기는 왼쪽 고정, 헤더 묶음 점검사항·매매내역).
 * 부모가 retrieve(말일, 1일, 재직구분 코드)를 부른다. 서버는 신고 계좌가 없는 사원을 뺀다(noAccountSkipYnCheck).
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { AgGridReact } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { FltCeoTr, FltCeoTabHandle } from '@/types/flt';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<FltCeoTr>();
const CHECK_COLOR = '#C13322';  // setHtmlGridStyle(…, "C13322") — 점검사항 열 제목 색
const colored = { headerStyle: { color: CHECK_COLOR, fontWeight: 'bold' } };

export const Flt10_TabPage_TrList = forwardRef<FltCeoTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<FltCeoTr> | null>(null);
  const [rows, setRows] = useState<FltCeoTr[]>([]);

  // [E0] 화면 열림 (생성자 L28-32) → 초기화

  // buildGrid01() L34-65 — 헤더 묶음 점검사항(L37, 3열)·매매내역(L38, 11열). 이름·소속·보고주기(L41-43)는 addTextFrozen
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 80, '이름', { pinned: 'left' }),  // L41
    gb.text('orgName', 150, '소속', { pinned: 'left' }),  // L42
    gb.textCenter('checkCycleName', 80, '보고주기', { pinned: 'left' }),  // L43
    { ...gb.group('점검사항', [
      gb.textCenter('trYn', 100, '매매여부', colored),  // L49
      gb.long('depositAmt', 130, '당해연도<br>순입금액', colored),  // L50
      gb.long('totalInvestAmt', 130, '총 누적<br>투자금액', colored),  // L51
    ]), ...colored },
    gb.group('매매내역', [
      gb.text('corpName', 180, '증권사'),  // L52
      gb.text('accountNo', 200, '계좌번호'),  // L53
      gb.text('accountName', 100, '계좌명'),  // L54
      gb.text('trItemName', 180, '매매종목'),  // L55
      gb.textCenter('trTypeName', 80, '거래구분'),  // L56
      gb.date('regDate', 90, '사전신고일'),  // L57 (원본 100 → UX-08)
      gb.double('expectTrQty', 100, '신고수량'),  // L58
      gb.date('trDate', 90, '매매일자'),  // L59 (원본 100 → UX-08)
      gb.double('trQty', 100, '매매수량'),  // L60
      gb.double('unitPrice', 120, '단가'),  // L61
      gb.long('trAmt', 150, '매매금액'),  // L62
    ]),
  ], []);

  // retrieve() L67-92: 서비스 flt.Flt10_Tr.selectByStdDate2(companyId, stdDate, noAccountSkipYnCheck=true, startDate, transCode) → 끝나면 첫 행 선택
  useImperativeHandle(ref, () => ({
    retrieve: async (stdDate, startDate, transCode) => {
      setRows(await fltApi.searchCeoTrs(stdDate, startDate, transCode));
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    },
  }), []);

  return (
    <MultiGrid<FltCeoTr>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.trId)}
    />
  );
});
Flt10_TabPage_TrList.displayName = 'Flt10_TabPage_TrList';
