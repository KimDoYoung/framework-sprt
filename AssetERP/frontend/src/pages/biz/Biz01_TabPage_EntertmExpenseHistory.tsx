/**
 * 접대비 현황 > 제공 내역 탭 (U18)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_EntertmExpenseHistory.java (130줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L35-53: 가로 2칸 — 왼쪽 0.70 = 제공 내역 그리드(buildGrid L67-80: 사용자 70 · 카드승인일 100 · 가맹점명 240 · 결제금액 100 · 제공금액 100 · 인원 70 · 인당 경제적가치 100 · 비고 270,
 *   맨 아래 합계 행 "계" — getSumGrid("계", 2, 4, 5)), 오른쪽 0.30 = Biz02_Grid_PersonList(직원 위·거래상대방 아래, setButtonVisible(false)로 [등록][삭제] 감춤)
 * 스타일: 탭 페이지(대상 아님)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizEntertmExpenseApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizEntertmHistory } from '@/types/biz';
import { Biz02_Grid_PersonList } from './Biz02_Grid_PersonList';
import { EntertmParam, EntertmTabHandle, fitCols, gridSumCss, totalRowClass, withTotalRow } from './bizEntertmTab';

const gb = gbFor<BizEntertmHistory>();

// [E0] 화면 열림 (생성자 L35-53) → setting(): personList.setButtonVisible(false) · personList.setting()(두 목록 비활성), retrieve()
// 마지막 retrieve() 콜백이 personList.setting()을 다시 불러 목록은 늘 비활성(흐리게) 상태다 — 읽기 전용 표시
export const Biz01_TabPage_EntertmExpenseHistory = forwardRef<EntertmTabHandle>((_props, ref) => {
  const [rows, setRows] = useState<BizEntertmHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoId, setPromoId] = useState<number | null>(null);

  // 합계 행(AS-IS getSumGrid("계", 2, 4, 5) — 카드승인일 열에 "계", 결제금액·제공금액 합)은 마지막 내역 바로 다음 행 (grid-SUM)
  const data = useMemo(() => withTotalRow(rows, 'promoId', 'approvalDt', ['provideAmt', 'averageProvideAmt']), [rows]);

  const columnDefs = useMemo(() => fitCols([
    gb.textCenter('regEmpName', 70, '사용자'),
    gb.date('approvalDt', 100, '카드승인일'),
    gb.text('franchiseName', 240, '가맹점명'),
    gb.long('provideAmt', 100, '결제금액'),
    gb.long('averageProvideAmt', 100, '제공금액'),
    gb.long('totalPeple', 70, '인원'),
    gb.long('averagePrice', 100, '인당 경제적가치'),
    gb.text('note', 270, '비고'),
  ], rows), [rows]);

  // retrieve() L109-123: 서비스 biz.Biz01_Promo.selectByAccountName(companyId, year, closeDate, cardRealUserType) → personList.setting()(비활성)
  useImperativeHandle(ref, () => ({
    retrieve: async (p: EntertmParam) => {
      setLoading(true);
      try {
        setRows(await bizEntertmExpenseApi.searchHistory(p));
        setPromoId(null);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      } finally {
        setLoading(false);
      }
    },
    init: () => { setRows([]); setPromoId(null); },
  }), []);

  return (
    <div style={{ height: '100%', display: 'flex', minHeight: 0 }}>
      <div className="entertm-history" style={{ flex: '0 0 70%', minWidth: 0, boxSizing: 'border-box', borderRight: '1px solid #d9d9d9' }}>
        <style>{gridSumCss('entertm-history')}</style>
        {/* [E1] grid.RowClick (L59) → retrieveTabpage() L100-107: personList.retrieve(고른 내역) — 직원·거래상대방 두 목록을 읽는다 */}
        <SingleGrid<BizEntertmHistory>
          rowData={data}
          columnDefs={columnDefs}
          loading={loading}
          getRowId={p => String(p.data.promoId)}
          onSelect={row => setPromoId(row?.promoId ?? null)}
          getRowClass={totalRowClass<BizEntertmHistory>('promoId')}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0, opacity: 0.6 }}>
        <Biz02_Grid_PersonList promo={promoId == null ? null : { promoId }} closed refreshKey={0} onChanged={() => undefined} />
      </div>
    </div>
  );
});
Biz01_TabPage_EntertmExpenseHistory.displayName = 'Biz01_TabPage_EntertmExpenseHistory';
