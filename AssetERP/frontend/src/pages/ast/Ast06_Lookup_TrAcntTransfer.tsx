/**
 * 거래등록/거래변경 편집창 — 금융상품 계좌대체(3150) (W08) — Ast06_Tab_TrAcntTransfer의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrAcntTransfer.java (623줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L121-139 / open() L141-192: 모달 600×680 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L383-467: 라벨 폭 130, 박스 3개
 *   (거래일자 · 거래유형 · 종목(자산구분) · 보유수량 · 보유금액 · 출고계좌 / 입고계좌 · 입고수량 · 입고금액 / 수수료 · 결제구분 · 적요) + 분개 안내(MODI만), 아래 가운데 [저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstHoldBook, AstTrFinance } from '@/types/ast';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Box, DoubleInput, FieldRow, JournalNotice, LongInput, SettleMngField } from './Ast06_EditParts';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';
import { Ast09_Lookup_Book } from './Ast09_Lookup_Book';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 130;
const TR_CODE = '3150';  // 계좌대체

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrAcntTransferTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrFinance };

interface Form {
  date: Dayjs | null;
  trName: string;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  curCode: string;
  trUnit: number;
  corpId: number | null;
  accountId: number | null;
  accountName: string | null;
  inAccountId: number | null;
  inAccountName: string | null;
  holdQty: number | null;
  holdPurAmt: number | null;
  qty: number | null;
  trAmt: number | null;
  fee: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
}

/** openNew() L121-139: 일자 = 오늘, 거래유형 3150 계좌대체, 통화 KRW, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trName: '계좌대체', astClassTreeId: null, classTreeFullName: null, curCode: 'KRW', trUnit: 1, corpId: null,
  accountId: null, accountName: null, inAccountId: null, inAccountName: null, holdQty: null, holdPurAmt: null,
  qty: null, trAmt: null, fee: null, settleMngYn: true, depositId: null, depositName: null, note: null,
});

/** open() L141-192 MODI: 값을 채운다. 보유 칸은 이 SQL이 안 읽어 비어 있다 */
const fromTr = (tr: AstTrFinance): Form => ({
  date: dayjs(tr.date), trName: tr.trName ?? '계좌대체', astClassTreeId: tr.astClassTreeId, classTreeFullName: tr.classTreeFullName,
  curCode: tr.curCode ?? 'KRW', trUnit: tr.trUnit ?? 1, corpId: tr.corpId, accountId: tr.accountId, accountName: tr.accountName,
  inAccountId: tr.inAccountId, inAccountName: tr.inAccountName, holdQty: null, holdPurAmt: null,
  qty: tr.qty, trAmt: tr.trAmt, fee: tr.fee, settleMngYn: tr.settleMngYn, depositId: tr.depositId, depositName: tr.depositName, note: tr.note,
});

