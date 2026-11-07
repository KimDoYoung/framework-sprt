/**
 * 거래등록/거래변경 편집창 — 금융상품 거래(외화, 해외자산) (W07) — Ast06_Tab_TrForFinance의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrForFinance.java (815줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L140-154 / open() L156-222: 모달 750×710 "해외자산 거래등록"(NEW)·"해외자산 거래변경"(MODI), getEditor() L557-658: 라벨 폭 130, 박스 4개
 *   (거래일자 · 거래유형 · 종목(자산구분) · 거래계좌(보관처)+계좌명 / 보유수량·외화 장부금액 · 출고가능수량·원화 장부금액
 *    / 거래수량·적용통화/환율 · 거래단가·원화 거래금액 · 외화 거래금액·수수료 / 결제금액 · 결제구분(예금계좌 콤보) · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Radio, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstForeignDeposit, AstHoldBook, AstTrCodeByWindow, AstTrCodeTreeNode, AstTrFinance } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Box, DoubleInput, FieldRow, JournalNotice, LongInput } from './Ast06_EditParts';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast09_Lookup_Book } from './Ast09_Lookup_Book';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 130;
const LABEL2 = 100;
const WINDOW_CLASS = 'Ast06_Tab_TrForFinance';
/** bookIoType: 2 출고 · 3 입/출고 · 5 원장변경 · 8 해당없음(보유건 거래) — 보유자산에서 종목을 고른다 */
const BOOK_TYPES = ['2', '3', '5', '8'];

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrForFinanceTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrFinance };

interface Form {
  date: Dayjs | null;
  trCode: string;
  trName: string | null;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  curCode: string | null;
  fxRate: number | null;
  trUnit: number;
  corpId: number | null;
  corpName: string | null;
  accountId: number | null;
  accountName: string | null;
  holdQty: number | null;
  holdForBookAmt: number | null;
  holdBookAmt: number | null;
  sellPossibleQty: number | null;
  qty: number | null;
  price: number | null;
  forTrAmt: number | null;
  trAmt: number | null;
  fee: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  /** 01 수령 · 02 지급 — setSettleAmt()가 수수료를 빼는지 더하는지 정한다 */
  rcvPayType: string | null;
  /** null = 거래유형을 아직 안 골랐다 */
  bookYn: boolean | null;
}

/** openNew() L140-154: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trCode: '', trName: null, astClassTreeId: null, classTreeFullName: null, curCode: null, fxRate: null, trUnit: 1,
  corpId: null, corpName: null, accountId: null, accountName: null, holdQty: null, holdForBookAmt: null, holdBookAmt: null, sellPossibleQty: null,
  qty: null, price: null, forTrAmt: null, trAmt: null, fee: null, amt: null,
  settleMngYn: true, depositId: null, depositName: null, note: null, rcvPayType: null, bookYn: null,
});

/** open() L156-222 MODI: 값을 채우고 거래유형의 원장 입출고 구분으로 bookYn을 정한다. 보유 칸은 이 SQL이 안 읽어 비어 있다 */
const fromTr = (tr: AstTrFinance): Form => ({
  date: dayjs(tr.date), trCode: tr.trCode, trName: tr.trName, astClassTreeId: tr.astClassTreeId, classTreeFullName: tr.classTreeFullName,
  curCode: tr.curCode, fxRate: tr.fxRate, trUnit: tr.trUnit ?? 1, corpId: tr.corpId, corpName: tr.corpName, accountId: tr.accountId, accountName: tr.accountName,
  holdQty: null, holdForBookAmt: null, holdBookAmt: null, sellPossibleQty: null,
  qty: tr.qty, price: tr.price, forTrAmt: tr.forTrAmt, trAmt: tr.trAmt, fee: tr.fee,
  amt: tr.amt, settleMngYn: tr.settleMngYn, depositId: tr.depositId, depositName: tr.depositName, note: tr.note,
  rcvPayType: tr.rcvPayCode, bookYn: BOOK_TYPES.includes(tr.bookIoType ?? ''),
});

/** setSettleAmt() L530-555: 거래유형이 없으면 "거래유형을 선택해주세요"(계산하지 않음), 수령(01)이면 거래금액 − 수수료, 아니면 거래금액 + 수수료 */
const withSettle = (f: Form): Form => {
  if (!f.rcvPayType) { message.warning('거래유형을 선택해주세요'); return f; }
  const trAmt = f.trAmt ?? 0, fee = f.fee ?? 0;
  return { ...f, amt: f.rcvPayType === '01' ? trAmt - fee : trAmt + fee };
};

/** setTrAmt() L513-528: 원화 거래금액 = (long)(외화 거래금액(빈 값 0) × 적용환율(빈 값 0)) → setSettleAmt() */
const withTrAmt = (f: Form): Form => withSettle({ ...f, trAmt: Math.trunc((f.forTrAmt ?? 0) * (f.fxRate ?? 0)) });

