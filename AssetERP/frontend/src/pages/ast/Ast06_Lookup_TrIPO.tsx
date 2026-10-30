/**
 * 거래등록/거래변경 편집창 — 공모주 청약(3500 기관청약·3501·3503 일반청약입고·3511 채권청약입고 …) (W05) — Ast06_Tab_TrIPO의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrIPO.java (883줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L136-150 / open() L152-209: 모달 750×650 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L583-674: 라벨 폭 130, 박스 3개
 *   (거래일자 · 거래유형 · 종목(자산구분)+[종목 생성하기] · 보관계좌+계좌명 / 청약수량·공모단가·청약금액·청약수수료·결제금액 | 상장일자·보유의무확약·매도제한일 / 결제구분 · 적요) + 분개 안내(MODI만),
 *   아래 가운데 [저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AstTrCodeByWindow, AstTrCodeTreeNode, AstTrFinance } from '@/types/ast';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Box, FieldRow, JournalNotice, LongInput, SettleMngField } from './Ast06_EditParts';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast06_Lookup_CreateIpoAstClass } from './Ast06_Lookup_CreateIpoAstClass';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 130;
/** 3503 일반청약입고 · 3511 채권청약입고 — 상장일자 기본값, 수수료 막힘 */
const IN_CODES = ['3503', '3511'];
/** 3500 기관청약 포함 — 보유의무확약 기본 미확약(00)을 넣는 거래유형 */
const LOCKUP_CODES = ['3503', '3500', '3511'];

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrIpoTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrFinance };

interface Form {
  date: Dayjs | null;
  trCode: string;
  trName: string | null;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  curCode: string | null;
  trUnit: number;
  corpId: number | null;
  corpName: string | null;
  accountId: number | null;
  accountName: string | null;
  qty: number | null;
  price: number | null;
  trAmt: number | null;
  fee: number | null;
  amt: number | null;
  listDate: Dayjs | null;
  lockUpPeriodCode: string | null;
  lockUpDate: Dayjs | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
}

/** openNew() L136-150: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trCode: '', trName: null, astClassTreeId: null, classTreeFullName: null, curCode: null, trUnit: 1,
  corpId: null, corpName: null, accountId: null, accountName: null, qty: null, price: null, trAmt: null, fee: null, amt: null,
  listDate: null, lockUpPeriodCode: null, lockUpDate: null, settleMngYn: true, depositId: null, depositName: null, note: null,
});

const fromTr = (tr: AstTrFinance): Form => ({
  date: dayjs(tr.date), trCode: tr.trCode, trName: tr.trName, astClassTreeId: tr.astClassTreeId, classTreeFullName: tr.classTreeFullName,
  curCode: tr.curCode, trUnit: tr.trUnit ?? 1, corpId: tr.corpId, corpName: tr.corpName, accountId: tr.accountId, accountName: tr.accountName,
  qty: tr.qty, price: tr.price, trAmt: tr.trAmt, fee: tr.fee, amt: tr.amt,
  listDate: tr.listDate ? dayjs(tr.listDate) : null, lockUpPeriodCode: tr.lockUpPeriodCode, lockUpDate: tr.lockUpDate ? dayjs(tr.lockUpDate) : null,
  settleMngYn: tr.settleMngYn, depositId: tr.depositId, depositName: tr.depositName, note: tr.note,
});

/** setSettleAmt() L568-581: 결제금액 = 청약금액 + 청약수수료 (빈 값은 0) */
const withSettle = (f: Form): Form => ({ ...f, amt: (f.trAmt ?? 0) + (f.fee ?? 0) });

/** setTrAmt() L550-566: 청약금액 = (long)(수량(빈 값 0) × 단가(빈 값 1) ÷ 거래단위) → setSettleAmt() */
const withTrAmt = (f: Form): Form => withSettle({ ...f, trAmt: Math.trunc((f.qty ?? 0) * (f.price ?? 1) / f.trUnit) });

/** 소수 자리(최대 dec)까지 천 단위 쉼표 — AS-IS DoubleField의 setFormat("#,###" / "#,###.######") */
const fmtNum = (v: string | number | undefined, dec: number): string => {
  if (v == null || v === '') return '';
  const [int, frac] = String(v).split('.');
  const head = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac != null && dec > 0 ? `${head}.${frac.slice(0, dec)}` : head;
};

