/**
 * 휴가신청 편집 폼 — 휴가신청(Emp20_Tab_Leave, Y01)의 아래 폼 (스타일 SGEF 견본 Fnd01_Edit_FundCode: 라벨 오른쪽 정렬, 줄 사이 간격, 아래 가운데 버튼 줄)
 * AS-IS: myApp/client/vi/emp/Emp20_Edit_Leave.java (935줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L296-366: 줄1 휴가구분·특별휴가/포상 사유·비상망·[대결자 지정] / 줄2 휴가시작일·사유·대직자 / 줄3 휴가종료일 / 줄4 기간·[계산]·비고·문서분류, 아래 가운데 [임시저장][상신하기][초과사용 승인요청] (라벨 폭 105)
 * [E0] 화면 열림 (생성자 L121-180) → defaultCheck() L259-294(A01 문서분류·휴가기준), getEditor(), refreshCode01() L182-193(콤보 읽기)
 * 결재요청 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A01 — updateRow() L438 → chkReward() L795 → 저장 → checkA() L494 → checkExcess() L516 → insertLinkApproval() L649 → updateApprId() L699
 * [대결자 지정] 단추(E5 L158-166) = Apr07_Lookup_AltAppr.open(leaveModel) — EE38에서 연결했다(editDriver.flush()처럼 폼의 현재 값을 넘긴다)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empMyLeaveApi, empLeaveApi } from '@/api/emp';
import { sysLeaveCompanyApi } from '@/api/sys';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { EtcLeave, LeaveOption, MyLeave, MyLeaveCodes, TransInfo } from '@/types/emp';
import { LeaveCompany } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Apr07_Lookup_AltAppr } from '@/components/lookup/Apr07_Lookup_AltAppr';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Emp22_Lookup_EtcLeave } from './Emp22_Lookup_EtcLeave';

const FORMAT = 'YYYY-MM-DD';
const LINK_CODE = 'A01';
const LABEL_W = 105;
/** checkCode() L243-245: 종료일을 시작일로 맞추고 잠그는 휴가구분 */
const SINGLE_DAY_CODES = ['02', '03', '06', '07', '08', '09'];
/** 결재가 진행 중이거나 끝난 상태 (retrieve() L396) */
const LOCKED_STATUS = ['10', '20', '30'];

interface Form {
  leaveId: number;
  leaveCode: string | null;
  spcLeaveCode: string | null;
  spcLeaveName: string | null;
  etcLeaveId: number | null;
  regDate: string | null;
  startDate: Dayjs | null;
  closeDate: Dayjs | null;
  leaveCount: number | null;
  reason: string;
  managerName: string;
  emergencyTelno: string;
  note: string;
  apprId: number | null;
  classTreeId: number | null;
  classTreeFullName: string | null;
}

const toForm = (m: MyLeave): Form => ({
  leaveId: m.leaveId, leaveCode: m.leaveCode, spcLeaveCode: m.spcLeaveCode, spcLeaveName: m.spcLeaveName, etcLeaveId: m.etcLeaveId,
  regDate: m.regDate, startDate: m.startDate ? dayjs(m.startDate) : null, closeDate: m.closeDate ? dayjs(m.closeDate) : null,
  leaveCount: m.leaveCount, reason: m.reason ?? '', managerName: m.managerName ?? '', emergencyTelno: m.emergencyTelno ?? '',
  note: m.note ?? '', apprId: m.apprId, classTreeId: m.classTreeId, classTreeFullName: m.classTreeFullName,
});

const EMPTY_FORM: Form = {
  leaveId: 0, leaveCode: null, spcLeaveCode: null, spcLeaveName: null, etcLeaveId: null, regDate: null, startDate: null, closeDate: null,
  leaveCount: null, reason: '', managerName: '', emergencyTelno: '', note: '', apprId: null, classTreeId: null, classTreeFullName: null,
};

