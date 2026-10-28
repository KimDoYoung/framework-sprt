/**
 * [1033] 경영관리 > 02. 휴가/출장 관리 > 휴가관리(경영관리팀) (S06)
 * AS-IS: myApp/client/vi/emp/Emp20_Tab_LeaveManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L98-191, SG): 테두리 박스 = 툴바(기준연도 · 사원명 · [조회][엑셀다운로드][휴가취소] · 초과휴가 [승인][반려][취소] ····· [기본설정][문서분류지정][초기설정 휴가일수])
 *   + 휴가 그리드(체크 단일, 2단 헤더 "초과휴가") + 아래 요약 두 줄(유급휴가 총/사용/잔여/기간 · 포상휴가 총/사용/잔여 + 안내 아이콘)
 * 1단계(사용자 결정 2026-10-28): [휴가취소]의 결재문서 삭제(emp.Emp20_Leave.cancelUpdate → apr01_appr.insertApprDel/deleteAppr)와
 *   알림톡·메일·SMS 발송(emp92_sms_notice.*)은 다음 단계 — 원본의 선택·상태 검사와 확인창까지만 한다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empLeaveApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { Leave, LeaveOption } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { rdDownload } from '@/utils/rdDownload';
import { Sys31_Lookup_LeaveCompany } from '../sys/Sys31_Lookup_LeaveCompany';
import { Emp22_Lookup_EtcLeave } from './Emp22_Lookup_EtcLeave';
import { Emp26_Lookup_InitLeave } from './Emp26_Lookup_InitLeave';

const gb = gbFor<Leave>();

/** 단일 체크 선택 (setChecked(SINGLE)) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** 요약 칸 (읽기 전용 TextField) */
const SummaryBox: React.FC<{ value: string; width: number }> = ({ value, width }) => (
  <Input readOnly size="small" value={value} style={{ width, textAlign: 'center' }} />
);
const Sep: React.FC<{ text?: string }> = ({ text = ' / ' }) => <span style={{ whiteSpace: 'pre' }}>{text}</span>;
const Lbl: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ whiteSpace: 'nowrap' }}>{children}</b>;

const EMPTY_SUMMARY = { total1: '', pyRemain: '', use1: '', remain1: '', stdPeriod1: '', total02: '', use02: '', remain02: '' };
const str = (v: number | string | null | undefined) => (v == null ? '' : String(v));

