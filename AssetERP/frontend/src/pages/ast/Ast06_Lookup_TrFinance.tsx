/**
 * 거래등록/거래변경 편집창 — 금융상품 거래(3200대 매수·매도·상환·이자수령 …) (W06) — Ast06_Tab_TrFinance의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrFinance.java (974줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L159-173 / open() L175-244: 모달 750×820 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L673-784: 라벨 폭 130, 박스 5개
 *   (거래일자 · 거래유형 · 종목(자산구분) · 거래계좌(보관처)+계좌명 / 보유수량·장부금액 · 출고가능수량·매도제한일 / 거래수량·수수료 · 거래단가·거래세 · 거래금액
 *    / (경과)이자금액·법인세 · (보유)이자금액·지방세 / 결제금액·손익 · 결제구분 · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstHoldBook, AstTrCodeByWindow, AstTrCodeTreeNode, AstTrFinance } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Box, FieldRow, JournalNotice, LongInput, SettleMngField } from './Ast06_EditParts';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast09_Lookup_Book } from './Ast09_Lookup_Book';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 130;
const WINDOW_CLASS = 'Ast06_Tab_TrFinance';
/** bookIoType: 2 출고 · 3 입/출고 · 5 원장변경 · 8 해당없음(보유건 거래) — 보유자산에서 종목을 고른다 */
const BOOK_TYPES = ['2', '3', '5', '8'];

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrFinanceTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrFinance };

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
  holdQty: number | null;
  holdBookAmt: number | null;
  holdAcrIntAmt: number | null;
  lockUpDate: Dayjs | null;
  sellPossibleQty: number | null;
  qty: number | null;
  price: number | null;
  trAmt: number | null;
  fee: number | null;
  trTax: number | null;
  acrIntAmt: number | null;
  intAmt: number | null;
  corpTax: number | null;
  localTax: number | null;
  amt: number | null;
  pl: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  /** 01 수령 · 02 지급 — setSettleAmt()가 수수료·거래세를 빼는지 더하는지 정한다 */
  rcvPayType: string | null;
  /** null = 거래유형을 아직 안 골랐다 */
  bookYn: boolean | null;
}

/** openNew() L159-173: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trCode: '', trName: null, astClassTreeId: null, classTreeFullName: null, curCode: null, trUnit: 1,
  corpId: null, corpName: null, accountId: null, accountName: null, holdQty: null, holdBookAmt: null, holdAcrIntAmt: null, lockUpDate: null, sellPossibleQty: null,
  qty: null, price: null, trAmt: null, fee: null, trTax: null, acrIntAmt: null, intAmt: null, corpTax: null, localTax: null, amt: null, pl: null,
  settleMngYn: true, depositId: null, depositName: null, note: null, rcvPayType: null, bookYn: null,
});

/** open() L175-244 MODI: 값을 채우고 거래유형의 원장 입출고 구분으로 bookYn을 정한다. 매도제한일은 비운다(lockUpDate.setValue(null)), 보유 칸은 이 SQL이 안 읽어 비어 있다 */
const fromTr = (tr: AstTrFinance): Form => ({
  date: dayjs(tr.date), trCode: tr.trCode, trName: tr.trName, astClassTreeId: tr.astClassTreeId, classTreeFullName: tr.classTreeFullName,
  curCode: tr.curCode, trUnit: tr.trUnit ?? 1, corpId: tr.corpId, corpName: tr.corpName, accountId: tr.accountId, accountName: tr.accountName,
  holdQty: null, holdBookAmt: null, holdAcrIntAmt: null, lockUpDate: null, sellPossibleQty: null,
  qty: tr.qty, price: tr.price, trAmt: tr.trAmt, fee: tr.fee, trTax: tr.trTax, acrIntAmt: tr.acrIntAmt, intAmt: tr.intAmt, corpTax: tr.corpTax, localTax: tr.localTax,
  amt: tr.amt, pl: tr.pl, settleMngYn: tr.settleMngYn, depositId: tr.depositId, depositName: tr.depositName, note: tr.note,
  rcvPayType: tr.rcvPayCode, bookYn: BOOK_TYPES.includes(tr.bookIoType ?? ''),
});

