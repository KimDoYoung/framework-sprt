/**
 * [1420] 책무 > 03. 부서책무매뉴얼 > 매뉴얼 작업대상 선정 (N15)
 * AS-IS: myApp/client/vi/tdm/Tdm40_Tab_ManlJob.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L72-105: 툴바(검색 · 작성중만 조회 · [조회][등록][저장][삭제] · [관리의무생성] · 관리자만 [매뉴얼 작성][매뉴얼 복제]) + 셀 편집 그리드(단일 체크)
 * 함께: Tdm20_Lookup_SelectRole(직책 돋보기, 기존 부품) · Org00_Lookup_SelectSingle(점검부서 돋보기, 기존 부품 + [전체] 버튼)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08), 등록은 맨 아래(03 원칙 17)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, Modal, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlJob, TdmRole } from '@/types/tdm';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';

const gb = gbFor<TdmManlJob>();
const FORMAT = 'YYYY-MM-DD';
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;   // setChecked(SINGLE)
const DUTY_CHECK_MSG = '작성중인 매뉴얼작업입니다';   // dutyCheckMsg L70

/** SimpleMessage 뒤에 중단하는 확인 상자 (HtmlMessageBox YES/NO) */
const confirmBox = (title: string, content: string, width: number) => new Promise<boolean>(resolve => {
  Modal.confirm({ title, content, width, onOk: () => resolve(true), onCancel: () => resolve(false) });
});

/** updateChk() L342-367: 바뀐 행마다 완료 → 작업명 → 적용시작일 순서로 검사 */
const validate = (changed: TdmManlJob[]) => {
  for (const r of changed) {
    if (r.dutyEndYn) return '완료된 책무매뉴얼은 수정이 불가능합니다';
    if (!r.jobName) return '매뉴얼작업명은 필수입력항목입니다';
    if (!r.manlApplyStartDate) return '매뉴얼 적용시작일은 필수입력항목입니다';
  }
  return undefined;
};

