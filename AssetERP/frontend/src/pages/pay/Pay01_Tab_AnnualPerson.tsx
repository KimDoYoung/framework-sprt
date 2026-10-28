/**
 * 연봉조회 (S15) — 경영관리 > 03. 연봉관리 > 연봉조회 #1104
 * AS-IS: myApp/client/vi/pay/Pay01_Tab_AnnualPerson.java (142줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-64: 툴바 45([조회] 하나) + 본인 연봉 보기 그리드(2단 헤더 "기본정보"·"월급여 구성"). 열 때 곧바로 조회한다.
 * 조회 대상은 로그인 사용자 본인의 결재완료 연봉이다(서버가 로그인 사용자로 정한다).
 * 1단계: 상신상태 아이콘의 결재문서 보기(Apr01_Edit_ApprDoc, 다른 도메인 apr)는 다음 단계.
 * UX보강(10): 툴바 = SearchBar(UX-01), UX-08(읽기 전용 날짜 90)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayAnnual } from '@/types/pay';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';

const gb = gbFor<PayAnnual>();

export const Pay01_Tab_AnnualPerson: React.FC = () => {
  const [rows, setRows] = useState<PayAnnual[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L130-136: pay.Pay01_Annual.selectByPersonId(companyId, personId = 로그인 사용자, apprYn "true")
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await payApi.searchMyAnnuals());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L42-64) → retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // buildGrid() L66-128: SingleGrid(Pay01_AnnualModel), 2단 헤더 2개(기본정보 7열 · 월급여 구성 7열)
  const columnDefs = useMemo(() => [
    gb.group('기본정보', [
      gb.textCenter('personNo', 50, '사번'),
      gb.textCenter('personName', 80, '성명'),
      gb.date('startDate', 90, '적용시작일'),
      gb.date('closeDate', 90, '적용종료일'),
      gb.textCenter('startTime', 80, '시업시간'),
      gb.textCenter('closeTime', 80, '종업시간'),
      gb.longCenter('monthOtHours', 80, '월연장<br>근로시간'),
    ]),
    gb.long('annualPay', 100, '기본연봉'),
    gb.long('retirePay', 100, '퇴직금'),
    gb.long('yearPay', 100, '총연봉'),
    gb.text('etcAgreement', 100, '기타약정사항'),
    gb.group('월급여 구성', [
      gb.long('basicPay', 100, '기본급여'),
      gb.long('mealPay', 100, '중식대'),
      gb.long('carMt', 100, '차량유지비'),
      gb.long('childcareAllowance', 100, '양육수당'),
      gb.long('overPay', 100, '연장근로'),
      gb.long('etc01Pay', 100, '기타급여1'),
      gb.long('etc02Pay', 100, '기타급여2'),
    ]),
    gb.long('monthPay', 100, '합계'),
    gb.textCenter('apprStatusName', 100, '상신상태'),
    // [E2] actionCell (ImageCell).callbackOnCreate (L89) → 인라인 L89-94: 상신문서가 없으면 "상신문서가 없습니다", 있으면 Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
    iconCell<PayAnnual>('view', 'actionCell', 60, '', row => {
      if (row.apprId == null) { message.warning('상신문서가 없습니다'); return; }
      message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
    }),
  ], []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L45) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading} />
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PayAnnual> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.annualId)} />
        </div>
      </div>
    </div>
  );
};