/** setSettleAmt() L606-671: 3211 이자수령·3210 상환·3201 매도·3202 매도(RP/CMA)는 거래금액 + 이자 + 경과이자 − 세금, 3217 분배금재투자는 0, 그 밖은 거래금액 − 세금.
 *  수령(01)이면 거래세·수수료를 빼고 아니면 더한다. 거래유형이 없으면 "거래유형을 선택해주세요"(계산하지 않음) */
const withSettle = (f: Form): Form => {
  if (!f.trCode) { message.warning('거래유형을 선택해주세요'); return f; }
  const trAmt = f.trAmt ?? 0, trTax = f.trTax ?? 0, fee = f.fee ?? 0, acr = f.acrIntAmt ?? 0, int = f.intAmt ?? 0, corp = f.corpTax ?? 0, local = f.localTax ?? 0;
  let settle: number;
  if (['3211', '3210', '3201', '3202'].includes(f.trCode)) settle = trAmt + int + acr - (corp + local);
  else if (f.trCode === '3217') settle = 0;
  else settle = trAmt - (corp + local);
  settle = f.rcvPayType === '01' ? settle - (trTax + fee) : settle + (trTax + fee);
  return { ...f, amt: settle };
};

/** setTrAmt() L588-604: 거래금액 = (long)(수량(빈 값 0) × 단가(빈 값 1) ÷ 거래단위) → setSettleAmt() */
const withTrAmt = (f: Form): Form => withSettle({ ...f, trAmt: Math.trunc((f.qty ?? 0) * (f.price ?? 1) / f.trUnit) });

/** 소수 자리(최대 dec)까지 천 단위 쉼표 — AS-IS DoubleField의 setFormat("#,###" / "#,###.######") */
const fmtNum = (v: string | number | undefined, dec: number): string => {
  if (v == null || v === '') return '';
  const [int, frac] = String(v).split('.');
  const head = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac != null && dec > 0 ? `${head}.${frac.slice(0, dec)}` : head;
};

