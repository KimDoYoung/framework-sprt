/**
 * [1211] 문서작성 > 05. 메일관리 > 공용주소록 관리 (G12)
 * AS-IS: myApp/client/vi/emp/Emp10_Tab_PublicAddrBook.java (203줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L51-78: center=vlc(테두리, 여백 20) — 툴바 [검색 칸(빈칸 안내 "담당자명/회사이름/비고")][조회][등록][저장][삭제][그룹설정] + 셀 편집 그리드(체크박스 다중,
 *   8열: G11의 7열 + 등록자 100). G11 주소록 관리와 같은 모양, 공용(publicYn=true)·로그인 회사 전체를 다룬다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { empAddrBookApi } from '@/api/emp';
import { EmpAddrBook } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Emp57_Lookup_Insert } from './Emp57_Lookup_Insert';

const gb = gbFor<EmpAddrBook>();

export const Emp10_Tab_PublicAddrBook: React.FC = () => {
  const user = useLoginUser();
  const [searchText, setSearchText] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);

  // retrieve() L140-152: 서비스 emp.Emp10_AddrBook.selectByPublicText("%"+글자+"%", companyId)
  const search = useCallback(() => empAddrBookApi.searchPublicAddrBooks(searchText), [searchText]);

  const crud = useGridCrud<EmpAddrBook>({
    idField: 'addrBookId',
    search,
    // update() L154-158: GridUpdate → emp.Emp10_AddrBook.update
    save: empAddrBookApi.saveAddrBooks,
    // deleteRow() L188-198: GridDeleteData → emp.Emp10_AddrBook.delete
    remove: empAddrBookApi.deleteAddrBooks,
    // 확인 창은 deleteChk()가 직접 띄운다 (아래)
    deleteConfirm: false,
    // [E3] insertButton[등록].Select (L97) → insertRow() L160-166: GridInsertRow, 등록자 = 나, 공용 true
    newRow: useCallback(() => ({ publicYn: 'true', personId: user.userId }), [user.userId]),
  });

  // [E0] 화면 열림 (생성자 L51-78) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] deleteButton[삭제].Select (L109) → deleteChk() L168-186: "삭제"/"n건의 주소록을 삭제하시겠습니까?"(폭 300) → [E7] msgBox.DialogHide [YES] (L171) → deleteRow() L188-198:
  //   고른 행 중 등록자가 내가 아닌 것이 있으면 "등록자만 삭제 가능합니다." 하고 멈춘다
  const deleteChk = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${checked.length}건의 주소록을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: () => {
        if (checked.some(r => r.personId !== user.userId)) {
          message.warning('등록자만 삭제 가능합니다.');
          return;
        }
        crud.deleteChecked();
      },
    });
  };

  // buildGrid() L124-137
  const columnDefs = useMemo(() => [
    gb.text('contactName', 100, '담당자명', { editor: 'text' }),  // L127
    gb.text('emailAddress', 220, '이메일', { editor: 'text' }),  // L128
    gb.text('mobileTelNo', 120, '핸드폰 번호', { editor: 'text' }),  // L129
    gb.text('officeTelNo', 120, '사무실 번호', { editor: 'text' }),  // L130
    gb.text('companyName', 180, '회사이름', { editor: 'text' }),  // L131
    gb.text('posName', 100, '직위', { editor: 'text' }),  // L132
    gb.text('note', 500, '비고', { editor: 'text' }),  // L133
    gb.textCenter('personName', 100, '등록자'),  // L134 SQL 계산 컬럼(selectByPublicText: f_emp_kor_nm(emp10_person_id))
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        {/* [E1] searchText.KeyPress [Enter] (L83) → retrieve(), [E2] retrieveButton[조회].Select (L91) → retrieve() */}
        <div style={{ overflowX: 'auto' }}>
          <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
            {/* [E3] insertButton[등록].Select (L97) → insertRow() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E4] updateButton[저장].Select (L103) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
            {/* [E6] groupButton[그룹설정].Select (L115) → new Emp57_Lookup_Insert().open() */}
            <Button type="group" onClick={() => setGroupOpen(true)}>그룹설정</Button>
          </>}>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="담당자명/회사이름/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
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