export const Emp20_Tab_LeaveManager: React.FC = () => {
  const gridRef = useRef<AgGridReact<Leave>>(null);
  const [option, setOption] = useState<LeaveOption>({ leaveYn: false, leaveConfirmYn: false, leaveMonthCode: null });
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [person, setPerson] = useState<{ id: number; name: string } | null>(null);
  const [rows, setRows] = useState<Leave[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [personOpen, setPersonOpen] = useState(false);
  const [etcPersonId, setEtcPersonId] = useState<number | null>(null);
  const [initOpen, setInitOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // setOverConfirmVer() L611-627: 초과휴가허용 & 초과휴가 승인후 사용이면 라벨·버튼·열 9~11을 보인다
  const overVisible = option.leaveYn && option.leaveConfirmYn;

  // [E0] 화면 열림 (생성자 L98-191) → buttonBarSetting() L193-322: 기준연도(결산월 '03'이면 3월까지는 전년) · setOverConfirmVer()
  useEffect(() => {
    empLeaveApi.getOption().then(o => {
      setOption(o);
      const now = dayjs();
      setYear(o.leaveMonthCode === '03' && now.month() + 1 <= 3 ? String(now.year() - 1) : String(now.year()));
    }).catch(() => undefined);
  }, []);

  // retrieve() L407-424: 서비스 emp.Emp20_Leave.selectByPersonId(personId, stdYear, managerYn=true) → checkRemainDay() → 첫 행 선택
  // checkRemainDay() L426-470: 서비스 emp.Emp20_Leave.selectByDays + emp.Emp22_EtcLeave.selectByDays(apprCheckYn=true) — 사원 정보가 있을 때만 요약 칸을 바꾼다
  const retrieve = async (p = person, y = year) => {
    if (!p) { setRows([]); return; }
    try {
      const list = await empLeaveApi.searchLeaves(p.id, y);
      setRows(list);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      const d = await empLeaveApi.getDays(p.id, y);
      if (d) {
        setSummary({
          total1: str(d.totalDays), pyRemain: str(d.pyRemainMonthDays), use1: str(d.useDays), remain1: str(d.remainDays), stdPeriod1: str(d.stdPeriod),
          total02: str(d.etcTotalDays), use02: str(d.etcUseDays), remain02: str(d.etcRemainDays),
        });
      }
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] retrieveButton[조회].Select (L260) → personNameCheck() L345-351
  const personNameCheck = () => {
    if (!person) { message.warning('사원을 선택해주세요'); return; }
    return retrieve();
  };

  // [E3] personName.TriggerClick (L240) → Emp00_Lookup_SelectSingle.open(오늘, true, callback) → 이름·ID를 넣고 retrieve()
  const onPickPerson = (t: { personId: number; korNm?: string | null } | null) => {
    setPersonOpen(false);
    if (!t) return;
    const p = { id: t.personId, name: t.korNm ?? '' };
    setPerson(p);
    void retrieve(p);
  };

  // [E1] helpAnchor.MouseDown (L103): 사원이 없으면 "사원을 선택해주세요", 있으면 Emp22_Lookup_EtcLeave.view(personId)
  const openEtcLeave = () => {
    if (!person) { message.warning('사원을 선택해주세요'); return; }
    setEtcPersonId(person.id);
  };

  // [E5] downloadButton[엑셀다운로드].Select (L266) → createRdExcel() L472-530: 서비스 sys.Sys99_Print.insertRdLeaveManager(companyId, personId, "Emp20_Tab_LeaveManager", selectPersonId, stdYear, managerYn)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Emp20_Rd_LeaveManager · options "/rexportopt [6] /rxlsopt [100]" · 파일 "휴가사용 내역(이름)-년도년.xlsx" · rv rdGroupId + 요약 칸 8개)
  //   (원본은 사원 없이 눌러도 서버를 부르지만 TOBE는 안내만 한다 — 서버가 소속 사원을 확인한다)
  const createRdExcel = async () => {
    if (!person) { message.warning('사원을 선택해주세요'); return; }
    setBusy(true);
    try {
      const groupId = await empLeaveApi.rdDownload(person.id, year);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Emp20_Rd_LeaveManager',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `휴가사용 내역(${person.name})-${year}년.xlsx`,
        rv: {
          rdGroupId: groupId, total1: summary.total1, pyRemainMonthDays01: summary.pyRemain, use1: summary.use1, remain1: summary.remain1,
          stdPeriod1: summary.stdPeriod1, total02: summary.total02, use02: summary.use02, remain02: summary.remain02,
        },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E6] cancelButton[휴가취소].Select (L272) → cancel() L353-367 → cancelMessage() L369-405
  const cancel = () => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) { message.warning('문서를 선택해주세요'); return; }
    if (sel.apprStatusCode == null || !(sel.apprStatusCode === '20' || sel.apprStatusCode === '30')) {
      message.warning('해당 문서는 취소가 불가능합니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 문서를 취소하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      // [E13] msgBox.DialogHide [YES] (L372) → 서비스 emp.Emp20_Leave.cancelUpdate(companyId, leaveId, apprId, targetEmpId, empId), 성공이면 "취소처리가 완료되었습니다."
      //   결재문서 삭제·알림 발송은 다음 단계 — 아직 변환 전이라 서버를 부르지 않는다
      onOk: () => { message.info('결재문서 삭제와 알림 발송(emp.Emp20_Leave.cancelUpdate)은 아직 변환 전입니다.'); },
    });
  };

  // [E7] overApprButton[승인] (L278) "A" / [E8] overRejectButton[반려] (L284) "R" / [E9] overCancelButton[취소] (L290) "C" → updateOverStatus() L532-609
  const updateOverStatus = (actionType: 'A' | 'R' | 'C') => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) { message.warning('초과휴가 내역을 선택하세요'); return; }
    if (sel.overConfirmStatusCode == null) { message.warning('처리대상이 아닙니다'); return; }
    if (['10', '20', '30'].includes(sel.apprStatusCode ?? '')) { message.warning('상신진행(또는 완료)되어 처리할 수 없습니다'); return; }
    // 초과휴가 승인상태 (10:신청/20:승인/30:반려)
    if (actionType === 'A' || actionType === 'R') {
      if (sel.overConfirmStatusCode !== '10') { message.warning('신청상태가 아닙니다'); return; }
    } else if (sel.overConfirmStatusCode === '10') {
      message.warning('승인(또는 반려) 상태가 아닙니다');
      return;
    }
    const statusCode = actionType === 'A' ? '20' : actionType === 'R' ? '30' : '10';
    const msg = actionType === 'A' ? '승인하시겠습니까?' : actionType === 'R' ? '반려하시겠습니까?' : '취소하시겠습니까?';
    Modal.confirm({
      title: '확인',
      content: msg,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      // [E14] messageBox.DialogHide [YES] (L588) → 서비스 emp.Emp20_Leave.updateOverConfirm(leaveId, confirmStatusCode, confirmerId) → 그 행만 바꾼다 (grid.store.update)
      onOk: async () => {
        try {
          const saved = await empLeaveApi.updateOverConfirm(sel.leaveId, statusCode);
          setRows(prev => prev.map(r => (r.leaveId === saved.leaveId ? saved : r)));
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // buildGrid() L324-343 — setChecked(SINGLE), 행번호 있음, 묶음 헤더 "초과휴가"(열 9~11)는 setOverConfirmVer()가 보이거나 숨긴다
  const columnDefs = useMemo(() => [
    gb.date('startDate', 90, '시작일'),  // L330 (읽기 전용 날짜 UX-08)
    gb.date('closeDate', 90, '종료일'),  // L331
    gb.text('leaveName', 100, '휴가구분'),  // L332
    gb.double('leaveCount', 60, '기간'),  // L333
    gb.text('managerName', 120, '대직자'),  // L334
    gb.text('reason', 550, '사유'),  // L335
    gb.text('apprStatusName', 100, '문서상태'),  // L336
    gb.group('초과휴가', [  // L327
      gb.textCenter('overConfirmStatusName', 70, '승인상태', { hide: !overVisible }),  // L338
      gb.textCenter('overConfirmerName', 100, '승인자', { hide: !overVisible }),  // L339
      gb.textCenter('overConfirmDateStr', 150, '승인일시', { hide: !overVisible }),  // L340
    ]),
  ], [overVisible]);

  return (
    <div style={{ height: '100%', padding: 20, background: '#fff', boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <SearchBar
          onSearch={personNameCheck}
          loading={busy}
          extra={<>
            <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
            <Button type="cancel" onClick={cancel}>휴가취소</Button>
            {overVisible && (
              <>
                <b style={{ marginLeft: 16, whiteSpace: 'nowrap' }}>초과휴가</b>
                <Button type="save" onClick={() => updateOverStatus('A')}>승인</Button>
                <Button type="cancel" onClick={() => updateOverStatus('R')}>반려</Button>
                <Button type="cancel" onClick={() => updateOverStatus('C')}>취소</Button>
              </>
            )}
            <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 8 }}>
              {/* [E11] leaveMngButton[기본설정].Select (L303) → Sys31_Lookup_LeaveCompany.open() */}
              <Button type="settings" onClick={() => setCompanyOpen(true)}>기본설정</Button>
              {/* [E12] mappingButton[문서분류지정].Select (L310) → Dcr30_Lookup_Link.open("A01", callback{}) */}
              <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
              {/* [E10] initButton[초기설정 휴가일수].Select (L296) → Emp26_Lookup_InitLeave.open(leaveYText.getText()) */}
              <Button type="org" onClick={() => setInitOpen(true)}>초기설정 휴가일수</Button>
            </span>
          </>}
        >
          <SearchBar.Field label="기준연도">
            {/* [E2] leaveYText.KeyPress [Enter] (L232) → retrieve() — 이 칸에서 Enter */}
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={year} onChange={e => setYear(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="사원명">
            <LookupInput value={person?.name ?? ''} width={110} onOpen={() => setPersonOpen(true)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Leave>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.leaveId)}
          />
        </div>
        {/* centerButtonBar01 L159·L163-176 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', paddingLeft: 5 }}>
          <Lbl>유급휴가 총 일수</Lbl><SummaryBox value={summary.total1} width={50} />
          <Sep text=" + " /><SummaryBox value={summary.pyRemain} width={50} />
          <span style={{ color: '#4472C4', whiteSpace: 'nowrap' }}>(전년도 미사용 월차)</span>
          <Sep /><Lbl>유급휴가 사용 일수</Lbl><SummaryBox value={summary.use1} width={50} />
          <Sep /><Lbl>유급휴가 잔여 일수</Lbl><SummaryBox value={summary.remain1} width={50} />
          <Sep /><Lbl>휴가사용기간</Lbl><SummaryBox value={summary.stdPeriod1} width={180} />
        </div>
        {/* centerButtonBar02 L160·L178-188 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', paddingLeft: 5 }}>
          <Lbl>포상휴가 총 일수</Lbl><SummaryBox value={summary.total02} width={50} />
          <Sep /><Lbl>포상휴가 사용 일수</Lbl><SummaryBox value={summary.use02} width={50} />
          <Sep /><Lbl>포상휴가 잔여 일수</Lbl><SummaryBox value={summary.remain02} width={50} />
          <span style={{ color: '#4472C4', whiteSpace: 'nowrap', marginLeft: 6 }}>※ 사용만료기간의 차이로 잔여 일수가 일치하지 않을 수 있습니다. 자세한 내용은 우측 아이콘을 통해 확인해주세요.</span>
          <InfoCircleOutlined style={{ color: '#4472C4', cursor: 'pointer', fontSize: 16 }} onMouseDown={openEtcLeave} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personOpen} separateAddTitle noneLabel={null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPickPerson} onClose={() => setPersonOpen(false)} />
      <Emp22_Lookup_EtcLeave personId={etcPersonId} onClose={() => setEtcPersonId(null)} />
      <Emp26_Lookup_InitLeave open={initOpen} year={year} onClose={() => setInitOpen(false)} />
      <Sys31_Lookup_LeaveCompany open={companyOpen} onClose={() => setCompanyOpen(false)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A01" onClose={() => setLinkOpen(false)} />
    </div>
  );
};
