/**
 * 책무이행점검의 아래 점검항목 목록 (N22)
 * AS-IS: myApp/client/vi/tdm/Tdm52_TabPage_CheckManl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-56: 체크박스 다중 그리드(직책 150 · 구분 50 · 책무 300 · 점검항목 650 · 점검결과 80 · 점검상태 80 · 점검 45(DynamicCell 아이콘) · 점검이력 70(아이콘))
 * 툴바는 없다 — 일괄점검·일괄점검취소는 위 화면(Tdm52_Tab_CheckManl)의 단추가 lookupBatchCheckManl()을 부른다
 * 점검 아이콘 = 점검 창(Tdm52_Edit_ChckManl), 일괄점검 = 일괄점검 창(Tdm52_Edit_ChckManlBatch) 또는 서버 일괄 취소. 점검 열은 addDynamicCell(…, true) — 점검상태가 없으면 금지 표시(BanIcon, N23에서 부품으로 뽑음)
 * UX보강(10): 해당 없음(체크박스 그리드는 조회창이 아니라 행 클릭 선택 없음)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckManlDetail, TdmCheckOrg } from '@/types/tdm';
import { MultiGrid, gbFor } from '@/components/grid';
import { dynamicIconCell, iconCell } from '@/components/grid/iconCell';
import { Tdm52_Edit_ChckManl } from './Tdm52_Edit_ChckManl';
import { Tdm52_Edit_ChckManlBatch } from './Tdm52_Edit_ChckManlBatch';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb = gbFor<TdmCheckManlDetail>();

export interface CheckManlTarget {
  /** 위 그리드에서 고른 부서 점검현황. 없으면 목록을 비운다 (AS-IS tabPage.clear()) */
  org: TdmCheckOrg | null;
  /** 점검자 (AS-IS checkEmpId) */
  checkEmpId: number | null;
  /** 점검 마감 여부 */
  endYn: boolean;
  /** 진행&반려건만 */
  undoneYn: boolean;
  /** 점검년월의 첫날 'yyyy-MM-dd' */
  stdDate: string;
  /** 같은 부서를 다시 눌러도 다시 읽게 하는 번호 (AS-IS retrieve(model, param) 호출마다 +1) */
  nonce: number;
}

export interface Tdm52_TabPage_CheckManlHandle {
  /** AS-IS lookupBatchCheckManl(actionType) L158-220 — P 일괄점검 / C 일괄점검취소 */
  lookupBatchCheckManl: (actionType: 'P' | 'C') => void;
}

interface Props {
  target: CheckManlTarget;
  /** 위 화면의 검색어 (AS-IS searchText TextField — 조회할 때 읽는다) */
  searchText: string;
  /** 일괄점검·일괄취소가 끝나면 부르는 쪽이 다시 조회한다 (AS-IS callback.execute()) */
  onChanged: () => void;
}

