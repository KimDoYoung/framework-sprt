/**
 * [1213] 준법감시 > 01. 법규관리 > 법규 관리그룹 등록  (H10) — 법규관리(H08)가 고르는 관리그룹을 등록·수정·삭제하고, 그룹마다 공유 부서를 둔다
 * AS-IS: myApp/client/vi/ics/Ics02_Tab_Manager.java (323줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L66-115, BorderLayout): west 550(최대 1000, 분할) = 툴바 50(제목 "법규관리 그룹" · [조회][등록][저장][삭제]) + 관리그룹 그리드, center = 공유 페이지(Ics04_Page_Share)
 * 그리드(CellEditGrid, 체크): 행번호 · 선택 · 잠금 40(미지정 그룹) · 관리그룹명 360(편집)
 * 도달 불가라 만들지 않은 것: lookupEmp 트리거(컬럼·툴바 미연결), selectCheck()/[전체적용](호출처 없음, E6·E7)
 * 스타일: GDP (docs/page-style.md)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Splitter } from 'antd';
import type { SelectionChangedEvent } from 'ag-grid-community';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsManager } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics04_Page_Share } from './Ics04_Page_Share';

const gb = gbFor<IcsManager>();

/** AS-IS buildGrid() L201-240 */
const buildGrid = () => [
  gb.booleanIcon('defaultYn', 40, ''),  // L229 addBooleanIcon — 미지정 그룹(잠금)
  gb.text('managerGroupName', 360, '관리그룹명', { editor: 'text' }),  // L230
];

export const Ics02_Tab_Manager: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  /** 공유 페이지에 보여 줄 관리그룹 — 고른 행이 정확히 1개일 때만 */
  const [shareManagerId, setShareManagerId] = useState<number | null>(null);

  const crud = useGridCrud<IcsManager>({
    idField: 'managerId',
    // retrieve() L244-253: ics.Ics02_Manager.selectByCompanyId(companyId)
    search: useCallback(() => icsApi.searchManagers(), []),
    // update() L255-258: GridUpdate — 검사 없음
    save: useCallback((rows: IcsManager[]) => icsApi.saveManagers(rows.map(r => ({ managerId: r.managerId, managerGroupName: r.managerGroupName }))), []),
    // deleteRow() L314-318: GridDeleteData — 체크한 행
    remove: useCallback((ids: number[]) => icsApi.deleteManagers(ids), []),
    // insertRow() L260-266: GridInsertRow
    newRow: () => ({ managerGroupName: '', defaultYn: false }),
    firstEditField: 'managerGroupName',
    // deleteChedk() L268-312: "n건의 관리그룹 코드를 삭제하시겠습니까?"
    deleteConfirm: n => `${n}건의 관리그룹 코드를 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (생성자 L66-115) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  // [E6 생략] lookupEmp.TriggerClick (L162) — lookupEmp 컬럼·툴바 미연결(도달 불가)
  // [E7 생략] msgBox.DialogHide [YES] (L214) → Ics02_Manager.insert 전체적용 — selectCheck() 호출처 없음(도달 불가)

  // [E5] grid.SelectionChanged (L148) → retrieveShare() L190-199: 고른 행이 1개면 그 그룹의 공유, 아니면 비활성
  const retrieveShare = (e: SelectionChangedEvent<IcsManager>) => {
    const selected = e.api.getSelectedRows();
    setShareManagerId(selected.length === 1 && selected[0].managerId > 0 ? selected[0].managerId : null);
  };

  // [E4] deleteButton[삭제].Select (L142) → deleteChedk() L268-312
  const deleteChedk = async () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.some(m => m.defaultYn)) {
      message.warning('미지정 그룹은 삭제 불가합니다.');
      return;
    }
    // 관리그룹으로 지정된 그룹은 삭제불가 — ics.Ics02_Manager.checkRelateIcs (저장 안 한 새 행은 DB에 없어 세지 않는다)
    const ids = selected.map(m => m.managerId).filter(id => id > 0);
    if (ids.length > 0) {
      try {
        if (await icsApi.isManagersInUse(ids)) {
          message.warning('사용중인 관리그룹입니다.');
          return;
        }
      } catch (err) {
        message.error(errorMessage(err, '확인 실패'));
        return;
      }
    }
    // [E8] msgBox.DialogHide [YES] (L293) → deleteRow() (useGridCrud 안, 체크 없으면 경고)
    await crud.deleteChecked();
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={550} min={300} max={1000}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <b style={{ fontSize: 14, marginRight: 8 }}>법규관리 그룹</b>
              {/* [E1] retrieveButton[조회].Select (L124) → retrieve() */}
              <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
              {/* [E2] insertButton[등록].Select (L130) → insertRow() */}
              <Button type="register" onClick={crud.addRow}>등록</Button>
              {/* [E3] updateButton[저장].Select (L136) → update(). 저장(n)은 UX-03 */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteChedk}>삭제</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<IcsManager> crud={crud} columnDefs={columnDefs} onSelectionChanged={retrieveShare} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', padding: '20px 20px 20px 0', boxSizing: 'border-box' }}>
            <Ics04_Page_Share managerId={shareManagerId} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
