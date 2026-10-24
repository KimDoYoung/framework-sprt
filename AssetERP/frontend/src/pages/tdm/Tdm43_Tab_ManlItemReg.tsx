/**
 * [1422] 책무 > 03. 부서책무매뉴얼 > 매뉴얼(점검항목) 작성 (N17)
 * AS-IS: myApp/client/vi/tdm/Tdm43_Tab_ManlItemReg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L88-140: north(0.5) = 툴바(매뉴얼작업 · 직책 · 책무 · 부서 · 검색 · [조회][불러오기]) + 관리의무 그리드 + 페이징 50건
 *                 center(0.5) = Tdm43_TabPage_ManlItemReg (점검항목 목록 + [등록][삭제][불러오기][작성완료][작성취소])
 * 함께: Tdm40_Lookup_SelectSingle(매뉴얼작업, checkYn)·Tdm20_Lookup_SelectRole·Tdm10_Lookup_SelectSingle·Org00_Lookup_SelectTdm(부서)·Tdm43_Lookup_ManlItemRegList2(주요관리의무 불러오기)
 *       — 점검항목 등록·수정창(Tdm43_Edit_Manl)과 TabPage의 불러오기 창은 TabPage 쪽
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlCopySource, TdmManlDutyReg, TdmManlJob, TdmRole, TdmTask } from '@/types/tdm';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { SearchBar } from '@/components/search';
import { Tdm10_Lookup_SelectSingle } from './Tdm10_Lookup_SelectSingle';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';
import { Tdm40_Lookup_SelectSingle } from './Tdm40_Lookup_SelectSingle';
import { ManlItemRegList2Target, Tdm43_Lookup_ManlItemRegList2 } from './Tdm43_Lookup_ManlItemRegList2';
import { ManlItemRegTarget, Tdm43_TabPage_ManlItemReg } from './Tdm43_TabPage_ManlItemReg';

const LIMIT = 50;   // gridToolBar.setToolBar(50)
const gb = gbFor<TdmManlDutyReg>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;   // setChecked 없음

/** buildGrid() L409-421 */
const buildGrid = () => [
  gb.text('roleName', 150, '직책'),  // L411
  gb.textArea('taskName', 250, '책무'),  // L412
  gb.textArea('taskRelateDetailName', 350, '책무세부'),  // L413
  gb.textArea('taskRelateDutyName', 550, '관리의무'),  // L414
  gb.longCenter('manlCnt', 70, '작성건수'),  // L415
  gb.booleanYn2('endYn', 80, '작성완료'),  // L416
  gb.date('endDate', 100, '작성완료일'),  // L417
  gb.textCenter('endEmpName', 100, '작성자'),  // L418
];

interface Named { id: number | null; name: string | null }
interface Cond { manlJobId: number | null; roleId: number | null; taskId: number | null; orgId: number | null; searchText: string }