/** setForTrAmt() L495-511: 외화 거래금액 = 수량(빈 값 0) × 단가(빈 값 1) ÷ 거래단위 → setTrAmt() */
const withForTrAmt = (f: Form): Form => withTrAmt({ ...f, forTrAmt: (f.qty ?? 0) * (f.price ?? 1) / f.trUnit });

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrForFinanceTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrFinance, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrForFinance: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [deposits, setDeposits] = useState<AstForeignDeposit[]>([]);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L136-138, open L156-222) → editDriver.edit(trModel), setting()
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
    // setting() L224-436: depositName = CommonComboBoxField("sys.Sys00_Common.selectForDeposit")
    astApi.getForeignDeposits().then(setDeposits).catch(() => setDeposits([]));
  }, [target]);

  /** 콤보 목록에 현재 값이 없으면(예: 사용 중지된 계좌) 이름으로라도 보이게 끼워 넣는다 */
  const depositOptions = useMemo(() => {
    const opts = deposits.map(d => ({ value: d.codeId, label: d.name ?? '' }));
    if (f?.depositId != null && !opts.some(o => o.value === f.depositId)) opts.unshift({ value: f.depositId, label: f.depositName ?? String(f.depositId) });
    return opts;
  }, [deposits, f?.depositId, f?.depositName]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // setFieldInit() L438-450: 종목·보관처·계좌·보유 칸을 비우고 거래단위 1
  const fieldInit: Partial<Form> = {
    astClassTreeId: null, classTreeFullName: null, corpId: null, corpName: null, accountId: null, accountName: null,
    holdQty: null, holdBookAmt: null, holdForBookAmt: null, sellPossibleQty: null, trUnit: 1,
  };

  // [E2] trName[거래유형].TriggerClick (L277) → setFieldInit(), Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrForFinance", null, …)
  const openTrCode = () => {
    set(fieldInit);
    setTrCodeOpen(true);
  };
  const onTrCodeResult = (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    if (!row) return;
    // 거래유형의 원장 입출고 구분(2 출고·3 입/출고·5 원장변경·8 해당없음)이면 bookYn
    set({ trCode: row.trCode, trName: row.trName, rcvPayType: row.rcvPayCode, bookYn: BOOK_TYPES.includes(row.bookIoType ?? '') });
  };

  // [E3] classTreeFullName.TriggerClick [bookYn == null] (L305) — 거래유형을 안 골랐으면 "거래유형을 선택해주세요.", bookYn이면 Ast09_Lookup_Book("2"), 아니면 Ast01_Lookup_Info.gridInsert("1", trCode, "2")
  const openClass = () => {
    if (f.bookYn == null) { message.warning('거래유형을 선택해주세요.'); return; }
    if (f.bookYn) setBookOpen(true); else setInfoOpen(true);
  };
  const onBookResult = (b: AstHoldBook | null) => {
    setBookOpen(false);
    if (!b) { set(fieldInit); return; }  // result == null → setFieldInit()
    set({
      astClassTreeId: b.astClassTreeId, classTreeFullName: b.astClassTreeName, corpId: b.corpId, corpName: b.corpName,
      accountId: b.keepAccountId, accountName: b.keepAccountName, holdQty: b.holdQty, holdBookAmt: b.bookAmt, holdForBookAmt: b.forBookAmt,
      sellPossibleQty: b.sellPossibleQty, trUnit: b.astTrUnit ?? 1, curCode: b.curCode,
    });
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

  // [E5] corpName[거래계좌(보관처)].TriggerClick [result == null] (L386) → Ast01_Lookup_CorpAccount.open(일자, "NOT")
  const onCorpResult = (acc: { classTreeId: number; classTreeName: string | null; corpId: number | null; corpName: string | null } | null) => {
    setCorpOpen(false);
    set(acc
      ? { accountId: acc.classTreeId, accountName: acc.classTreeName, corpId: acc.corpId, corpName: acc.corpName }
      : { accountId: null, accountName: null, corpId: null, corpName: null });
  };

  // success() L766-787: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
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

  // [E7] journalButton[분개재생성].Select (L416) → createJournal() L741-764: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E6] updateButton[저장].Select (L410) → preUpdate() L660-698 → preUpdate2() L700-717 → update() L719-739
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.astClassTreeId == null) return message.warning('종목(자산구분)은 필수선택 항목입니다.');
    if (f.corpId == null) return message.warning('거래처는 필수선택 항목입니다.');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    if (f.curCode == null || f.curCode === '') return message.warning('적용통화는 필수선택 항목입니다');
    if (f.fxRate == null) return message.warning('적용환율은 필수입력 항목입니다');
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.updateFinance)은 서버가 한 트랜잭션으로 한다.
      // 이 창에 없는 매도제한·상장 값은 열 때 받은 행의 값을 그대로 돌려준다
      const trId = await astApi.saveTrFinance({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, astClassTreeId: f.astClassTreeId, corpId: f.corpId,
        depositId: f.depositId, settleMngYn: f.settleMngYn, amt: f.amt, fee: f.fee, note: f.note, curCode: f.curCode, accountId: f.accountId,
        qty: f.qty, price: f.price, trAmt: f.trAmt, lockUpPeriodCode: tr?.lockUpPeriodCode ?? null,
        lockUpDate: tr?.lockUpDate ?? null, listDate: tr?.listDate ?? null,
        foreign: true, fxRate: f.fxRate, forTrAmt: f.forTrAmt,
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
        title={modi ? '해외자산 거래변경' : '해외자산 거래등록'}
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
              {/* [E8] closeButton[닫기].Select ["NEW".equals(actionName)] (L422) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
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
              <FieldRow label="보유수량" labelWidth={LABEL} width="50%"><DoubleInput value={f.holdQty} dec={6} disabled /></FieldRow>
              <FieldRow label="외화 장부금액" labelWidth={LABEL2} width="50%"><DoubleInput value={f.holdForBookAmt} dec={6} disabled /></FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="출고가능수량" labelWidth={LABEL} width="50%"><DoubleInput value={f.sellPossibleQty} dec={6} disabled /></FieldRow>
              <FieldRow label="원화 장부금액" labelWidth={LABEL2} width="50%"><LongInput value={f.holdBookAmt} disabled onChange={() => undefined} /></FieldRow>
            </div>
          </Box>
          <Box>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* [E9] qty[거래수량].ValueChange (L453) · [E10] price[거래단가].ValueChange (L460) → setForTrAmt() */}
              <FieldRow label="거래수량" labelWidth={LABEL} width="50%">
                <DoubleInput value={f.qty} dec={6} disabled={modi} onChange={v => setF(p => p && withForTrAmt({ ...p, qty: v }))} />
              </FieldRow>
              {/* 적용통화(ComboBoxField "CurCode" 60) / 적용환율(103) — [E11] fxRate.ValueChange (L467) → setTrAmt() */}
              <FieldRow label="적용통화/환율" labelWidth={LABEL2} width="50%">
                <div style={{ display: 'flex', gap: 5 }}>
                  <SystemCodeComboBox kindCd="CurCode" style={{ width: 90 }} allowClear={false} value={f.curCode ?? undefined} onChange={c => set({ curCode: c ?? null })} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <DoubleInput value={f.fxRate} dec={6} onChange={v => setF(p => p && withTrAmt({ ...p, fxRate: v }))} />
                  </div>
                </div>
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <FieldRow label="거래단가" labelWidth={LABEL} width="50%">
                <DoubleInput value={f.price} dec={6} onChange={v => setF(p => p && withForTrAmt({ ...p, price: v }))} />
              </FieldRow>
              {/* [E13] trAmt[원화 거래금액].ValueChange (L481) → setSettleAmt() */}
              <FieldRow label="원화 거래금액" labelWidth={LABEL2} width="50%">
                <LongInput value={f.trAmt} onChange={v => setF(p => p && withSettle({ ...p, trAmt: v }))} />
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* [E12] forTrAmt[외화 거래금액].ValueChange (L474) → setTrAmt() */}
              <FieldRow label="외화 거래금액" labelWidth={LABEL} width="50%">
                <DoubleInput value={f.forTrAmt} dec={6} onChange={v => setF(p => p && withTrAmt({ ...p, forTrAmt: v }))} />
              </FieldRow>
              {/* [E14] fee[수수료].ValueChange (L488) → setSettleAmt() */}
              <FieldRow label="수수료" labelWidth={LABEL2} width="50%">
                <LongInput value={f.fee} onChange={v => setF(p => p && withSettle({ ...p, fee: v }))} />
              </FieldRow>
            </div>
          </Box>
          <Box>
            <FieldRow label="결제금액" labelWidth={LABEL} width="50%"><LongInput value={f.amt} onChange={v => set({ amt: v })} /></FieldRow>
            {/* [E1] settleMngToggleGroup.ValueChange (L260): 바꾸면 예금계좌를 비우고 미수/미지급이면 칸을 막는다. [E4] depositName.Collapse (L376) → depositId */}
            <FieldRow label="결제구분" labelWidth={LABEL}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Radio.Group value={f.settleMngYn ? 'true' : 'false'}
                  onChange={e => set({ settleMngYn: e.target.value === 'true', depositId: null, depositName: null })}>
                  <Radio value="true">미수/미지급</Radio>
                  <Radio value="false">예금</Radio>
                </Radio.Group>
                <Select<number> style={{ width: 308 }} disabled={f.settleMngYn} options={depositOptions} value={f.depositId ?? undefined}
                  onChange={(id, opt) => set({ depositId: id, depositName: (opt as { label?: string }).label ?? null })} />
              </div>
            </FieldRow>
            <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
          </Box>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={onTrCodeResult} onClose={() => setTrCodeOpen(false)} />
      <Ast09_Lookup_Book open={bookOpen} holdDate={f.date ?? dayjs()} abroType="2" onResult={onBookResult} onClose={() => setBookOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" trCode={f.trCode} abroType="2" onResult={node => void onInfoResult(node)} onClose={() => setInfoOpen(false)} />
      <Ast01_Lookup_CorpAccount open={corpOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
    </>
  );
};
