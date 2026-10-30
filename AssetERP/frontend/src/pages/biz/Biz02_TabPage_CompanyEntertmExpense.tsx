/**
 * 접대비 현황 > 거래처별 제공금액 탭 (U18)
 * AS-IS: myApp/client/vi/biz/Biz02_TabPage_CompanyEntertmExpense.java (155줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L36-49: 가로 2칸 — 왼쪽 0.3 = 거래처 그리드(buildGrid L65-73: 회사명 200(HTML) · 접대비 200, 맨 아래 합계 행 "계" — getSumGrid("계", 1, 2, 2)),
 *   오른쪽 0.7 = 제공 내역 그리드(buildReportGrid L75-88: 사용자 70 · 카드승인일 100 · 가맹점명 240 · 결제금액 100 · 제공금액 100 · 인원 70 · 인당 경제적가치 100 · 비고 270, 합계 행 없음)
 * 스타일: 탭 페이지(대상 아님)
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizEntertmExpenseApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { SingleGrid, gbFor } from '@/components/grid';
import { BizEntertmCompany, BizEntertmHistory } from '@/types/biz';
import { EntertmParam, EntertmTabHandle, fitCols, gridSumCss, totalRowClass, withTotalRow } from './bizEntertmTab';

const gbCompany = gbFor<BizEntertmCompany>();
const gbReport = gbFor<BizEntertmHistory>();

// [E0] 화면 열림 (생성자 L36-49) → settings(): 거래처 그리드 선택 바뀜 처리, retrieve()
export const Biz02_TabPage_CompanyEntertmExpense = forwardRef<EntertmTabHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<BizEntertmCompany>>(null);
  const paramRef = useRef<EntertmParam | null>(null);
  const [companies, setCompanies] = useState<BizEntertmCompany[]>([]);
  const [reports, setReports] = useState<BizEntertmHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // 합계 행(AS-IS getSumGrid("계", 1, 2, 2) — 회사명 열에 "계", 접대비 합)은 마지막 거래처 바로 다음 행 (grid-SUM)
  const companyData = useMemo(() => withTotalRow(companies, 'personId', 'htmlTargetCompanyName', ['entertmExpenseSum']), [companies]);

  const companyCols = useMemo(() => fitCols([
    gbCompany.textHtml('htmlTargetCompanyName', 200, '회사명'),
    gbCompany.long('entertmExpenseSum', 200, '접대비'),
  ], companies), [companies]);
  const reportCols = useMemo(() => fitCols([
    gbReport.textCenter('regEmpName', 70, '사용자'),
    gbReport.date('approvalDt', 100, '카드승인일'),
    gbReport.text('franchiseName', 240, '가맹점명'),
    gbReport.long('provideAmt', 100, '결제금액'),
    gbReport.long('averageProvideAmt', 100, '제공금액'),
    gbReport.long('totalPeple', 70, '인원'),
    gbReport.long('averagePrice', 100, '인당 경제적가치'),
    gbReport.text('note', 270, '비고'),
  ], reports), [reports]);

  // [E1] grid.SelectionChanged [선택>0] (L52) → retrieve(personModel) L131-147: 서비스 biz.Biz01_Promo.selectByTargetCompanyName(companyId, year, closeDate, cardRealUserType, targetCompanyName)
  const retrieveReport = useCallback(async (row: BizEntertmCompany | undefined) => {
    const p = paramRef.current;
    if (!row || !p || row.targetCompanyName == null) return;
    setReportLoading(true);
    try {
      setReports(await bizEntertmExpenseApi.searchByTargetCompany(p, row.targetCompanyName));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setReportLoading(false);
    }
  }, []);

  // retrieve() L108-129: 서비스 biz.Biz02_Person.selectByEntertmExpense(companyId, year, closeDate) → 첫 행을 고른다(num = 0)
  useImperativeHandle(ref, () => ({
    retrieve: async (p: EntertmParam) => {
      paramRef.current = p;
      setLoading(true);
      try {
        const list = await bizEntertmExpenseApi.searchCompanies(p);
        setCompanies(list);
        setReports([]);
        if (list.length > 0) setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      } finally {
        setLoading(false);
      }
    },
    init: () => { setCompanies([]); setReports([]); },
  }), []);

  return (
    <div style={{ height: '100%', display: 'flex', minHeight: 0 }}>
      <div className="entertm-company" style={{ flex: '0 0 30%', minWidth: 0, boxSizing: 'border-box', borderRight: '1px solid #d9d9d9' }}>
        <style>{gridSumCss('entertm-company')}</style>
        <SingleGrid<BizEntertmCompany>
          gridRef={gridRef}
          rowData={companyData}
          columnDefs={companyCols}
          loading={loading}
          getRowId={p => String(p.data.personId)}
          onSelect={row => void retrieveReport(row)}
          getRowClass={totalRowClass<BizEntertmCompany>('personId')}
        />
      </div>
      <div className="entertm-company-report" style={{ flex: 1, minWidth: 0 }}>
        <style>{gridSumCss('entertm-company-report')}</style>
        <SingleGrid<BizEntertmHistory>
          rowData={reports}
          columnDefs={reportCols}
          loading={reportLoading}
          getRowId={p => String(p.data.promoId)}
        />
      </div>
    </div>
  );
});
Biz02_TabPage_CompanyEntertmExpense.displayName = 'Biz02_TabPage_CompanyEntertmExpense';
