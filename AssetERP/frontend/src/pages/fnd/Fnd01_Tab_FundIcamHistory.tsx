/**
 * [1327] 펀드관리 > 02. 펀드관리 > 펀드 조회(변경이력) (P08)
 * AS-IS: myApp/client/vi/fnd/Fnd01_Tab_FundIcamHistory.java (163줄) + Fnd01_Grid_FundIcamHistory.java (115줄, 오른쪽 변경이력 페이징 그리드)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-100: 위(50, 여백 20·20·0·20) 툴바 / 왼쪽 35%(분할, 최대 1000, 여백 0·0·20·20) 펀드 그리드 / 오른쪽 65%(최대 1000, 여백 0·20·20·0) 변경이력 그리드 + 페이징 100
 * 열 때 조회한다(생성자 끝 retrieve()). 조회가 끝나면 첫 행을 고른다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Splitter, message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundHistory } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Fnd01_Grid_FundIcamHistory } from './Fnd01_Grid_FundIcamHistory';

const gb = gbFor<FundHistory>();
/** setChecked 없음 → 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Fnd01_Tab_FundIcamHistory: React.FC = () => {
  // [E0] 화면 열림 (생성자 L42-100): 검색칸 빈칸 글자 "펀드코드/펀드명", 해지펀드포함 해제 → 곧바로 retrieve()
  const [searchText, setSearchText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [rows, setRows] = useState<FundHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const retrieveSeq = useRef(0);

  /** retrievePage(): 고른 펀드 → 오른쪽 변경이력 그리드 */
  const [fundCode, setFundCode] = useState<string | null>(null);

  // [E1] searchTextField.KeyPress [Enter] (L43) · [E2] retrieveButton[조회].Select (L52) → retrieve() L126-143: fnd.Fnd01_FundCode.selectByHistoryCompanyId
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchFundHistory({ closeYn, searchText });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      if (list.length === 0) retrievePage(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E3] grid.SelectionChanged (L60) → retrievePage() L116-123: 한 행이면 fundInfoGrid.retrieve(회사, 펀드코드), 아니면 setClear()
  const retrievePage = (row: FundHistory | null) => setFundCode(row ? row.fundCode : null);

  // 열 때 조회 (생성자 끝 retrieve())
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { void retrieveRef.current(); }, []);

  // buildGrid() L102-113 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 110, '펀드코드'),  // L106
    gb.text('fundName', 350, '펀드명'),  // L107
    gb.date('workDate', 90, '최신적용일'),  // L108
    gb.date('startDate', 90, '설정일'),  // L109
    gb.date('endDate', 90, '해지일'),  // L110
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        <div style={{ border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <SearchBar onSearch={() => void retrieve()} loading={loading}>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 300 }} placeholder="펀드코드/펀드명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
            <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
          </SearchBar>
        </div>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="35%" min={150} max={1000}>
          <div style={{ height: '100%', padding: '0 0 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <SingleGrid<FundHistory>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.fundCodeId)}
                loading={loading}
                rowSelection={SINGLE_CHECK}
                onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
                onSelectionChanged={e => {
                  const sel = e.api.getSelectedRows();
                  retrievePage(sel.length === 1 ? sel[0] : null);
                }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={150} max={1000}>
          <div style={{ height: '100%', padding: '0 20px 20px 0', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Fnd01_Grid_FundIcamHistory fundCode={fundCode} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
