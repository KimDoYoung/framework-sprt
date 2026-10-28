/**
 * 공동연차관리 (S09) — 경영관리 > 02. 휴가/출장 관리 > 공동연차관리 #1233
 * AS-IS: myApp/client/vi/emp/Emp24_Tab_JointLeave.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L87-130, GG): 위 58% 테두리 박스(툴바: 기준연도 · [조회][등록][저장][삭제] · [승인신청][문서분류지정] + 단일 체크 셀 편집 그리드)
 *   + 아래 테두리 박스(툴바: "▼ 제외사원" · [등록][저장][삭제] + 체크 다중 셀 편집 그리드). 위 그리드 행을 고르면 아래 제외사원을 읽는다.
 * 1단계(사용자 결정 2026-10-28): [승인신청]의 결재문서 생성(Apr01_Edit_ApprDoc.insertLinkApprovals → updateApprId)·상세보기(Apr01_Edit_ApprDoc.retrieveApproval)는
 *   다음 단계 — 원본의 문서분류·선택·상태 검사까지만 한다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { empJointLeaveApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { JointLeave, JointLeaveExcept, TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Emp01_Lookup_PersonModel } from '@/components/lookup/Emp01_Lookup_PersonModel';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';

const gb = gbFor<JointLeave>();
const gbExcept = gbFor<JointLeaveExcept>();

const BOX: React.CSSProperties = { border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 };

export const Emp24_Tab_JointLeave: React.FC = () => {
  // [E0] 화면 열림 (생성자 L87-130 → settings() L132-214, retrieve()): 기준연도 = 올해로 조회
  const [stdYear, setStdYear] = useState(dayjs().format('YYYY'));
  const cur = useRef({ stdYear });
  cur.current = { stdYear };
  const [linkOpen, setLinkOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  // retrieveDoc() L353-371: Link 코드 A24에 지정된 문서분류가 정확히 1건이면 쓰고, 아니면 null
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  // 위 그리드에서 고른 공동연차 (아래 제외사원의 부모)
  const selectedId = useRef<number | null>(null);
  const selectFirst = useRef(false);

  // 아래 제외사원 그리드 — exceptRetrieve() L373-390: 서비스 emp.Emp28_JointLeaveExcept.selectByJointLeaveId
  const exceptCrud = useGridCrud<JointLeaveExcept>({
    idField: 'jointLeaveExceptId',
    search: useCallback(async () => (selectedId.current != null && selectedId.current > 0 ? empJointLeaveApi.searchExcepts(selectedId.current) : []), []),
    // [E9] exceptUpdateButton[저장].Select (L195) → exceptUpdate() L504-516: GridUpdate → emp.Emp28_JointLeaveExcept.update
    save: useCallback((rows: JointLeaveExcept[]) => empJointLeaveApi.saveExcepts(rows), []),
    // [E10] exceptDeleteButton[삭제].Select (L201) → exceptDelete() L545-549: GridDeleteData → emp.Emp28_JointLeaveExcept.delete (확인창 없음)
    remove: useCallback((ids: number[]) => empJointLeaveApi.removeExcepts(ids), []),
    deleteConfirm: false,
    newRow: useCallback(() => ({}), []),
  });

  // 위 그리드 — retrieve() L330-351: 서비스 emp.Emp24_JointLeave.selectByYear(companyId, stdYear) → retrieveDoc(), 첫 행 선택 + exceptRetrieve
  const crud = useGridCrud<JointLeave>({
    idField: 'jointLeaveId',
    search: useCallback(() => empJointLeaveApi.search(cur.current.stdYear), []),
    // [E4] updateButton[저장].Select (L157) → update() L467-502: GridUpdate → emp.Emp24_JointLeave.update
    save: useCallback((rows: JointLeave[]) => empJointLeaveApi.save(rows), []),
    // [E5] deleteButton[삭제].Select (L163) → deleteCheck() L392-428 → [E13] msgBox.DialogHide [YES] (L413) → delete() L518-543: emp.Emp24_JointLeave.deleteApprId → delete
    remove: useCallback((ids: number[]) => empJointLeaveApi.remove(ids), []),
    deleteConfirm: false,
    newRow: useCallback(() => ({}), []),
    // update() L467-490: 고친 행마다 결재 중인 문서는 수정 불가, 시작일·종료일·사유 필수
    validate: useCallback((changed: JointLeave[]) => {
      for (const r of changed) {
        if (r.apprId != null) return '결재 중인 문서의 정보는 수정 불가능합니다';
        if (r.startDate == null || r.startDate === '') return '시작일은 필수선택 항목입니다.';
        if (r.closeDate == null || r.closeDate === '') return '종료일은 필수선택 항목입니다.';
        if (r.reason == null || r.reason === '') return '사유는 필수입력 항목입니다.';
      }
      return undefined;
    }, []),
  });

  // retrieveDoc() L353-371
  const retrieveDoc = useCallback(async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode('A24');
      setClassTreeId(list.length === 1 ? list[0].classTreeId : null);
    } catch { setClassTreeId(null); }
  }, []);

  useEffect(() => { void retrieve(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // [E1] leaveYText.KeyPress [Enter] (L137) / [E2] retrieveButton[조회].Select (L145) → retrieve()
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
    void retrieveDoc();
    // 행이 없으면 exceptRetrieve(null): 아래 그리드를 비운다
    if (crud.gridRef.current?.api?.getDisplayedRowCount() === 0) { selectedId.current = null; exceptCrud.clear(); }
  };

  // 조회 뒤 첫 행 선택(grid.getSelectionModel().select(0)) + [E11] grid.RowClick (L208) → exceptRetrieve(선택 행)
  const onRowDataUpdated = () => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
  };
  const onSelectionChanged = () => {
    const row = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (row == null) { selectedId.current = null; exceptCrud.clear(); return; }
    selectedId.current = row.jointLeaveId;
    void exceptCrud.retrieve();
  };

  // [E5] deleteButton[삭제].Select (L163) → deleteCheck() L392-428: 결재진행(10·20)이 있으면 안내, 아니면 확인창("결재완료된 문서도 같이 삭제됩니다…")
  const deleteCheck = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    if (selected.some(r => r.apprStatusCode === '10' || r.apprStatusCode === '20')) { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: <>결재완료된 문서도 같이 삭제됩니다.<br />{selected.length}건의 정보를 삭제하시겠습니까?</>,
      width: 310,
      okText: '예',
      cancelText: '아니오',
      onOk: () => crud.deleteChecked(), // → [E13] YES
    });
  };

  // [E3] insertButton[등록].Select (L151) → insertRow() L430-437: GridInsertRow(회사 ID 채움, 맨 아래 — 03 원칙 17)
  const insertRow = () => crud.addRow();

  // [E7] dcrLinkButton[문서분류지정].Select (L176) → Dcr30_Lookup_Link.open("A24", callback → retrieveDoc())
  const openLink = () => setLinkOpen(true);

  // [E6] apprButton[승인신청].Select (L170) → insertLinkApprovals() L270-306
  const insertLinkApprovals = () => {
    if (classTreeId == null) { message.warning('[문서분류지정]에서 먼저 문서분류를 선택해주세요'); return; }
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('결재요청할 정보를 선택해주세요'); return; }
    if (selected.some(r => r.apprStatusCode === '10' || r.apprStatusCode === '20' || r.apprStatusCode === '30')) {
      message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다');
      return;
    }
    // Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A24", gridList, false, cb) → updateApprId(apprModel) L308-328 — 다음 단계
    message.info('결재문서 작성(전자결재 편집창)은 아직 변환 전입니다(다음 단계).');
  };

  // [E8] exceptInsertButton[등록].Select (L189) → exceptInsertRow() L439-465: Emp01_Lookup_PersonModel.open → 고른 사원마다 행 추가(조직·사원명 채움, 변경으로 친다)
  const exceptInsertRow = () => {
    if (selectedId.current == null) { message.warning('공동연차를 먼저 선택해주세요'); return; }
    if (selectedId.current <= 0) { message.warning('공동연차를 먼저 저장해주세요'); return; }
    setPersonOpen(true);
  };
  const onPickPersons = (persons: TransPerson[]) => {
    setPersonOpen(false);
    exceptCrud.addRows(persons.map(p => ({ jointLeaveId: selectedId.current ?? 0, personId: p.personId, orgName: p.orgNm ?? null, personName: p.korNm ?? null })), true);
  };

  // [E12] actionCell (ImageCell).callbackOnCreate (L235) → 서비스 apr.Apr01_Appr.selectById(apprId) → 없으면 "관련 상신문서가 존재하지 않습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval — 편집창은 다음 단계
  const viewAppr = (apprId: number | null) => {
    if (apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 문서 보기는 아직 변환 전입니다(다음 단계).');
  };

  // AS-IS buildGrid() L216-258 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    editableCol(gb.date('startDate', 100, '시작일', { editor: 'date' })),
    editableCol(gb.date('closeDate', 100, '종료일', { editor: 'date' })),
    editableCol(gb.text('reason', 500, '사유', { editor: 'text' })),
    gb.textCenter('apprStatusName', 120, '상신상태'),
    iconCell<JointLeave>('view', 'actionCell', 80, '상세보기', row => viewAppr(row.apprId)),
    gb.text('note', 500, '비고'),
  ], []);

  // AS-IS exceptGrid() (setChecked MULTI)
  const exceptColumnDefs = useMemo(() => [
    gbExcept.text('orgName', 170, '조직'),
    gbExcept.textCenter('personName', 100, '사원명'),
    editableCol(gbExcept.text('reason', 800, '제외사유', { editor: 'text' })),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ ...BOX, flex: 58 }}>
        <SearchBar
          onSearch={() => void retrieve()}
          extra={(
            <>
              <Button type="register" onClick={insertRow}>등록</Button>
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteCheck}>삭제</Button>
              <Button type="register" onClick={insertLinkApprovals}>승인신청</Button>
              <Button type="select" onClick={openLink}>문서분류지정</Button>
            </>
          )}
        >
          <SearchBar.Field label="기준연도">
            <Input style={{ width: 50 }} maxLength={4} placeholder="YYYY" value={stdYear} onChange={e => setStdYear(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<JointLeave>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDataUpdated={onRowDataUpdated}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </div>
      <div style={{ ...BOX, flex: 42, marginTop: -1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', marginRight: 10 }}>▼ 제외사원</span>
          <Button type="register" onClick={exceptInsertRow}>등록</Button>
          <Button type="save" count={exceptCrud.changes} onClick={exceptCrud.saveRows}>저장</Button>
          <Button type="delete" onClick={exceptCrud.deleteChecked}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<JointLeaveExcept> crud={exceptCrud} columnDefs={exceptColumnDefs} />
        </div>
      </div>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A24" onClose={() => { setLinkOpen(false); void retrieveDoc(); }} />
      <Emp01_Lookup_PersonModel open={personOpen} onSelect={onPickPersons} onClose={() => setPersonOpen(false)} />
    </div>
  );
};
