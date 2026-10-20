/**
 * [1025] 문서작성 > 05. 메일관리 > 주소록 관리 (G11)
 * AS-IS: myApp/client/vi/emp/Emp10_Tab_AddrBook.java (216줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L53-80: center=vlc(테두리, 여백 20) — 툴바 [담당자명 칸][조회][등록][저장][삭제][그룹설정] + 셀 편집 그리드(체크박스 다중, 7열: 담당자명 100 · 이메일 220 ·
 *   핸드폰 번호 120 · 사무실 번호 120 · 회사이름 180 · 직위 100 · 비고 500). [그룹설정]은 그룹설정 창(Emp57_Lookup_Insert)을 연다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { empAddrBookApi } from '@/api/emp';
import { EmpAddrBook } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp57_Lookup_Insert } from './Emp57_Lookup_Insert';

const gb = gbFor<EmpAddrBook>();

export const Emp10_Tab_AddrBook: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);

  // retrieve() L157-168: 서비스 emp.Emp10_AddrBook.selectByText("%"+글자+"%", personId)
  const search = useCallback(() => empAddrBookApi.searchAddrBooks(searchText), [searchText]);

  const crud = useGridCrud<EmpAddrBook>({
    idField: 'addrBookId',
    search,
    // update() L171-175: GridUpdate → emp.Emp10_AddrBook.update
    save: empAddrBookApi.saveAddrBooks,
    // deleteRow() L207-211: GridDeleteData → emp.Emp10_AddrBook.delete
    remove: empAddrBookApi.deleteAddrBooks,
    // [E5] deleteButton[삭제].Select (L110) → deleteChk() L186-204: "삭제"/"n건의 주소록을 삭제하시겠습니까?"(폭 300) → [E7] msgBox.DialogHide [YES] (L189) → deleteRow()
    deleteConfirm: n => `${n}건의 주소록을 삭제하시겠습니까?`,
    // [E3] insertButton[등록].Select (L98) → insertRow() L178-184: GridInsertRow, 등록자 = 나(서버), 공용 false
    newRow: useCallback(() => ({ publicYn: 'false' }), []),
  });

  // [E0] 화면 열림 (생성자 L53-80) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // buildGrid() L125-154
  const columnDefs = useMemo(() => [
    gb.text('contactName', 100, '담당자명', { editor: 'text' }),  // L128
    gb.text('emailAddress', 220, '이메일', { editor: 'text' }),  // L129
    gb.text('mobileTelNo', 120, '핸드폰 번호', { editor: 'text' }),  // L130
    gb.text('officeTelNo', 120, '사무실 번호', { editor: 'text' }),  // L131
    gb.text('companyName', 180, '회사이름', { editor: 'text' }),  // L132
    gb.text('posName', 100, '직위', { editor: 'text' }),  // L133
    gb.text('note', 500, '비고', { editor: 'text' }),  // L134
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        {/* [E1] searchText.KeyPress [Enter] (L84) → retrieve(), [E2] retrieveButton[조회].Select (L92) → retrieve() */}
        <div style={{ overflowX: 'auto' }}>
          <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
            {/* [E3] insertButton[등록].Select (L98) → insertRow() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E4] updateButton[저장].Select (L104) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
            {/* [E6] groupButton[그룹설정].Select (L116) → new Emp57_Lookup_Insert().open() */}
            <Button type="group" onClick={() => setGroupOpen(true)}>그룹설정</Button>
          </>}>
            <SearchBar.Field label="담당자명">
              <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<EmpAddrBook> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Emp57_Lookup_Insert open={groupOpen} onClose={() => setGroupOpen(false)} />
    </div>
  );
};
