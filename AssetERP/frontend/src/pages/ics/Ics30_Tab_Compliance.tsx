/**
 * [1313] 기초자료 > 00. 내부통제 > 임직원 내부통제 준수리스트 (E05) — 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수리스트 관리 #1309도 같은 클래스
 * AS-IS: myApp/client/vi/ics/Ics30_Tab_Compliance.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-126: north = 툴바 왼쪽(70%) [조회][등록][확정][확정취소][삭제] · [예외사원 등록], 오른쪽(30%) [행 추가][행 삭제][저장],
 *   center = 왼쪽(200) 기준 적용일 그리드(기준 적용일 100 · 확정 50) + 오른쪽 위(70%) 준수항목 셀 편집 그리드 / 아래(30%) 준수답변(Ics33_TabPage_ComplianceAnswer)
 * 확정된 기준 적용일이면 [삭제][행 추가][행 삭제][저장]과 준수답변 버튼이 꺼진다. 처음엔 [삭제][행 추가][행 삭제][저장]이 꺼져 있다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { IcsCompliance, IcsComplianceDate } from '@/types/ics';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Emp33_Lookup_ExceptBiz } from '../emp/Emp33_Lookup_ExceptBiz';
import { Ics30_Lookup_Insert } from './Ics30_Lookup_Insert';
import { Ics33_TabPage_ComplianceAnswer, Ics33_TabPage_ComplianceAnswerHandle } from './Ics33_TabPage_ComplianceAnswer';

const gbDate = gbFor<IcsComplianceDate>();
const gbForm = gbFor<IcsCompliance>();
/** 체크박스 다중 선택. 렌더마다 새 객체를 주면 부모가 다시 그릴 때 AG Grid가 선택을 지우므로 한 번만 만든다 */
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

const isFixed = (m?: { dateFixYn?: string | null } | null) => m?.dateFixYn === 'true';
/** "yyyy년 MM월 dd일" (DateTimeFormat) */
const koDate = (d: string) => `${d.slice(0, 4)}년 ${d.slice(5, 7)}월 ${d.slice(8, 10)}일`;

