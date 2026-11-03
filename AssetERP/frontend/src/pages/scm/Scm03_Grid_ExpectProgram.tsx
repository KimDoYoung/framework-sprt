/**
 * 예상프로그램 그리드 (EE16) — Scm01_Edit_DevMng 아래 왼쪽(450×220)
 * AS-IS: myApp/client/vi/scm/Scm03_Grid_ExpectProgram.java (119줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprStepGrid() L75-83: 체크 다중, 구분 75 · 프로그램ID 150 · 프로그램명 150
 * insertRow(srModel) L30-57: Scm30_Lookup_SelectMulti에서 고른 프로그램마다 한 줄 (GridInsertRow, 아직 저장 안 함) · update() L85-88: scm.Scm03_ExpectProgram.update
 * deleteChk() L90-108: 확인창 "N건을 삭제하시겠습니까?" → [E1] YES → deleteRow() L110-114: scm.Scm03_ExpectProgram.delete(체크된 줄)
 * 버튼은 Scm01_Edit_DevMng의 [등록][저장][삭제]가 이 그리드의 핸들을 부른다
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { ExpectProgram, Program, Sr } from '@/types/scm';
import { MultiGrid, gbFor } from '@/components/grid';
import { Scm30_Lookup_SelectMulti } from './Scm30_Lookup_SelectMulti';

const gb = gbFor<ExpectProgram>();
let tempId = 0;

export interface ScmExpectProgramHandle {
  /** retrieve(srModel) L64-73: scm.Scm03_ExpectProgram.selectBySrId(srId) */
  retrieve: (sr: Sr) => Promise<void>;
  insertRow: (sr: Sr) => void;
  update: () => Promise<void>;
  deleteChk: () => void;
  clear: () => void;
}

export const Scm03_Grid_ExpectProgram = forwardRef<ScmExpectProgramHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<ExpectProgram>>(null);
  const [sr, setSr] = useState<Sr | null>(null);
  const [rows, setRows] = useState<ExpectProgram[]>([]);
  const [checked, setChecked] = useState<ExpectProgram[]>([]);
  const [lookupSr, setLookupSr] = useState<Sr | null>(null);
  // [E0] 화면 열림 (생성자 L59-62) → 그리드를 가득 채운다 (조회는 부르는 쪽이 retrieve(srModel))

  const retrieve = useCallback(async (target: Sr) => {
    setSr(target);
    try {
      setRows(await scmApi.searchExpectPrograms(target.srId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // Scm30_Lookup_SelectMulti 결과 → 고른 프로그램마다 새 줄 (srId, programId, 구분·ID·명)
  const addPrograms = (list: Program[]) => {
    if (!lookupSr) return;
    const added = list.map<ExpectProgram>(p => ({
      expectProgramId: --tempId, srId: lookupSr.srId, programId: p.programId,
      programTypeNm: p.programTypeNm ?? null, programCd: p.programCd ?? null, programNm: p.programNm ?? null,
    }));
    setRows(prev => [...prev, ...added]);  // 03 원칙 17: 맨 아래에 넣고 보이게 스크롤
    setTimeout(() => {
      const last = added[added.length - 1];
      const node = last ? gridRef.current?.api?.getRowNode(String(last.expectProgramId)) : null;
      if (node?.rowIndex != null) gridRef.current?.api?.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  const update = async () => {
    const news = rows.filter(r => r.expectProgramId <= 0);
    if (news.length === 0 || !sr) return;
    try {
      await scmApi.saveExpectPrograms(news.map(r => ({ expectProgramId: r.expectProgramId, srId: r.srId ?? sr.srId, programId: r.programId ?? null })));
      await retrieve(sr);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E1] msgBox.DialogHide [YES] (L93) → deleteRow() L110-114
  const deleteChk = () => {
    const targets = checked;
    Modal.confirm({
      title: '삭제', content: `${targets.length}건을 삭제하시겠습니까?`, width: 300, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          const saved = targets.filter(r => r.expectProgramId > 0).map(r => r.expectProgramId);
          if (saved.length > 0) await scmApi.deleteExpectPrograms(saved);
          const gone = new Set(targets.map(r => r.expectProgramId));
          setRows(prev => prev.filter(r => !gone.has(r.expectProgramId)));
          setChecked([]);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  useImperativeHandle(ref, () => ({
    retrieve, insertRow: setLookupSr, update, deleteChk,
    clear: () => { setRows([]); setChecked([]); setSr(null); },
  }), [retrieve, rows, checked, sr]);  // eslint-disable-line react-hooks/exhaustive-deps

  const columnDefs = useMemo(() => [
    gb.text('programTypeNm', 75, '구분'),
    gb.text('programCd', 150, '프로그램ID'),
    gb.text('programNm', 150, '프로그램명'),
  ], []);

  return (
    <>
      <MultiGrid<ExpectProgram>
        gridRef={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={p => String(p.data.expectProgramId)}
        onCheckedChange={setChecked}
      />
      {/* insertRow → Scm30_Lookup_SelectMulti.open(srModel, callback) */}
      <Scm30_Lookup_SelectMulti open={lookupSr != null} systemCd={lookupSr?.systemCd ?? null} onResult={addPrograms} onClose={() => setLookupSr(null)} />
    </>
  );
});
Scm03_Grid_ExpectProgram.displayName = 'Scm03_Grid_ExpectProgram';
