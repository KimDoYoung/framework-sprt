/**
 * [1122] 문서작성 > 03. 파일 및 양식관리 > 파일조회 (F12)
 * AS-IS: myApp/client/vi/fbx/Fbx01_Tab_Search.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-119: 위(높이 200, 분할) = 툴바(제목 350 · [조회]) + 파일보관함 그리드(체크박스 단일, 읽기 전용), 가운데 = 파일 목록(Fbx01_Grid_DocList)
 * 함께 쓰는 클래스: Fbx02_Popup_History(기록, F11 것을 재사용), Fbx01_Grid_DocList(파일 목록), Sys10_Lookup_FileViewer(미리보기, 파일 공통)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 원본에 초기화가 없어 UX-02는 넣지 않는다
 * insertRow()·deleteRow()·update()는 원본에 정의만 있고 화면에 연결된 버튼·이벤트가 없어(F11 복사 흔적) 옮기지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import { errorMessage } from '@/api/client';
import { fbxApi } from '@/api/fbx';
import { FbxBox } from '@/types/fbx';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar, useSearchParams } from '@/components/search';
import { Fbx01_Grid_DocList, Fbx01_Grid_DocListHandle } from './Fbx01_Grid_DocList';
import { Fbx02_Popup_History } from './Fbx02_Popup_History';

const gb = gbFor<FbxBox>();

export const Fbx01_Tab_Search: React.FC = () => {
  // searchText.setEmptyText("") L61 — 제목 빈칸
  const sp = useSearchParams(() => ({ searchText: '' }));
  const [rows, setRows] = useState<FbxBox[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyBoxId, setHistoryBoxId] = useState<number | null>(null);
  const docList = useRef<Fbx01_Grid_DocListHandle>(null);
  const selectFirst = useRef(false);
  const seq = useRef(0);

  // retrieve() L159-172: fbx.Fbx01_Box.selectByCompanyId(companyId, searchText) — 끝나면 첫 행을 고른다(select(0, false) — 셀 클릭이 아니라 [E3]은 일어나지 않는다)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);
    try {
      const list = await fbxApi.searchBoxes(sp.current.current.searchText);
      if (my !== seq.current) return;
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L55-58) → retrieve(), init()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4] statusComboBox[FbxBoxStatus].Collapse (L127-133) — 콤보를 만들어 두기만 하고 상태 컬럼에 붙이지 않아(addTextCenter) 닿을 수 없다. 옮기지 않음
  // [E5] msgBox.DialogHide [YES] (L199) → fbx.Fbx01_Box.delete — deleteRow() L192-217 안에 있고 deleteRow()를 부르는 버튼이 없다. 옮기지 않음
  // buildGrid() L121-152 (체크박스 단일 선택, 읽기 전용)
  const columnDefs = useMemo(() => [
    gb.date('crtDate', 100, '등록일'),  // L144
    gb.textCenter('statusName', 80, '상태'),  // L145
    gb.text('title', 550, '제목'),  // L146
    gb.text('note', 450, '비고'),  // L147
    gb.long('fileCount', 80, '파일갯수'),  // L148
    // L135-142 HistoryCell("History") → Fbx02_Popup_History.open(boxId)
    iconCell<FbxBox>('history', 'actionCell', 80, '기록', row => setHistoryBoxId(row.boxId)),  // L149
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        {/* northLayoutData: 높이 200, 분할 */}
        <Splitter.Panel defaultSize={200} min={120} max={1000}>
          <div style={{ height: '100%', paddingBottom: 10, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              {/* [E1] searchText.KeyPress [Enter] (L62) · [E2] retrieveButton[조회].Select (L71) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading}>
                <SearchBar.Field label="제목">
                  <SearchBar.Input style={{ width: 350 }} value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SingleGrid<FbxBox>
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.boxId)}
                  loading={loading}
                  rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                  onRowDataUpdated={e => {
                    // 조회 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false)). 처음 그릴 때의 빈 데이터 갱신은 건너뛴다
                    if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
                    selectFirst.current = false;
                    e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
                  }}
                  // [E3] grid.CellClick (L90) → retrieveDocList() L154-157: 고른 보관함으로 docList.retrieve(boxId)
                  onCellClicked={e => {
                    if (e.data) docList.current?.retrieve(e.data.boxId);
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', paddingTop: 10, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Fbx01_Grid_DocList ref={docList} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
      <Fbx02_Popup_History boxId={historyBoxId} onClose={() => setHistoryBoxId(null)} />
    </div>
  );
};