const DoubleInput: React.FC<{ value: number | null; dec: number; disabled?: boolean; onChange?: (v: number | null) => void }> = ({ value, dec, disabled, onChange }) => (
  <InputNumber style={{ width: '100%' }} controls={false} disabled={disabled} value={value ?? null}
    formatter={v => fmtNum(v, dec)}
    parser={v => Number((v ?? '').replace(/,/g, ''))}
    onChange={v => onChange?.(v == null || Number.isNaN(Number(v)) ? null : Number(v))} />
);

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrFinanceTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrFinance, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrFinance: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L155-157, open L175-244) → editDriver.edit(trModel), setting()
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // setFieldInit() L499-513: 종목·보관처·계좌·보유 칸·경과이자를 비우고 거래단위 1
  const fieldInit: Partial<Form> = {
    astClassTreeId: null, classTreeFullName: null, corpId: null, corpName: null, accountId: null, accountName: null,
    holdQty: null, holdBookAmt: null, holdAcrIntAmt: null, lockUpDate: null, sellPossibleQty: null, acrIntAmt: null, trUnit: 1,
  };

  // [E2] trName[거래유형].TriggerClick (L311) → setFieldInit(), Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrFinance", null, …)
  const openTrCode = () => {
    set(fieldInit);
    setTrCodeOpen(true);
  };
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    if (!row) return;
    // 거래유형의 원장 입출고 구분(2 출고·3 입/출고·5 원장변경·8 해당없음)이면 bookYn, 이때 경과이자 칸은 막는다
    set({ trCode: row.trCode, trName: row.trName, rcvPayType: row.rcvPayCode, bookYn: BOOK_TYPES.includes(row.bookIoType ?? '') });
  };

  // [E3] classTreeFullName.TriggerClick [bookYn == null] (L341) — 거래유형을 안 골랐으면 "거래유형을 선택해주세요.", bookYn이면 Ast09_Lookup_Book, 아니면 Ast01_Lookup_Info.gridInsert("1", trCode, "1")
  const openClass = () => {
    if (f.bookYn == null) { message.warning('거래유형을 선택해주세요.'); return; }
    if (f.bookYn) setBookOpen(true); else setInfoOpen(true);
  };
  const onBookResult = (b: AstHoldBook) => {
    setBookOpen(false);
    setF(prev => prev && ({
      ...prev,
      astClassTreeId: b.astClassTreeId, classTreeFullName: b.astClassTreeName, corpId: b.corpId, corpName: b.corpName,
      accountId: b.keepAccountId, accountName: b.keepAccountName, holdQty: b.holdQty, holdBookAmt: b.bookAmt, holdAcrIntAmt: b.acrIntAmt,
      lockUpDate: b.lockUpDate ? dayjs(b.lockUpDate) : null, sellPossibleQty: b.sellPossibleQty, trUnit: b.astTrUnit ?? 1, curCode: b.curCode,
      // 3211 금융상품 이자수령이면 보유 경과이자를 경과이자 칸에 넣는다
      acrIntAmt: prev.trCode === '3211' ? b.acrIntAmt : prev.acrIntAmt,
    }));
  };
  const onInfoResult = async (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    if (!node) return;
    set({ astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName, curCode: node.curCode });
    try {
      // 거래단위가져오기: ast.Ast01_ClassTree.selectById (없으면 1)
      const item = await astApi.getClassTree(node.classTreeId);
      set({ trUnit: item.trUnit == null || item.trUnit === '' ? 1 : Number(item.trUnit) });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E5] corpName[거래계좌(보관처)].TriggerClick [result == null] (L447) → Ast01_Lookup_CorpAccount.open(일자, "NOT")
  const onCorpResult = (acc: { classTreeId: number; classTreeName: string | null; corpId: number | null; corpName: string | null } | null) => {
    setCorpOpen(false);
    set(acc
      ? { accountId: acc.classTreeId, accountName: acc.classTreeName, corpId: acc.corpId, corpName: acc.corpName }
      : { accountId: null, accountName: null, corpId: null, corpName: null });
  };

  // success() L924-946: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
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

  // [E7] journalButton[분개재생성].Select (L477) → createJournal() L899-922: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E6] updateButton[저장].Select (L471) → preUpdate() L786-847 → preUpdate2() L849-874 → update() L876-897
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.astClassTreeId == null) return message.warning('종목(자산구분)은 필수선택 항목입니다.');
    if (f.corpId == null) return message.warning('거래처는 필수선택 항목입니다.');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    // preUpdate2(): 보유경과이자가 있으면 경과이자를 보유수량 대비 거래수량으로 안분한다((long)(보유경과이자 ÷ 보유수량 × 거래수량))
    let acrIntAmt = f.acrIntAmt;
    if (f.holdAcrIntAmt != null && f.qty != null && f.holdQty) acrIntAmt = Math.trunc(f.holdAcrIntAmt / f.holdQty * f.qty);
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.updateFinance)은 서버가 한 트랜잭션으로 한다
      const trId = await astApi.saveTrFinance({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, astClassTreeId: f.astClassTreeId, corpId: f.corpId,
        depositId: f.depositId, settleMngYn: f.settleMngYn, amt: f.amt, fee: f.fee, note: f.note, curCode: f.curCode, accountId: f.accountId,
        qty: f.qty, price: f.price, trAmt: f.trAmt, lockUpPeriodCode: null,
        lockUpDate: f.lockUpDate ? f.lockUpDate.format(FORMAT) : null, listDate: null,
        detail: true, trTax: f.trTax, corpTax: f.corpTax, localTax: f.localTax, intAmt: f.intAmt, acrIntAmt,
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
              {/* [E8] closeButton[닫기].Select ["NEW".equals(actionName)] (L483) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
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
            <FieldRow label="종목(자산구분)" labelWidth={LABEL} width="75%">
              <LookupInput value={f.classTreeFullName ?? ''} width={450} disabled={modi} onOpen={openClass} />
            </FieldRow>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <FieldRow label="거래계좌(보관처)" labelWidth={LABEL} width="55%">
                <LookupInput value={f.corpName ?? ''} width={240} disabled={modi} onOpen={() => setCorpOpen(true)} />
              </FieldRow>
              <Input readOnly disabled style={{ width: '36%' }} value={f.accountName ?? ''} />
            </div>
          </Box>
          <Box>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="보유수량" labelWidth={LABEL} width="50%"><DoubleInput value={f.holdQty} dec={0} disabled /></FieldRow>
              <FieldRow label="장부금액" labelWidth={LABEL - 40} width="50%"><LongInput value={f.holdBookAmt} disabled onChange={() => undefined} /></FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="출고가능수량" labelWidth={LABEL} width="50%"><DoubleInput value={f.sellPossibleQty} dec={0} disabled /></FieldRow>
              <FieldRow label="매도제한일" labelWidth={LABEL - 40} width="50%">
                <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.lockUpDate} disabled />
              </FieldRow>
            </div>
          </Box>
          <Box>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* [E9] qty[거래수량].ValueChange (L517) · [E10] price[거래단가].ValueChange (L524) → setTrAmt() */}
              <FieldRow label="거래수량" labelWidth={LABEL} width="50%">
                <DoubleInput value={f.qty} dec={0} disabled={modi} onChange={v => setF(p => p && withTrAmt({ ...p, qty: v }))} />
              </FieldRow>
              {/* [E13] fee[수수료].ValueChange (L545) → setSettleAmt() */}
              <FieldRow label="수수료" labelWidth={LABEL - 40} width="50%">
                <LongInput value={f.fee} onChange={v => setF(p => p && withSettle({ ...p, fee: v }))} />
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="거래단가" labelWidth={LABEL} width="50%">
                <DoubleInput value={f.price} dec={6} onChange={v => setF(p => p && withTrAmt({ ...p, price: v }))} />
              </FieldRow>
              {/* [E12] trTax[거래세].ValueChange (L538) → setSettleAmt() */}
              <FieldRow label="거래세" labelWidth={LABEL - 40} width="50%">
                <LongInput value={f.trTax} onChange={v => setF(p => p && withSettle({ ...p, trTax: v }))} />
              </FieldRow>
            </div>
            {/* [E11] trAmt[거래금액].ValueChange (L531) → setSettleAmt() */}
            <FieldRow label="거래금액" labelWidth={LABEL} width="50%">
              <LongInput value={f.trAmt} onChange={v => setF(p => p && withSettle({ ...p, trAmt: v }))} />
            </FieldRow>
          </Box>
          <Box>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* [E14] acrIntAmt.ValueChange (L559) → setSettleAmt(), 원장 입출고 거래유형이면 칸을 막는다 */}
              <FieldRow label="(경과)이자금액" labelWidth={LABEL} width="50%">
                <LongInput value={f.acrIntAmt} disabled={f.bookYn === true} onChange={v => setF(p => p && withSettle({ ...p, acrIntAmt: v }))} />
              </FieldRow>
              {/* [E16] corpTax[법인세].ValueChange (L573) → setSettleAmt() */}
              <FieldRow label="법인세" labelWidth={LABEL - 40} width="50%">
                <LongInput value={f.corpTax} onChange={v => setF(p => p && withSettle({ ...p, corpTax: v }))} />
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* [E15] intAmt.ValueChange (L566) → setSettleAmt() */}
              <FieldRow label="(보유)이자금액" labelWidth={LABEL} width="50%">
                <LongInput value={f.intAmt} onChange={v => setF(p => p && withSettle({ ...p, intAmt: v }))} />
              </FieldRow>
              {/* [E17] localTax[지방세].ValueChange (L580) → setSettleAmt() */}
              <FieldRow label="지방세" labelWidth={LABEL - 40} width="50%">
                <LongInput value={f.localTax} onChange={v => setF(p => p && withSettle({ ...p, localTax: v }))} />
              </FieldRow>
            </div>
          </Box>
          <Box>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="결제금액" labelWidth={LABEL} width="50%"><LongInput value={f.amt} onChange={v => set({ amt: v })} /></FieldRow>
              <FieldRow label="손익" labelWidth={LABEL - 40} width="50%"><LongInput value={f.pl} disabled onChange={() => undefined} /></FieldRow>
            </div>
            {/* [E1] settleMngToggleGroup.ValueChange (L294), [E4] depositName.TriggerClick [result == null] (L425) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
            <FieldRow label="결제구분" labelWidth={LABEL}>
              <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
            </FieldRow>
            <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
          </Box>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Ast09_Lookup_Book open={bookOpen} holdDate={f.date ?? dayjs()} abroType="1" onResult={onBookResult} onClose={() => setBookOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" trCode={f.trCode} abroType="1" onResult={node => void onInfoResult(node)} onClose={() => setInfoOpen(false)} />
      <Ast01_Lookup_CorpAccount open={corpOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
    </>
  );
};