/** 한 줄 칸: 라벨(오른쪽 정렬) + 입력 */
const Field: React.FC<{ label: string; width?: number; flex?: number; children: React.ReactNode; top?: boolean }> = ({ label, width, flex, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 8, width, flex, minWidth: 0 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', flexShrink: 0, paddingTop: top ? 5 : 0 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
  </div>
);

interface Props {
  /** 위 그리드에서 고른 행 (retrieve(leaveModel)) — null이면 폼을 막고 단추를 숨긴다 */
  model: MyLeave | null;
  /** Emp20_Tab_Leave.checkRemainDay() — 요약 칸을 다시 읽고 남은 연차 일수를 돌려준다 */
  refreshDays: () => Promise<number | null>;
  /** TempData.getLeaveCount() — 마지막으로 읽은 남은 연차 일수 */
  getRemain: () => number | null;
  /** GridUpdate.update(store, …) — 저장·승인요청 뒤 그 행으로 목록을 바꾼다 */
  onSaved: (oldId: number, saved: MyLeave) => void;
  /** Emp20_Tab_Leave.retrieve() */
  onRetrieve: () => void;
}

export const Emp20_Edit_Leave: React.FC<Props> = ({ model, refreshDays, getRemain, onSaved, onRetrieve }) => {
  const user = useLoginUser();
  const [f, setF] = useState<Form>(EMPTY_FORM);
  const [codes, setCodes] = useState<MyLeaveCodes>({ leaveCodes: [], spcLeaveCodes: [], mobileTelNo: null });
  const [companies, setCompanies] = useState<LeaveCompany[]>([]);
  const [defaultClass, setDefaultClass] = useState<{ classTreeId: number; classTreeFullName: string } | null>(null);
  const [classEmptyText, setClassEmptyText] = useState('');
  const [option, setOption] = useState<LeaveOption>({ leaveYn: false, leaveConfirmYn: false, leaveMonthCode: null });
  const [picked, setPicked] = useState<{ classTreeId: number; classTreeFullName: string } | null>(null);   // classTreeModel — retrieve() 때마다 초기화
  const [saved, setSaved] = useState<MyLeave | null>(null);   // 서버가 돌려준 마지막 행 — 버튼 보임·초과사용 승인상태 판단
  const [etcOpen, setEtcOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [confirmerOpen, setConfirmerOpen] = useState(false);
  const [altOpen, setAltOpen] = useState(false);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const fRef = useRef(f);
  fRef.current = f;

  // defaultCheck() L259-294: dcr.Dcr30_Link.selectByLinkCode("A01") — 정확히 1건이면 기본 문서분류, 아니면 안내 글. sys.Sys31_LeaveCompany.selectByCompanyId — 휴가기준(계산방식·최대일수)
  // refreshCode01() L182-193: 휴가구분·특별휴가 콤보 읽기(sys.Sys00_Common.selectLeaveCode·selectSpcLeaveCode)
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode(LINK_CODE).then(list => {
      if (list.length === 1) { setDefaultClass(list[0]); setClassEmptyText(list[0].classTreeFullName); }
      else setClassEmptyText('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
    }).catch(() => setClassEmptyText('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'));
    sysLeaveCompanyApi.search().then(setCompanies).catch(() => setCompanies([]));
    empMyLeaveApi.getCodes().then(setCodes).catch(() => undefined);
    empLeaveApi.getOption().then(setOption).catch(() => undefined);
  }, []);

  /** checkCode() L241-253 — 종료일 잠금은 휴가구분이 정한다, 기간은 비운다 */
  const isCloseLocked = (code: string | null) => code != null && SINGLE_DAY_CODES.includes(code);

  /** calculate() L737-793: 휴가기준(sys31)에서 계산방식·최대일수를 찾고 emp.Emp20_Leave.count로 기간을 구한다 */
  const calculate = useCallback(async (cur: Form): Promise<Form> => {
    if (!cur.startDate || !cur.closeDate || !cur.leaveCode) return cur;
    let next = cur;
    if (isCloseLocked(cur.leaveCode)) next = { ...next, closeDate: next.startDate };
    let calcCode = '2';
    let days: number | null = null;
    for (const c of companies) {
      if (c.leaveCode !== cur.leaveCode) continue;
      if (cur.spcLeaveCode != null) {
        if (c.spcLeaveCode === cur.spcLeaveCode) { calcCode = c.calcCode ?? '2'; days = c.days ?? null; break; }
      } else { calcCode = c.calcCode ?? '2'; days = c.days ?? null; break; }
    }
    try {
      const count = await empMyLeaveApi.count(next.startDate!.format(FORMAT), next.closeDate!.format(FORMAT), cur.leaveCode, calcCode);
      next = { ...next, leaveCount: count };
      if (cur.leaveCode === '04' && days != null && count != null && count > days) {
        message.warning(`'${cur.spcLeaveName ?? ''}'는 최대 사용기간은 ${days}일 입니다. (${count - days}일 초과)`);
        next = { ...next, leaveCount: null };
      }
    } catch (err) {
      message.error(errorMessage(err, '기간 계산 실패'));
    }
    return next;
  }, [companies]);

  // retrieve(leaveModel) L368-435: 폼을 채우고 checkCode() → calculate()
  useEffect(() => {
    setPicked(null);
    setSaved(model);
    if (!model) { setF(EMPTY_FORM); return; }
    let alive = true;
    let base = toForm(model);
    if (isCloseLocked(base.leaveCode) && base.startDate) base = { ...base, closeDate: base.startDate };
    base = { ...base, leaveCount: null };   // checkCode()가 기간을 비운다
    setF(base);
    void calculate(base).then(n => { if (alive) setF(n); });
    return () => { alive = false; };
  }, [model, calculate]);

  const set = (patch: Partial<Form>) => setF(prev => ({ ...prev, ...patch }));

  // [E7] leaveName[휴가구분].Collapse (L305) → refreshCode02() L195-238
  const onLeaveChange = (code: string) => {
    const spcFirst = codes.spcLeaveCodes[0] ?? null;
    let patch: Partial<Form> = { leaveCode: code, leaveCount: null };
    if (isCloseLocked(code)) patch = { ...patch, closeDate: fRef.current.startDate };
    if (code === '04') {
      patch = spcFirst ? { ...patch, spcLeaveCode: spcFirst.code, spcLeaveName: spcFirst.name } : { ...patch, spcLeaveCode: null, spcLeaveName: null };
    } else {
      patch = { ...patch, spcLeaveCode: null, spcLeaveName: null };
      if (code === '05') setEtcOpen(true);   // 포상휴가면 부여받은 포상휴가 선택 조회창 (Emp22_Lookup_EtcLeave.open(personId, callback))
      else patch = { ...patch, etcLeaveId: null };
    }
    set(patch);
  };

  // lookup callback L224-229: etcLeaveId·사유를 칸에 넣는다
  const onEtcPick = (row: EtcLeave) => set({ etcLeaveId: row.etcLeaveId, spcLeaveName: row.reason });

  // [E8] spcLeaveName.Collapse (L311) → checkCode()
  const onSpcChange = (code: string) => {
    const c = codes.spcLeaveCodes.find(x => x.code === code);
    set({ spcLeaveCode: code, spcLeaveName: c?.name ?? null, leaveCount: null, ...(isCloseLocked(fRef.current.leaveCode) ? { closeDate: fRef.current.startDate } : {}) });
  };

  // chkReward() L795-835: 포상휴가면 사용 가능 기간·사용 횟수 확인. 통과하면 true
  const chkReward = async (isCheckDays: boolean): Promise<boolean> => {
    const cur = fRef.current;
    if (cur.leaveCode !== '05') return true;
    if (cur.etcLeaveId == null) { message.warning('사용하고자 하는 포상휴가를 선택하세요'); return false; }
    try {
      const e = await empMyLeaveApi.getEtcLeave(cur.etcLeaveId, cur.leaveId > 0 ? cur.leaveId : undefined);
      const s = cur.startDate?.format(FORMAT) ?? '';
      const c = cur.closeDate?.format(FORMAT) ?? '';
      if (e.startDate <= s && e.closeDate >= c) {
        if (isCheckDays && (cur.leaveCount ?? 0) > ((e.days ?? 0) - e.useDays)) { message.warning('포상사용횟수 초과입니다'); return false; }
        return true;
      }
      message.warning(`포상휴가 사용가능 기간은 [${e.startDate} ~ ${e.closeDate}]입니다.`);
      return false;
    } catch (err) {
      message.error(errorMessage(err, '포상휴가 확인 실패'));
      return false;
    }
  };

  // [E4] calculateButton[계산].Select (L152) → preCalculate() L719-735
  const preCalculate = async () => {
    const cur = fRef.current;
    if (!cur.startDate) { message.warning('휴가시작일을 입력하세요'); return; }
    if (!cur.closeDate) { message.warning('휴가종료일을 입력하세요'); return; }
    if (!(await chkReward(false))) return;
    setF(await calculate(fRef.current));
  };

  const insertLinkApproval = async (leaveId: number) => {
    // insertLinkApproval() L649-696: classTreeModel이 없으면 dcr.Dcr30_Link.selectByLinkCode("A01")로 읽는다
    let classTreeId = picked?.classTreeId ?? null;
    if (classTreeId == null) {
      try {
        const list = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
        if (list.length === 0) { message.warning('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요'); return; }
        classTreeId = list[list.length - 1].classTreeId;
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    setLink({ classTreeId, linkCode: LINK_CODE, refId: leaveId });
  };

  // checkExcess() L516-587: 회사별 휴가 초과사용 유무 확인
  const checkExcess = async (remain: number | null, row: MyLeave) => {
    if (row.leaveCode === '05') { await insertLinkApproval(row.leaveId); return; }
    if ((remain ?? 0) >= 0) { await insertLinkApproval(row.leaveId); return; }
    let op = option;
    try { op = await empLeaveApi.getOption(); setOption(op); } catch { /* 이전 값을 쓴다 */ }
    if (!op.leaveYn) { message.warning('휴가사용횟수 초과입니다'); return; }
    if (!op.leaveConfirmYn) { await insertLinkApproval(row.leaveId); return; }
    if (row.leaveCode === '04' || row.leaveCode === '05') { await insertLinkApproval(row.leaveId); return; }
    if (row.overConfirmStatusCode === '20') { await insertLinkApproval(row.leaveId); return; }   // 20:승인
    message.warning('사용가능일수를 초과하였습니다. 초과사용 승인완료 후 상신하세요');
  };

  // [E1] tempButton[임시저장].Select (L134)·[E2] apprButton[상신하기].Select (L140) → updateRow(check) L438-492
  const updateRow = async (check: boolean) => {
    const cur = fRef.current;
    if (cur.leaveCode == null) { message.warning('휴가구분은 필수선택 항목입니다'); return; }
    if (cur.closeDate == null) { message.warning('휴가종료일은 필수선택 항목입니다'); return; }
    if (!cur.managerName.trim()) { message.warning('대직자는 필수입력 항목입니다'); return; }
    if (!cur.emergencyTelno.trim()) { message.warning('비상망은 필수입력 항목입니다'); return; }
    if (cur.leaveCount == null) { message.warning('기간 값이 없습니다. 계산 후 저장해주세요'); return; }
    if (cur.leaveCount < 0) { message.warning('기간 값을 확인해주세요'); return; }
    if (!(await chkReward(true))) return;
    setBusy(true);
    try {
      const row = await empMyLeaveApi.save({
        leaveId: cur.leaveId, leaveCode: cur.leaveCode, spcLeaveCode: cur.spcLeaveCode, etcLeaveId: cur.etcLeaveId,
        regDate: cur.regDate, startDate: cur.startDate?.format(FORMAT) ?? null, closeDate: cur.closeDate.format(FORMAT),
        leaveCount: cur.leaveCount, reason: cur.reason, managerName: cur.managerName, emergencyTelno: cur.emergencyTelno,
        note: cur.note, apprId: cur.apprId, classTreeId: cur.classTreeId,
      });
      const before = getRemain();
      onSaved(cur.leaveId, row);
      setSaved(row);
      setF(toForm(row));
      // checkA() L494-513
      if (check) {
        const remain = await refreshDays();
        await checkExcess(remain, row);
      } else {
        if ((before ?? 0) < 0) message.warning('휴가잔여 일수를 확인해주세요');
        onRetrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  // updateApprId() L699-716: emp.Emp20_Leave.update(결재문서 ID) → 성공하면 parent.retrieve()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    try {
      await empMyLeaveApi.updateApprId(link.refId, apprId);
      onRetrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // [E3] overConfirmButton[초과사용 승인요청].Select (L146) → lookupEmpTransInfo() L589-599 → sendMessage() L601-629 → updateOverConfirm() L631-646
  const onConfirmerPick = async (t: TransInfo | null) => {
    setConfirmerOpen(false);
    if (!t) return;
    const cur = fRef.current;
    if (cur.leaveId <= 0) { message.warning('저장 후 승인요청을 진행하세요'); return; }
    setBusy(true);
    try {
      const row = await empMyLeaveApi.requestOverConfirm(cur.leaveId, t.personId);
      message.success('승인요청 문자발송이 완료되었습니다');
      onSaved(cur.leaveId, row);
      setSaved(row);
    } catch (err) {
      message.error(errorMessage(err, '문자발신 서비스를 미신청한 고객사입니다. 관리자에게 문의하세요'));
    } finally {
      setBusy(false);
    }
  };

  // [E5] altApprButton[대결자 지정].Select (L158-166) → leaveModel = editDriver.flush() → Apr07_Lookup_AltAppr.open(leaveModel)
  const altAppr = () => setAltOpen(true);

  const disabled = model == null;
  // retrieve() L396-429: 결재가 진행 중·완료이거나 취소된 문서는 단추를 숨기고 [계산]을 막는다
  const locked = saved != null && ((saved.apprStatusCode != null && LOCKED_STATUS.includes(saved.apprStatusCode)) || saved.cancel === '취소');
  const showSave = !disabled && !locked;
  const overVisible = showSave && option.leaveYn && option.leaveConfirmYn
    && saved?.overConfirmStatusCode !== '20' && saved?.overConfirmStatusCode !== '30';
  const overEnabled = saved?.overConfirmStatusCode == null || saved.overConfirmStatusCode === '10';
  const spcEnabled = !disabled && f.leaveCode === '04' && codes.spcLeaveCodes.length > 0;
  const closeLocked = isCloseLocked(f.leaveCode);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, overflow: 'auto', paddingTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Field label="휴가구분" width={250}>
          <Select style={{ width: 140 }} disabled={disabled} value={f.leaveCode ?? undefined} onChange={onLeaveChange}
            options={codes.leaveCodes.map(c => ({ value: c.code, label: c.name }))} />
        </Field>
        <div style={{ flex: '0 1 495px', minWidth: 200 }}>
          {f.leaveCode === '05'
            ? <Input disabled value={f.spcLeaveName ?? ''} />
            : <Select style={{ width: '100%' }} disabled={!spcEnabled} value={f.spcLeaveCode ?? undefined} onChange={onSpcChange}
                options={codes.spcLeaveCodes.map(c => ({ value: c.code, label: c.name }))} />}
        </div>
        <Field label="비상망" width={250}>
          <Input disabled={disabled} value={f.emergencyTelno} onChange={e => set({ emergencyTelno: e.target.value })} />
        </Field>
        <Button type="change" onClick={altAppr} disabled={disabled}>대결자 지정</Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Field label="휴가시작일" width={250}>
          {/* [E9] startDate[휴가시작일].Collapse (L317) → 인라인 L317-323: 기간을 비우고 종료일 최소값 = 시작일 */}
          <DatePicker style={{ width: 140 }} disabled={disabled} allowClear={false} value={f.startDate} format={FORMAT}
            onChange={d => set({ startDate: d, leaveCount: null })} />
        </Field>
        <Field label="사유" flex={1} top>
          <Input.TextArea style={{ height: 65 }} disabled={disabled} value={f.reason} onChange={e => set({ reason: e.target.value })} />
        </Field>
        <Field label="대직자" flex={1} top>
          <Input.TextArea style={{ height: 65 }} disabled={disabled} value={f.managerName} onChange={e => set({ managerName: e.target.value })} />
        </Field>
      </div>

      <Field label="휴가종료일" width={250}>
        {/* [E10] closeDate[휴가종료일].Collapse (L324) → 인라인 L324-329: 기간을 비운다 */}
        <DatePicker style={{ width: 140 }} disabled={disabled || closeLocked} value={f.closeDate} format={FORMAT}
          disabledDate={d => f.startDate != null && d.isBefore(f.startDate, 'day')}
          onChange={d => set({ closeDate: d, leaveCount: null })} />
      </Field>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Field label="기간" width={250}>
          <InputNumber style={{ width: 80 }} disabled={disabled} readOnly value={f.leaveCount} />
          <Button type="change" onClick={preCalculate} disabled={disabled || locked}>계산</Button>
        </Field>
        <Field label="비고" flex={1} top>
          <Input.TextArea style={{ height: 30 }} disabled={disabled} value={f.note} onChange={e => set({ note: e.target.value })} />
        </Field>
        <Field label="문서분류" flex={1}>
          {/* [E6] classTreeFullName[문서분류].TriggerClick (L299) → openLookupDoc() L838-847: Dcr30_Move_DcrClass.open(defaultModel, callback) */}
          <LookupInput value={picked?.classTreeFullName ?? f.classTreeFullName ?? ''} placeholder={classEmptyText} width={560}
            disabled={disabled} onOpen={() => setClassOpen(true)} />
        </Field>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 'auto', minHeight: 44 }}>
        {showSave && <Button type="save" onClick={() => updateRow(false)} disabled={busy}>임시저장</Button>}
        {showSave && <Button type="register" onClick={() => updateRow(true)} disabled={busy}>상신하기</Button>}
        {overVisible && <Button type="save" onClick={() => setConfirmerOpen(true)} disabled={busy || !overEnabled}>초과사용 승인요청</Button>}
      </div>

      <Emp22_Lookup_EtcLeave personId={etcOpen ? user.userId : null} onSelect={onEtcPick} onClose={() => setEtcOpen(false)} />
      <Apr07_Lookup_AltAppr open={altOpen} onClose={() => setAltOpen(false)}
        leave={{
          leaveId: f.leaveId,
          startDate: f.startDate ? f.startDate.format('YYYY-MM-DD') : null,
          closeDate: f.closeDate ? f.closeDate.format('YYYY-MM-DD') : null,
          reason: f.reason || null,
          emergencyTelno: f.emergencyTelno || null,
        }} />
      <Dcr30_Move_DcrClass
        open={classOpen}
        authCheck
        defaultClassTreeId={defaultClass?.classTreeId ?? null}
        onResult={r => {
          setClassOpen(false);
          if (r.classTreeId != null) setPicked({ classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName ?? '' });
        }}
        onClose={() => setClassOpen(false)}
      />
      <Emp00_Lookup_SelectSingle
        open={confirmerOpen}
        leaveManager
        noneLabel={null}
        transDate={dayjs().format(FORMAT)}
        onResult={t => void onConfirmerPick(t)}
        onClose={() => setConfirmerOpen(false)}
      />
      {/* 결재요청 = insertLinkApproval(classTreeModel, "A01", 휴가 행, …) */}
      <Apr01_Edit_ApprDoc
        apprId={null}
        link={link}
        onLinkSaved={id => void updateApprId(id)}
        onClose={() => setLink(null)}
      />
    </div>
  );
};
