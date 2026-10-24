/**
 * [1412] 책무 > 01. 기본정보 > 책무 등록 (N05)
 * AS-IS: myApp/client/vi/tdm/Tdm10_Tab_Task.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L81-123: 가운데(여백 20, 테두리) = 툴바(기준일 · 전체보기 · 책무구분 · 검색 · [조회][등록][등록(복사)][삭제] · 오른쪽 [책무유형 관리][변경이력]) + 책무 그리드(MultiGrid)
 * 함께: Tdm10_Edit_Task(편집창), Tdm12_Lookup_TaskRelateDetail(세부내용), Tdm14_Lookup_TaskType(책무유형 관리), Tdm95_Lookup_ChangeHistory(변경이력)
 * 1단계: 연결법규·연결내규 아이콘이 여는 Tdm11_Lookup_TaskRelateRule(+ Bbs15_Lookup_CompanyRule·Sys09_Lookup_CodeKind 법규 고르기)은 다음 단계 — 건수 열은 보이고 아이콘은 안내만
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmTask } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { SearchBar } from '@/components/search';
import { Tdm10_Edit_Task } from './Tdm10_Edit_Task';
import { Tdm12_Lookup_TaskRelateDetail } from './Tdm12_Lookup_TaskRelateDetail';
import { Tdm14_Lookup_TaskType } from './Tdm14_Lookup_TaskType';
import { Tdm95_Lookup_ChangeHistory } from './Tdm95_Lookup_ChangeHistory';

const gb = gbFor<TdmTask>();
const FORMAT = 'YYYY-MM-DD';
const cntStr = (n: number | null) => (n ? `${n}건` : '');

export const Tdm10_Tab_Task: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmTask>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());          // settings() L126 기준일 = 오늘
  const [allYn, setAllYn] = useState(true);                          // L129 전체보기 기본 체크 → 기준일 비활성
  const [taskClass, setTaskClass] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmTask[]>([]);
  const [edit, setEdit] = useState<{ mode: 'INSERT' | 'COPY' | 'UPDATE'; task: TdmTask | null } | null>(null);
  const [detailTask, setDetailTask] = useState<TdmTask | null>(null);
  const [typeLookup, setTypeLookup] = useState(false);
  const [history, setHistory] = useState<{ targetId: number | null } | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);

  // retrieve() L312-327: tdm.Tdm10_Task.selectByText (companyId는 서버, baseDate, taskClassCode, allYn, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async (over?: { allYn?: boolean; taskClass?: string }) => {
    try {
      setRows(await tdmApi.searchTasks({
        baseDate: baseDate.format(FORMAT),
        taskClassCode: over?.taskClass ?? taskClass,
        allYn: over?.allYn ?? allYn,
        searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L81-123) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const selectedRows = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // buildGrid() L202-310
  const columnDefs = useMemo(() => [
    // L291 수정 아이콘 → Tdm10_Edit_Task.edit(selectModel, callback → retrieve())
    iconCell<TdmTask>('edit', 'editTask', 50, '수정', row => setEdit({ mode: 'UPDATE', task: row })),
    gb.text('taskClassName', 120, '책무구분'),  // L292
    gb.text('taskTypeName', 250, '책무유형'),  // L293
    gb.textArea('taskName', 350, '책무'),  // L294
    gb.textCenter('taskRelateDetailCntStr', 60, '세부내용'),  // L295
    // L296 actionCell02 → Tdm12_Lookup_TaskRelateDetail.open(selectModel, 건수 → 그 행의 세부내용 건수)
    iconCell<TdmTask>('edit', 'editDetail', 35, '', row => setDetailTask(row)),
    gb.textCenter('taskRelateLawCnt', 60, '연결법규', { valueGetter: p => cntStr(p.data?.taskRelateLawCnt ?? null) }),  // L297 (getTaskRelateLawCntStr)
    // L298 actionCell03 → Tdm11_Lookup_TaskRelateRule.open(taskId, "1", …): 다음 단계
    iconCell<TdmTask>('edit', 'editLaw', 35, '', () => nextStep('연결법규')),
    gb.textCenter('taskRelateRuleCnt', 60, '연결내규', { valueGetter: p => cntStr(p.data?.taskRelateRuleCnt ?? null) }),  // L299 (getTaskRelateRuleCntStr)
    // L300 actionCell04 → Tdm11_Lookup_TaskRelateRule.open(taskId, "2", …): 다음 단계
    iconCell<TdmTask>('edit', 'editRule', 35, '', () => nextStep('연결내규')),
    gb.booleanYn2('commonYn', 80, '공통책무'),  // L301
    gb.booleanYn2('ceoYn', 80, 'CEO책무'),  // L302
    gb.date('startDate', 90, '사용시작일'),  // L303
    gb.date('endDate', 90, '사용종료일'),  // L304
    gb.textCenter('updName', 80, '변경자'),  // L305
    gb.textCenter('updDateStr', 150, '변경일시'),  // L306
    // L307 historyCell(ImageCell "View") → Tdm95_Lookup_ChangeHistory.open("tdm10_task", 그 행의 ID)
    iconCell<TdmTask>('view', 'history', 70, '변경이력 ', row => setHistory({ targetId: row.taskId })),
  ], []);

  const nextStep = (name: string) => {
    message.info(`${name} 창(Tdm11_Lookup_TaskRelateRule)은 아직 변환되지 않았습니다 (다음 단계).`);
  };

  // [E6] copyButton[등록(복사)].Select (L174) → copyRow() L339-352: 선택이 없으면 안내, 첫 선택 행을 복사
  const copyRow = () => {
    const selected = selectedRows();
    if (selected.length === 0) {
      message.warning('대상을 선택하세요');
      return;
    }
    setEdit({ mode: 'COPY', task: selected[0] });
  };

  // [E7] deleteButton[삭제].Select (L180) → deleteChk() L354-411: 사용이력 검사 → "n건을 삭제하시겠습니까?" → 삭제사유 → deleteRow()
  const deleteChk = async () => {
    const selected = selectedRows();
    if (selected.length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    try {
      if ((await tdmApi.countTaskUse(selected.map(r => r.taskId))) !== 0) {
        message.warning('사용이력이 있는 책무는 삭제 할 수 없습니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    // [E11] msgBox.DialogHide [YES] (L375) → 삭제사유 입력
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: () => setDeleteIds(selected.map(r => r.taskId)),
    });
  };

  // deleteRow(historyMap) L413-430: tdm.Tdm10_Task.delete (삭제이력은 서버가 만든다)
  const deleteRow = async (reason: string | null) => {
    if (reason == null) {
      message.warning('삭제가 취소되었습니다 (사유 미입력)');
      return;
    }
    const ids = deleteIds ?? [];
    try {
      await tdmApi.deleteTasks(ids, reason);
      setRows(prev => prev.filter(r => !ids.includes(r.taskId)));
      message.success(`${ids.length}건 삭제되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <SearchBar
            onSearch={() => retrieve()}
            extra={
              <>
                {/* [E5] insertButton[등록].Select (L168) → insertRow() L329-337 */}
                <Button type="register" onClick={() => setEdit({ mode: 'INSERT', task: null })}>등록</Button>
                <Button type="register" onClick={copyRow}>등록(복사)</Button>
                <Button type="delete" onClick={deleteChk}>삭제</Button>
              </>
            }
          >
            <SearchBar.Field label="기준일">
              <DatePicker style={{ width: 120 }} allowClear={false} disabled={allYn} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
            </SearchBar.Field>
            {/* [E1] allYn[전체보기].ValueChange [allYn.getValue()] (L131) → 기준일 활성/비활성 + retrieve() */}
            <Checkbox checked={allYn} onChange={e => { setAllYn(e.target.checked); void retrieve({ allYn: e.target.checked }); }}>전체보기</Checkbox>
            <SearchBar.Field label="책무구분">
              {/* [E2] taskClassComboBox[TdmTaskClassCode].Collapse (L144) → retrieve() */}
              <SystemCodeComboBox
                kindCd="TdmTaskClassCode"
                altCode={['%', '전체']}
                style={{ width: 120 }}
                value={taskClass}
                onChange={code => { const v = code ?? '%'; setTaskClass(v); void retrieve({ taskClass: v }); }}
              />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E3] searchText.KeyPress [Enter] (L153) → retrieve() */}
              <SearchBar.Input style={{ width: 250 }} placeholder="책무유형/책무" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Space>
            {/* [E8] taskTypeButton[책무유형 관리].Select (L186) → Tdm14_Lookup_TaskType.edit(null) */}
            <Button type="save" onClick={() => setTypeLookup(true)}>책무유형 관리</Button>
            {/* [E9] historyButton[변경이력].Select (L193) → Tdm95_Lookup_ChangeHistory.open("tdm10_task", null) */}
            <Button type="change" onClick={() => setHistory({ targetId: null })}>변경이력</Button>
          </Space>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TdmTask> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.taskId)} />
        </div>
      </div>
      {/* [E4] retrieveButton[조회].Select (L162) → retrieve() 는 SearchBar의 [조회] / [E10] 그리드 책무구분 콤보 편집 (L204): 이 그리드는 편집이 없어 쓰지 않는다 */}
      <Tdm10_Edit_Task mode={edit?.mode ?? null} task={edit?.task} onSaved={() => void retrieve()} onClose={() => setEdit(null)} />
      <Tdm12_Lookup_TaskRelateDetail
        task={detailTask ? { taskId: detailTask.taskId, taskName: detailTask.taskName } : null}
        onClosed={count => {
          if (detailTask) {
            const id = detailTask.taskId;
            setRows(prev => prev.map(r => (r.taskId === id ? { ...r, taskRelateDetailCntStr: count === 0 ? '' : `${count}건` } : r)));
          }
        }}
        onClose={() => setDetailTask(null)}
      />
      <Tdm14_Lookup_TaskType mode={typeLookup ? 'edit' : null} onClose={() => setTypeLookup(false)} />
      <Tdm95_Lookup_ChangeHistory targetTable={history ? 'tdm10_task' : null} targetId={history?.targetId} onClose={() => setHistory(null)} />
      <AreaMessage open={!!deleteIds} title="삭제사유" required onResult={deleteRow} onClose={() => setDeleteIds(null)} />
    </div>
  );
};
