/**
 * 접대비 현황 > 월별 제공금액 누계 탭 (U18)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_MonthEntertmExpense.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-83: center = 그리드 하나(buildGrid L103-124: 사용자 80 · 1월~12월 110 · 합 계 120, 맨 아래 합계 행 "계" — getSumGrid("계", 1, 2, 14)).
 *   문서분류(classTreeFullName)·[상신] 칸은 폼을 만들지만 화면에 붙이지 않는다(L60-72, cp를 어디에도 add하지 않음) → TOBE도 그리지 않는다. 같은 일은 본 화면(Biz01_Tab_EntertmExpenseReport) 아래 칸이 한다
 * 스타일: 탭 페이지(대상 아님). 그리드 스타일 grid-SUM (docs/grid-style.md — 견본) — 이 그리드의 특징:
 *   ① 열 폭 = AS-IS 폭을 비율(flex)로, 최소 폭은 값·제목 길이로 계산(fitCols) → 숫자가 잘리지 않고 가로 스크롤을 피한다
 *   ② 합계 행 = 맨 아래 고정이 아니라 마지막 내역 바로 다음 행(위 2px #91caff 선, 굵은 글씨, 행번호 숨김, 클릭 불가)
 *   ③ 모든 셀 오른쪽 세로선 1px #e0e0e0  ④ 합 계 열은 사용자 바로 뒤, 숫자만 굵은 파랑(#1677ff), 배경은 다른 열과 같게
 *   사용자 요청(2026-10-30)으로 AS-IS와 다른 점: 합 계 열 위치(AS-IS는 맨 오른쪽), 합계 행 위치(AS-IS는 맨 아래 고정)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizEntertmExpenseApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizEntertmMonth } from '@/types/biz';
import { EntertmParam, EntertmTabHandle, fitCols, gridSumCss, totalRowClass, withTotalRow } from './bizEntertmTab';

const gb = gbFor<BizEntertmMonth>();

const SUM_FIELDS = ['janSum', 'febSum', 'marSum', 'aprSum', 'maySum', 'junSum', 'julSum', 'augSum', 'sepSum', 'octSum', 'novSum', 'decSum', 'totalSum'];

// [E0] 화면 열림 (생성자 L57-83) → settings(), defaultName() — 문서분류·[상신]은 화면에 붙지 않는 코드라 본 화면 아래 칸이 대신한다
// [E1] classTreeFullName[문서분류].TriggerClick (L87) → openLookupDoc() — 화면에 붙지 않음(본 화면 [E5]가 한다)
// [E2] apprButton[상신].Select (L94) → insertLinkApproval() — 화면에 붙지 않음(본 화면 [E6]이 한다)
export const Biz01_TabPage_MonthEntertmExpense = forwardRef<EntertmTabHandle>((_props, ref) => {
  const [rows, setRows] = useState<BizEntertmMonth[]>([]);
  const [loading, setLoading] = useState(false);

  const columnDefs = useMemo(() => fitCols([
    gb.textCenter('empName', 80, '사용자'),
    // 사용자 요청(2026-10-30): 합 계를 사용자 바로 뒤로 옮기고 굵은 파랑으로 보인다 (AS-IS는 맨 오른쪽)
    gb.long('totalSum', 120, '합 계', { cellStyle: { fontWeight: 'bold', color: '#1677ff' } }),
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
  ], rows), [rows]);

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

  // 합계 행(AS-IS getSumGrid "계")을 맨 아래 고정이 아니라 마지막 내역 바로 다음 행으로 둔다 (grid-SUM, 사용자 요청 2026-10-30)
  const data = useMemo(() => withTotalRow(rows, 'promoId', 'empName', SUM_FIELDS as (keyof BizEntertmMonth)[]), [rows]);

  return (
    <div className="entertm-month" style={{ height: '100%' }}>
      <style>{gridSumCss('entertm-month')}</style>
      <SingleGrid<BizEntertmMonth>
        rowData={data}
        columnDefs={columnDefs}
        loading={loading}
        getRowId={p => String(p.data.promoId)}
        getRowClass={totalRowClass<BizEntertmMonth>('promoId')}
      />
    </div>
  );
});
Biz01_TabPage_MonthEntertmExpense.displayName = 'Biz01_TabPage_MonthEntertmExpense';
