/**
 * [1282] 관리자 > 03. 문서관리 > 문서결재선 그룹관리 (EE03)
 * AS-IS: myApp/client/vi/apr/Apr30_Tab_ApprStepGroup.java (206줄) + Apr31_Page_ApprStepGroupMember(420줄, 같은 폴더 파일) + Emp00_Lookup_SelectMulti(연결, 이미 변환) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L49-97: North(50, 여백 20·20·1·20, 테두리) = 안내 글 "※ 해당 그룹을 [문서분류] 탭에서 지정 시, 기존 결재선 정보에 추가로 반영됩니다" /
 *   West(600, 분할·최대 1000, 여백 0·-2·22·20, 테두리) = 툴바(지정그룹 · [조회][등록][저장][삭제]) + 지정그룹 셀 편집 그리드(행번호: 문서결재선 그룹명 250 · 비고 350) /
 *   Center(0.4, 분할, 여백 0·20·20·0, 테두리) = 결재선 설정 페이지 Apr31_Page_ApprStepGroupMember. 열 때 retrieve()
 * 스타일: GDP (견본 docs/page-style/GDP/ — 왼쪽 버튼 줄 + 그리드, 오른쪽 상세 페이지. 위 안내 글 한 줄이 더 있다)
 * UX보강(10): UX-03 저장(n)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Splitter } from 'antd';
import { aprApi } from '@/api/apr';
import { AprApprStepGroup } from '@/types/apr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr31_Page_ApprStepGroupMember } from './Apr31_Page_ApprStepGroupMember';

const gb = gbFor<AprApprStepGroup>();
/** 행 클릭 단일 선택(체크박스 없음 — 원본 지정그룹 그리드는 setChecked가 없다). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Apr30_Tab_ApprStepGroup: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const crud = useGridCrud<AprApprStepGroup>({
    idField: 'apprStepGroupId',
    // retrieve() L152-161: apr.Apr30_ApprStepGroup.selectByCompanyId (companyId는 서버가 세션에서)
    search: aprApi.searchApprStepGroups,
    // update() L163-166: GridUpdate → apr.Apr30_ApprStepGroup.update
    save: aprApi.saveApprStepGroups,
    // deleteRow() L197-201: GridDeleteData → apr.Apr30_ApprStepGroup.delete
    remove: aprApi.deleteApprStepGroups,
    // [E4] deleteButton[삭제].Select (L118) → deleteChedk() L176-195: "확인"/"해당 문서결재 그룹을 삭제하시겠습니까?"(폭 300) → [E6] msgBox.DialogHide [YES] (L179) → deleteRow()
    deleteConfirm: '해당 문서결재 그룹을 삭제하시겠습니까?',
    // [E2] insertButton[등록].Select (L106) → insertRow() L168-174: GridInsertRow (회사는 서버가 세션에서)
    newRow: useCallback(() => ({}), []),
    firstEditField: 'apprStepGroupName',
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L49-97) → settings(), retrieve()
  useEffect(() => {
    void crudRetrieve();
  }, [crudRetrieve]);

  // [E5] grid.RowClick (L124) → retrievePage() L140-150: 한 건만 골랐으면 멤버 페이지를 켜고 그 그룹으로 조회, 아니면 끄고 retrieve(null)
  //   (저장 전 새 행은 ID가 임시 음수라 멤버를 달 수 없어 끈다)
  const onSelectionChanged = (e: { api: { getSelectedRows: () => AprApprStepGroup[] } }) => {
    const sel = e.api.getSelectedRows();
    setSelectedId(sel.length === 1 && sel[0].apprStepGroupId > 0 ? sel[0].apprStepGroupId : null);
  };

  // buildGrid() L132-138
  const columnDefs = useMemo(() => [
    gb.text('apprStepGroupName', 250, '문서결재선 그룹명', { editor: 'text' }),  // L135
    gb.text('note', 350, '비고', { editor: 'text' }),  // L136
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        <span style={{ fontSize: 14, fontWeight: 'bold' }}>※ 해당 그룹을 [문서분류] 탭에서 지정 시, 기존 결재선 정보에 추가로 반영됩니다</span>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize={600} min={300} max={1000}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 50, flex: 'none' }}>
              <b>지정그룹</b>
              {/* [E1] retrieveButton[조회].Select (L100) → retrieve() */}
              <Button type="search" onClick={crud.retrieve}>조회</Button>
              <Button type="register" onClick={() => crud.addRow()}>등록</Button>
              {/* [E3] updateButton[저장].Select (L112) → update() L163-166 */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<AprApprStepGroup> crud={crud} columnDefs={columnDefs} rowSelection={ROW_SELECTION} onSelectionChanged={onSelectionChanged} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', padding: '20px 20px 20px 0', boxSizing: 'border-box' }}>
            <Apr31_Page_ApprStepGroupMember apprStepGroupId={selectedId} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
