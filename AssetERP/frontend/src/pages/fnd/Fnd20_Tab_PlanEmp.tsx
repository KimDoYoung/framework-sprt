/**
 * [1106] 펀드관리 > 01. 상품기획 > 상품기획문서 등록 (P04)
 * AS-IS: myApp/client/vi/fnd/Fnd20_Tab_PlanEmp.java (178줄) + Fnd20_TabPage_PlanEmp.java (235줄, 아래 펀드별 일정목록 탭)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-114: 위(40%, 여백 20·20·0·20) = 테두리 박스(툴바 50 + 기획펀드 그리드) / 아래(60%, 여백 20) = 펀드별 일정목록 탭(테두리)
 * 1단계: 아래 탭의 [결재요청] 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundPlanList } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Fnd20_TabPage_PlanEmp } from './Fnd20_TabPage_PlanEmp';

const gb = gbFor<FundPlanList>();
const ALL = '%';
/** 콤보 "전체"(fundTypeComboBox = ComboBoxField("IcamFundType", "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd20_Tab_PlanEmp: React.FC = () => {
  const gridRef = useRef<AgGridReact<FundPlanList>>(null);
  // [E0] 화면 열림 (생성자 L44-47) → init(), retrieve() — 열자마자 조회한다. 펀드유형 "전체"(200), 기획펀드 검색칸(400, 빈칸 글자 "전체"), 완료건포함 해제
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [fundText, setFundText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [rows, setRows] = useState<FundPlanList[]>([]);
  const [loading, setLoading] = useState(false);
  /** 아래 탭이 보여 줄 펀드 — 조회가 끝나면 첫 행, 행을 누르면 그 행(누를 때마다 nonce를 올려 다시 조회) */
  const [target, setTarget] = useState<{ fundId: number | null; nonce: number }>({ fundId: null, nonce: 0 });
  /** 다음 rowData 갱신 때 첫 행을 고른다 */
  const pendingFirst = useRef(false);
  const retrieveSeq = useRef(0);

  // [E1] fundSearchTextField.KeyPress [Enter] (L53)·[E2] retrieveButton[조회].Select (L61) → retrieve() L136-157: fnd.Fnd01_FundCode.selectByPlan
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchPlanFunds({ closeYn, fundName: fundText, fundTypeCode });
      if (my !== retrieveSeq.current) return;
      pendingFirst.current = list.length > 0;
      setRows(list);  // 조회가 끝나면 첫 행을 고르고 tabPage.retrieve(그 펀드)
      if (list.length === 0) setTarget(t => ({ fundId: null, nonce: t.nonce + 1 }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] grid.RowClick [data != null] (L67) → tabPage.retrieve(고른 행의 fundCodeId)
  const onRowClicked = (row: FundPlanList | undefined) => {
    if (row) setTarget(t => ({ fundId: row.fundCodeId, nonce: t.nonce + 1 }));
  };

  // buildGrid() L116-133
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 100, '펀드코드'),
    gb.text('fundName', 400, '펀드명'),
    gb.text('kofiaFundTypeName', 150, '펀드유형'),
    gb.date('startDate', 100, '설정일'),
    gb.date('endDate', 100, '해지일'),
    gb.text('closeName', 100, '해지여부'),
    gb.text('kofiaTrustName', 120, '신탁구분'),
    gb.text('kofiaPublicName', 160, '공모구분'),
    gb.text('note', 300, '비고'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="40%" min={120} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <SearchBar onSearch={() => void retrieve()} loading={loading}>
                <SearchBar.Field label="펀드유형">
                  <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 200 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="기획펀드">
                  <SearchBar.Input style={{ width: 400 }} placeholder="전체" value={fundText} onChange={e => setFundText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>완료건포함</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SingleGrid<FundPlanList>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => {
                    // 조회가 끝나면 첫 행을 고르고(select(0, false)) 그 펀드의 기획일정을 읽는다
                    if (!pendingFirst.current) return;
                    pendingFirst.current = false;
                    const node = e.api.getDisplayedRowAtIndex(0);
                    if (node?.data) {
                      node.setSelected(true);
                      setTarget(t => ({ fundId: node.data!.fundCodeId, nonce: t.nonce + 1 }));
                    }
                  }}
                  onRowClicked={e => onRowClicked(e.data)}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="60%" min={120} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 8 }}>
              <Fnd20_TabPage_PlanEmp target={target} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
