/**
 * 지출결의서 편집 폼 (U03) — Pay50_Tab_ExpenseManager South(350)에 붙는다. 목록에서 고른 행을 고쳐 [저장]한다
 * AS-IS: myApp/client/vi/pay/Pay50_Edit_Expense.java (723줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L395-491: 라벨 115, 두 칸 800씩(왼쪽: 발생일자·요청자 / 지출처·선급계좌 / 지출내역 [내역상세] / 면세구분·지급요청일 / 공급가액·지급방법·선급관리계좌 /
 *   세액·지급요청계좌 / 합계·계정과목, 오른쪽: 승인자(관리자만)·증빙자료 / 결의자·처리상태 / 반려사유 / 비고 92), 아래 가운데 [저장]
 * 상신된 건(expenseApprStatusCode 있음)은 모두 읽기 전용이고 [저장]이 꺼진다(disabled L661-693). 행이 없으면 폼 전체가 꺼진다(setEnabled)
 * 공급가액 KeyUp·Change(E10~E13)는 한 곳(setAmt)에서 처리한다 — 면세구분이 과세(2)면 세액을 10%로 다시 계산한다
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PayExpense } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Sys17_Lookup_Account } from '@/components/lookup/Sys17_Lookup_Account';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ast01_Lookup_CorpAccount } from '../ast/Ast01_Lookup_CorpAccount';
import { Pay50_Lookup_Content } from './Pay50_Lookup_Content';
import { Pay52_Lookup_AccountCode } from './Pay52_Lookup_AccountCode';

const FORMAT = 'YYYY-MM-DD';
const LABEL_BLUE = '#0069B4';
const fmt = (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const parse = (v: string | undefined) => (v ? v.replace(/,/g, '') : '');
/** 빈 글자는 null (GWT TextField.getCurrentValue()) */
const nz = (v: string | null | undefined) => (v === undefined || v === null || v === '' ? null : v);

/** 칸 하나: 라벨(폭 115, 오른쪽 정렬, 필수는 파란색) + 입력. 폭은 칸 전체(라벨 포함) */
const Field: React.FC<{ label: string; width: number; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }> =
  ({ label, width, required, children, style }) => (
    <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0, ...style }}>
      <label style={{ width: 115, flexShrink: 0, textAlign: 'right', paddingRight: 10, color: required ? LABEL_BLUE : undefined }}>{label}</label>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );

const Row: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '20px 20px 17px 10px', ...style }}>{children}</div>
);

interface Props {
  /** 목록에서 고른 행 — null이면 폼이 꺼진다(init()) */
  model: PayExpense | null;
  /** new Pay50_Edit_Expense(grid, isManager) — 관리자는 승인자 칸과 계정코드 편집이 있다 */
  isManager: boolean;
  /** [저장] 성공 뒤 서버에서 다시 읽은 행 */
  onSaved: (row: PayExpense) => void;
  /** 내역상세 저장처럼 그 행의 값만 바뀐 경우 */
  onChanged: (row: PayExpense) => void;
}

