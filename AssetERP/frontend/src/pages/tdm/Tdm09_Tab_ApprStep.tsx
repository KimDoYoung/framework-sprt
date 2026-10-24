/**
 * [1463] 책무 > 01. 기본정보 > 직책별 부서승인선 등록 (N10)
 * AS-IS: myApp/client/vi/tdm/Tdm09_Tab_ApprStep.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-128: 왼쪽(650) = 툴바(검색 · [조회][등록][저장][삭제]) + 직책-부서 그리드(단일 체크, 셀 편집),
 *                 가운데 = 툴바([등록] · 새로고침) + 승인자 그리드(행번호 없음, 위로/아래로/삭제 셀)
 * 함께: Tdm20_Lookup_SelectRole(책무직책 칸)·Tdm23_Lookup_SelectOrg(수행부서 칸)·Emp01_Lookup_PersonModel(승인자 등록, 다른 도메인 — 기존 부품)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Modal, message } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColDef } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmApprStep, TdmApprStepChild } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp01_Lookup_PersonModel } from '@/components/lookup/Emp01_Lookup_PersonModel';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';
import { Tdm23_Lookup_SelectOrg } from './Tdm23_Lookup_SelectOrg';

const gb = gbFor<TdmApprStep>();
const gbStep = gbFor<TdmApprStepChild>();

/** update() L325-350 앞부분: 바뀐 행마다 직책 → 부서 순으로 필수 확인 */
const validate = (changed: TdmApprStep[]) => {
  for (const r of changed) {
    if (r.roleId == null) return '직책을 선택하세요';
    if (r.orgId == null) return '부서를 선택하세요';
  }
  return undefined;
};

/** 위로·아래로 칸 (AS-IS ImageCell("▲"/"▼")) */
const moveCell = (colId: string, header: string, mark: string, onClick: (row: TdmApprStepChild) => void): ColDef<TdmApprStepChild> => ({
  colId,
  headerName: header,
  width: 70,
  sortable: false,
  cellStyle: { textAlign: 'center', cursor: 'pointer' },
  valueGetter: () => mark,
  onCellClicked: p => { if (p.data) onClick(p.data); },
});

/** 조회창 트리거 칸 (AS-IS LookupTriggerField) */
const triggerCell = (open: (row: TdmApprStep) => void) => ({
  cellStyle: { color: '#1677ff' },
  cellRenderer: (p: { data?: TdmApprStep; value?: string }) => (
    <>
      <AntButton type="text" size="small" icon={<SearchOutlined />}
        onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
      {p.value}
    </>
  ),
});