/** qty.ValueChange L354-380: 입고금액 = (long)(보유금액 ÷ 보유수량 × 출고수량) — 입고수량이 비거나 0이면 1, 보유 칸이 비면 0 */
const transferAmt = (f: Form, qty: number | null): number => {
  const v = Math.trunc((f.holdPurAmt ?? 0) / (f.holdQty ?? 0) * (qty == null || qty === 0 ? 1 : qty));
  return Number.isNaN(v) ? 0 : v;  // 자바의 (long)NaN = 0
};

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrAcntTransferTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrFinance, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrAcntTransfer: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [inOpen, setInOpen] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L117-119, open L141-192) → editDriver.edit(trModel), setting()
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // setFieldInit() L337-350: 종목·보관처·출고/입고계좌·보유 칸·입고수량·입고금액·수수료를 비운다
  const fieldInit: Partial<Form> = {
    astClassTreeId: null, classTreeFullName: null, corpId: null, accountId: null, accountName: null, inAccountId: null, inAccountName: null,
    holdQty: null, holdPurAmt: null, qty: null, trAmt: null, fee: null,
  };

  // [E2] classTreeFullName.TriggerClick [result != null] (L230) → Ast09_Lookup_Book.open(일자, "1"): 고르면 종목·출고계좌·보유 칸·거래단위, 안 고르면 setFieldInit()
  const onBookResult = (b: AstHoldBook | null) => {
    setBookOpen(false);
    if (!b) { set(fieldInit); return; }
    set({
      astClassTreeId: b.astClassTreeId, classTreeFullName: b.astClassTreeName, corpId: b.corpId, accountId: b.keepAccountId,
      accountName: b.keepAccountName, holdQty: b.holdQty, holdPurAmt: b.purAmt, trUnit: b.astTrUnit ?? 1,
    });
  };

  // [E3] inAccountName[입고계좌].TriggerClick [result == null] (L257) → Ast01_Lookup_CorpAccount.open(일자, "NOT")
  const onInResult = (acc: { classTreeId: number; classTreeName: string | null } | null) => {
    setInOpen(false);
    set(acc ? { inAccountId: acc.classTreeId, inAccountName: acc.classTreeName } : { inAccountId: null, inAccountName: null });
  };

  // success() L577-599: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
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

  // [E6] journalButton[분개재생성].Select (L315) → createJournal() L554-575: act.Act02_Journal.createJournal(procType "P", exceptYn true) → success()
  const createJournal = async (trId: number) => {
    try {
      await actApi.createJournal(trId, TR_CODE);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E5] updateButton[저장].Select (L309) → preUpdate() L469-531 → update() L533-552
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다.');
    if (f.astClassTreeId == null) return message.warning('종목(자산구분)은 필수입력 항목입니다.');
    if (f.inAccountId == null) return message.warning('입고계좌는 필수입력 항목입니다.');
    if (f.qty == null) return message.warning('입고수량은 필수입력 항목입니다.');
    if (f.trAmt == null) return message.warning('입고금액은 필수입력 항목입니다.');
    // 단가 = 입고금액 ÷ 입고수량 × 거래단위, 결제금액·외화금액 = 수수료(빈 값 0)
    const price = f.trAmt / f.qty * f.trUnit;
    const fee = f.fee ?? 0;
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    setSaving(true);
    try {
      // 회계마감 검사(act.Act04_GenLedger.checkClose)와 저장(ast.Ast06_Tr.updateFinance)은 서버가 한 트랜잭션으로 한다.
      // 이 창에 없는 매도제한·상장 값은 열 때 받은 행의 값을 그대로 돌려준다
      const trId = await astApi.saveTrFinance({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: TR_CODE, astClassTreeId: f.astClassTreeId, corpId: f.corpId,
        depositId: f.depositId, settleMngYn: f.settleMngYn, amt: fee, fee, note: f.note, curCode: f.curCode, accountId: f.accountId,
        qty: f.qty, price, trAmt: f.trAmt, lockUpPeriodCode: tr?.lockUpPeriodCode ?? null,
        lockUpDate: tr?.lockUpDate ?? null, listDate: tr?.listDate ?? null,
        transfer: true, inAccountId: f.inAccountId,
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
        width={630}
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
              {/* [E7] closeButton[닫기].Select ["NEW".equals(actionName)] (L321) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Box>
            <div style={{ display: 'flex' }}>
              <FieldRow label="거래일자" labelWidth={LABEL} width="55%">
                <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} value={f.date} disabled={modi} onChange={d => d && set({ date: d })} />
              </FieldRow>
            </div>
            <FieldRow label="거래유형" labelWidth={LABEL} width="85%">
              <LookupInput value={f.trName} width={330} disabled onOpen={() => undefined} />
            </FieldRow>
            <FieldRow label="종목(자산구분)" labelWidth={LABEL} width="85%">
              <LookupInput value={f.classTreeFullName ?? ''} width={330} disabled={modi} onOpen={() => setBookOpen(true)} />
            </FieldRow>
            <FieldRow label="보유수량" labelWidth={LABEL} width="60%"><DoubleInput value={f.holdQty} dec={6} disabled /></FieldRow>
            <FieldRow label="보유금액" labelWidth={LABEL} width="60%"><LongInput value={f.holdPurAmt} disabled onChange={() => undefined} /></FieldRow>
            <FieldRow label="출고계좌" labelWidth={LABEL} width="85%"><Input readOnly disabled value={f.accountName ?? ''} /></FieldRow>
          </Box>
          <Box>
            <FieldRow label="입고계좌" labelWidth={LABEL} width="85%">
              <LookupInput value={f.inAccountName ?? ''} width={330} disabled={modi} onOpen={() => setInOpen(true)} />
            </FieldRow>
            {/* [E8] qty[입고수량].ValueChange (L354) → 입고금액 = 보유금액 ÷ 보유수량 × 입고수량 */}
            <FieldRow label="입고수량" labelWidth={LABEL} width="60%">
              <DoubleInput value={f.qty} dec={6} onChange={v => setF(p => p && ({ ...p, qty: v, trAmt: transferAmt(p, v) }))} />
            </FieldRow>
            <FieldRow label="입고금액" labelWidth={LABEL} width="60%"><LongInput value={f.trAmt} onChange={v => set({ trAmt: v })} /></FieldRow>
          </Box>
          <Box>
            <FieldRow label="수수료" labelWidth={LABEL} width="60%"><LongInput value={f.fee} onChange={v => set({ fee: v })} /></FieldRow>
            {/* [E1] settleMngToggleGroup.ValueChange (L213), [E4] depositName.TriggerClick [result == null] (L289) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
            <FieldRow label="결제구분" labelWidth={LABEL}>
              <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
            </FieldRow>
            <FieldRow label="적요" labelWidth={LABEL}><Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} /></FieldRow>
          </Box>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast09_Lookup_Book open={bookOpen} holdDate={f.date ?? dayjs()} abroType="1" onResult={onBookResult} onClose={() => setBookOpen(false)} />
      <Ast01_Lookup_CorpAccount open={inOpen} stdDate={f.date ?? dayjs()} mode="NOT" onResult={onInResult} onClose={() => setInOpen(false)} />
    </>
  );
};
