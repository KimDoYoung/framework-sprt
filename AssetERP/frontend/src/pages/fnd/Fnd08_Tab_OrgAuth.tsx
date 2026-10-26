/**
 * [1050] 펀드관리 > 02. 펀드관리 > 펀드 권한설정 (P06)
 * AS-IS: myApp/client/vi/fnd/Fnd08_Tab_OrgAuth.java (311줄) + Fnd08_Page_OrgAuth.java (오른쪽 트리, P02에서 변환) + Fnd08_Lookup_OrgAuth.java (331줄, components/lookup)
 *   + Fnd01_Lookup_SelectMulti(openAdmin)·Fnd00_Lookup_FundCode·Fnd08_Lookup_OrgCode — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-106: 위 툴바(50, 여백 20·20·-2·20, 테두리) / 왼쪽(0.5, 분할 가능, 최대 1000) = 펀드 그리드 / 가운데(0.5) = 조직 권한 트리(Fnd08_Page_OrgAuth)
 * P02(신규기획펀드 권한설정)와 같은 모양이지만 일반 펀드(planYn false) 목록이고 툴바에 펀드찾기·[일괄 권한설정]이 더 있다. 열 때 조회하지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundLookup, FundPlanAuth } from '@/types/fnd';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Fnd00_Lookup_FundCode } from '@/components/lookup/Fnd00_Lookup_FundCode';
import { Fnd08_Lookup_OrgCode } from '@/components/lookup/Fnd08_Lookup_OrgCode';
import { Fnd08_Lookup_OrgAuth } from '@/components/lookup/Fnd08_Lookup_OrgAuth';
import { Fnd08_Page_OrgAuth } from './Fnd08_Page_OrgAuth';

const gb = gbFor<FundPlanAuth>();
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd08_Tab_OrgAuth: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundPlanAuth>>(null);
  // [E0] 화면 열림 (생성자 L65-106) → settings() L108-180: 펀드유형 "전체"(150), 클래스구분 "전체"(120), 해지펀드포함 해제, 펀드찾기 빈칸 글자 "전체"(210), 권한부서 빈칸 글자 "전체"(150)
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [classTypeCode, setClassTypeCode] = useState<string>(ALL);
  const [closeYn, setCloseYn] = useState(false);
  const [org, setOrg] = useState<{ id: number; name: string } | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundOpen, setFundOpen] = useState(false);
  const [authAllOpen, setAuthAllOpen] = useState(false);
  const [rows, setRows] = useState<FundPlanAuth[]>([]);
  const [loading, setLoading] = useState(false);
  /** retrieveEditPage(): 고른 펀드 → 오른쪽 트리 */
  const [fundCodeId, setFundCodeId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);

  // [E5] retrieveButton[조회].Select (L162) → retrieve() L229-260: 권한부서가 없으면 fnd.Fnd01_FundCode.selectByFundName, 있으면 selectByFundOrgAuth (planYn false)
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFundAuths({ closeYn, fundName, fundTypeCode, classTypeCode, orgId: org?.id ?? null });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      if (list.length === 0) setFundCodeId(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E1] lookupPlanFundField.TriggerClick (L123) → openLookupFundCode() L217-226: Fnd00_Lookup_FundCode → 고른 펀드명
  const onFundResult = (f: FundLookup) => setFundName(f.fundName ?? '');
  // [E2] orgKorName.TriggerClick (L131) → Fnd08_Lookup_OrgCode.open → 고른 조직의 이름·id
  const onOrgResult = (o: OrgInfo) => setOrg({ id: o.orgCodeId, name: o.korNm ?? '' });
  // [E3] orgKorName.Change (L146) — 비우면(또는 "전체") 권한부서를 없앤다
  const clearOrg = () => setOrg(null);

  // [E7 생략] messageBox.DialogHide (L278) → deleteSelectedRow(): deleteRow() 호출처가 없어 도달도 불가 — 삭제 단추도 없다
  // [E4] grid.SelectionChanged [선택>0] (L154) → retrieveEditPage() L206-215: orgAuthTree.retrieve(fundCodeId)
  const retrieveEditPage = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (row) setFundCodeId(row.fundCodeId);
  };

  // buildGrid() L182-204 (고정 열 1~2)
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 90, '코드', { pinned: 'left' }),
    gb.text('fundName', 350, '펀드명', { pinned: 'left' }),
    gb.text('kofiaFundTypeName', 120, '펀드유형'),
    gb.date('startDate', 90, '생성일'),
    gb.date('endDate', 90, '해지일'),
    gb.text('closeName', 60, '해지여부'),
    gb.text('kofiaTrustName', 120, '신탁구분'),
    gb.text('kofiaPublicName', 130, '공모'),
    gb.text('orgCodeName', 150, '운용부서'),
    gb.text('operator1', 90, '운용역1'),
    gb.text('operator2', 90, '운용역2'),
    gb.text('note', 200, '비고'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0 20px', flexShrink: 0 }}>
        <div style={{ border: '1px solid #d9d9d9' }}>
          <SearchBar
            onSearch={() => void retrieve()}
            loading={loading}
            extra={
              /* [E6] authAllButton[일괄 권한설정].Select (L168) → Fnd08_Lookup_OrgAuth.open(callback: retrieve()) */
              <Button type="save" onClick={() => setAuthAllOpen(true)}>일괄 권한설정</Button>
            }
          >
            <SearchBar.Field label="권한부서">
              <LookupInput width={150} value={org?.name ?? ''} placeholder="전체" onOpen={() => setOrgOpen(true)} onClear={clearOrg} />
            </SearchBar.Field>
            <SearchBar.Field label="펀드유형">
              <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 150 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
            </SearchBar.Field>
            <SearchBar.Field label="클래스구분">
              <SystemCodeComboBox kindCd="IcamClassType" altCode={ALL_CODE} style={{ width: 120 }} value={classTypeCode} onChange={c => setClassTypeCode(c ?? ALL)} />
            </SearchBar.Field>
            <SearchBar.Field label="펀드찾기">
              <LookupInput width={210} value={fundName} placeholder="전체" onOpen={() => setFundOpen(true)} onClear={() => setFundName('')} />
            </SearchBar.Field>
            <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
          </SearchBar>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel defaultSize="50%" min={200} max={1000}>
            <div style={{ height: '100%', padding: '0 0 20px 20px', boxSizing: 'border-box' }}>
              <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                <SingleGrid<FundPlanAuth>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
                  onSelectionChanged={retrieveEditPage}
                />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel min={200}>
            <div style={{ height: '100%', padding: '0 20px 20px 0', boxSizing: 'border-box' }}>
              <Fnd08_Page_OrgAuth fundCodeId={fundCodeId} />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Fnd00_Lookup_FundCode open={fundOpen} onResult={onFundResult} onClose={() => setFundOpen(false)} />
      <Fnd08_Lookup_OrgCode open={orgOpen} onResult={onOrgResult} onClose={() => setOrgOpen(false)} />
      <Fnd08_Lookup_OrgAuth open={authAllOpen} onDone={() => void retrieve()} onClose={() => setAuthAllOpen(false)} />
    </div>
  );
};
