/**
 * [1277] 경영관리 > 04. 급여관리 > 급여공제정보 (S28)
 * AS-IS: myApp/client/vi/emp/Emp35_Tab_DeductPerson.java (239줄) + Emp35_Page_DeductDate.java (175줄) + Emp35_TabPage_DeductInsert.java (282줄)
 *        + 팝업 Emp36_Popup_AddDeduct (128줄)·Emp35_Popup_DeductCreate (116줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-62 → init() L136-153: BorderLayout 가운데(여백 20) = 툴바 45(재직구분 100 · 사원명 100 · [조회][기본설정][임금계산방법][급여출금계좌]) + 그리드,
 *   아래 400(여백 0,20,20,20) = Emp35_Page_DeductDate (C01-3 `Emp35_TabPage_DeductDate`와 같은 본문 — 날짜 목록 15% + 편집 폼 85%)
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 편집 폼 "4대보험 신고정보" 아이콘의 Pay31_Popup_InsureApply(E4, 다른 도메인 연결 창) — C01-3과 같이 안내만 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Select, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { DeductPerson, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Emp35_Page_DeductDate } from './Emp35_Page_DeductDate';
import { Pay30_Popup_BasicSetup } from '../pay/pay30_Popup_BasicSetup';
import { Pay04_Lookup_Formula } from '../pay/Pay04_Lookup_Formula';
import { Pay03_Lookup_PayAccount } from '../pay/Pay03_Lookup_PayAccount';
import dayjs from 'dayjs';

const gb = gbFor<DeductPerson>();

/** eventSetting() L81-88: 전체·재직·퇴직 ("겸직"은 주석 처리), 처음 값 "재직" */
const TRANS_OPTIONS = ['전체', '재직', '퇴직'].map(v => ({ value: v }));
/** retrieve() L171-184: 재직구분 이름 → transCode (그 밖은 000) */
const TRANS_CODES: Record<string, string> = { 겸직: '800', 퇴직: '900', 재직: '100' };

/** buildGrid() L155-169 — 사번 70 · 성명 100 · 입사일 150 · 생년월일 150 · 공제대상가족수 150 · 추가인적공제여부 150 · 4대보험가입 150 · 고용보험 미납부 150 · 국민연금 미납부 150 · 원천징수 비율(%) 150 */
const buildGrid = () => [
  gb.textCenter('personNo', 70, '사번'),
  gb.textCenter('personName', 100, '성명'),
  gb.date('hireDate', 150, '입사일'),
  gb.date('birthday', 150, '생년월일'),
  gb.longCenter('basicDeductCnt', 150, '공제대상가족수'),
  gb.boolean('addDeductYn', 150, '추가인적공제여부'),
  gb.boolean('insureYn', 150, '4대보험가입'),
  gb.boolean('reprYn', 150, '고용보험 미납부'),
  gb.boolean('npsYn', 150, '국민연금 미납부'),
  gb.longCenter('withHoldRate', 150, '원천징수 비율(%)'),
];

export const Emp35_Tab_DeductPerson: React.FC = () => {
  const gridRef = useRef<AgGridReact<DeductPerson>>(null);
  const columnDefs = useMemo(buildGrid, []);
  const [transName, setTransName] = useState('재직');
  const [personId, setPersonId] = useState<number | null>(null);
  const [personName, setPersonName] = useState('');
  const [rows, setRows] = useState<DeductPerson[]>([]);
  const [loading, setLoading] = useState(false);
  /** 아래 Emp35_Page_DeductDate가 보여 줄 사원 (grid.SelectionChanged → retrieveDeductDate) */
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [lookupPerson, setLookupPerson] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [payAccountOpen, setPayAccountOpen] = useState(false);

  // [E1] transName[재직].Collapse (L89) → retrieve(), [E3] retrieveButton[조회].Select (L102) → retrieve() L171-192
  const retrieve = useCallback(async (trans: string = transName, pid: number | null = personId) => {
    setLoading(true);
    try {
      setRows(await empApi.getDeductPersons({ personId: pid, transCode: TRANS_CODES[trans] ?? '000' }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [transName, personId]);

  // [E0] 화면 열림 (생성자 L58-62) → init(), eventSetting(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] personName.TriggerClick (L96) → openLookupPerson() L194-209: Emp00_Lookup_SelectSingle.open(true, 오늘, true, …) — [전체]는 사원을 비운다
  const onPickPerson = (r: TransInfo | null) => {
    setLookupPerson(false);
    setPersonId(r?.personId ?? null);
    setPersonName(r?.korNm ?? '');
  };

  // [E7] grid.SelectionChanged (L128) → retrieveDeductDate() L219-224: 고른 행이 있으면 아래 페이지가 그 사원으로 다시 읽는다 (없으면 그대로)
  const onSelect = (row: DeductPerson | undefined) => { if (row) setSelectedPersonId(row.personId); };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => retrieve()}
                loading={loading}
                extra={
                  <>
                    {/* [E4] settingButton[기본설정].Select (L108) → setting() L211-217: pay30_Popup_BasicSetup */}
                    <Button type="settings" onClick={() => setSettingOpen(true)}>기본설정</Button>
                    {/* [E5] formulaButton[임금계산방법].Select (L114) → lookupformula() L226-229: Pay04_Lookup_Formula */}
                    <Button type="view" onClick={() => setFormulaOpen(true)}>임금계산방법</Button>
                    {/* [E6] payAccountButton[급여출금계좌].Select (L121) → lookupPayAccount() L231-234: Pay03_Lookup_PayAccount */}
                    <Button type="view" onClick={() => setPayAccountOpen(true)}>급여출금계좌</Button>
                  </>
                }
              >
                <SearchBar.Field label="재직구분">
                  <Select style={{ width: 100 }} value={transName} options={TRANS_OPTIONS}
                    onChange={v => { setTransName(v); void retrieve(v); }} />
                </SearchBar.Field>
                <SearchBar.Field label="사원명">
                  <LookupInput width={100} value={personName} placeholder="전체" onOpen={() => setLookupPerson(true)}
                    onClear={() => { setPersonId(null); setPersonName(''); }} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<DeductPerson>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.personId)}
                  onSelect={onSelect}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={400} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Emp35_Page_DeductDate personId={selectedPersonId} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <Emp00_Lookup_SelectSingle open={lookupPerson} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')}
        onResult={onPickPerson} onClose={() => setLookupPerson(false)} />
      <Pay30_Popup_BasicSetup open={settingOpen} onClose={() => setSettingOpen(false)} />
      <Pay04_Lookup_Formula open={formulaOpen} onClose={() => setFormulaOpen(false)} />
      <Pay03_Lookup_PayAccount open={payAccountOpen} onClose={() => setPayAccountOpen(false)} />
    </div>
  );
};
