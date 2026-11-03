/**
 * 진행단계 목록 (EE17) — Scm10_Tab_Dev 가운데 왼쪽(400)
 * AS-IS: myApp/client/vi/scm/Scm11_Grid_DevStep.java (87줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprStepGrid() L69-78 (체크 없음, 한 줄 선택, 행번호): 구분 60 · 담당자 80 · 확인일시 140 · 결과 60 (전부 정렬 없는 텍스트)
 * retrieve(devModel, callback) L35-39 · retrieve() L41-67: scm.Scm11_DevStep.selectByDevId(devId) → 첫 줄을 고르고 callback(그 줄)
 * [E1] grid.RowClick (L27) → callback(고른 줄)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<DevStep>();

export interface ScmDevStepGridHandle {
  /** 같은 개발의 목록을 다시 불러 첫 줄을 고른다(retrieve()) */
  retrieve: () => Promise<void>;
}

interface Props {
  /** retrieve(devModel, callback)의 devModel.getDevId(). null이면 비운다(clear) */
  devId: number | null;
  /** 바뀔 때마다 다시 조회한다(저장 뒤 Scm10_Tab_Dev.retrieve() → retrieveEditPage()) */
  reloadKey: number;
  /** callback.execute(고른 줄) — 줄이 하나도 없으면 null (AS-IS의 `result == null` 갈래) */
  onSelect: (step: DevStep | null) => void;
}

export const Scm11_Grid_DevStep = forwardRef<ScmDevStepGridHandle, Props>(({ devId, reloadKey, onSelect }, ref) => {
  // [E0] 화면 열림 (생성자 L23-33) → 그리드를 가득 채운다 (조회는 부르는 쪽이 retrieve(devModel, callback))
  const gridRef = useRef<AgGridReact<DevStep>>(null);
  const [rows, setRows] = useState<DevStep[]>([]);
  const [loading, setLoading] = useState(false);
  const pendingFirst = useRef(false);
  const seq = useRef(0);

  const retrieve = useCallback(async () => {
    const my = ++seq.current;
    if (devId == null) { setRows([]); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await scmApi.searchDevSteps(devId);
      if (my !== seq.current) return;
      if (list.length === 0) {
        setRows([]);
        onSelect(null);
        return;
      }
      pendingFirst.current = true;  // grid.getSelectionModel().select(0, false) — [2024.03.21] 가장 첫번째 항목에 포커스
      setRows(list);
      onSelect(list[0]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devId]);

  useEffect(() => { void retrieve(); }, [retrieve, reloadKey]);
  useImperativeHandle(ref, () => ({ retrieve }), [retrieve]);

  const columnDefs = useMemo(() => [
    gb.text('devStepNm', 60, '구분'),
    gb.text('personNm', 80, '담당자'),
    gb.text('resultDateStr', 140, '확인일시'),
    gb.text('resultNm', 60, '결과'),
  ], []);

  return (
    <SingleGrid<DevStep>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.devStepId)}
      loading={loading}
      onRowDataUpdated={e => {
        if (!pendingFirst.current) return;
        pendingFirst.current = false;
        e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
      }}
      // [E1] grid.RowClick (L27) → callback.execute(selectedItem)
      onRowClicked={e => { if (e.data) onSelect(e.data); }}
    />
  );
});
Scm11_Grid_DevStep.displayName = 'Scm11_Grid_DevStep';
