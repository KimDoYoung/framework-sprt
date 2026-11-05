/**
 * 자유게시판 관리자 (U2-01) — AS-IS 메뉴 없음(sys06_menu에 클래스 없음, 다른 화면에서도 열지 않는 화면)
 * AS-IS: myApp/client/vi/bbs/Bbs01_Tab_BoardManager.java (245줄) + Bbs01_Edit_Board(오른쪽 읽기 전용 패널) + 등록 Bbs01_Lookup_BoardInsert · 수정 Bbs01_Lookup_BoardUpdate — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-92: north = 툴바 50(구분 콤보 200 "전체" · 제목으로 찾기 250 · [조회] [등록]), center = 글 그리드(단일 선택, 수정 아이콘 열), east 60%(최대 1000) = Bbs01_Edit_Board
 * 자유게시판(Bbs01_Tab_Board)과 다른 점: [등록] · "수정" 아이콘 열(L98-108) · 조회 뒤 첫 행을 자동으로 고르지 않는다(L146-152 주석). deleteRow() L203은 호출처가 없어 도달할 수 없다([E5] 생략)
 * 스타일: SGHF (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsFreeBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsBoard } from '@/types/bbs';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Bbs01_Edit_Board } from './Bbs01_Edit_Board';
import { Bbs01_Lookup_BoardInsert } from './Bbs01_Lookup_BoardInsert';
import { Bbs01_Lookup_BoardUpdate } from './Bbs01_Lookup_BoardUpdate';

const gb = gbFor<BbsBoard>();

export const Bbs01_Tab_BoardManager: React.FC = () => {
  const gridRef = useRef<AgGridReact<BbsBoard>>(null);
  const sp = useSearchParams(() => ({ typeCode: '%', searchText: '' }));
  const { typeCode, searchText } = sp.values;
  const [rows, setRows] = useState<BbsBoard[]>([]);
  const [current, setCurrent] = useState<BbsBoard | null>(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // retrieve() L138-157: bbs.Bbs01_Board.selectByCompanyId(typeCode, title, companyId) — 조회 뒤 자동 선택 없음
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      setRows(await bbsFreeBoardApi.search(v.typeCode, v.searchText));
      setCurrent(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 (생성자 L46-92) → retrieve() · [E1] searchText[제목으로 찾기].EnterKey (L55) → retrieve() · [E2] searchBarBuilder[조회].Retrieve (L56) → retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] searchBarBuilder[등록].Insert (L59) → insertRow() L167-200: 새 글 번호를 받아 등록 창(Bbs01_Lookup_BoardInsert)을 연다, 저장되면 다시 조회
  // [E4] grid.SelectionChanged [선택>0] (L79) → retrieveEditPage() L121-134: 고른 글을 오른쪽 패널에 넘긴다(없으면 비움)
  // buildGrid() L94-112: "수정" 아이콘 열 → editBoard() L114-119 → 수정 창(Bbs01_Lookup_BoardUpdate)
  const columnDefs = useMemo(() => [
    gb.text('typeName', 70, '구분'),  // L105
    gb.text('title', 300, '제목'),  // L106
    gb.text('writeUserName', 100, '작성자'),  // L107
    iconCell<BbsBoard>('edit', 'editCell', 50, '수정', row => setEditId(row.boardId)),  // L108
    gb.date('writeDate', 100, '작성일'),  // L109
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel min={400}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ padding: '0 10px 10px 10px' }}>
              <SearchBar onSearch={retrieve} extra={<Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>}>
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindCd="BoardTypeCode" altCode={['%', '전체']} style={{ width: 200 }} value={typeCode}
                    onChange={c => sp.set('typeCode', c ?? '%')} />
                </SearchBar.Field>
                <SearchBar.Field label="제목으로 찾기">
                  <SearchBar.Input style={{ width: 250 }} value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
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
      <Bbs01_Lookup_BoardInsert open={insertOpen} onSaved={() => void retrieve()} onClose={() => setInsertOpen(false)} />
      <Bbs01_Lookup_BoardUpdate boardId={editId} onChanged={() => void retrieve()} onClose={() => setEditId(null)} />
    </div>
  );
};
