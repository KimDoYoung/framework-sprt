/**
 * 승인선 변경·확인 창 (N21) — 업무점검자 지정 화면의 [승인선]이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm58_Lookup_ChckApprStep.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 600×400(원본): 툴바([조회][등록][저장][삭제]) + 체크 다중 그리드(행번호 숨김, 구분 120·성명 80·부서명 200·위로 70·아래로 70) + [닫기]
 * view(chckOrgId, stdDate) L68-81: "승인선 확인" — [등록][저장][삭제]와 위로·아래로 열을 감춘다. edit(…) L83-86: "승인선 변경"
 * 승인선 순서(apprSeq "01"…)는 저장할 때와 위로·아래로를 누를 때마다 목록 순서대로 다시 매긴다.
 * UX보강(10): 조회창(UX-05·06 — 삭제용 체크라 행 클릭 선택은 쓰지 않는다). 저장(n)(UX-03)·변경 표시(UX-07)는 `useGridCrud`를 쓰지 않아 넣지 않았다(원본도 변경이 없어도 저장은 눌린다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmChckApprStep } from '@/types/tdm';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<TdmChckApprStep>();

/** 위로·아래로 칸 (AS-IS ImageCell("▲"/"▼")) */
const moveCell = (colId: string, header: string, mark: string, onClick: (row: TdmChckApprStep) => void): ColDef<TdmChckApprStep> => ({
  colId,
  headerName: header,
  width: 70,
  sortable: false,
  cellStyle: { textAlign: 'center', cursor: 'pointer' },
  valueGetter: () => mark,
  onCellClicked: p => { if (p.data) onClick(p.data); },
});

export interface ChckApprStepTarget {
  chckOrgId: number;
  /** 기준일 'yyyy-MM-dd' (open의 stdDate — 사원찾기 기준일) */
  stdDate: string;
  /** 'view' = 승인선 확인(읽기), 'edit' = 승인선 변경 */
  mode: 'view' | 'edit';
}

interface Props {
  /** 값이 있으면 열림 */
  target: ChckApprStepTarget | null;
  onClose: () => void;
}