export const Ics30_Tab_Compliance: React.FC = () => {
  const user = useLoginUser();
  const dateGridRef = useRef<AgGridReact<IcsComplianceDate>>(null);
  const answerRef = useRef<Ics33_TabPage_ComplianceAnswerHandle>(null);
  const [dates, setDates] = useState<IcsComplianceDate[]>([]);
  const [typeCodes, setTypeCodes] = useState<Code[]>([]);
  const [insertOpen, setInsertOpen] = useState(false);
  const [excpBizCode, setExcpBizCode] = useState<string | null>(null);  // Emp33_Lookup_ExceptBiz.open("10")
  // retrieveForm() L507-543: 확정된 날이면 [삭제][행 추가][행 삭제][저장]이 꺼진다 (처음엔 꺼져 있다)
  const [formEnabled, setFormEnabled] = useState(false);
  const selected = useRef<IcsComplianceDate | null>(null);   // grid.getSelectionModel().getSelectedItem()
  const deleteIds = useRef<number[]>([]);                     // deleteList (updateList는 그리드의 변경 행)
  const loaded = useRef<IcsCompliance[]>([]);                 // 마지막으로 읽은 준수항목
  const selectFirst = useRef(false);                          // retrieve() 콜백의 grid.getSelectionModel().select(0, false)

  // [E0] 화면 열림 (생성자 L76-126) → settings(), retrieve(): 준수항목 콤보 IcsComplianceType를 읽고 기준 적용일을 조회한다
  useEffect(() => { sysApi.searchCodes('IcsComplianceType').then(setTypeCodes).catch(() => undefined); }, []);

  const formCrud = useGridCrud<IcsCompliance>({
    idField: 'complianceId',
    // retrieveForm() L507-543: 서비스 ics.Ics30_Compliance.selectByStartDate(companyId, startDate)
    search: useCallback(async () => {
      const d = selected.current;
      loaded.current = d ? await icsApi.searchCompliances(d.startDate) : [];
      return loaded.current;
    }, []),
    save: async () => [],  // 저장은 updateFormChk()·updateForm()이 직접 한다 (확인 → 저장)
    remove: async () => undefined,
    // insertForm() L393-413: 기준 적용일·회사·해당없음 false·사용 true·확정 false
    newRow: useCallback(() => ({
      startDate: selected.current?.startDate,
      companyId: user.companyId,
      naUseYn: 'false',
      useYn: 'true',
      dateFixYn: 'false',
    }), [user.companyId]),
    firstEditField: 'complianceTypeName',
  });

  // retrieveForm(formulaModel) L507-543
  const retrieveForm = useCallback(async (model: IcsComplianceDate) => {
    selected.current = model;
    const enabled = !isFixed(model);
    setFormEnabled(enabled);
    answerRef.current?.setEnable(enabled);
    deleteIds.current = [];  // updateList.clear(); deleteList.clear()
    await formCrud.retrieve();
    const first = loaded.current[0];
    if (first) {
      setTimeout(() => formCrud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 150);  // formGrid.getSelectionModel().select(0, false) — 행이 그려진 뒤
      await answerRef.current?.retrieve(first);
    } else {
      await answerRef.current?.retrieve(null);
    }
  }, [formCrud]);

  // [E3] retrieveButton[조회].Select (L143) → retrieve() L493-505: 서비스 ics.Ics30_Compliance.groupByStartDate(companyId) → 첫 행을 고르고 retrieveForm()
  const retrieve = useCallback(async () => {
    try {
      const list = await icsApi.searchComplianceDates();
      selectFirst.current = list.length > 0;
      setDates(list);
      if (list.length > 0) await retrieveForm(list[0]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [retrieveForm]);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] insertButton[등록].Select (L149) → insert() L377-391: 이미 있는 기준 적용일을 넘겨 Ics30_Lookup_Insert를 연다 (생성하면 retrieve())
  const insert = () => setInsertOpen(true);

  // confirm(dateFixYn) L285-300: 서비스 ics.Ics30_Compliance.updateDateFixYn → retrieve()
  const confirm = async (dateFixYn: boolean) => {
    const model = selected.current;
    if (!model) return;
    try {
      await icsApi.updateComplianceDateFix(model.startDate, dateFixYn ? 'true' : 'false');
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E5] confirmButton[확정].Select [YES] (L155): 서비스 ics.Ics31_ComplianceWrite.selectByStartDate — 이후 작성 기록이 있으면 "기준 적용일 이후의 데이터가 존재합니다."
  //   이미 확정이면 "이미 확정된 준수항목 리스트입니다" → 확인 창 "확인"(폭 450) → [E6] msgBox.DialogHide [YES] (L180) → confirm(true)
  const onConfirm = async () => {
    const model = selected.current;
    if (!model) { message.warning('기준 적용일을 선택해주세요'); return; }
    try {
      if (await icsApi.hasComplianceWriteAfter(model.startDate)) { message.warning('기준 적용일 이후의 데이터가 존재합니다.'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    if (isFixed(model)) { message.warning('이미 확정된 준수항목 리스트입니다'); return; }
    Modal.confirm({
      title: '확인',
      content: `${koDate(model.startDate)} 적용 준수항목리스트를 확정하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: () => confirm(true),
    });
  };

  // [E7] cancleButton[확정취소].Select [YES] (L202): 확정 전이면 "확정 전 준수항목 리스입니다", 서비스 ics.Ics30_Compliance.checkDate — 작성 기록이 있으면
  //   "작성한 준수확인항목이 존재합니다" → 확인 창 "확인"(폭 450) → [E8] msgBox.DialogHide [YES] (L224) → confirm(false)
  const onCancel = async () => {
    const model = selected.current;
    if (!model) { message.warning('기준 적용일을 선택해주세요'); return; }
    if (!isFixed(model)) { message.warning('확정 전 준수항목 리스입니다'); return; }
    try {
      if (await icsApi.hasComplianceWrite(model.startDate)) { message.warning('작성한 준수확인항목이 존재합니다'); return; }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${koDate(model.startDate)} 적용 준수항목리스트를 확정 취소하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: () => confirm(false),
    });
  };

  // [E9] deleteButton[삭제].Select (L249) → delete() L334-375: 선택 없으면 "기준 적용일을 선택해주세요" → "삭제"/"해당 적용일을 삭제하시겠습니까?"(폭 400)
  //   → [E15] msgBox.DialogHide [YES] (L342) → 서비스 ics.Ics30_Compliance.deleteByDate: 작성 기록이 있으면 "삭제 불가능한 내용이 포함되어있습니다", 아니면 retrieve() + formGrid 비움
  const onDelete = () => {
    const model = selected.current;
    if (!model) { message.warning('기준 적용일을 선택해주세요'); return; }
    Modal.confirm({
      title: '삭제',
      content: '해당 적용일을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        try {
          await icsApi.deleteComplianceDate(model.startDate);
        } catch (err) {
          message.warning(errorMessage(err, '삭제 불가능한 내용이 포함되어있습니다'));
          return;
        }
        formCrud.clear();
        await retrieve();
      },
    });
  };

  // [E11] insertFormButton[행 추가].Select (L262) → insertForm() L393-413: 기준 적용일을 안 골랐으면 "기준 적용일을 선택해주세요"
  const insertForm = () => {
    if (!selected.current) { message.warning('기준 적용일을 선택해주세요'); return; }
    formCrud.addRow();
  };

  // [E12] deleteFormButton[행 삭제].Select (L268) → 고른 행을 deleteList에 모으고 그리드에서 뺀다 (확인 창 없음)
  const deleteForm = () => {
    const checked = formCrud.gridRef.current?.api?.getSelectedRows() ?? [];
    deleteIds.current.push(...checked.map(r => r.complianceId).filter(id => id > 0));
    formCrud.removeRows(checked.map(r => r.complianceId));
  };

  // updateForm() L475-491: updateList(actionCode "yes") → "정상적으로 저장되었습니다" → retrieveForm()
  const updateForm = async (rows: IcsCompliance[]) => {
    try {
      await icsApi.saveCompliances(rows, deleteIds.current);
      message.success('정상적으로 저장되었습니다');
      if (selected.current) await retrieveForm(selected.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E13] updateFormButton[저장].Select (L277) → updateFormChk() L415-473: 사용이면 미사용 적용일자를 비우고, 미사용인데 적용일자가 없으면
  //   "미사용 처리 시, 미사용 적용일자는 필수 선택사항입니다" → updateList(actionCode "check"): 1 저장 / 1 초과 → [E16] 확인 창(폭 650) YES → updateForm()
  //   / 1 미만 "선택한 내용 중 삭제 불가능한 내용이 포함되어있습니다" + retrieveForm()
  const updateFormChk = async () => {
    formCrud.gridRef.current?.api?.stopEditing();
    const rows = formCrud.getChanged().map(r => (r.useYn === 'true' ? { ...r, useCloseDate: null } : r));
    if (rows.some(r => r.useYn !== 'true' && !r.useCloseDate)) {
      message.warning('미사용 처리 시, 미사용 적용일자는 필수 선택사항입니다');
      return;
    }
    let status: number;
    try {
      status = await icsApi.checkSaveCompliances(rows, deleteIds.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    if (status === 1) {
      await updateForm(rows);
    } else if (status > 1) {
      Modal.confirm({
        title: '확인',
        content: '이미 사용중인 내용을 수정 시, 예기치 못한 문제가 발생할 수있습니다. 진행하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 650,
        onOk: () => updateForm(rows),
      });
    } else {
      message.warning('선택한 내용 중 삭제 불가능한 내용이 포함되어있습니다');
      if (selected.current) await retrieveForm(selected.current);
    }
  };

  // buildGrid() L303-307
  const dateColumns = useMemo(() => [
    gbDate.date('startDate', 100, '기준 적용일'),  // L304
    gbDate.booleanYn('dateFixYn', 50, '확정'),     // L305
  ], []);

  // [E14] complianceTypeComboBox[IcsComplianceType].Collapse (L313) → 그 행의 complianceType·complianceTypeName을 바꾼다
  // buildFormGrid() L309-332
  const formColumns = useMemo(() => [
    gbForm.text('complianceTypeName', 200, '준수항목', {
      editor: 'select',
      values: typeCodes.map(c => c.name),
      valueSetter: p => {
        p.data.complianceTypeName = p.newValue;
        p.data.complianceType = typeCodes.find(c => c.name === p.newValue)?.code ?? p.data.complianceType;
        return true;
      },
    }),                                                                           // L323
    gbForm.text('subNum', 100, '내부번호', { editor: 'text' }),                     // L324
    gbForm.textArea('content', 550, '내용', { editor: 'largeText' }),               // L325
    gbForm.boolean('naUseYn', 100, '해당없음<br>사용', { editable: true }),          // L326
    gbForm.boolean('useYn', 100, '사용', { editable: true }),                       // L327
    gbForm.date('useCloseDate', 100, '미사용<br>적용일자', { editor: 'date' }),      // L328
    gbForm.textArea('note', 350, '비고', { editor: 'largeText' }),                  // L329
  ], [typeCodes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px 20px 20px', boxSizing: 'border-box', background: '#fff' }}>
      {/* buttonBarHlc L76-126: 왼쪽 70% / 오른쪽 30% */}
      <div style={{ display: 'flex', alignItems: 'center', height: 50, border: '1px solid #d9d9d9', boxSizing: 'border-box', flex: 'none' }}>
        <div style={{ flex: '0 0 70%', display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8, minWidth: 0 }}>
          {/* [E3] retrieveButton[조회].Select (L143) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          <Button type="register" onClick={insert}>등록</Button>
          <Button type="save" onClick={onConfirm}>확정</Button>
          <Button type="cancel" onClick={onCancel}>확정취소</Button>
          <Button type="delete" onClick={onDelete} disabled={!formEnabled}>삭제</Button>
          <span style={{ width: 8 }} />
          {/* [E10] excpEmpButton[예외사원 등록].Select (L255) → lookupExcpEmp() L545-548: Emp33_Lookup_ExceptBiz.open("10") */}
          <Button type="register" onClick={() => setExcpBizCode('10')}>예외사원 등록</Button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, paddingRight: 8 }}>
          <Button type="addRow" onClick={insertForm} disabled={!formEnabled}>행 추가</Button>
          <Button type="removeRow" onClick={deleteForm} disabled={!formEnabled}>행 삭제</Button>
          <Button type="save" onClick={updateFormChk} disabled={!formEnabled}>저장</Button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ width: 200, flex: 'none', border: '1px solid #d9d9d9', borderTop: 0, boxSizing: 'border-box' }}>
          {/* [E1] grid.RowClick (L129) → retrieveForm() */}
          <SingleGrid<IcsComplianceDate>
            gridRef={dateGridRef}
            rowData={dates}
            columnDefs={dateColumns}
            getRowId={p => String(p.data.complianceId)}
            onRowClicked={e => { if (e.data) void retrieveForm(e.data); }}
            onRowDataUpdated={e => {
              if (selectFirst.current) { selectFirst.current = false; e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }  // grid.getSelectionModel().select(0, false)
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: '7 1 0', minHeight: 0, border: '1px solid #d9d9d9', borderTop: 0, borderLeft: 0, boxSizing: 'border-box' }}>
            {/* [E2] formGrid.RowClick (L136) → tapPage.retrieve(고른 행) */}
            <CellEditGrid<IcsCompliance>
              crud={formCrud}
              columnDefs={formColumns}
              rowSelection={MULTI_SELECTION}
              onRowClicked={e => { if (e.data) void answerRef.current?.retrieve(e.data); }}
            />
          </div>
          <div style={{ flex: '3 1 0', minHeight: 0, border: '1px solid #d9d9d9', borderTop: 0, borderLeft: 0, boxSizing: 'border-box' }}>
            <Ics33_TabPage_ComplianceAnswer ref={answerRef} />
          </div>
        </div>
      </div>
      <Emp33_Lookup_ExceptBiz exceptBizCode={excpBizCode} onClose={() => setExcpBizCode(null)} />
      <Ics30_Lookup_Insert open={insertOpen} dateList={dates.map(d => d.startDate)} onCreated={() => { void retrieve(); }} onClose={() => setInsertOpen(false)} />
    </div>
  );
};
