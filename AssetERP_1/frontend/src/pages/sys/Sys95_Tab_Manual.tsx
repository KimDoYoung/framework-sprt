/**
 * [1297] AssetERP 매뉴얼 (A33)
 * AS-IS: myApp/client/vi/sys/Sys95_Tab_Manual.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-93: 왼쪽 = 툴바(분류 · 검색어 · 조회) + 그리드(행번호, 단일 선택) + 아래 빨간 안내문 2줄(65·45), 오른쪽 1100 = Sys95_PDFViewer(분할)
 * UX보강(10): 툴바 = SearchBar(UX-01, 검색어 Enter·지우기=UX-04). 조건이 둘이라 초기화(UX-02)를 둔다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Manual } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Sys95_PDFViewer } from './Sys95_PDFViewer';

const gb = gbFor<Manual>();

/** AS-IS buildGrid() L135-143 */
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L138
  gb.text('manualTypeNm', 100, '분류'),  // L139 SQL 계산 컬럼(f_cdnm('ManualType', …))
  gb.text('fileNm', 300, '파일명'),  // L140 SQL 계산 컬럼(sys10_file_nm)
  gb.text('note', 500, '비고'),  // L141
];

const redNote: React.CSSProperties = { color: '#E82032', fontSize: 13, fontWeight: 'bold', lineHeight: '20px' };

export const Sys95_Tab_Manual: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const gridRef = useRef<AgGridReact<Manual>>(null);
  const selectFirst = useRef(false);
  const [rows, setRows] = useState<Manual[]>([]);
  const [selected, setSelected] = useState<Manual>();
  // typeComboBox ComboBoxField("ManualType", "%", "전체", "전체"), searchTextField TextField 빈칸="검색어 입력"
  const sp = useSearchParams(() => ({ manualType: '%', searchText: '' }));
  const { manualType, searchText } = sp.values;

  // retrieve() L145-172: 서비스 sys.Sys95_Manual.selectByText(manualType, searchText, publicCheck=true). 조회 뒤 첫 행을 선택하고 PDF면 열고 아니면 "none"
  const retrieve = useCallback(async (p: { manualType: string; searchText: string } = sp.current.current) => {
    try {
      const list = await sysApi.searchManuals(p);
      selectFirst.current = true;
      setSelected(undefined);
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp.current]);

  // [E0] 화면 열림 (생성자 L53-93) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  useEffect(() => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    if (rows.length > 0) setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
  }, [rows]);

  const isPdf = selected?.fileExt?.toLowerCase() === 'pdf';

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%', border: '1px solid #d9d9d9' }}>
        <Splitter.Panel min={300}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
            {/* [E4] retrieveButton[조회].Select (L127) → retrieve(). [E2] searchTextField.KeyPress [Enter] (L106) → retrieve() = SearchBar.Input */}
            <SearchBar onSearch={() => retrieve()} onReset={() => { sp.reset(); void retrieve({ manualType: '%', searchText: '' }); }}>
              <SearchBar.Field label="분류">
                {/* [E1] typeComboBox[ManualType].Collapse (L97) → retrieve() */}
                <SystemCodeComboBox kindCd="ManualType" altCode={['%', '전체']} style={{ width: 130 }} value={manualType}
                  onChange={v => { const next = v ?? '%'; sp.set('manualType', next); void retrieve({ manualType: next, searchText: sp.current.current.searchText }); }} />
              </SearchBar.Field>
              <SearchBar.Input placeholder="검색어 입력" style={{ width: 150 }} value={searchText}
                onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E3] grid.CellClick (L114) → 선택한 파일이 pdf면 viewer.open(PDF) 아니면 viewer.open("none") */}
              <SingleGrid<Manual>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.fileId)}
                onSelect={setSelected}
              />
            </div>
            <div style={{ flex: 'none', padding: '5px 0 5px 15px' }}>
              <div style={{ ...redNote, marginBottom: 6 }}>• 본 자료는 시스템 사용목적으로만 사용해 주시고 외부유출은 절대 금지하며,<br />&nbsp;&nbsp;&nbsp;제3자에게 제공 시 한국펀드서비스의 동의를 받아야 합니다.</div>
              <div style={redNote}>• 외부유출시 손해배상책임이 발생할 수 있으니 각별히 주의해 주시기 바랍니다.</div>
            </div>
          </div>
        </Splitter.Panel>
        {/* 원본 east 1100px 고정은 1920px 화면 기준이라 1600px 이하에서 왼쪽이 쓸 수 없게 좁아진다 → 55%로 둔다(분할선은 끌어서 조절, 작업기록 제안) */}
        <Splitter.Panel defaultSize="55%" min={300}>
          <Sys95_PDFViewer fileId={isPdf ? selected?.fileId : undefined} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
