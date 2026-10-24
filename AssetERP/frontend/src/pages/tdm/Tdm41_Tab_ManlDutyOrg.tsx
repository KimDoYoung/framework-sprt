/**
 * [1421] 책무 > 03. 부서책무매뉴얼 > 매뉴얼 부서지정 (N16)
 * AS-IS: myApp/client/vi/tdm/Tdm41_Tab_ManlDutyOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-124: north(0.3) = 툴바(매뉴얼작업 · 직책 · 책무 · [조회][확정][확정취소] · [점검항목 부서변경]) + 직책별 건수 그리드(합계 행)
 *                 center(0.7) = Tdm41_TabPage_ManlDutyOrg (관리의무 목록 + 페이징)
 * 함께: Tdm40_Lookup_SelectSingle(매뉴얼작업)·Tdm20_Lookup_SelectRole(직책, 기존)·Tdm10_Lookup_SelectSingle(책무)·Tdm41_Lookup_ChangeOrg_Tmp(부서변경) — 이 ID에서 새로 만듦
 * 생략: Tdm44_Lookup_ManlDutyOrg — 관리의무 목록의 점검부서 수정 아이콘이 "임시로 막음"(Tdm41_TabPage L297)이라 닿지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Splitter, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlDutyGroup, TdmManlJob, TdmRole, TdmTask } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Tdm10_Lookup_SelectSingle } from './Tdm10_Lookup_SelectSingle';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';
import { Tdm40_Lookup_SelectSingle } from './Tdm40_Lookup_SelectSingle';
import { Tdm41_Lookup_ChangeOrg_Tmp } from './Tdm41_Lookup_ChangeOrg_Tmp';
import { ManlDutyTarget, Tdm41_TabPage_ManlDutyOrg } from './Tdm41_TabPage_ManlDutyOrg';

const gb = gbFor<TdmManlDutyGroup>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;   // setChecked 없음

/** addLongCnt(…, color) — 굵은 "N건", null·0은 #404040의 "0건", 오른쪽 정렬 (GridBuilder L1588) */
const cntCell = (color: string) => (p: ICellRendererParams) => {
  const v = p.value as number | null | undefined;
  return <b style={{ color: v == null || v === 0 ? '#404040' : color }}>{v == null ? 0 : v}건</b>;
};
const cnt = (field: keyof TdmManlDutyGroup & string, w: number, header: string, color = '#404040') =>
  gb.long(field, w, header, { cellRenderer: cntCell(color), valueFormatter: undefined });

/** buildGrid() L313-339 — 묶음 "책무건수"{전체·개별·공통·CEO}, 합계 행 getSumGrid("계", 1, 2, 8) */
const buildGrid = () => [
  gb.text('roleName', 250, '직책'),  // L327
  gb.group('책무건수', [  // L325 HeaderGroupMap(0, 2, HeaderGroupConfig("책무건수", 1, 4))
    cnt('taskCnt', 120, '전체'),  // L328
    cnt('taskIndvCnt', 120, '개별'),  // L329
    cnt('taskCommonCnt', 120, '공통'),  // L330
    cnt('taskCeoCnt', 120, 'CEO'),  // L331
  ]),
  cnt('taskRelateDetailCnt', 120, '책무세부건수'),  // L332
  cnt('taskRelateDutyCnt', 120, '관리의무건수'),  // L333
  cnt('taskRelateDutyNoneCnt', 120, '부서미등록<br>관리의무건수', '#DD5E5E'),  // L334
];
const SUM_ROW = {
  labelField: 'roleName', label: '계',
  sum: ['taskCnt', 'taskIndvCnt', 'taskCommonCnt', 'taskCeoCnt', 'taskRelateDetailCnt', 'taskRelateDutyCnt', 'taskRelateDutyNoneCnt'],
};

const confirmBox = (title: string, content: string, width: number) => new Promise<boolean>(resolve => {
  Modal.confirm({ title, content, width, onOk: () => resolve(true), onCancel: () => resolve(false) });
});