export const Tdm40_Tab_ManlJob: React.FC = () => {
  const user = useLoginUser();
  const isManager = user.userId < 0 || user.companyId === 0;   // LoginUser.getIsManager() (L88) — 서버도 같은 기준(SysMenuSearchService.isManager)
  const [searchText, setSearchText] = useState('');
  const [writingYn, setWritingYn] = useState(false);          // writingYn "작성중만 조회" = false (settings L107-163)
  const [roleLookup, setRoleLookup] = useState<TdmManlJob | null>(null);   // lookup01 (직책)이 열린 행
  const [orgLookup, setOrgLookup] = useState<TdmManlJob | null>(null);     // lookup02 (점검부서)가 열린 행

  // retrieve() L311-327: tdm.Tdm40_ManlJob.selectByText (companyId는 서버, searchText "%…%", writingYn, checkYn=false, createDutyYn=false)
  const latest = useRef({ searchText, writingYn });
  latest.current = { searchText, writingYn };
  const search = useCallback(() => tdmApi.searchManlJobs(latest.current), []);

  const crud = useGridCrud<TdmManlJob>({
    idField: 'manlJobId',
    search,
    // update() L369-372: GridUpdate → tdm.Tdm40_ManlJob.update
    save: useCallback(async (changed: TdmManlJob[]) => { await tdmApi.saveManlJobs(changed); return changed; }, []),
    // deleteRow() L452-466: GridDeleteData(userName) → tdm.Tdm40_ManlJob.delete
    remove: tdmApi.deleteManlJobs,
    newRow: useCallback(() => ({ regDate: dayjs().format(FORMAT), dutyEndYn: false }), []),   // insertRow() L329-340: 등록일 = 오늘
    firstEditField: 'jobName',
    validate,
    deleteConfirm: false,
    reloadAfterSave: true,
  });

  // [E0] 생성자 끝의 retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  const crudRows = useRef<TdmManlJob[]>([]);
  crudRows.current = crud.rows;
  const current = (row: TdmManlJob) => crudRows.current.find(r => r.manlJobId === row.manlJobId) ?? row;   // 셀에서 고친 값까지 든 행
  const selectedRow = () => crud.gridRef.current?.api?.getSelectedRows()[0] as TdmManlJob | undefined;
  const warn = (text: string) => { message.warning(text); };

  // tdm41Chk() L294-309: tdm.Tdm41_ManlDuty.selectByManlJobId — 행이 있으면 STOP, 없으면 PASS (아직 저장 안 한 행은 작성내역이 있을 수 없다)
  const tdm41Chk = async (row: TdmManlJob) => (row.manlJobId > 0 && await tdmApi.hasManlJobDuties(row.manlJobId) ? 'STOP' : 'PASS');

  // [E9] lookup01.TriggerClick (L168) — 직책
  const openLookup01 = async (row: TdmManlJob) => {
    const selectModel = current(row);
    if (selectModel.dutyEndYn) { warn('완료된 매뉴얼은 수정이 불가능합니다'); return; }
    if (!selectModel.manlApplyStartDate) { warn('매뉴얼 적용시작일을 먼저 선택해주세요'); return; }
    try {
      if (await tdm41Chk(selectModel) !== 'PASS') { warn(DUTY_CHECK_MSG); return; }
      setRoleLookup(selectModel);   // Tdm20_Lookup_SelectRole.openAll(manlApplyStartDate, callback)
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // [E10] lookup02.TriggerClick (L222) — 점검부서
  const openLookup02 = async (row: TdmManlJob) => {
    const selectModel = current(row);
    if (selectModel.dutyEndYn) { warn('완료된 매뉴얼은 수정이 불가능합니다'); return; }
    if (!selectModel.manlApplyStartDate) { warn('매뉴얼 적용시작일을 먼저 선택해주세요'); return; }
    if (selectModel.roleId == null) { warn('직책을 먼저 선택해주세요'); return; }
    try {
      if (await tdm41Chk(selectModel) !== 'PASS') { warn(DUTY_CHECK_MSG); return; }
      setOrgLookup(selectModel);   // Org00_Lookup_SelectSingle.open(manlApplyStartDate, true, callback)
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // L196-211: 고르면 직책 + 부서 비움 (callback의 result == null 분기는 [전체]가 hide()만 하므로 닿지 않는다)
  const onRoleResult = (role: TdmRole) => {
    if (roleLookup) crud.updateRow(roleLookup.manlJobId, { roleId: role.roleId, roleName: role.roleName, orgId: null, orgName: null });
  };
  // L256-268
  const onOrgResult = (org: OrgInfo) => {
    if (orgLookup) crud.updateRow(orgLookup.manlJobId, { orgId: org.orgCodeId, orgName: org.korNm ?? null });
  };

  // [E5] deleteButton[삭제].Select (L139) → deleteChk() L374-403
  const deleteChk = async () => {
    const selectModel = selectedRow();
    if (!selectModel) { warn('선택된 매뉴얼작업내역이 없습니다'); return; }
    if (selectModel.dutyEndYn) { warn('완료된 책무매뉴얼은 삭제할 수 없습니다'); return; }
    if (!await confirmBox('확인', '선택한 매뉴얼작업을 삭제하시겠습니까?', 350)) return;
    // [E11] msgBox.DialogHide [YES] (L388) → deleteChk2() L405-436
    try {
      if (await tdm41Chk(selectModel) === 'STOP') {
        if (!await confirmBox('삭제', '작성내역이 있는 매뉴얼작업입니다. 진행시 작성중인 모든 데이터가 삭제됩니다. 삭제하시겠습니까?', 500)) return;
        await tdmApi.deleteManlJobContents(selectModel.manlJobId);   // deleteAll() L438-450
      }
      await crud.deleteChecked();   // deleteRow()
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // createDuty() L581-598
  const createDuty = async (selectModel: TdmManlJob) => {
    await tdmApi.createManlJobDuty(selectModel.manlJobId);
    message.success('관리의무생성이 완료되었습니다');
    await crud.retrieve();
  };

  // [E6] makeButton[관리의무생성].Select (L145) → checkPreCreateDuty() L468-514
  const checkPreCreateDuty = async () => {
    const selectModel = selectedRow();
    if (!selectModel) { warn('생성할 매뉴얼작업을 선택하세요'); return; }
    if (crud.hasChanges()) { warn('저장되지 않은 내역이 존재합니다. 저장 후 생성하세요'); return; }
    if (!selectModel.startDate) { warn('작성시작일을 입력하세요'); return; }
    if (!selectModel.endDate) { warn('작성마감일을 입력하세요'); return; }
    if (selectModel.dutyEndYn) { warn('완료된 매뉴얼작업입니다'); return; }
    if (selectModel.orgId != null) { warn('생성 단위는 직책(조건1)까지입니다. 부서(조건2)는 제거해 주세요'); return; }
    if (!await confirmBox('확인', '관리의무생성을 하시겠습니까?', 300)) return;
    // [E13] msgBox.DialogHide [YES] (L499) → checkPreCreateDuty2() L516-547
    try {
      if (await tdm41Chk(selectModel) === 'STOP') {
        // 점검항목 존재시 삭제불가 체크 (2026.07.30 CYY): countByManlJobId의 status가 0이어야 다음으로
        if (await tdmApi.countManlJobManls(selectModel.manlJobId) !== 0) {
          warn('작성된 점검항목이 존재합니다. 점검항목 정리 후 재생성 가능합니다.');
          return;
        }
        // checkPreCreateDuty3() L549-579
        if (!await confirmBox('확인', '작성중인 매뉴얼작업입니다. 삭제 후 다시 생성하시겠습니까?', 500)) return;
        await tdmApi.deleteManlJobContents(selectModel.manlJobId);
      }
      await createDuty(selectModel);   // [E14] createDuty()
    } catch (err) {
      message.error(errorMessage(err, '관리의무생성 실패'));
    }
  };

  // [E7] redefineButton[매뉴얼 작성].Select (L151)·[E8] copyButton[매뉴얼 복제].Select (L157) → createDirectManl(actionName) L600-651
  const createDirectManl = async (actionName: 'REDEFINE_BY_ROLE' | 'REMAKE_FROM_LATEST') => {
    const selectModel = selectedRow();
    if (!selectModel) { warn('생성할 매뉴얼작업을 선택하세요'); return; }
    if (crud.hasChanges()) { warn('저장되지 않은 내역이 존재합니다. 저장 후 생성하세요'); return; }
    if (!selectModel.startDate) { warn('작성시작일을 입력하세요'); return; }
    if (!selectModel.endDate) { warn('작성마감일을 입력하세요'); return; }
    if (selectModel.dutyEndYn) { warn('완료된 매뉴얼작업입니다'); return; }
    if (!await confirmBox('확인', '매뉴얼을 생성하시겠습니까?', 350)) return;
    try {
      await tdmApi.createManlJobManual(selectModel.manlJobId, actionName);
      message.success('매뉴얼 생성이 완료되었습니다.');
      await crud.retrieve();   // [E15] messageBox.DialogHide → retrieve()
    } catch (err) {
      message.error(errorMessage(err, '매뉴얼 생성 실패'));
    }
  };

  // buildGrid() L165-292 — 직책·점검부서는 LookupTriggerField(편집 불가 입력칸 + 돋보기)
  const columnDefs = useMemo(() => {
    const trigger = (open: (row: TdmManlJob) => void) => ({
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: TdmManlJob; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) void open(p.data); }} />
          {p.value}
        </>
      ),
    });
    return [
      gb.date('regDate', 90, '등록일'),  // L279
      gb.text('jobName', 250, '매뉴얼작업명', { editor: 'text' }),  // L280
      gb.date('manlApplyStartDate', 120, '매뉴얼<br>적용시작일', { editor: 'date' }),  // L281 (UX-08)
      gb.text('roleName', 150, '직책<br>(조건1)', trigger(openLookup01)),  // L282 lookup01
      gb.text('orgName', 150, '점검부서<br>(조건2)', trigger(openLookup02)),  // L283 lookup02
      gb.text('jobReason', 200, '사유', { editor: 'text' }),  // L284
      gb.date('startDate', 120, '작성시작일', { editor: 'date' }),  // L285 (UX-08)
      gb.date('endDate', 120, '작성마감일', { editor: 'date' }),  // L286 (UX-08)
      gb.textCenter('dutyCntStr', 150, '작성현황<br>(완료부서/전체부서)'),  // L287
      gb.booleanYn2('dutyEndYn', 90, '완료여부'),  // L288
      gb.date('dutyEndDate', 90, '완료일'),  // L289
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
        {/* [E1] searchText.KeyPress [Enter] (L110)·[E2] retrieveButton[조회].Select (L121) → retrieve() */}
        <SearchBar
          onSearch={() => crud.retrieve()}
          extra={
            <>
              {/* [E3] insertButton[등록].Select (L127) → insertRow() — 등록일 = 오늘을 바꾼 것으로 쳐서 저장 대상 */}
              <Button type="register" onClick={() => crud.addRows([{ regDate: dayjs().format(FORMAT), dutyEndYn: false }], true)}>등록</Button>
              {/* [E4] updateButton[저장].Select (L133) → updateChk() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteChk}>삭제</Button>
              <Button type="generate" onClick={checkPreCreateDuty}>관리의무생성</Button>
              {isManager && <Button type="generate" onClick={() => createDirectManl('REDEFINE_BY_ROLE')}>매뉴얼 작성</Button>}
              {isManager && <Button type="generate" onClick={() => createDirectManl('REMAKE_FROM_LATEST')}>매뉴얼 복제</Button>}
            </>
          }
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="매뉴얼작업명/직책" value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Checkbox checked={writingYn} onChange={e => setWritingYn(e.target.checked)}>작성중만 조회</Checkbox>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmManlJob> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECKED} />
        </div>
      </div>
      <Tdm20_Lookup_SelectRole open={!!roleLookup} allButton stdDate={roleLookup?.manlApplyStartDate} onSelect={onRoleResult} onClose={() => setRoleLookup(null)} />
      <Org00_Lookup_SelectSingle baseDate={orgLookup?.manlApplyStartDate ?? undefined} fixDate={false} allButton onSelect={onOrgResult} onClose={() => setOrgLookup(null)} />
    </div>
  );
};