export const Tdm52_TabPage_CheckManl = forwardRef<Tdm52_TabPage_CheckManlHandle, Props>(({ target, searchText, onChanged }, ref) => {
  const { org, checkEmpId, endYn, undoneYn } = target;
  const gridRef = useRef<AgGridReact<TdmCheckManlDetail>>(null);
  const [rows, setRows] = useState<TdmCheckManlDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<{ manl: TdmCheckManlDetail; mode: 'view' | 'edit' } | null>(null);
  const [batchIds, setBatchIds] = useState<number[] | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const latest = useRef({ searchText, endYn, checkEmpId, undoneYn, org });
  latest.current = { searchText, endYn, checkEmpId, undoneYn, org };

  // retrieve() L103-124: tdm.Tdm52_ChckManl.selectByPersonId(chckOrgId, personId, undoneYn, searchText = 글자가 있을 때만 "%…%") → 첫 행 선택
  const retrieve = useCallback(async () => {
    const c = latest.current;
    if (!c.org || c.checkEmpId == null) { setRows([]); return; }   // clear() L88-90
    setLoading(true);
    try {
      const list = await tdmApi.searchCheckManlsByPerson({ chckOrgId: c.org.chckOrgId, personId: c.checkEmpId, undoneYn: c.undoneYn, searchText: c.searchText });
      setRows(list);
      if (list.length > 0) setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L49-56) / 부모의 retrieve(model, param) L92-101 → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [org?.chckOrgId, target.nonce]);

  // lookupCheckManl() L126-156 (점검 아이콘)
  const lookupCheckManl = (row: TdmCheckManlDetail) => {
    // 점검상태가 점검대기(10)면 열 수 없다. (null이면 점검 아이콘 자체가 그려지지 않는다 — DynamicCell)
    if (row.checkStatusCode === '10') { message.warning('점검대기 상태입니다. 상단의 "점검시작" 버튼을 클릭하세요'); return; }
    const readOnly = endYn || ['20', '21', '25'].includes(row.checkStatusCode ?? '');   // 점검마감 · 승인요청/진행/완료
    setEdit({ manl: row, mode: readOnly ? 'view' : 'edit' });
  };

  // lookupBatchCheckManl(actionType) L158-220 → lookupBatchCheckManl2() L222-253
  const lookupBatchCheckManl = (actionType: 'P' | 'C') => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 점검항목이 없습니다'); return; }
    const targets: TdmCheckManlDetail[] = [];
    for (const m of selected) {
      if (m.checkStatusCode === '10') { message.warning('점검대기 상태입니다. 상단의 "점검시작" 버튼을 클릭하세요'); return; }
      if (actionType === 'P' && m.checkStatusCode === '11') targets.push(m);          // (11:점검진행)
      else if (actionType === 'C' && m.checkStatusCode === '19') targets.push(m);     // (19:점검완료)
    }
    if (targets.length === 0) {
      message.warning(actionType === 'P' ? "'점검진행'인 점검항목을 선택하세요" : "'점검완료'인 점검항목을 선택하세요");
      return;
    }
    let msg: string;
    let width = 450;
    if (selected.length !== targets.length) {
      width = 530;
      msg = actionType === 'P'
        ? `점검상태가 '점검진행'인 항목(${targets.length}건)만 처리합니다.\n이미 점검내용이 작성되어 있는 경우 초기화됩니다. 처리하시겠습니까?`
        : `점검상태가 '점검완료'인 항목(${targets.length}건)만 취소합니다. 진행하시겠습니까?`;
    } else {
      msg = actionType === 'P'
        ? `선택한 ${targets.length}건의 점검항목을 처리하시겠습니까?\n(이미 점검내용이 작성되어 있는 경우 초기화됩니다)`
        : `선택한 ${targets.length}건의 점검항목의 점검처리를 취소하시겠습니까?`;
    }
    const ids = targets.map(m => m.chckManlId);
    // [E1] messageBox.DialogHide [YES] (L210) → lookupBatchCheckManl2()
    Modal.confirm({
      title: '확인', content: <span style={{ whiteSpace: 'pre-line' }}>{msg}</span>, width, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (actionType === 'P') { setBatchIds(ids); return; }                    // Tdm52_Edit_ChckManlBatch.open(list, stdDate, cb)
        try {
          await tdmApi.batchCancelCheckManls(ids);                               // tdm.Tdm52_ChckManl.batchCancelComplete
        } catch (err) {
          message.info(errorMessage(err, '처리 실패'));
          return;
        }
        message.info('점검취소가 완료되었습니다');
        onChanged();
      },
    });
  };

  useImperativeHandle(ref, () => ({ lookupBatchCheckManl }));

  // buildGrid() L58-86 (setChecked MULTI) — 점검 열은 addDynamicCell(…, true): 점검상태가 없으면(점검 작업 확정 전) 아이콘을 그리지 않는다
  const columnDefs = useMemo(() => {
    return [
      gb.text('roleName', 150, '직책'),  // L76
      gb.textCenter('commonTypeName', 50, '구분'),  // L77
      gb.text('taskName', 300, '책무'),  // L78
      gb.textArea('checkItem', 650, '점검항목'),  // L79
      gb.textStatus('checkResultName', 80, '점검결과'),  // L80
      gb.textStatus('checkStatusName', 80, '점검상태'),  // L81
      dynamicIconCell<TdmCheckManlDetail>('edit', 'actionCell01', 45, '점검', lookupCheckManl, row => row.checkStatusCode != null),  // L83 actionCell01 → lookupCheckManl()
      iconCell<TdmCheckManlDetail>('view', 'actionCell02', 70, '점검이력', row => setRecordId(row.chckManlId)),  // L84 actionCell02 → Tdm55_Lookup_ChckRecord.open(chckManlId)
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endYn]);

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <MultiGrid<TdmCheckManlDetail>
        gridRef={gridRef}
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={p => String(p.data.chckManlId)}
        loading={loading}
      />
      <Tdm52_Edit_ChckManl
        target={edit}
        onChanged={m => setRows(prev => prev.map(r => (r.chckManlId === m.chckManlId ? m : r)))}
        onClose={() => setEdit(null)}
      />
      <Tdm52_Edit_ChckManlBatch
        ids={batchIds}
        onDone={onChanged}
        onClose={() => setBatchIds(null)}
      />
      <Tdm55_Lookup_ChckRecord relateId={recordId} onClose={() => setRecordId(null)} />
    </div>
  );
});