export const Tdm43_Tab_ManlItemReg: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmManlDutyReg>>(null);
  const [manlJob, setManlJob] = useState<Named>({ id: null, name: null });   // manlJobId · manlJobLookup 값
  const [role, setRole] = useState<Named>({ id: null, name: null });         // roleId · roleLookup 값 (null = 전체)
  const [task, setTask] = useState<Named>({ id: null, name: null });         // taskId · taskLookup 값 (null = 전체)
  const [org, setOrg] = useState<Named>({ id: null, name: null });           // orgId · orgLookup 값 (처음엔 내 부서)
  const [searchText, setSearchText] = useState('');
  const [isManager, setIsManager] = useState(false);                         // isTdmManager (setIsManager L314-336)
  const [rows, setRows] = useState<TdmManlDutyReg[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageTarget, setPageTarget] = useState<ManlItemRegTarget>({ duty: null, nonce: 0 });
  const [jobLookup, setJobLookup] = useState<{ checkYn: boolean } | null>(null);
  const [lookup, setLookup] = useState<'role' | 'task' | 'org' | null>(null);
  const [list2Target, setList2Target] = useState<ManlItemRegList2Target | null>(null);
  const columnDefs = useMemo(buildGrid, []);

  // 페이징 조건은 마지막 조회 것 (gridToolBar.addParam은 retrieve()에서만 바뀐다)
  const last = useRef<Cond>({ manlJobId: null, roleId: null, taskId: null, orgId: null, searchText: '' });
  const selectedId = useRef<number | null>(null);

  // retrieveTabPage() L475-478: 고른 행으로 아래 점검항목을 읽는다
  const retrieveTabPage = (duty: TdmManlDutyReg | null) => {
    selectedId.current = duty ? duty.manlDutyId : null;
    setPageTarget(prev => ({ duty, nonce: prev.nonce + 1 }));
  };

  // retrieve() L423-454 + retrieveEnd() L456-473: tdm.Tdm41_ManlDuty.selectByOrgIdPaging(+Total)(manlJobId, roleId, taskId, orgId, "%검색어%", 50건)
  //   → 끝나면 행이 있으면 (고른 행이 있었으면 그 행, 없으면 첫 행)을 골라 retrieveTabPage(), 없으면 TabPage를 비운다
  const load = useCallback(async (toPage: number) => {
    const cond = last.current;
    if (cond.manlJobId == null) return;
    setLoading(true);
    try {
      const res = await tdmApi.searchManlDutiesByOrg({
        manlJobId: cond.manlJobId, roleId: cond.roleId, taskId: cond.taskId, orgId: cond.orgId,
        searchText: cond.searchText, offset: (toPage - 1) * LIMIT, limit: LIMIT,
      });
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      if (res.rows.length > 0) {
        const keep = res.rows.find(r => r.manlDutyId === selectedId.current) ?? res.rows[0];
        retrieveTabPage(keep);
        setTimeout(() => gridRef.current?.api.getRowNode(String(keep.manlDutyId))?.setSelected(true), 0);
      } else {
        retrieveTabPage(null);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  const retrieve = useCallback((cond: Cond) => {
    if (cond.manlJobId == null) return Promise.resolve();   // retrieve() L424: manlJobId가 없으면 아무 일 없다
    last.current = cond;
    retrieveTabPage(null);                                  // tabPage.clear()
    return load(1);
  }, [load]);

  const current = (): Cond => ({ manlJobId: manlJob.id, roleId: role.id, taskId: task.id, orgId: org.id, searchText });

  // manlJobLookupEnd(jobModel) L338-353: 값·ID를 넣고, 작업에 직책이 있으면 직책 칸도 채운 뒤 retrieve()
  const manlJobLookupEnd = (job: TdmManlJob, orgId: number | null = org.id) => {
    setManlJob({ id: job.manlJobId, name: job.jobName ?? null });
    let roleId = role.id;
    if (job.roleId != null) {
      setRole({ id: job.roleId, name: job.roleName ?? null });
      roleId = job.roleId;
    }
    void retrieve({ manlJobId: job.manlJobId, roleId, taskId: task.id, orgId, searchText });
  };

  // [E0] 화면 열림 (생성자 L88-140) → settings() L142-312: 책무관리자 여부(setIsManager)와 내 부서를 읽고,
  //      autoRetrieve() L377-407: tdm.Tdm40_ManlJob.selectByText(searchText "%", writingYn=true, checkYn=true) — 1건이면 그것으로 조회, 2건 이상이면 매뉴얼 선택 창 open(true)
  useEffect(() => {
    void (async () => {
      try {
        const [manager, myOrg] = await Promise.all([tdmApi.isDashboardManager(dayjs().format('YYYY-MM-DD')), tdmApi.getDashboardMyOrg()]);
        setIsManager(manager);
        const orgId = myOrg?.orgCodeId ?? null;
        setOrg({ id: orgId, name: myOrg?.korName ?? null });
        const jobs = await tdmApi.searchManlJobs({ searchText: '', writingYn: true, checkYn: true, createDutyYn: true });
        if (jobs.length === 1) {
          manlJobLookupEnd(jobs[0], orgId);
        } else if (jobs.length > 1) {
          setJobLookup({ checkYn: true });
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E5] manlJobLookup.TriggerClick [result != null] (L229): 책무관리자면 open(false), 아니면 open(true) → manlJobLookupEnd()
  // [E1] roleLookup.TriggerClick [result != null] (L150): Tdm20_Lookup_SelectRole.openAll(null) — 고르면 직책, [전체]면 비우고 retrieve()
  const selectRole = (r: TdmRole | null) => {
    setRole(r ? { id: r.roleId, name: r.roleName } : { id: null, name: null });
    void retrieve({ ...current(), roleId: r ? r.roleId : null });
  };
  // [E2] taskLookup.TriggerClick [result != null] (L174): Tdm10_Lookup_SelectSingle — 고르면 책무, [전체]면 비우고 retrieve()
  const selectTask = (t: TdmTask | null) => {
    setTask(t ? { id: t.taskId, name: t.taskName } : { id: null, name: null });
    void retrieve({ ...current(), taskId: t ? t.taskId : null });
  };
  // [E3] orgLookup.TriggerClick (L197): Org00_Lookup_SelectTdm.open(오늘, null, true) — 고른 부서로 바꾸고 retrieve() (책무관리자만 활성)
  const selectOrg = (o: { orgCodeId: number; korNm?: string | null } | null) => {
    if (!o) return;
    setOrg({ id: o.orgCodeId, name: o.korNm ?? null });
    void retrieve({ ...current(), orgId: o.orgCodeId });
  };

  // [E6] retrieveButton[조회].Select [manlJobId == null] (L253) / [E4] searchText.KeyPress [Enter] (L217) → retrieve()
  const onSearch = () => {
    if (manlJob.id == null) { message.warning('매뉴얼작업을 선택하세요'); return; }
    void retrieve(current());
  };

  // [E7] loadButton[불러오기].Select [manlJobId == null] (L263): 매뉴얼작업·직책·부서를 확인하고 Tdm43_Lookup_ManlItemRegList2.open(param, cb → copyManlList())
  const loadDuties = () => {
    if (manlJob.id == null) { message.warning('매뉴얼작업을 선택하세요'); return; }
    if (role.id == null) { message.warning('직책을 선택하세요'); return; }
    if (org.id == null) { message.warning('부서를 선택하세요'); return; }
    setList2Target({ manlJobId: manlJob.id, roleId: role.id, roleName: role.name ?? '', orgId: org.id, orgName: org.name ?? '' });
  };
  // copyManlList(dutyList) L355-375: tdm.Tdm43_Manl.copyDutyList(manlJobId, roleId, orgId, 목록) → "점검항목이 등록되었습니다" → retrieve()
  const copyDuties = async (sources: TdmManlCopySource[]) => {
    if (manlJob.id == null || role.id == null || org.id == null) return;
    try {
      await tdmApi.copyManlDuties({ manlJobId: manlJob.id, roleId: role.id, orgId: org.id, sources });
      message.info('점검항목이 등록되었습니다');
      await retrieve(current());
    } catch (err) {
      message.warning(errorMessage(err, '등록중 오류가 발생하였습니다. 관리팀에 문의해주세요'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="50%" min={100}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
            <SearchBar onSearch={onSearch} extra={<Button type="register" onClick={loadDuties}>불러오기</Button>}>
              <SearchBar.Field label="매뉴얼작업">
                <LookupInput width={250} value={manlJob.name ?? ''} placeholder="필수선택입니다" onOpen={() => setJobLookup({ checkYn: !isManager })} />
              </SearchBar.Field>
              <SearchBar.Field label="직책">
                <LookupInput width={200} value={role.name ?? ''} placeholder="전체" onOpen={() => setLookup('role')} />
              </SearchBar.Field>
              <SearchBar.Field label="책무">
                <LookupInput width={200} value={task.name ?? ''} placeholder="전체" onOpen={() => setLookup('task')} />
              </SearchBar.Field>
              <SearchBar.Field label="부서">
                <LookupInput width={200} value={org.name ?? ''} disabled={!isManager} onOpen={() => setLookup('org')} />
              </SearchBar.Field>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 200 }} placeholder="직책/책무/책무세부/관리의무" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E8] grid.SelectionChanged (L306) → retrieveTabPage() */}
              <SingleGrid<TdmManlDutyReg>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.manlDutyId)}
                rowSelection={SINGLE_SELECTION}
                loading={loading}
                onRowClicked={e => { if (e.data && e.data.manlDutyId !== selectedId.current) retrieveTabPage(e.data); }}
              />
            </div>
            <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p)} />
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
            <Tdm43_TabPage_ManlItemReg target={pageTarget} onEndChanged={() => void load(page)} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Tdm40_Lookup_SelectSingle
        open={!!jobLookup}
        checkYn={jobLookup?.checkYn ?? false}
        onSelect={job => manlJobLookupEnd(job)}
        onClose={() => setJobLookup(null)}
      />
      <Tdm20_Lookup_SelectRole open={lookup === 'role'} allButton onAll={() => selectRole(null)} onSelect={selectRole} onClose={() => setLookup(null)} />
      <Tdm10_Lookup_SelectSingle open={lookup === 'task'} onAll={() => selectTask(null)} onSelect={selectTask} onClose={() => setLookup(null)} />
      <Org00_Lookup_SelectTdm stdDate={lookup === 'org' ? dayjs().format('YYYY-MM-DD') : undefined} onSelect={selectOrg} onClose={() => setLookup(null)} />
      <Tdm43_Lookup_ManlItemRegList2 target={list2Target} onResult={sources => void copyDuties(sources)} onClose={() => setList2Target(null)} />
    </div>
  );
};
