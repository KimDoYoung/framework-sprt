/**
 * [1047] 펀드관리 > 01. 상품기획 > 신규기획펀드 권한설정 (P02)
 * AS-IS: myApp/client/vi/fnd/Fnd08_Tab_OrgAuthTempFund.java (266줄) + Fnd08_Page_OrgAuth.java (147줄, 오른쪽 트리) + Fnd08_Lookup_OrgCode.java (154줄, components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L61-97: 위 툴바(50, 여백 20·20·-2·20, 테두리) / 왼쪽(0.5, 분할 가능, 최대 1000) = 임시펀드 그리드 / 가운데 = 조직 권한 트리(Fnd08_Page_OrgAuth)
 * 열 때 조회하지 않는다(생성자는 settings()만). 삭제 단추는 없고 deleteRow()는 호출처가 없어 만들지 않았다(E5 도달 불가)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건 4개 → 초기화(UX-02) 적용(값은 처음 연 상태로, 초기화 뒤 자동 조회 없음)
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundPlanAuth } from '@/types/fnd';
import { OrgInfo } from '@/types/emp';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Fnd08_Lookup_OrgCode } from '@/components/lookup/Fnd08_Lookup_OrgCode';
import { Fnd08_Page_OrgAuth } from './Fnd08_Page_OrgAuth';

const gb = gbFor<FundPlanAuth>();
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd08_Tab_OrgAuthTempFund: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundPlanAuth>>(null);
  // [E0] 화면 열림 (생성자 L61-97) → settings() L99-151: 펀드유형 "전체"(180), 클래스구분 "전체"(130), 해지펀드포함 해제, 권한부서 빈칸 글자 "전체"(250)
  const sp = useSearchParams(() => ({ fundTypeCode: ALL, classTypeCode: ALL, closeYn: false, org: null as { id: number; name: string } | null }));
  const { fundTypeCode, classTypeCode, closeYn, org } = sp.values;
  const [orgOpen, setOrgOpen] = useState(false);
  const [rows, setRows] = useState<FundPlanAuth[]>([]);
  const [loading, setLoading] = useState(false);
  /** retrieveEditPage(): 고른 펀드 → 오른쪽 트리 */
  const [fundCodeId, setFundCodeId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);

  // [E3] retrieveButton[조회].Select (L137) → retrieve() L183-215: 권한부서가 없으면 fnd.Fnd01_FundCode.selectByFundName, 있으면 selectByFundOrgAuth
  // (lookupPlanFundField는 원본 툴바에 붙어 있지 않아 펀드명 조건은 항상 빈 문자열 → 서버가 "%%")
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFundPlanAuths({ closeYn, fundName: '', fundTypeCode, classTypeCode, orgId: org?.id ?? null });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      if (list.length === 0) setFundCodeId(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E1] orgKorName.TriggerClick (L114) → Fnd08_Lookup_OrgCode.open → 고른 조직의 이름·id
  const onOrgResult = (o: OrgInfo) => sp.set('org', { id: o.orgCodeId, name: o.korNm ?? '' });
  // [E2] orgKorName.Change (L129) — 비우면(또는 "전체") 권한부서를 없앤다
  const clearOrg = () => sp.set('org', null);

  // [E5 생략] messageBox.DialogHide (L233) → deleteSelectedRow(): deleteRow() 호출처가 없어 도달 불가 — 삭제 단추도 없다
  // [E4] grid.SelectionChanged [선택>0] (L143) → retrieveEditPage() L171-180: orgAuthTree.retrieve(fundCodeId)
  const retrieveEditPage = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (row) setFundCodeId(row.fundCodeId);
  };

  // buildGrid() L153-169
  const columnDefs = useMemo(() => [
     gb.text('fundCode', 70, '코드'), 
    gb.text('fundName', 250, '펀드명'),
    gb.text('kofiaFundTypeName', 100, '펀드유형'),
    gb.date('startDate', 90, '등록일'),
    gb.date('endDate', 90, '예정일'),
    gb.text('closeName', 60, '해지여부'),
    gb.text('orgCodeName', 150, '운용부서'),
    gb.text('operator1', 90, '운용역'),
    gb.text('note', 200, '비고'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0 20px', flexShrink: 0 }}>
        <div>
          <SearchBar onSearch={() => void retrieve()} onReset={sp.reset} loading={loading}>
            <SearchBar.Field label="권한부서">
              <LookupInput width={250} value={org?.name ?? ''} placeholder="전체" onOpen={() => setOrgOpen(true)} onClear={clearOrg} />
            </SearchBar.Field>
            <SearchBar.Field label="펀드유형">
              <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 180 }} value={fundTypeCode} onChange={c => sp.set('fundTypeCode', c ?? ALL)} />
            </SearchBar.Field>
            <SearchBar.Field label="클래스구분">
              <SystemCodeComboBox kindCd="IcamClassType" altCode={ALL_CODE} style={{ width: 130 }} value={classTypeCode} onChange={c => sp.set('classTypeCode', c ?? ALL)} />
            </SearchBar.Field>
            <Checkbox checked={closeYn} onChange={e => sp.set('closeYn', e.target.checked)}>해지펀드포함</Checkbox>
          </SearchBar>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 , marginTop: 8}}>
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
      <Fnd08_Lookup_OrgCode open={orgOpen} onResult={onOrgResult} onClose={() => setOrgOpen(false)} />
    </div>
  );
};
