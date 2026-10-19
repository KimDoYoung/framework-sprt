/**
 * 화면 찾기 조회창 (E29) — Ast15_Lookup_TrCodeWindow의 [등록]에서 연다 (sys 도메인 다른 화면에서도 쓸 수 있는 조회창)
 * AS-IS: myApp/client/vi/sys/Sys06_Lookup_SearchMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(companyId, callback) L56-96 → settings() L98-161: 관리자(회사관리자·회사 0)는 "화면찾기(관리자)" 620×600에 화면명·화면번호·ClassName 열만,
 * 그 밖에는 "화면찾기" 1300×600에 북마크·화면경로·화면명·화면번호·화면설명·북마크 아이콘 열과 [북마크]·"화면명만 검색". 툴바 `화면명: [조회][북마크][화면명만 검색]`, 아래 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { MenuSearch } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys40_Lookup_Bookmark } from '@/components/lookup/Sys40_Lookup_Bookmark';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<MenuSearch>();

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(companyId, callback): 관리자 회사가 운용사를 지정해 연다. 없으면 로그인 회사 */
  companyId?: number | null;
  /** callback.execute(menuModel): 더블클릭 confirm() L244-252 */
  onResult: (menu: MenuSearch) => void;
  /** [닫기]: callback.execute(null) 뒤 hide() */
  onClose: () => void;
}

export const Sys06_Lookup_SearchMenu: React.FC<Props> = ({ open, companyId, onResult, onClose }) => {
  const user = useLoginUser();
  // settings() L98-161의 분기: LoginUser.getIsManager() || companyId == 0 (회사관리자의 세션 사용자 ID는 음수)
  const manager = user.userId < 0 || user.companyId === 0;
  const gridRef = useRef<AgGridReact<MenuSearch>>(null);
  const [text, setText] = useState('');
  const [menuNameYn, setMenuNameYn] = useState(!manager ? false : true);
  const [rows, setRows] = useState<MenuSearch[]>([]);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  /** 북마크를 바꾼 행의 위치 (AS-IS num) — 다시 읽은 뒤 그 행으로 돌아간다 */
  const focusIdx = useRef(-1);
  const rowsRef = useRef<MenuSearch[]>([]);
  rowsRef.current = rows;
  const toggleRef = useRef<(row: MenuSearch) => Promise<void>>(async () => undefined);

  // retrieve() L217-242: 로그인 사용자·회사, "%검색어%", 화면명만 검색 → 관리자면 selectByTextManager, 아니면 selectByText
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchMenus(text, manager ? true : menuNameYn, companyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [text, menuNameYn, manager, companyId]);

  // open() L56-96: 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    setText('');
    setMenuNameYn(manager ? true : false);
    setRows([]);
    void (async () => {
      try {
        setRows(await sysApi.searchMenus('', manager ? true : false, companyId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 북마크 아이콘을 누른 행 위치로 돌아간다 (retrieve 콜백의 grid.getView().focusRow(num))
  const onRowDataUpdated = () => {
    if (focusIdx.current >= 0) {
      gridRef.current?.api.ensureIndexVisible(focusIdx.current);
      focusIdx.current = -1;
    }
  };

  // buildGrid() L163-215의 ActionCell: 북마크가 없으면 insertMenuId, 있으면 deleteMenuId 뒤 retrieve()
  toggleRef.current = async (row: MenuSearch) => {
    try {
      if (row.bookmark == null) await sysApi.insertBookmark(row.menuId);
      else await sysApi.deleteBookmark(row.menuId);
      focusIdx.current = rowsRef.current.findIndex(r => r.menuId === row.menuId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '북마크 저장 실패'));
    }
  };

  /** buildGrid() L163-215 — 관리자는 settings() L103-106으로 북마크(1)·화면경로(2)·화면설명(5)·북마크 아이콘(6)을 숨긴다, 그 밖은 ClassName(7)을 숨긴다 */
  const columnDefs = useMemo(() => {
    const bookmarkCell = (p: { data?: MenuSearch }) => (p.data?.bookmark == null ? null : <StarFilled style={{ color: '#faad14' }} />);
    const actionCell = (p: { data?: MenuSearch }) => (
      p.data ? (
        <span style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); void toggleRef.current(p.data!); }}>
          {p.data.bookmark == null ? <StarOutlined /> : <StarFilled style={{ color: '#faad14' }} />}
        </span>
      ) : null
    );
    return [
      ...(manager ? [] : [{ colId: 'bookmark', headerName: '', width: 50, cellRenderer: bookmarkCell, cellStyle: { textAlign: 'center' } }]),  // L206 addBookMark
      ...(manager ? [] : [gb.text('parentPathNm', 270, '화면경로')]),  // L208
      gb.text('menuNm', 180, '화면명'),  // L209
      gb.textCenter('menuNo', 100, '화면번호'),  // L210
      ...(manager ? [] : [gb.text('note', 630, '화면설명')]),  // L211
      ...(manager ? [] : [{ colId: 'actionCell', headerName: '', width: 50, cellRenderer: actionCell, cellStyle: { textAlign: 'center' } }]),  // L212 addCell(ImageCell "Bookmark")
      ...(manager ? [gb.text('className', 320, 'ClassName')] : []),  // L213
    ];
  }, [manager]);

  // [E5] grid.CellDoubleClick (L155) → confirm() L244-252
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('매뉴를 선택해주세요');
      return;
    }
    onResult(row);
  };

  return (
    <LookupModal open={open} title={manager ? '화면찾기(관리자)' : '화면찾기'} width={manager ? 620 : 1300} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] closeButton[닫기].Select (L148) → callback.execute(null), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <span>화면명 </span>
          {/* [E1] menuName.KeyPress [Enter] (L128) → retrieve() */}
          <Input autoFocus style={{ width: manager ? 200 : 300 }} value={text} onChange={e => setText(e.target.value)} onPressEnter={() => void retrieve()} />
          {/* [E2] retrieveButton[조회].Select (L136) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E3] bookmarkButton[북마크].Select (L142) → bookmark() L254-262: 북마크 창을 닫으면 retrieve() */}
          {!manager && <Button type="bookmark" onClick={() => setBookmarkOpen(true)}>북마크</Button>}
          {!manager && <Checkbox checked={menuNameYn} onChange={e => setMenuNameYn(e.target.checked)}>화면명만 검색</Checkbox>}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<MenuSearch>
            gridRef={gridRef}
            rowData={rows}
            rowNumber={false}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.menuId)}
            rowSelection={SINGLE_ROW}
            onRowDoubleClicked={confirm}
            onRowDataUpdated={onRowDataUpdated}
          />
        </div>
      </div>
      <Sys40_Lookup_Bookmark open={bookmarkOpen} onClose={() => { setBookmarkOpen(false); void retrieve(); }} />
    </LookupModal>
  );
};
