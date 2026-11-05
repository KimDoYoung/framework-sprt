/**
 * 자유게시판 (U2-01) — AS-IS 메뉴 없음(sys06_menu에 클래스 없음, 다른 화면에서도 열지 않는 화면)
 * AS-IS: myApp/client/vi/bbs/Bbs01_Tab_Board.java (230줄) + Bbs01_Edit_Board(오른쪽 읽기 전용 패널) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L44-81: north = 툴바 50(구분 콤보 200 "전체" · 제목으로 찾기 240 · [조회]), center = 글 그리드(단일 선택), east 60%(최대 1000) = Bbs01_Edit_Board
 * deleteRow() L191은 호출처가 없어 도달할 수 없다([E4] 생략). editBoard() L103도 미사용
 * 스타일: SGHF (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsFreeBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsBoard } from '@/types/bbs';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Bbs01_Edit_Board } from './Bbs01_Edit_Board';

const gb = gbFor<BbsBoard>();

export const Bbs01_Tab_Board: React.FC = () => {
  const gridRef = useRef<AgGridReact<BbsBoard>>(null);
  const sp = useSearchParams(() => ({ typeCode: '%', searchText: '' }));
  const { typeCode, searchText } = sp.values;
  const [rows, setRows] = useState<BbsBoard[]>([]);
  const [current, setCurrent] = useState<BbsBoard | null>(null);

  // [E0] 화면 열림 (생성자 L44-81) → retrieve() · [E1] searchText[제목으로 찾기].EnterKey (L53) → retrieve() · [E2] searchBarBuilder[조회].Retrieve (L55) → retrieve()
  // retrieve() L127-145: bbs.Bbs01_Board.selectByCompanyId(typeCode, title, companyId) → 끝나면 첫 행을 고른다
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      const list = await bbsFreeBoardApi.search(v.typeCode, v.searchText);
      setRows(list);
      setCurrent(null);
      if (list.length > 0) {
        // 그리드가 새 행을 그린 뒤 첫 행 선택 (AS-IS grid.getSelectionModel().select(0, false))
        setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].boardId))?.setSelected(true), 0);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 → retrieve()
  React.useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] grid.SelectionChanged [선택>0] (L69) → retrieveEditPage() L110-123: 고른 글을 오른쪽 패널에 넘긴다(없으면 비움)
  const columnDefs = useMemo(() => [
    gb.text('typeName', 70, '구분'),  // L86
    gb.text('title', 300, '제목'),  // L87
    gb.text('writeUserName', 100, '작성자'),  // L88
    gb.date('writeDate', 100, '작성일'),  // L89
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={400}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ padding: '0 10px 10px 10px' }}>
              <SearchBar onSearch={retrieve}>
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindCd="BoardTypeCode" altCode={['%', '전체']} style={{ width: 200 }} value={typeCode}
                    onChange={c => sp.set('typeCode', c ?? '%')} />
                </SearchBar.Field>
                <SearchBar.Field label="제목으로 찾기">
                  <SearchBar.Input style={{ width: 240 }} value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<BbsBoard>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.boardId)}
                onSelect={row => setCurrent(row ?? null)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="60%" min={300} max={1000}>
          <Bbs01_Edit_Board board={current} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