export const Tdm41_Tab_ManlDutyOrg: React.FC = () => {
  const [manlJob, setManlJob] = useState<{ id: number; name: string | null } | null>(null);   // manlJobId · manlJobLookup 값
  const [role, setRole] = useState<{ id: number; name: string | null } | null>(null);         // roleId · roleLookup 값 (null = 전체)
  const [task, setTask] = useState<{ id: number; name: string | null } | null>(null);         // taskId · taskLookup 값 (null = 전체)
  const [rows, setRows] = useState<TdmManlDutyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageTarget, setPageTarget] = useState<ManlDutyTarget>({ manlJobId: null, roleId: null, taskId: null, nonce: 0 });
  const [jobLookup, setJobLookup] = useState(false);
  const [roleLookup, setRoleLookup] = useState(false);
  const [taskLookup, setTaskLookup] = useState(false);
  const [changeOrgTarget, setChangeOrgTarget] = useState<{ manlJobId: number; roleId: number } | null>(null);
  const gridRef = useRef<AgGridReact<TdmManlDutyGroup>>(null);
  const columnDefs = useMemo(buildGrid, []);

  // retrieveTabPage() L365-372: 목록이 비면 아무 일 없고, 있으면 고른 행의 직책으로 아래 목록을 읽는다 (taskId는 지금 조건)
  const retrieveTabPage = (row: TdmManlDutyGroup | undefined, taskId: number | null) => {
    if (!row) return;
    setPageTarget(prev => ({ manlJobId: row.manlJobId, roleId: row.roleId, taskId, nonce: prev.nonce + 1 }));
  };

  // retrieve() L341-363: tdm.Tdm41_ManlDuty.groupByManlJobId (manlJobId, roleId, taskId) → 끝나면 첫 행을 고르고 retrieveTabPage()
  // 값은 호출한 자리에서 막 바꾼 것이라 상태 반영 전이므로 인자로 받는다
  const retrieve = useCallback(async (cond: { manlJobId: number | null; roleId: number | null; taskId: number | null }) => {
    if (cond.manlJobId == null) {
      message.warning('매뉴얼작업을 선택하세요');
      return;
    }
    setLoading(true);
    try {
      const list = await tdmApi.searchManlDutyGroups({ manlJobId: cond.manlJobId, roleId: cond.roleId, taskId: cond.taskId });
      setRows(list);
      if (list.length > 0) {
        retrieveTabPage(list[0], cond.taskId);
        setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  const current = () => ({ manlJobId: manlJob?.id ?? null, roleId: role?.id ?? null, taskId: task?.id ?? null });

  // [E0] 화면 열림 (생성자 L80-124) → settings() L126-274 → autoRetrieve() L276-311:
  //      tdm.Tdm40_ManlJob.selectByText(searchText "%", writingYn=true, checkYn=false) — 1건이면 그것으로 조회, 2건 이상이면 매뉴얼 선택 창
  useEffect(() => {
    void (async () => {
      try {
        const jobs = await tdmApi.searchManlJobs({ searchText: '', writingYn: true, createDutyYn: true });
        if (jobs.length === 1) {
          selectJob(jobs[0]);
        } else if (jobs.length > 1) {
          setJobLookup(true);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] manlJobLookup.TriggerClick [result != null] (L134): 고르면 값과 ID를 넣고 retrieve()
  const selectJob = (job: TdmManlJob) => {
    setManlJob({ id: job.manlJobId, name: job.jobName ?? null });
    void retrieve({ manlJobId: job.manlJobId, roleId: role?.id ?? null, taskId: task?.id ?? null });
  };
  // [E2] roleLookup.TriggerClick [result != null] (L155): 고르면 직책, [전체]면 비우고 retrieve()
  const selectRole = (r: TdmRole | null) => {
    setRole(r ? { id: r.roleId, name: r.roleName } : null);
    void retrieve({ manlJobId: manlJob?.id ?? null, roleId: r ? r.roleId : null, taskId: task?.id ?? null });
  };
  // [E3] taskLookup.TriggerClick [result != null] (L178): 고르면 책무, [전체]면 비우고 retrieve()
  const selectTask = (t: TdmTask | null) => {
    setTask(t ? { id: t.taskId, name: t.taskName } : null);
    void retrieve({ manlJobId: manlJob?.id ?? null, roleId: role?.id ?? null, taskId: t ? t.taskId : null });
  };

  // [E5] confirmButton[확정].Select (L204) → 매뉴얼작업이 없으면 안내, 있으면 확인(500)
  // [E6] msgBox.DialogHide [YES] (L214) → confirmChk("I") L374-419 → confirm() L421-440
  // [E11 생략] msgBox.DialogHide [YES] (L393) — confirmChk가 status 2(확인 후 계속)를 받을 때의 분기. 서버가 그 경우를 주석 처리해(Tdm42_ManlOrg L97) 닿지 않는다
  const confirmJob = async () => {
    if (manlJob == null) { message.warning('매뉴얼작업을 선택하세요'); return; }
    if (!await confirmBox('확인', `매뉴얼작업 '${manlJob.name ?? ''}'의 확정처리를 진행하시겠습니까?`, 500)) return;
    try {
      await tdmApi.confirmManlDuties(manlJob.id);   // confirmChk(I) 검사 + insertManlOrg
      message.success('확정처리가 완료되었습니다');
    } catch (err) {
      message.warning(errorMessage(err, '확정처리 실패'));
    }
  };
  // [E7] cancelButton[확정취소].Select (L231) → 매뉴얼작업이 없으면 안내, 있으면 확인(500)
  // [E8] msgBox.DialogHide [YES] (L241) → confirmChk("D") → cancel() L442-459
  const cancelJob = async () => {
    if (manlJob == null) { message.warning('매뉴얼작업을 선택하세요'); return; }
    if (!await confirmBox('확인', `매뉴얼작업 '${manlJob.name ?? ''}'의 확정내역을 취소하시겠습니까?`, 500)) return;
    try {
      await tdmApi.cancelManlDuties(manlJob.id);   // confirmChk(D) 검사 + deleteByManlJobId
      message.success('확정내역이 취소되었습니다');
    } catch (err) {
      message.warning(errorMessage(err, '확정취소 실패'));
    }
  };

  // [E9] changeOrgButton[점검항목 부서변경].Select (L259) → lookupChangeOrg() L461-474
  const lookupChangeOrg = () => {
    const selected = gridRef.current?.api.getSelectedRows()[0];
    if (!selected) { message.warning('상단그리드에서 직책을 선택하세요'); return; }
    setChangeOrgTarget({ manlJobId: selected.manlJobId, roleId: selected.roleId });
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="30%" min={100}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
            {/* [E4] retrieveButton[조회].Select (L198) → retrieve() */}
            <SearchBar
              onSearch={() => retrieve(current())}
              extra={
                <>
                  <Button type="save" onClick={confirmJob}>확정</Button>
                  <Button type="cancel" onClick={cancelJob}>확정취소</Button>
                  <Button type="change" onClick={lookupChangeOrg}>점검항목 부서변경</Button>
                </>
              }
            >
              <SearchBar.Field label="매뉴얼작업">
                <LookupInput width={300} value={manlJob?.name ?? ''} placeholder="필수선택입니다" onOpen={() => setJobLookup(true)} />
              </SearchBar.Field>
              <SearchBar.Field label="직책">
                <LookupInput width={250} value={role?.name ?? ''} placeholder="전체" onOpen={() => setRoleLookup(true)} />
              </SearchBar.Field>
              <SearchBar.Field label="책무">
                <LookupInput width={250} value={task?.name ?? ''} placeholder="전체" onOpen={() => setTaskLookup(true)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E10] grid.RowClick (L266) → retrieveTabPage() */}
              <SingleGrid<TdmManlDutyGroup>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.roleId)}
                rowSelection={SINGLE_SELECTION}
                sumRow={SUM_ROW}
                loading={loading}
                onRowClicked={e => retrieveTabPage(e.data, task?.id ?? null)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
            <Tdm41_TabPage_ManlDutyOrg target={pageTarget} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Tdm40_Lookup_SelectSingle open={jobLookup} onSelect={selectJob} onClose={() => setJobLookup(false)} />
      <Tdm20_Lookup_SelectRole open={roleLookup} allButton onAll={() => selectRole(null)} onSelect={selectRole} onClose={() => setRoleLookup(false)} />
      <Tdm10_Lookup_SelectSingle open={taskLookup} onAll={() => selectTask(null)} onSelect={selectTask} onClose={() => setTaskLookup(false)} />
      <Tdm41_Lookup_ChangeOrg_Tmp
        target={changeOrgTarget}
        onClosed={() => void retrieve(current())}
        onClose={() => setChangeOrgTarget(null)}
      />
    </div>
  );
};