const DoubleInput: React.FC<{ value: number | null; dec: number; disabled?: boolean; onChange: (v: number | null) => void }> = ({ value, dec, disabled, onChange }) => (
  <InputNumber style={{ width: '100%' }} controls={false} disabled={disabled} value={value ?? null}
    formatter={v => fmtNum(v, dec)}
    parser={v => Number((v ?? '').replace(/,/g, ''))}
    onChange={v => onChange(v == null || Number.isNaN(Number(v)) ? null : Number(v))} />
);

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrIpoTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrFinance, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrIPO: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  /** setLockUpDate()/setEnable()가 켜고 끄는 매도제한일 칸 */
  const [lockDateEnabled, setLockDateEnabled] = useState(true);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  /** setEnable() L676-718이 거래유형으로 정하는 칸 막힘. 거래유형이 아직 없으면(NEW 처음) 모두 열려 있다 */
  const code = f?.trCode ?? '';
  const noType = code === '';
  const lockType = LOCKUP_CODES.includes(code);
  const qtyEnabled = noType || lockType;
  const feeEnabled = noType || code === '3500' || !(IN_CODES.includes(code));
  const listEnabled = noType || lockType;
  const makeVisible = noType ? !modi : (code === '3500' || code === '3501');

  // [E0] 화면 열림 (open L152-209) → editDriver.edit(trModel), setting(). MODI는 setEnable(trCode)까지
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    const init = target.mode === 'NEW' ? newForm() : fromTr(target.tr);
    setF(init);
    setLockDateEnabled(target.mode === 'NEW' ? true : lockEnabledFor(init.trCode, init.lockUpPeriodCode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  /** setEnable()의 매도제한일 칸: 청약 거래유형이면 미확약(00)만 막고, 그 밖의 거래유형은 항상 막는다 */
  const lockEnabledFor = (trCode: string, period: string | null) => (LOCKUP_CODES.includes(trCode) ? period !== '00' : false);

  // setLockUpDate() L497-548: 상장일자 + 확약기간 → 매도제한일(영업일이 아니면 다음 영업일). 90 직접입력은 그대로, 미확약·없음은 칸을 막고 비운다
  const setLockUpDate = useCallback(async (listDate: Dayjs | null, period: string | null) => {
    setLockDateEnabled(true);
    let calc: Dayjs | null = null;
    if (period === '10') calc = listDate?.add(14, 'day') ?? null;
    else if (period === '20') calc = listDate?.add(1, 'month').subtract(1, 'day') ?? null;
    else if (period === '21') calc = listDate?.add(29, 'day') ?? null;
    else if (period === '30') calc = listDate?.add(3, 'month').subtract(1, 'day') ?? null;
    else if (period === '40') calc = listDate?.add(6, 'month').subtract(1, 'day') ?? null;
    else if (period === '90') calc = null;
    else {
      setLockDateEnabled(false);
      setF(prev => prev && { ...prev, lockUpDate: null });
      return;
    }
    if (calc == null) return;
    try {
      const biz = await sysApi.getBizDate(calc.format(FORMAT), '+0');
      setF(prev => prev && { ...prev, lockUpDate: dayjs(biz) });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // [E2] trName[거래유형].TriggerClick (L251) → setFieldInit() L442-450, Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrIPO", null, …) → setEnable()
  const openTrCode = () => {
    set({ astClassTreeId: null, classTreeFullName: null, corpId: null, corpName: null, accountId: null, accountName: null, trUnit: 1 });
    setTrCodeOpen(true);
  };
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    if (!row) return;
    const c = row.trCode;
    const lock = LOCKUP_CODES.includes(c);
    set({
      trCode: c, trName: row.trName,
      // 주식청약입고(3503)·채권청약입고(3511)는 상장일자 기본값, 주식청약입고·기관청약(3500)·채권청약입고는 보유의무확약 기본 미확약(00)
      listDate: IN_CODES.includes(c) ? f.date : null,
      lockUpPeriodCode: lock ? '00' : null, lockUpDate: null,
    });
    setLockDateEnabled(lockEnabledFor(c, lock ? '00' : null));
  };

  // [E3] classTreeFullName.TriggerClick (L292) → Ast01_Lookup_Info.gridInsert("1", trCode, "1", …): 고르면 종목·통화 + 거래단위(ast.Ast01_ClassTree.selectById, 없으면 1)
  const openInfo = () => {
    if (!f.trCode) { message.warning('거래유형을 선택해주세요'); return; }
    setInfoOpen(true);
  };
  const onInfoResult = async (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    if (!node) return;
    set({ astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName, curCode: node.curCode });
    try {
      const item = await astApi.getClassTree(node.classTreeId);
      set({ trUnit: item.trUnit == null || item.trUnit === '' ? 1 : Number(item.trUnit) });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] makeAst.Click (L332) → Ast06_Lookup_CreateIpoAstClass.open(…): 만든 종목을 종목 칸에 넣는다
  const openCreate = () => {
    if (!f.trCode) { message.warning('거래유형을 선택해주세요'); return; }
    setCreateOpen(true);
  };

  // [E6] corpName[보관계좌].TriggerClick [result == null] (L390) → Ast01_Lookup_CorpAccount.open(일자, "NOT")
  const onCorpResult = (acc: { classTreeId: number; classTreeName: string | null; corpId: number | null; corpName: string | null } | null) => {
    setCorpOpen(false);
    set(acc
      ? { accountId: acc.classTreeId, accountName: acc.classTreeName, corpId: acc.corpId, corpName: acc.corpName }
      : { accountId: null, accountName: null, corpId: null, corpName: null });
  };

  // success() L833-855: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
  const success = async (trId: number) => {
    if (f.date) void astApi.cleanDepositBook(f.date.format(FORMAT)).catch(() => undefined);
    const saved = await astApi.getTrFinance(trId);
    if (!modi) {
      message.success('저장이 완료되었습니다.');
      onChanged(saved, true);
      onClose();
    } else {
      onChanged(saved, false);
      message.success('분개생성이 완료되었습니다.');
    }
  };

  // [E8] journalButton[분개재생성].Select (L420) → createJournal() L808-831: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E7] updateButton[저장].Select (L414) → preUpdate() L720-783 → update() L785-806
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.astClassTreeId == null) return message.warning('종목(자산구분)은 필수선택 항목입니다.');
    if (f.corpId == null) return message.warning('거래처 계좌는 필수선택 항목입니다.');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    if (LOCKUP_CODES.includes(f.trCode)) {
      if (!f.listDate) return message.warning('상장일자는 필수입력 항목입니다');
      if (f.lockUpPeriodCode !== '00' && !f.lockUpDate) return message.warning('보유의무확약이 미확약이 아닌경우 매도제한일은 필수입력 항목입니다.');
    }
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.updateFinance)은 서버가 한 트랜잭션으로 한다
      const trId = await astApi.saveTrFinance({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, astClassTreeId: f.astClassTreeId, corpId: f.corpId,
        depositId: f.depositId, settleMngYn: f.settleMngYn, amt: f.amt, fee: f.fee, note: f.note, curCode: f.curCode, accountId: f.accountId,
        qty: f.qty, price: f.price, trAmt: f.trAmt, lockUpPeriodCode: f.lockUpPeriodCode,
        lockUpDate: f.lockUpDate ? f.lockUpDate.format(FORMAT) : null, listDate: f.listDate ? f.listDate.format(FORMAT) : null,
      });
      savedId.current = trId;
      if (!modi) {
        await createJournal(trId);  // 최초 등록인 경우 분개 자동생성
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(await astApi.getTrFinance(trId), false);
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open
        title={modi ? '거래변경' : '거래등록'}
        width={780}
        maskClosable={false}
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {modi && <Button type="generate" onClick={() => createJournal(savedId.current ?? tr!.trId)}>분개재생성</Button>}
              {/* [E9] closeButton[닫기].Select ["NEW".equals(actionName)] (L426) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Box>
            <div style={{ display: 'flex' }}>
              <FieldRow label="거래일자" labelWidth={LABEL} width="50%">
                <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} value={f.date} disabled={modi} onChange={d => d && set({ date: d })} />
              </FieldRow>
            </div>
            <FieldRow label="거래유형" labelWidth={LABEL} width="75%">
              <LookupInput value={f.trName ?? ''} width={450} disabled={modi} onOpen={openTrCode} />
            </FieldRow>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FieldRow label="종목(자산구분)" labelWidth={LABEL} width="75%">
                <LookupInput value={f.classTreeFullName ?? ''} width={450} disabled={modi} onOpen={openInfo} />
              </FieldRow>
              {makeVisible && (
                <a style={{ lineHeight: '32px', fontSize: 13, fontWeight: 'bold', color: '#0078D7', whiteSpace: 'nowrap' }} onClick={openCreate}>종목 생성하기</a>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <FieldRow label="보관계좌" labelWidth={LABEL} width="55%">
                <LookupInput value={f.corpName ?? ''} width={240} disabled={modi} onOpen={() => setCorpOpen(true)} />
              </FieldRow>
              <Input readOnly style={{ width: '36%' }} value={f.accountName ?? ''} />
            </div>
          </Box>
          <Box>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '55%' }}>
                {/* [E10] qty[청약수량].ValueChange (L454) · [E11] price[공모단가].ValueChange (L461) → setTrAmt() */}
                <FieldRow label="청약수량" labelWidth={LABEL}>
                  <DoubleInput value={f.qty} dec={0} disabled={!qtyEnabled} onChange={v => setF(p => p && withTrAmt({ ...p, qty: v }))} />
                </FieldRow>
                <FieldRow label="공모단가" labelWidth={LABEL}>
                  <DoubleInput value={f.price} dec={6} disabled={!qtyEnabled} onChange={v => setF(p => p && withTrAmt({ ...p, price: v }))} />
                </FieldRow>
                {/* [E12] trAmt[청약금액].ValueChange (L468) · [E13] fee[청약수수료].ValueChange (L475) → setSettleAmt() */}
                <FieldRow label="청약금액" labelWidth={LABEL}>
                  <LongInput value={f.trAmt} onChange={v => setF(p => p && withSettle({ ...p, trAmt: v }))} />
                </FieldRow>
                <FieldRow label="청약수수료" labelWidth={LABEL}>
                  <LongInput value={f.fee} disabled={!feeEnabled} onChange={v => setF(p => p && withSettle({ ...p, fee: v }))} />
                </FieldRow>
                <FieldRow label="결제금액" labelWidth={LABEL}>
                  <LongInput value={f.amt} onChange={v => set({ amt: v })} />
                </FieldRow>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '45%' }}>
                {/* [E15] listDate[상장일자].ValueChange (L489) → setLockUpDate() */}
                <FieldRow label="상장일자" labelWidth={LABEL - 40}>
                  <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.listDate} disabled={!listEnabled}
                    onChange={d => { set({ listDate: d }); void setLockUpDate(d, f.lockUpPeriodCode); }} />
                </FieldRow>
                {/* [E14] lockUpPeriodName[보유의무확약].Collapse (L482) → setLockUpDate() */}
                <FieldRow label="보유의무확약" labelWidth={LABEL - 40}>
                  <SystemCodeComboBox kindCd="LockUpPeriodCode" style={{ width: '100%' }} disabled={!listEnabled} allowClear
                    value={f.lockUpPeriodCode ?? undefined}
                    onChange={c => { set({ lockUpPeriodCode: c ?? null }); void setLockUpDate(f.listDate, c ?? null); }} />
                </FieldRow>
                <FieldRow label="매도제한일" labelWidth={LABEL - 40}>
                  <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.lockUpDate} disabled={!lockDateEnabled} onChange={d => set({ lockUpDate: d })} />
                </FieldRow>
              </div>
            </div>
          </Box>
          <Box>
            {/* [E1] settleMngToggleGroup.ValueChange (L234), [E5] depositName.TriggerClick [result == null] (L368) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
            <FieldRow label="결제구분" labelWidth={LABEL}>
              <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
            </FieldRow>
            <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
          </Box>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName="Ast06_Tab_TrIPO" onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" trCode={f.trCode} abroType="1" onResult={node => void onInfoResult(node)} onClose={() => setInfoOpen(false)} />
      <Ast06_Lookup_CreateIpoAstClass open={createOpen}
        onCreated={item => { setCreateOpen(false); set({ astClassTreeId: item.classTreeId, classTreeFullName: item.classTreeFullName ?? null, curCode: item.curCode ?? null, trUnit: item.trUnit ? Number(item.trUnit) : 1 }); }}
        onClose={() => setCreateOpen(false)} />
      <Ast01_Lookup_CorpAccount open={corpOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
    </>
  );
};