export const Tdm58_Lookup_ChckApprStep: React.FC<Props> = ({ target, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmChckApprStep>>(null);
  const [rows, setRows] = useState<TdmChckApprStep[]>([]);
  const [dirty, setDirty] = useState(false);             // grid.getStore().getModifiedRecords().size() != 0
  const [empLookup, setEmpLookup] = useState(false);     // Emp00_Lookup_SelectMulti
  const tempId = useRef(0);
  const readOnly = target?.mode === 'view';

  // buildGrid() L170-194: setRowNumHidden(true), setChecked(MULTI). view()는 위로·아래로(L75-76)를 감춘다
  const changeRowRef = useRef<(row: TdmChckApprStep, code: 'up' | 'down') => void>(() => undefined);
  const columnDefs = useMemo(() => [
    gb.textCenter('apprStepInfo', 120, '구분'),  // L187
    gb.text('apprEmpName', 80, '성명'),  // L188 addTextFixCenter
    gb.text('apprOrgName', 200, '부서명'),  // L189 addTextFix
    ...(readOnly ? [] : [
      moveCell('up', '위로', '▲', r => changeRowRef.current(r, 'up')),  // L190
      moveCell('down', '아래로', '▼', r => changeRowRef.current(r, 'down')),  // L191
    ]),
  ], [readOnly]);

  // retrieve() L196-209: tdm.Tdm58_ChckApprStep.selectByChckOrgId
  const retrieve = useCallback(async () => {
    if (!target) return;
    try {
      setRows(await tdmApi.searchChckApprSteps(target.chckOrgId));
      setDirty(false);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [target]);

  // [E0] 화면 열림 (생성자 L95-121) → settings() / open() L88-93 → retrieve(), show()
  useEffect(() => {
    if (!target) return;
    setRows([]);
    void retrieve();
  }, [target, retrieve]);

  // getSeq() L316-324: 목록 순서대로 "01"… 다시 매김
  const renumber = (list: TdmChckApprStep[]) => list.map((r, i) => ({ ...r, apprSeq: String(i + 1).padStart(2, '0') }));

  // [E2] insertButton[등록].Select (L130) → insertRow() L211-236: 사원찾기(다중) → 고른 사원마다 맨 아래에 행(부서명·성명·승인자ID)
  const insertRow = (list: TransInfo[]) => {
    if (!target) return;
    const added: TdmChckApprStep[] = list.map(m => ({
      chckApprStepId: --tempId.current,
      chckOrgId: target.chckOrgId,
      apprEmpId: m.personId,
      apprEmpName: m.korNm,
      apprOrgName: m.orgKorNm,
    }));
    setRows(prev => [...prev, ...added]);
    setDirty(true);
    setTimeout(() => {
      const api = gridRef.current?.api;
      if (api && added.length > 0) api.ensureIndexVisible(api.getDisplayedRowCount() - 1);
    });
  };

  // [E3] updateButton[저장].Select (L136) → update() L238-282: 중복 사원이면 안내, 목록 순서대로 apprSeq를 매겨 전체 행 저장 → 성공하면 retrieve()
  const update = async () => {
    if (new Set(rows.map(r => r.apprEmpId)).size !== rows.length) {
      message.warning('승인선에 중복된 사원이 존재합니다');
      return;
    }
    const ordered = renumber(rows);
    try {
      await tdmApi.saveChckApprSteps(ordered.map(r => ({ chckApprStepId: r.chckApprStepId, chckOrgId: r.chckOrgId, apprSeq: r.apprSeq as string, apprEmpId: r.apprEmpId })));
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // changeRow(actionCode) L284-314: 맨 위 두 번째 행은 올라가지 않는다(원본 조건 rowIndex > 1 그대로) → getSeq() → 옮긴 행 선택
  const changeRow = (record: TdmChckApprStep, code: 'up' | 'down') => {
    const idx = rows.findIndex(r => r.chckApprStepId === record.chckApprStepId);
    if (idx < 0) return;
    const list = [...rows];
    if (code === 'down') {
      if (idx + 1 < list.length) { list.splice(idx, 1); list.splice(idx + 1, 0, record); }
    } else if (idx > 1) {
      list.splice(idx, 1); list.splice(idx - 1, 0, record);
    }
    setRows(renumber(list));
    setDirty(true);
    setTimeout(() => gridRef.current?.api.getRowNode(String(record.chckApprStepId))?.setSelected(true), 0);
  };
  changeRowRef.current = changeRow;

  // [E4] deleteButton[삭제].Select (L142) → deleteChk() L326-344: 확인(300) → [E7] deleteRow() L346-350: tdm.Tdm58_ChckApprStep.delete (저장된 행) 뒤 목록에서 뺀다
  const deleteChk = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: '선택한 승인자를 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          const ids = checked.map(r => r.chckApprStepId).filter(id => id > 0);
          if (ids.length > 0) await tdmApi.deleteChckApprSteps(ids);
          const gone = new Set(checked.map(r => r.chckApprStepId));
          setRows(prev => prev.filter(r => !gone.has(r.chckApprStepId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E5] closeButton[닫기].Select (L148): 반영되지 않은 변경이 있으면 확인(350) → [E6] messageBox.DialogHide (L153) YES → hide()
  const close = () => {
    if (!dirty) { onClose(); return; }
    Modal.confirm({
      title: '확인',
      content: <span>반영되지 않은 변경사항이 존재합니다.<br />저장하지 않고 닫으시겠습니까?</span>,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: () => onClose(),
    });
  };

  return (
    <>
      <LookupModal
        open={target != null}
        title={readOnly ? '승인선 확인' : '승인선 변경'}
        width={700}
        closable={false}
        maskClosable={false}
        onCancel={close}
        destroyOnHidden
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
      >
        <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L124) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {!readOnly && <Button type="register" onClick={() => setEmpLookup(true)}>등록</Button>}
            {!readOnly && <Button type="save" onClick={update}>저장</Button>}
            {!readOnly && <Button type="delete" onClick={deleteChk}>삭제</Button>}
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<TdmChckApprStep>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              rowNumber={false}
              getRowId={p => String(p.data.chckApprStepId)}
            />
          </div>
        </div>
      </LookupModal>
      {/* insertRow() L212: Emp00_Lookup_SelectMulti.open(stdDate, callback) — 로그인 회사, 겸직 없음 */}
      <Emp00_Lookup_SelectMulti
        open={empLookup && target != null}
        transDate={target?.stdDate ?? ''}
        onResult={list => { setEmpLookup(false); insertRow(list); }}
        onClose={() => setEmpLookup(false)}
      />
    </>
  );
};
