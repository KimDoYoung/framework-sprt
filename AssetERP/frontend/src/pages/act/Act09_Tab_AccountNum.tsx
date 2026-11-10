/**
 * [1206] 관리자 > 05. 관리회계 > 결산회기관리 (EE10)
 * AS-IS: myApp/client/vi/act/Act09_Tab_AccountNum.java (176줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-104: 툴바 [조회][등록][저장][삭제] + 셀 편집 그리드(체크박스 다중, 4열: 회기 100 · 회기시작일 120 · 회기종료일 120 · 비고 500)
 * 스타일: CG (견본 — docs/page-style.md)
 */
import React, { useEffect, useMemo } from 'react';
import { actApi } from '@/api/act';
import { AccountNum } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AccountNum>();

export const Act09_Tab_AccountNum: React.FC = () => {
  const crud = useGridCrud<AccountNum>({
    idField: 'accountNumId',
    // retrieve() L121-133: 서비스 act.Act09_AccountNum.selectByRetrieve(companyId)
    search: actApi.searchAccountNums,
    // update() L136-140: GridUpdate → act.Act09_AccountNum.update (companyId는 서버가 로그인 회사로)
    save: actApi.saveAccountNums,
    // deleteChk() L150-168: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 300) → [E5] msgBox.DialogHide [YES] (L153) → deleteRow() L170 → act.Act09_AccountNum.delete
    remove: actApi.deleteAccountNums,
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // [E2] insertButton[등록].Select (L69) → insertRow() L143-148: GridInsertRow, 회사 ID만 채움(서버가 로그인 회사로 채움)
    newRow: () => ({ num: null, startDate: null, closeDate: null, note: null }),
    firstEditField: 'num',
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L46-104) → retrieve()
  useEffect(() => {
    void crudRetrieve();
  }, [crudRetrieve]);

  const columnDefs = useMemo(() => [
    gb.long('num', 100, '회기', { editor: 'number' }),
    gb.date('startDate', 120, '회기시작일', { editor: 'date' }),
    gb.date('closeDate', 120, '회기종료일', { editor: 'date' }),
    gb.text('note', 500, '비고', { editor: 'text' }),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L62) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L69) → insertRow() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L76) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L83) → deleteChk() */}
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AccountNum> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
};