export const Pay50_Edit_Expense: React.FC<Props> = ({ model, isManager, onSaved, onChanged }) => {
  const [f, setF] = useState<PayExpense | null>(model);
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [prePayCorpOpen, setPrePayCorpOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L109-119) → getEditor() / retrieve(param) L493-516: editDriver.edit(model) → 상신된 건이면 disabled(true) → setPayAccountInfo()
  useEffect(() => {
    if (!model) { setF(null); return; }
    setF(noAccountFor(model));
  }, [model]);

  /** setPayAccountInfo() L370-393: 현금(20)·법인카드(15)·선급비용(17)이면 지급요청계좌를 비운다 */
  function noAccountFor(m: PayExpense): PayExpense {
    return ['20', '15', '17'].includes(m.payMethodCode ?? '') ? { ...m, payAccountInfo: null } : m;
  }

  const set = (patch: Partial<PayExpense>) => setF(prev => (prev ? { ...prev, ...patch } : prev));
  const locked = !f || f.expenseApprStatusCode != null;  // disabled(true) L661-693 — 상신된 건
  const off = !f;                                        // 행이 없으면 폼 전체가 꺼진다

  /**
   * 합계·세액 계산. 면세구분이 과세(2)면 세액 = 공급가액의 10%(반올림)
   */
  // [E10] amt[공급가액].Change (L308) → 합계 = 공급가액 + 세액 (과세면 세액을 10%로 다시 계산)
  // [E12] amt[공급가액].KeyUp (L352) → updateSettleAmt(), updateAmt()
  const setAmt = (amt: number | null) => {
    setF(prev => {
      if (!prev) return prev;
      const a = amt ?? 0;
      const tax = prev.taxType === '2' ? Math.round(a * 0.1) : (prev.tax ?? 0);
      return { ...prev, amt, tax, settleAmt: a + tax };
    });
  };
  // [E11] tax[세액].Change (L336) · [E13] tax[세액].KeyUp (L362) → updateSettleAmt(): 합계 = 공급가액 + 세액
  const setTax = (tax: number | null) => setF(prev => (prev ? { ...prev, tax, settleAmt: (prev.amt ?? 0) + (tax ?? 0) } : prev));

  // [E7] payMethodName[지급방법].Selection (L268) → setPayAccountInfo() — 선택한 지급방법
  const selectPayMethod = (code: string | undefined, name?: string) => {
    setF(prev => (prev ? noAccountFor({ ...prev, payMethodCode: code ?? null, payMethodName: name ?? null }) : prev));
  };

  // [E8] taxTypeName[면세구분].Selection (L275) → 과세(2)면 세액 10%, 아니면 0
  const selectTaxType = (code: string | undefined, name?: string) => {
    setF(prev => {
      if (!prev) return prev;
      const a = prev.amt ?? 0;
      const tax = code === '2' ? Math.round(a * 0.1) : 0;
      return { ...prev, taxType: code ?? null, taxTypeName: name ?? null, tax, settleAmt: a + tax };
    });
  };

  // [E4] corpName[지출처].TriggerClick (L165) → 기타출금(선급, 91)이면 Ast01_Lookup_CorpAccount.openPrePayOnly, 아니면 Sys15_Lookup_Corp.open(true, true)
  const openCorp = () => (f?.expenseCode === '91' ? setPrePayCorpOpen(true) : setCorpOpen(true));

  /** 거래처의 대표계좌 "은행 계좌번호 예금주" (AS-IS Sys15_CorpModel.getPayAccountInfo — 대표계좌 서브쿼리) */
  const mainAccountInfo = async (corpId: number) => {
    const accounts = await sysApi.searchCorpAccounts(corpId);
    const main = accounts.find(a => a.mainAccountYn === 'true');
    return main ? [main.bankName, main.accountNoDec, main.accountName].filter(Boolean).join(' ') : null;
  };

  const lookupCorpDone = async (corp: { corpId: number; corpName: string | null } | null) => {
    setCorpOpen(false);
    if (corp) {
      let info: string | null = null;
      try { info = await mainAccountInfo(corp.corpId); } catch { /* 대표계좌를 못 읽어도 지출처는 고른다 */ }
      set({ corpId: corp.corpId, corpName: corp.corpName, payAccountInfo: info, payMethodName: '계좌이체', payMethodCode: '10', astId: null, astName: null });
    } else {
      set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null });
    }
  };

  // [E5] depositName.TriggerClick (L222): 지출처가 없으면 "먼저 지출처를 선택하세요"
  const openDeposit = () => {
    if (f?.corpId == null) { message.warning('먼저 지출처를 선택하세요'); return; }
    setDepositOpen(true);
  };

  // [E6] payAccountInfo[지급요청계좌].TriggerClick (L247): 지출처가 없으면 "지출처 선택 후 지급요청계좌 선택이 가능합니다"
  const openBank = () => {
    if (f?.corpId == null) { message.warning('지출처 선택 후 지급요청계좌 선택이 가능합니다'); return; }
    setBankOpen(true);
  };

  // [E1] contentButton[내역상세].Select (L144) → lookupContent() L603-617: 상신된 건은 보기, 아니면 편집(저장하면 "내역상세가 저장되었습니다.")
  // [E2] fileButton[증빙자료].Select (L151) → lookupFile() L619-659: Com01_Lookup_RelateAppr — 다른 도메인 컴포넌트라 다음 단계
  const lookupFile = () => message.info('증빙자료 창(Com01_Lookup_RelateAppr)은 다음 단계에서 변환합니다.');

  // [E3] updateButton[저장].Select (L158) → update() L522-582
  const update = async () => {
    if (!model || !f) return;
    if (f.occDate == null) return void message.warning('발생일자는 필수입력 값입니다');
    if (f.corpId == null) return void message.warning('지출처는 필수입력 값입니다');
    if (nz(f.desc) == null) return void message.warning('지출내역은 필수입력 값입니다');
    if (f.taxType == null) return void message.warning('면세구분은 필수입력 값입니다');
    if (f.tax == null && f.taxType === '2') return void message.warning('면세구분이 과세면 세액은 필수입력 값입니다');
    if (f.dueDate == null) return void message.warning('지급요청일은 필수입력 값입니다');
    if (f.amt == null) return void message.warning('공급가액은 필수입력 값입니다');
    if (f.payMethodCode == null) return void message.warning('지급방법은 필수입력 값입니다');
    if (f.payMethodCode === '10') {
      if (nz(f.payAccountInfo) == null) return void message.warning('지급계좌는 필수입력 값입니다.');
    } else if (f.payMethodCode === '17') {
      if (f.depositId == null) return void message.warning("지급방법이 '선급비용'인 경우 선급관리계좌는 필수입력 값입니다");
    }
    setSaving(true);
    try {
      const saved = await payApi.updateExpense(model.expenseId, {
        occDate: f.occDate, desc: nz(f.desc), corpId: f.corpId, taxType: f.taxType, amt: f.amt, tax: f.tax, settleAmt: f.settleAmt,
        dueDate: f.dueDate, payMethodCode: f.payMethodCode, payAccountInfo: nz(f.payAccountInfo), accountCode: f.accountCode,
        note: nz(f.note), depositId: f.depositId, astId: f.astId,
      });
      message.success('저장이 완료되었습니다.');
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const payMethod17 = f?.payMethodCode === '17';
  const payAccountDisabled = off || locked || ['20', '15', '17'].includes(f?.payMethodCode ?? '');
  const payAccountHint = ['20', '15', '17'].includes(f?.payMethodCode ?? '') ? '(해당없음)' : f?.payMethodCode === '10' ? '지급계좌 정보를 선택 또는 입력하세요' : '정보를 입력하세요';

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex' }}>
        {/* ── 왼쪽 800 (layout01) ── */}
        <div style={{ width: 800, flexShrink: 0 }}>
          <Row>
            <Field label="발생일자" width={240} required>
              <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} disabled={off || locked}
                value={f?.occDate ? dayjs(f.occDate) : null} onChange={d => set({ occDate: d ? d.format(FORMAT) : null })} />
            </Field>
            <div style={{ width: 100 }} />
            <Field label="요청자" width={420}><Input disabled value={f?.regEmpOrgName ?? ''} /></Field>
          </Row>
          <Row>
            <Field label="지출처" width={455} required>
              <LookupInput width={330} value={f?.corpName ?? ''} disabled={off || locked} onOpen={openCorp}
                onClear={() => set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null })} />
            </Field>
            <div style={{ width: 305, marginLeft: 5 }}><Input disabled value={f?.astName ?? ''} /></div>
          </Row>
          <Row>
            <Field label="지출내역" width={660} required>
              <Input disabled={off || locked} value={f?.desc ?? ''} onChange={e => set({ desc: e.target.value })} />
            </Field>
            <div style={{ width: 100, marginLeft: 5 }}>
              <Button type="register" disabled={off} onClick={() => setContentOpen(true)}>내역상세</Button>
            </div>
          </Row>
          <Row>
            <Field label="면세구분" width={240} required>
              <SystemCodeComboBox kindCd="TaxType" style={{ width: '100%' }} disabled={off || locked} allowClear={false}
                value={f?.taxType ?? undefined} onChange={selectTaxType} />
            </Field>
            <div style={{ width: 100 }} />
            <Field label="지급요청일" width={240} required>
              <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} disabled={off || locked}
                value={f?.dueDate ? dayjs(f.dueDate) : null} onChange={d => set({ dueDate: d ? d.format(FORMAT) : null })} />
            </Field>
          </Row>
          <Row>
            <Field label="공급가액" width={240} required>
              <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled={off || locked}
                value={f?.amt ?? null} onChange={v => setAmt(v == null ? null : Number(v))} />
            </Field>
            <div style={{ width: 100 }} />
            <Field label="지급방법" width={240} required>
              <SystemCodeComboBox kindCd="PayMethodCode" style={{ width: '100%' }} disabled={off || locked} allowClear={false}
                value={f?.payMethodCode ?? undefined} onChange={selectPayMethod} />
            </Field>
            {payMethod17 && (
              <div style={{ width: 180, marginLeft: 5 }}>
                <LookupInput width={180} placeholder="선급관리계좌를 선택하세요" value={f?.depositName ?? ''} disabled={off || locked} onOpen={openDeposit}
                  onClear={() => set({ depositId: null, depositName: null })} />
              </div>
            )}
          </Row>
          <Row>
            <Field label="세액" width={240}>
              <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled={off || locked}
                value={f?.tax ?? null} onChange={v => setTax(v == null ? null : Number(v))} />
            </Field>
            <div style={{ width: 100 }} />
            <Field label="지급요청계좌" width={420}>
              <Input disabled={payAccountDisabled} placeholder={payAccountHint} value={f?.payAccountInfo ?? ''}
                onChange={e => set({ payAccountInfo: e.target.value })}
                suffix={<SearchOutlined style={{ cursor: payAccountDisabled ? 'default' : 'pointer' }} onClick={() => { if (!payAccountDisabled) openBank(); }} />} />
            </Field>
          </Row>
          <Row>
            <Field label="합계" width={240} required>
              <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled value={f?.settleAmt ?? null} />
            </Field>
            <div style={{ width: 100 }} />
            <Field label="계정과목" width={420} required>
              {/* [E9] accountName[계정과목].TriggerClick (L301) → openLookupAccount() L695-704: Pay52_Lookup_AccountCode.open(isManager) → setAccount() */}
              <LookupInput width={300} value={f?.accountName ?? ''} disabled={off || locked} onOpen={() => setCodeOpen(true)} />
            </Field>
          </Row>
        </div>
        {/* ── 오른쪽 800 (layout02) ── */}
        <div style={{ width: 800, flexShrink: 0 }}>
          <Row>
            {isManager
              ? <Field label="승인자" width={350}><Input disabled value={f?.confirmerOrgName ?? ''} /></Field>
              : <div style={{ width: 350 }} />}
            <div style={{ width: 110 }} />
            <Field label="증빙자료" width={240}>
              <Button type="register" disabled={off} onClick={lookupFile}>{`증빙자료(${f?.fileCountStr ?? '0건'})`}</Button>
            </Field>
          </Row>
          <Row>
            <Field label="결의자" width={350}><Input disabled value={f?.apprEmpOrgName ?? ''} /></Field>
            <div style={{ width: 110 }} />
            <Field label="처리상태" width={240}><Input disabled value={f?.expenseStatusName ?? ''} /></Field>
          </Row>
          <Row>
            <Field label="반려사유" width={700}><Input disabled value={f?.rejectReason ?? ''} /></Field>
          </Row>
          <Row style={{ marginTop: 35, alignItems: 'flex-start' }}>
            <Field label="비고" width={700} style={{ alignItems: 'flex-start' }}>
              <Input.TextArea style={{ height: 92, resize: 'none' }} disabled={off || locked} value={f?.note ?? ''} onChange={e => set({ note: e.target.value })} />
            </Field>
          </Row>
        </div>
      </div>
      <div style={{ flex: 'none', textAlign: 'center', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
        {/* [E3] updateButton[저장] — 상신된 건이면 꺼진다 */}
        <Button type="save" disabled={off || locked} loading={saving} onClick={() => void update()}>저장</Button>
      </div>

      <Sys15_Lookup_Corp open={corpOpen} regYn onResult={c => void lookupCorpDone(c)} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={prePayCorpOpen} stdDate={dayjs(f?.occDate ?? undefined)} prePayOnly corpId={null}
        onResult={row => {
          setPrePayCorpOpen(false);
          if (row) set({ corpId: row.corpId, corpName: row.corpName, payAccountInfo: row.corpPayAccountInfo, astId: row.classTreeId, astName: row.classTreeName, payMethodName: '계좌이체', payMethodCode: '10' });
          else set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null });
        }}
        onClose={() => setPrePayCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={depositOpen} stdDate={dayjs(f?.occDate ?? undefined)} prePayOnly corpId={f?.corpId ?? null}
        onResult={row => {
          setDepositOpen(false);
          if (row) set({ depositId: row.classTreeId, depositName: row.classTreeName });
          else set({ depositId: null, depositName: null });
        }}
        onClose={() => setDepositOpen(false)} />
      <Sys17_Lookup_Account open={bankOpen} corpId={f?.corpId ?? null}
        onResult={a => { setBankOpen(false); set({ payAccountInfo: [a.bankName, a.accountNoDec, a.accountName].join(' ') }); }}
        onClose={() => setBankOpen(false)} />
      <Pay52_Lookup_AccountCode open={codeOpen} isManager={isManager}
        onResult={a => { setCodeOpen(false); set({ accountCode: a.accountCode, accountName: a.accountName }); }}
        onClose={() => setCodeOpen(false)} />
      <Pay50_Lookup_Content open={contentOpen} mode={f?.expenseApprStatusCode != null ? 'view' : 'edit'} content={f?.content} expenseId={model?.expenseId}
        onResult={html => { message.success('내역상세가 저장되었습니다.'); if (model) onChanged({ ...model, content: html }); }}
        onClose={() => setContentOpen(false)} />
    </div>
  );
};
