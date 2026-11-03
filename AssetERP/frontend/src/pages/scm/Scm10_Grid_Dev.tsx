/**
 * 개발자 그리드 (EE16) — Scm01_Edit_DevMng 아래 오른쪽(1200×220)
 * AS-IS: myApp/client/vi/scm/Scm10_Grid_Dev.java (244줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprStepGrid() L91-176 (체크 없음, 한 줄 선택): 등록일 100(날짜 편집) · 개발자 80(사원 조회) · 개발내용 390 · [편집] 30 · 진행상태 80 · [보기] 30 · 프로그램 55 · [보기] 30 · 첨부파일 55 · [보기] 30 · 시작일 90 · 완료예정일 90 · 완료일 90
 * insertRow(srId) L48-73: Emp00_Lookup_SelectMulti에서 고른 사원마다 한 줄(등록일 = 오늘, 개발자 = 그 사원) · update() L178-202: scm.Scm10_Dev.updateList → retrieve()
 * [E1] 개발자 칸 트리거 (L93) → Emp00_Lookup_SelectSingle · [편집] (L109) → Scm10_Lookup_Note · [보기] 진행상태 (L138) → Scm11_Lookup_DevStep.edit · 프로그램 (L145) → Scm13_Lookup_DevProgram · 첨부파일 (L152) → Scm01_Lookup_ApprFile
 * deleteChk() L204-222: 확인창 "삭제하시겠습니까?" → [E2] YES → deleteRow() L224-239: scm.Scm11_DevStep.deleteByDevId → scm.Scm10_Dev.delete
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Dev } from '@/types/scm';
import { TransInfo } from '@/types/emp';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Scm01_Lookup_ApprFile } from './Scm01_Lookup_ApprFile';
import { Scm10_Lookup_Note } from './Scm10_Lookup_Note';
import { Scm11_Lookup_DevStep } from './Scm11_Lookup_DevStep';
import { Scm13_Lookup_DevProgram } from './Scm13_Lookup_DevProgram';

const gb = gbFor<Dev>();
let tempId = 0;
const today = () => dayjs().format('YYYY-MM-DD');
/** 개발내용 요약 — arrangeNote.replaceAll("<[^>]*>", "") (L132) */
const stripTags = (html: string) => html.replace(/<[^>]*>/g, '');

export interface ScmDevHandle {
  /** retrieve(srModel) L80-89: scm.Scm10_Dev.selectBySrId(srId) */
  retrieve: (srId: number) => Promise<void>;
  insertRow: (srId: number) => void;
  update: () => Promise<void>;
  deleteChk: () => void;
  clear: () => void;
}

