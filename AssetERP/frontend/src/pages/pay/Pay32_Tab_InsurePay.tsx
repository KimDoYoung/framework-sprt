/**
 * [1276] 경영관리 > 04. 급여관리 > 4대보험 정산내역 (S27) — 스타일: SG (견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx)
 * AS-IS: myApp/client/vi/pay/Pay32_Tab_InsurePay.java (240줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L66-94: 가운데(여백 20, 테두리) = 툴바 50(기준년도 · 사원명 · 구분(InsureCode003 콤보, 기본 "전체") · [조회]) + 정산 그리드(체크 다중, 합계 행). 열 때 조회한다.
 * 합계 행(buildGrid L193-194): 성명 칸에 "합계", 정산보험료(tgtAmt)만 더한다.
 * 함께: Pay32_Lookup_Detail(납부상세 창, S16 부품 — 정산 행에서 열 때는 구분·기준년도를 그 행에서)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayInsurePay } from '@/types/pay';
import { SearchBar } from '@/components/search';
import { MultiGrid, SumRow, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PayInsurePersonField } from './payInsureApplyTab';
import { Pay32_Lookup_Detail } from './Pay32_Lookup_Detail';

const gb = gbFor<PayInsurePay>();

// getSumGrid: setSumGridHeader("합계", 3) = 성명 칸, setSumGrid(5) = 정산보험료
const SUM_ROW: SumRow = { labelField: 'personNm', label: '합계', sum: ['tgtAmt'] };

export const Pay32_Tab_InsurePay: React.FC = () => {
  // settings() L96-: 기준년도 = 작년, 구분 = 전체("%")
  const [yearText, setYearText] = useState(() => String(dayjs().year() - 1));
  const [insureCode, setInsureCode] = useState('%');
  const [rows, setRows] = useState<PayInsurePay[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<{ personId: number; year: string; insureName: string } | null>(null);
  const personIdRef = useRef<number | null>(null);
  const latest = useRef({ yearText, insureCode });
  latest.current = { yearText, insureCode };

  // retrieve() L216-235: 기준년도가 없으면 "신고년도를 입력해주세요", pay.Pay32_InsurePay.selectByCompanyId(personId, insureCode, year)
  const retrieve = async () => {
    if (latest.current.yearText.trim() === '') {
      message.warning('신고년도를 입력해주세요');
      return;
    }
    setLoading(true);
    try {
      setRows(await payApi.searchInsurePaysByCompany({ personId: personIdRef.current, insureCode: latest.current.insureCode, year: latest.current.yearText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L66-94) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L172-197 — MultiGrid(Pay32_InsurePayModel), 체크 다중 + 합계 행
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 80, '사번'),
    gb.textCenter('personNm', 100, '성명'),
    gb.textCenter('insureNm', 150, '구분'),
    gb.long('tgtAmt', 200, '정산보험료'),
    gb.textCenter('payNm', 150, '납부방법'),
    gb.longCenter('payDiv', 150, '분할납부회차'),
    gb.long('remAmt', 200, '잔여 정산보험료'),
    // actionCell(ImageCell "View") L173-181 → Pay32_Lookup_Detail.open(선택한 정산 행)
    iconCell<PayInsurePay>('view', 'actionCell', 60, '납부상세', row => setDetail({ personId: row.personId, year: row.year ?? '', insureName: row.insureNm ?? '' })),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L164) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="기준년도">
            {/* [E2] yearText.KeyPress [Enter] (L116) → retrieve() */}
            <Input style={{ width: 60 }} placeholder="YYYY" value={yearText}
              onChange={e => { latest.current.yearText = e.target.value; setYearText(e.target.value); }}
              onPressEnter={() => void retrieve()} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            {/* [E3] personName.TriggerClick (L126) → openLookupPerson() · [E4] personName.ValueChange (L132) */}
            <PayInsurePersonField onChange={(id, doRetrieve) => { personIdRef.current = id; if (doRetrieve) void retrieve(); }} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E1] insureComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L105) → retrieve() */}
            <SystemCodeComboBox kindGroupCd="InsureCode003" altCode={['%', '전체']} style={{ width: 120 }} value={insureCode}
              onChange={code => { const c = code ?? '%'; latest.current.insureCode = c; setInsureCode(c); void retrieve(); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayInsurePay> rowData={rows} columnDefs={columnDefs} sumRow={SUM_ROW} getRowId={p => String(p.data.insurePayId)} />
        </div>
      </div>
      <Pay32_Lookup_Detail target={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