export const Tdm09_Tab_ApprStep: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef('');
  searchRef.current = searchText;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stepRows, setStepRows] = useState<TdmApprStepChild[]>([]);
  const stepGridRef = useRef<AgGridReact<TdmApprStepChild>>(null);
  const [roleTarget, setRoleTarget] = useState<number | null>(null);   // 책무직책 조회창이 채울 행 ID
  const [orgTarget, setOrgTarget] = useState<TdmApprStep | null>(null);  // 수행부서 조회창이 채울 행
  const [personParent, setPersonParent] = useState<number | null>(null);  // 승인자 등록할 상위 행 ID
  const selectFirst = useRef(false);

  // retrieve() L285-302: tdm.Tdm09_ApprStep.selectByCompanyId (companyId는 서버, typeCode "C", searchText "%…%")
  const crud = useGridCrud<TdmApprStep>({
    idField: 'apprStepId',
    search: useCallback(() => tdmApi.searchApprSteps(searchRef.current), []),
    // update() L325-350: GridUpdate → tdm.Tdm09_ApprStep.update, 저장 뒤 retrieve()
    save: tdmApi.saveApprSteps,
    // delete() L390-400: GridDeleteData → tdm.Tdm09_ApprStep.deleteByParentId, 삭제 뒤 retrieve()
    remove: tdmApi.deleteApprSteps,
    // insert() L381-388: companyId·typeCode "C"·parentId 0은 서버가 채운다
    newRow: useCallback(() => ({ roleId: null, orgId: null, roleName: null, exctName: null, orgName: null, managerName: null }), []),
    validate,
    deleteConfirm: n => `${n}건의 정보를 삭제하시겠습니까?`,
    onChanged: () => { void retrieve(); },
  });
  const crudRows = useRef<TdmApprStep[]>([]);
  crudRows.current = crud.rows;
  const mainApi = () => crud.gridRef.current?.api;

  // 조회 뒤 첫 행 선택 (L297-299) — 선택이 바뀌면 E9가 승인자를 다시 읽는다
  const retrieve = useCallback(async () => {
    selectFirst.current = true;
    setSelectedId(null);
    try {
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.retrieve]);

  // [E0] 화면 열림 (생성자 L79-128) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  useEffect(() => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    if (crud.rows.length > 0) setTimeout(() => mainApi()?.getDisplayedRowAtIndex(0)?.setSelected(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crud.rows]);

  // retrieveStep() L304-323: tdm.Tdm09_ApprStep.selectByParentId (companyId는 서버, apprStepId, typeCode "T")
  const retrieveStep = useCallback(async (id: number | null) => {
    if (id == null) return;
    if (id <= 0) { setStepRows([]); return; }
    try {
      setStepRows(await tdmApi.searchApprStepChildren(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E9] grid.SelectionChanged [선택>0] (L199) → retrieveStep()
  useEffect(() => { void retrieveStep(selectedId); }, [selectedId, retrieveStep]);

  // [E1] anchor.MouseDown (L95) → retrieveStep()
  const refreshStep = () => {
    const id = mainApi()?.getSelectedRows()[0]?.apprStepId ?? null;
    void retrieveStep(id);
  };

  // [E6] deleteButton[삭제].Select [YES] (L160)·[E7] msgBox.DialogHide [YES] (L169) → delete()
  const deleteMain = () => {
    if ((mainApi()?.getSelectedRows() ?? []).length === 0) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    void crud.deleteChecked();
  };

  // [E8] insertStepButton[등록].Select [selectModel == null] (L186) → openLookupEmpInfo()
  const insertStep = () => {
    const sel = mainApi()?.getSelectedRows()[0];
    if (!sel) {
      message.warning("좌측리스트에서 '직책-부서'를 선택하세요");
      return;
    }
    setPersonParent(sel.apprStepId);
  };

  // openLookupEmpInfo() L435-474: 고른 사원마다 승인자 한 행(직책·부서는 상위 행 값, 승인순서는 이어서) → tdm.Tdm09_ApprStep.modelUpdate → retrieveStep()
  const onPersonSelect = async (persons: { personId: number }[]) => {
    const parent = personParent;
    if (parent == null) return;
    try {
      await tdmApi.addApprStepChildren(parent, persons.map(p => p.personId));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
    void retrieveStep(mainApi()?.getSelectedRows()[0]?.apprStepId ?? parent);
  };

  // changeRow() L518-552: 위로·아래로는 순서를 바꿔 전체 행의 승인순서를 다시 매기고 저장(update(scrollTop, scrollLeft)). 구분 글자는 AS-IS처럼 그대로 둔다
  const changeRow = async (action: 'up' | 'down', row: TdmApprStepChild) => {
    const list = [...stepRows];
    const idx = list.findIndex(r => r.apprStepId === row.apprStepId);
    if (idx < 0) return;
    if (action === 'down') {
      if (idx + 1 >= list.length) return;
      list.splice(idx, 1);
      list.splice(idx + 1, 0, row);
    } else if (idx > 0) {
      list.splice(idx, 1);
      list.splice(idx - 1, 0, row);
    }
    const renumbered = list.map((r, i) => ({ ...r, apprSeq: String(i + 1) }));  // getSeq() L554-559
    setStepRows(renumbered);
    setTimeout(() => stepGridRef.current?.api?.getRowNode(String(row.apprStepId))?.setSelected(true));
    try {
      await tdmApi.saveApprStepChildOrder(renumbered);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // deleteStepChk() L402-421: "해당 내용을 삭제하시겠습니까?"
  // [E12] msgBox.DialogHide [YES] (L405) → deleteStep() L423-433: tdm.Tdm09_ApprStep.delete → retrieveStep()
  const deleteStepChk = (row: TdmApprStepChild) => {
    Modal.confirm({
      title: '확인',
      content: '해당 내용을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await tdmApi.deleteApprStepChildren([row.apprStepId]);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        void retrieveStep(selectedId);
      },
    });
  };

  // [E11] lookup02.TriggerClick (L233) → lookupOrgCode() L476-516: 책무직책이 없으면 안내
  const lookupOrgCode = (row: TdmApprStepChild | TdmApprStep) => {
    const current = crudRows.current.find(r => r.apprStepId === row.apprStepId) ?? (row as TdmApprStep);
    if (current.roleId == null) {
      message.warning('책무직책을 먼저 선택하세요');
      return;
    }
    setOrgTarget(current);
  };

  // buildGrid() L209-248 (setChecked SINGLE, 책무직책·수행부서는 LookupTriggerField)
  const columnDefs = useMemo(() => [
    gb.text('roleName', 200, '책무직책', triggerCell(row => setRoleTarget(row.apprStepId))),  // L242 [E10] lookup01.TriggerClick (L215)
    gb.textCenter('exctName', 100, '책무임원'),  // L243
    gb.text('orgName', 150, '책무이행점검<br>수행부서', triggerCell(row => lookupOrgCode(row))),  // L244
    gb.textCenter('managerName', 100, '부서책무<br>담당자'),  // L245
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // stepBuildGrid() L250-283 (행번호 숨김)
  const stepColumnDefs = useMemo(() => [
    gbStep.textCenter('apprStepInfo', 120, '구분'),  // L274
    gbStep.textCenter('apprEmpName', 100, '승인자'),  // L275
    gbStep.textCenter('posName', 100, '직위'),  // L276
    gbStep.textCenter('apprOrgName', 150, '부서명'),  // L277
    // L278-280: addCell(actionCell, 70, 위로/아래로/삭제) → changeRow("up"|"down"|"delete")
    moveCell('actionUp', '위로', '▲', row => changeRow('up', row)),
    moveCell('actionDown', '아래로', '▼', row => changeRow('down', row)),
    iconCell<TdmApprStepChild>('delete', 'actionDelete', 70, '삭제', row => deleteStepChk(row)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [stepRows, selectedId]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex' }}>
      <div style={{ width: 650, flexShrink: 0, height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] searchText.KeyPress [Enter] (L133)·[E3] retrieveButton[조회].Select (L142) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              {/* [E4] insertButton[등록].Select (L148) → insert() */}
              <Button type="register" onClick={() => crud.addRow()}>등록</Button>
              {/* [E5] updateButton[저장].Select (L154) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteMain}>삭제</Button>
            </>
          }
        >
          <SearchBar.Input style={{ width: 250 }} placeholder="검색어(직책/부서/담당자)를 입력하세요" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmApprStep>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onSelectionChanged={e => {
              const row = e.api.getSelectedRows()[0];
              if (row) setSelectedId(row.apprStepId);
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, height: '100%', border: '1px solid #d9d9d9', borderLeft: 0, padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button type="register" onClick={insertStep}>등록</Button>
          <AntButton type="text" icon={<ReloadOutlined />} onClick={refreshStep} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TdmApprStepChild>
            gridRef={stepGridRef}
            rowNumber={false}
            rowData={stepRows}
            columnDefs={stepColumnDefs}
            getRowId={p => String(p.data.apprStepId)}
          />
        </div>
      </div>

      {/* [E10] lookup01.TriggerClick (L215) → Tdm20_Lookup_SelectRole.open → 그 행의 직책을 변경으로 */}
      <Tdm20_Lookup_SelectRole
        open={roleTarget !== null}
        onSelect={role => {
          if (roleTarget != null) crud.updateRow(roleTarget, { roleId: role.roleId, roleName: role.roleName });
        }}
        onClose={() => setRoleTarget(null)}
      />
      {/* [E11] lookup02.TriggerClick (L233) → Tdm23_Lookup_SelectOrg.openTdm09(roleId) → 그 행의 부서를 변경으로 */}
      <Tdm23_Lookup_SelectOrg
        roleId={orgTarget?.roleId ?? null}
        tdm09
        onSelect={org => {
          if (orgTarget) crud.updateRow(orgTarget.apprStepId, { orgId: org?.orgId ?? null, orgName: org?.orgName ?? null });
        }}
        onClose={() => setOrgTarget(null)}
      />
      {/* [E8] → openLookupEmpInfo() L435-474: Emp01_Lookup_PersonModel.open(callback) */}
      <Emp01_Lookup_PersonModel
        open={personParent !== null}
        onSelect={onPersonSelect}
        onClose={() => setPersonParent(null)}
      />
    </div>
  );
};
