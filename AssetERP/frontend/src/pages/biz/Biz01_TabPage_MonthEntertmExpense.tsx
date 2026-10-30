/**
 * 접대비 현황 > 월별 제공금액 누계 탭 (U18)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_MonthEntertmExpense.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-83: center = 그리드 하나(buildGrid L103-124: 사용자 80 · 1월~12월 110 · 합 계 120, 맨 아래 합계 행 "계" — getSumGrid("계", 1, 2, 14)).
 *   문서분류(classTreeFullName)·[상신] 칸은 폼을 만들지만 화면에 붙이지 않는다(L60-72, cp를 어디에도 add하지 않음) → TOBE도 그리지 않는다. 같은 일은 본 화면(Biz01_Tab_EntertmExpenseReport) 아래 칸이 한다
 * 스타일: 탭 페이지(대상 아님)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizEntertmExpenseApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizEntertmMonth } from '@/types/biz';
import { EntertmParam, EntertmTabHandle } from './bizEntertmTab';

const gb = gbFor<BizEntertmMonth>();

const SUM_FIELDS = ['janSum', 'febSum', 'marSum', 'aprSum', 'maySum', 'junSum', 'julSum', 'augSum', 'sepSum', 'octSum', 'novSum', 'decSum', 'totalSum'];

// [E0] 화면 열림 (생성자 L57-83) → settings(), defaultName() — 문서분류·[상신]은 화면에 붙지 않는 코드라 본 화면 아래 칸이 대신한다
// [E1] classTreeFullName[문서분류].TriggerClick (L87) → openLookupDoc() — 화면에 붙지 않음(본 화면 [E5]가 한다)
// [E2] apprButton[상신].Select (L94) → insertLinkApproval() — 화면에 붙지 않음(본 화면 [E6]이 한다)
export const Biz01_TabPage_MonthEntertmExpense = forwardRef<EntertmTabHandle>((_props, ref) => {
  const [rows, setRows] = useState<BizEntertmMonth[]>([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = useMemo(() => [
    gb.textCenter('empName', 80, '사용자'),
    gb.long('janSum', 110, '1월'),
    gb.long('febSum', 110, '2월'),
    gb.long('marSum', 110, '3월'),
    gb.long('aprSum', 110, '4월'),
    gb.long('maySum', 110, '5월'),
    gb.long('junSum', 110, '6월'),
    gb.long('julSum', 110, '7월'),
    gb.long('augSum', 110, '8월'),
    gb.long('sepSum', 110, '9월'),
    gb.long('octSum', 110, '10월'),
    gb.long('novSum', 110, '11월'),
    gb.long('decSum', 110, '12월'),
    gb.long('totalSum', 120, '합 계'),
  ], []);

  // retrieve() L144-158: 서비스 biz.Biz01_Promo.selectByMonthEntertmExpense(companyId, year, closeDate, cardRealUserType)
  useImperativeHandle(ref, () => ({
    retrieve: async (p: EntertmParam) => {
      setLoading(true);
      try {
        setRows(await bizEntertmExpenseApi.searchMonthly(p));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      } finally {
        setLoading(false);
      }
    },
    init: () => setRows([]),
  }), []);

  return (
    <SingleGrid<BizEntertmMonth>
      rowData={rows}
      columnDefs={columnDefs}
      loading={loading}
      getRowId={p => String(p.data.promoId)}
      sumRow={{ labelField: 'empName', label: '계', sum: SUM_FIELDS }}
    />
  );
});
Biz01_TabPage_MonthEntertmExpense.displayName = 'Biz01_TabPage_MonthEntertmExpense';
