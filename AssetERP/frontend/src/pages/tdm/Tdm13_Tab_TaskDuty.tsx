/**
 * [1413] 책무 > 01. 기본정보 > 관리의무 등록 (N06)
 * AS-IS: myApp/client/vi/tdm/Tdm13_Tab_TaskDuty.java + Tdm13_TabPage_TaskDuty.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-103: center(40%, 여백 20) = 툴바(기준일 · 전체보기 · 책무유형 · 검색 · [조회] / 오른쪽 [변경이력]) + 책무 세부내용 그리드(MultiGrid),
 *   south(60%, 여백 0·20·20·20) = Tdm13_TabPage_TaskDuty(▼ 관리의무: [등록][저장][삭제] + 관리의무 CellEditGrid)
 * 함께: Tdm14_Lookup_TaskType(책무유형 고르기), Tdm95_Lookup_ChangeHistory(변경이력)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Space, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmTaskDuty, TdmTaskDutyDetail } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, MultiGrid, gbFor, iconCell } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Tdm14_Lookup_TaskType } from './Tdm14_Lookup_TaskType';
import { Tdm95_Lookup_ChangeHistory } from './Tdm95_Lookup_ChangeHistory';

const FORMAT = 'YYYY-MM-DD';
const gbTop = gbFor<TdmTaskDutyDetail>();
const gbDuty = gbFor<TdmTaskDuty>();

type Pending = { kind: 'save' } | { kind: 'delete'; ids: number[] } | null;

export const Tdm13_Tab_TaskDuty: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmTaskDutyDetail>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());              // settings() L106 기준일 = 오늘
  const [baseDateEnabled, setBaseDateEnabled] = useState(true);          // 전체보기 값 변경 때만 바뀐다(L112-116) — 처음에는 켜져 있다
  const [allYn, setAllYn] = useState(true);                              // L108 전체보기 기본 체크
  const [taskType, setTaskType] = useState<{ code: string; name: string | null }>({ code: '%', name: null });   // L128-133 빈칸="전체"
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmTaskDutyDetail[]>([]);
  const [typeLookup, setTypeLookup] = useState(false);
  const [mainHistory, setMainHistory] = useState(false);

  // ── Tdm13_TabPage_TaskDuty (아래쪽) ──
  // [E0] 화면 열림 (생성자 L62-79) → settings(): 툴바(▼ 관리의무 · [등록][저장][삭제]) + 관리의무 그리드
  const detailRef = useRef<TdmTaskDutyDetail | null>(null);
  const [reasonFor, setReasonFor] = useState<Pending>(null);
  const [history, setHistory] = useState<{ targetId: number | null } | null>(null);
  const reasonRef = useRef<string | null>(null);

  const crud = useGridCrud<TdmTaskDuty>({
    idField: 'taskRelateDutyId',
    // retrieve(taskRelateDetailModel) L122-135: tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId
    search: useCallback(async () => (detailRef.current ? tdmApi.searchTaskDuties(detailRef.current.taskRelateDetailId) : []), []),
    save: useCallback((r: TdmTaskDuty[]) => tdmApi.saveTaskDuties(r, reasonRef.current), []),
    remove: useCallback((ids: number[]) => tdmApi.deleteTaskDuties(ids, reasonRef.current ?? ''), []),
    // insertRow() L235-249
    newRow: useCallback((): Partial<TdmTaskDuty> => ({
      taskId: detailRef.current?.taskId,
      taskRelateDetailId: detailRef.current?.taskRelateDetailId,
      useYn: 'true',
    }), []),
    firstEditField: 'content',
    // preUpdate() L137-218
    validate: changed => {
      for (const r of changed) {
        if (!r.content) return '관리의무를 입력하세요';
        if (r.seq == null) return '조회순서를 입력하세요';
      }
      return undefined;
    },
  });

  // retrieveEditPage() L193-196 → dutyPage.retrieve(selectModel)
  const retrieveEditPage = (row: TdmTaskDutyDetail) => {
    detailRef.current = row;
    void crud.retrieve();
  };

  // retrieve() L212-232: tdm.Tdm12_TaskRelateDetail.selectByText (companyId는 서버, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async (over?: { allYn?: boolean }) => {
    detailRef.current = null;       // dutyPage.gridClear() L216
    crud.clear();
    try {
      const list = await tdmApi.searchTaskDutyDetails({
        baseDate: baseDate.format(FORMAT),
        taskTypeCode: taskType.code,
        allYn: over?.allYn ?? allYn,
        searchText,
      });
      setRows(list);
      // 조회가 끝나면 첫 행 선택 (L225-229) → [E6] 선택 변경으로 아래쪽 조회
      if (list.length > 0) {
        setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L59-103) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L198-210, setGridHidden() L175-191: 전체보기가 아니면 사용기간·사용 열을 숨기고 나머지를 넓힌다
  const topColumns = useMemo(() => [
    gbTop.text('taskTypeName', allYn ? 200 : 250, '책무유형'),  // L201
    gbTop.text('taskName', allYn ? 350 : 400, '책무'),  // L202
    gbTop.date('taskStartDate', 90, '책무<br>사용시작일', { hide: !allYn }),  // L203
    gbTop.date('taskEndDate', 90, '책무<br>사용종료일', { hide: !allYn }),  // L204
    gbTop.text('content', allYn ? 650 : 700, '세부내용'),  // L205
    gbTop.booleanYn2('useYn', 35, '사용', { hide: !allYn }),  // L206
    gbTop.textCenter('dutyCnt', 80, '관리의무<br>건수'),  // L207
  ], [allYn]);

  // 아래쪽 buildGrid() L102-120
  const dutyColumns = [
    gbDuty.text('content', 1200, '관리의무', { editor: 'text' }),  // L114
    gbDuty.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L115
    gbDuty.boolean('useYn', 80, '사용여부', { editable: true }),  // L116
    // L117 historyCell(ImageCell "View") → Tdm95_Lookup_ChangeHistory.open("tdm13_task_relate_duty", 그 행의 ID)
    iconCell<TdmTaskDuty>('view', 'history', 70, '변경이력 ', row => setHistory({ targetId: row.taskRelateDutyId > 0 ? row.taskRelateDutyId : null })),
  ];

  // [E2] updateButton[저장].Select (L88) → preUpdate(): 검사 뒤, 기존 행을 고쳤으면 변경사유를 받고 저장(update L220-233)
  const preUpdate = () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length === 0) {
      message.warning('변경내역이 없습니다');
      return;
    }
    const invalid = changed.map(r => (!r.content ? '관리의무를 입력하세요' : r.seq == null ? '조회순서를 입력하세요' : undefined)).find(Boolean);
    if (invalid) {
      message.warning(invalid);
      return;
    }
    if (changed.some(r => r.taskRelateDutyId > 0)) {
      setReasonFor({ kind: 'save' });
    } else {
      reasonRef.current = null;
      void crud.saveRows();
    }
  };

  // [E1] insertButton[등록].Select (L82) → insertRow() L235-249
  const insertRow = () => {
    if (!detailRef.current) {
      message.warning('상단의 책무 세부내용을 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E3] deleteButton[삭제].Select (L94) → deleteChk() L251-307: 사용이력 검사 → "n건을 삭제하시겠습니까?" → 삭제사유 → deleteRow()
  const deleteChk = async () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    const savedIds = selected.map(r => r.taskRelateDutyId).filter(id => id > 0);
    try {
      if (savedIds.length > 0 && (await tdmApi.countTaskDutyUse(savedIds)) !== 0) {
        message.warning('사용이력이 있는 관리의무는 삭제 할 수 없습니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    // [E4] msgBox.DialogHide [YES] (L271) → 삭제사유 입력 → deleteRow(historyMap) L309-326
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 300,
      onOk: () => setReasonFor({ kind: 'delete', ids: selected.map(r => r.taskRelateDutyId) }),
    });
  };

  const onReason = async (text: string | null) => {
    const pending = reasonFor;
    if (!pending) return;
    if (text == null) {
      message.warning(pending.kind === 'save' ? '저장이 취소되었습니다 (사유 미입력)' : '삭제가 취소되었습니다 (사유 미입력)');
      return;
    }
    reasonRef.current = text;
    if (pending.kind === 'save') {
      await crud.saveRows();
    } else {
      // 저장된 행만 서버에서 지우고, 화면에서는 모두 뺀다
      const saved = pending.ids.filter(id => id > 0);
      try {
        if (saved.length > 0) await tdmApi.deleteTaskDuties(saved, text);
        crud.removeRows(pending.ids);
        message.success(`${pending.ids.length}건 삭제되었습니다.`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
      }
    }
  };

  // lookupTaskType() L234-250: Tdm14_Lookup_TaskType.view(true, …) — 고르면 이름·코드, [전체]면 비우고 코드 "%"
  const pickTaskType = (code: string | null, name: string | null) => {
    setTaskType({ code: code ?? '%', name });
    setTypeLookup(false);
  };

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="40%" min={150} max={1000}>
        <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              {/* [E4] retrieveButton[조회].Select (L146) → retrieve() 는 SearchBar의 [조회] */}
              <SearchBar onSearch={() => retrieve()}>
                <SearchBar.Field label="기준일">
                  <DatePicker style={{ width: 120 }} allowClear={false} disabled={!baseDateEnabled} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
                </SearchBar.Field>
                {/* [E1] allYn[전체보기].ValueChange [allYn.getValue()] (L111) → setGridHidden(), retrieve() */}
                <Checkbox
                  checked={allYn}
                  onChange={e => { setAllYn(e.target.checked); setBaseDateEnabled(!e.target.checked); void retrieve({ allYn: e.target.checked }); }}
                >
                  전체보기
                </Checkbox>
                <SearchBar.Field label="책무유형">
                  {/* [E2] taskTypeName.TriggerClick (L128) → lookupTaskType() */}
                  <LookupInput value={taskType.name ?? ''} empty={['전체']} placeholder="전체" width={250} onOpen={() => setTypeLookup(true)} onClear={() => pickTaskType(null, null)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  {/* [E3] searchText.KeyPress [Enter] (L137) → retrieve() */}
                  <SearchBar.Input style={{ width: 250 }} placeholder="책무/책무세부내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              {/* [E5] historyButton[변경이력].Select (L152) → Tdm95_Lookup_ChangeHistory.open("tdm13_task_relate_duty", null) */}
              <Button type="change" onClick={() => setMainHistory(true)}>변경이력</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E6] grid.SelectionChanged [선택>0] (L165) → retrieveEditPage() */}
              <MultiGrid<TdmTaskDutyDetail>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={topColumns}
                getRowId={p => String(p.data.taskRelateDetailId)}
                onSelectionChanged={e => { const row = e.api.getSelectedRows()[0]; if (row) retrieveEditPage(row); }}
              />
            </div>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={120} max={1000}>
        <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Space>
              <span style={{ fontWeight: 'bold' }}>▼ 관리의무</span>
              <Button type="register" onClick={insertRow}>등록</Button>
              <Button type="save" count={crud.changes} onClick={preUpdate}>저장</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
            </Space>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<TdmTaskDuty> crud={crud} columnDefs={dutyColumns} />
            </div>
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
      <Tdm14_Lookup_TaskType
        mode={typeLookup ? 'view' : null}
        onResult={t => pickTaskType(t.taskTypeCode, t.taskTypeName)}
        onAll={() => pickTaskType(null, null)}
        onClose={() => setTypeLookup(false)}
      />
      <AreaMessage
        open={!!reasonFor}
        title={reasonFor?.kind === 'delete' ? '삭제사유' : '변경사유'}
        required
        onResult={onReason}
        onClose={() => setReasonFor(null)}
      />
      <Tdm95_Lookup_ChangeHistory targetTable={mainHistory || history ? 'tdm13_task_relate_duty' : null} targetId={mainHistory ? null : history?.targetId} onClose={() => { setMainHistory(false); setHistory(null); }} />
    </>
  );
};