export const Scm10_Grid_Dev = forwardRef<ScmDevHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<Dev>>(null);
  const [srId, setSrId] = useState<number | null>(null);
  const [rows, setRows] = useState<Dev[]>([]);
  /** 고친 줄 — AS-IS grid.getStore().getModifiedRecords() */
  const [modified, setModified] = useState<Set<number>>(new Set());
  const [addFor, setAddFor] = useState<number | null>(null);
  const [empTarget, setEmpTarget] = useState<Dev | null>(null);
  const [noteTarget, setNoteTarget] = useState<Dev | null>(null);
  const [stepDevId, setStepDevId] = useState<number | null>(null);
  const [programDevId, setProgramDevId] = useState<number | null>(null);
  const [fileDevId, setFileDevId] = useState<number | null>(null);
  // [E0] 화면 열림 (생성자 L75-78) → 그리드를 가득 채운다 (조회는 부르는 쪽이 retrieve(srModel))

  const retrieve = useCallback(async (id: number) => {
    setSrId(id);
    try {
      setRows(await scmApi.searchDevs(id));
      setModified(new Set());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  const patchRow = (devId: number, patch: Partial<Dev>) => {
    setRows(prev => prev.map(r => (r.devId === devId ? { ...r, ...patch } : r)));
    setModified(prev => new Set(prev).add(devId));
  };

  // insertRow(srId) L48-73: Emp00_Lookup_SelectMulti(new Date()) → 고른 사원마다 한 줄(등록일 = 오늘, 개발자 = 그 사원)
  const addDevs = (list: TransInfo[]) => {
    if (addFor == null) return;
    const added = list.map<Dev>(e => ({ devId: --tempId, srId: addFor, regDate: today(), personId: e.personId, personNm: e.korNm ?? null }));
    setRows(prev => [...prev, ...added]);  // 03 원칙 17: 맨 아래에 넣고 보이게 스크롤
    setModified(prev => new Set([...prev, ...added.map(a => a.devId)]));
    setTimeout(() => {
      const last = added[added.length - 1];
      const node = last ? gridRef.current?.api?.getRowNode(String(last.devId)) : null;
      if (node?.rowIndex != null) gridRef.current?.api?.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // update() L178-202: 고친 줄을 scm.Scm10_Dev.updateList → retrieve()
  const update = async () => {
    if (srId == null) return;
    try {
      const changed = rows.filter(r => modified.has(r.devId));
      if (changed.length > 0) {
        await scmApi.saveDevs(changed.map(r => ({ devId: r.devId, srId: r.srId ?? srId, personId: r.personId ?? null, regDate: r.regDate ?? null, note: r.note ?? null })));
      }
      await retrieve(srId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // deleteChk() L204-222 → [E2] msgBox.DialogHide [YES] (L207) → deleteRow() L224-239
  const deleteChk = () => {
    const target = gridRef.current?.api?.getSelectedRows()[0];
    if (!target) { message.warning('삭제할 개발자를 선택해주세요'); return; }
    Modal.confirm({
      title: '삭제', content: '삭제하시겠습니까?', width: 200, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          if (target.devId > 0) await scmApi.deleteDevs([target.devId]);
          setRows(prev => prev.filter(r => r.devId !== target.devId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  useImperativeHandle(ref, () => ({
    retrieve, insertRow: setAddFor, update, deleteChk,
    clear: () => { setRows([]); setSrId(null); setModified(new Set()); },
  }), [retrieve, rows, modified, srId]);  // eslint-disable-line react-hooks/exhaustive-deps

  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일', {
      editor: 'date',
      onCellValueChanged: p => patchRow(p.data.devId, { regDate: p.newValue ?? null }),
    }),
    // [E1] lookupEmpInfo.TriggerClick (L93) → Emp00_Lookup_SelectSingle.open(new Date(), callback)
    gb.text('personNm', 80, '개발자', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: Dev; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setEmpTarget(p.data); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('arrangeNote', 390, '개발내용'),
    iconCell<Dev>('edit', 'noteCell', 30, '', row => setNoteTarget(row)),
    gb.text('devStepResult', 80, '진행상태'),
    iconCell<Dev>('view', 'stepCell', 30, '', row => setStepDevId(row.devId)),
    gb.long('devProgramCnt', 55, '프로그램'),
    iconCell<Dev>('view', 'programCell', 30, '', row => setProgramDevId(row.devId)),
    gb.long('fileCnt', 55, '첨부파일'),
    iconCell<Dev>('view', 'fileCell', 30, '', row => setFileDevId(row.devId)),
    gb.date('startDate', 90, '시작일'),
    gb.date('dueDate', 90, '완료예정일'),
    gb.date('resultDate', 90, '완료일'),
  ], []);

  return (
    <>
      <SingleGrid<Dev> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.devId)} />
      {/* insertRow(srId) → Emp00_Lookup_SelectMulti.open(new Date(), callback) */}
      <Emp00_Lookup_SelectMulti open={addFor != null} transDate={today()} onResult={addDevs} onClose={() => setAddFor(null)} />
      <Emp00_Lookup_SelectSingle
        open={empTarget != null}
        transDate={today()}
        noneLabel={null}
        onResult={emp => {
          const target = empTarget;
          setEmpTarget(null);
          if (emp && target) patchRow(target.devId, { personId: emp.personId, personNm: emp.korNm ?? null });
        }}
        onClose={() => setEmpTarget(null)}
      />
      {/* [편집] (L109) → Scm10_Lookup_Note.open(devModel, callback): 개발내용(note)과 요약(arrangeNote)을 그 행에 넣는다(저장은 [저장]) */}
      <Scm10_Lookup_Note
        open={noteTarget != null}
        note={noteTarget?.note ?? ''}
        editable
        onResult={html => { if (noteTarget) patchRow(noteTarget.devId, { note: html, arrangeNote: stripTags(html) }); }}
        onClose={() => setNoteTarget(null)}
      />
      <Scm11_Lookup_DevStep open={stepDevId != null} devId={stepDevId} mode="edit" onClose={() => setStepDevId(null)} />
      <Scm13_Lookup_DevProgram open={programDevId != null} devId={programDevId} onClose={() => setProgramDevId(null)} />
      <Scm01_Lookup_ApprFile open={fileDevId != null} devId={fileDevId} onClose={() => setFileDevId(null)} />
    </>
  );
});
Scm10_Grid_Dev.displayName = 'Scm10_Grid_Dev';
