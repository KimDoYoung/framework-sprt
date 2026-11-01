/**
 * 거래등록/거래변경 편집창 — 고유자산 거래 (X03) — Ast06_Tab_TrIntrinsic의 [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_TrIntrinsic.java (759줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew() L108-122 / open() L124-193: 모달 600×550 "거래등록"(NEW)·"거래변경"(MODI), getEditor() L468-526: 라벨 폭 120, 줄 10개
 *   (거래일자 230 · 거래유형 450 · 거래처 450 · 종목(자산구분) 450 · 거래금액 300 · 세금 300 · 결제금액 300 · 결제구분(미수/미지급·예금+예금계좌) · 적요 500 · 분개 안내(MODI만)),
 *   아래 가운데 [거래 불러오기](NEW만)[저장][분개재생성](MODI만)[닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬. 줄 사이 간격은 규격(gap 10)을 따른다
 * 원장에 반영된 거래(bookIoType이 1·2·3·5·8…)의 변경은 일자·거래유형·종목을 막는다(2024.08.30 CYY, open() L167-178)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AstBookDepn, AstTrCodeByWindow, AstTrCodeTreeNode, AstTrIntrinsic } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { FieldRow, JournalNotice, LongInput, SettleMngField } from './Ast06_EditParts';
import { Ast05_Lookup_TrCodeWindow } from './Ast05_Lookup_TrCodeWindow';
import { Ast01_Lookup_Info } from './Ast01_Lookup_Info';
import { Ast13_Lookup_BookDepn } from './Ast13_Lookup_BookDepn';
import { Ast06_Lookup_TrList } from './Ast06_Lookup_TrList';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 120;
const WINDOW_CLASS = 'Ast06_Tab_TrIntrinsic';

/** 열 때 받는 값: NEW는 새 거래, MODI는 고른 거래 행 */
export type AstTrIntrinsicTarget = { mode: 'NEW' } | { mode: 'MODI'; tr: AstTrIntrinsic };

interface Form {
  date: Dayjs | null;
  trCode: string | null;
  trName: string | null;
  corpId: number | null;
  corpName: string | null;
  astClassTreeId: number | null;
  classTreeFullName: string | null;
  curCode: string | null;
  itemLClassCode: string | null;
  itemSClassCode: string | null;
  contAmt: number | null;
  tax: number | null;
  amt: number | null;
  settleMngYn: boolean;
  depositId: number | null;
  depositName: string | null;
  note: string | null;
  bookIoType: string | null;
  purTrId: number | null;
  bookAmt: number | null;
  /** 01 수령 · 02 지급 — setAmt()가 세금을 빼는지 더하는지 정한다 */
  rcvPayType: string | null;
  financeYn: boolean;
}

/** openNew() L108-122: 일자 = 오늘, 결제구분 = 미수/미지급 */
const newForm = (): Form => ({
  date: dayjs(), trCode: null, trName: null, corpId: null, corpName: null, astClassTreeId: null, classTreeFullName: null, curCode: null,
  itemLClassCode: null, itemSClassCode: null, contAmt: null, tax: null, amt: null, settleMngYn: true, depositId: null, depositName: null,
  note: null, bookIoType: null, purTrId: null, bookAmt: null, rcvPayType: null, financeYn: false,
});

/** open() L124-193 MODI */
const fromTr = (t: AstTrIntrinsic): Form => ({
  date: dayjs(t.date), trCode: t.trCode, trName: t.trName, corpId: t.corpId, corpName: t.corpName, astClassTreeId: t.astClassTreeId,
  classTreeFullName: t.classTreeFullName, curCode: t.curCode, itemLClassCode: t.itemLClassCode, itemSClassCode: t.itemSClassCode,
  contAmt: t.contAmt, tax: t.tax, amt: t.amt, settleMngYn: t.settleMngYn, depositId: t.depositId, depositName: t.depositName, note: t.note,
  bookIoType: t.bookIoType, purTrId: t.purTrId, bookAmt: t.bookAmt, rcvPayType: t.rcvPayCode, financeYn: t.financeYn,
});

/** isBookYn() L678-687: 원장 입출고 구분 2 출고 · 3 입/출고 · 5 원장변경 · 8 해당없음(보유건 거래)이면 보유자산에서 종목을 고른다 */
const isBookYn = (bookIoType: string | null) => ['2', '3', '5', '8'].includes(bookIoType ?? '');

interface Props {
  /** 값이 있으면 열림 */
  target: AstTrIntrinsicTarget | null;
  /** 서버에서 다시 읽은 거래 — created: 새 거래의 등록이 끝났다(callback.execute(trModel) 뒤 hide) */
  onChanged: (tr: AstTrIntrinsic, created: boolean) => void;
  onClose: () => void;
}

export const Ast06_Lookup_TrIntrinsic: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const [f, setF] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  /** 저장한 거래 ID — NEW에서 저장은 됐는데 분개 생성이 실패해 다시 저장할 때 새 행을 또 만들지 않는다(AS-IS는 모델에 trId가 남는다) */
  const savedId = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  const tr = target?.mode === 'MODI' ? target.tr : null;

  // [E0] 화면 열림 (생성자 L104-106, open L124-193) → editDriver.edit(trModel), setting()
  useEffect(() => {
    savedId.current = null;
    if (!target) { setF(null); return; }
    setF(target.mode === 'NEW' ? newForm() : fromTr(target.tr));
  }, [target]);

  if (!target || !f) return null;
  const set = (patch: Partial<Form>) => setF(prev => prev && { ...prev, ...patch });

  // open() L167-178: 원장반영 거래(bookIoType이 없거나 9가 아님)의 변경은 일자·거래유형·종목을 막는다
  const bookLocked = modi && !(f.bookIoType == null || f.bookIoType === '9' || f.bookIoType === '');

  // setAmt() L439-466: 거래유형이 없으면 "거래유형을 선택해주세요."(계산 안 함). 금융 거래(financeYn)가 수령(01)이면 거래금액 − 세금, 그 밖은 거래금액 + 세금
  const withAmt = (p: Form): Form => {
    if (p.rcvPayType == null) { message.warning('거래유형을 선택해주세요.'); return p; }
    const cont = p.contAmt ?? 0;
    const tax = p.tax ?? 0;
    const amt = p.financeYn && p.rcvPayType === '01' ? cont - tax : cont + tax;
    return { ...p, amt };
  };

  // [E5] trName[거래유형].TriggerClick (L267) → Ast05_Lookup_TrCodeWindow.open("Ast06_Tab_TrIntrinsic", null, …)
  const onTrCodeResult = async (row: AstTrCodeByWindow | null) => {
    setTrCodeOpen(false);
    if (!row) return;
    // 수령/지급 구분이 없으면 "수령/지급 구분이 해당없음 또는 미지정 거래유형입니다."
    if (row.rcvPayCode == null) { message.warning('수령/지급 구분이 해당없음 또는 미지정 거래유형입니다.'); return; }
    let cur = 'KRW';
    let l: string | null = null;
    let s: string | null = null;
    if (row.astClassTreeId != null) {
      try {
        // ast.Ast01_ClassTree.selectById(classTreeId): 통화(없으면 KRW)·종목 대·소분류
        const item = await astApi.getClassTree(row.astClassTreeId);
        cur = item.curCode ? item.curCode : 'KRW';
        l = item.itemLClassCode ?? null;
        s = item.itemSClassCode ?? null;
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    set({
      rcvPayType: row.rcvPayCode, financeYn: !!row.financeYn, trCode: row.trCode, trName: row.trName, astClassTreeId: row.astClassTreeId ?? null,
      classTreeFullName: row.astClassTreeName ?? null, bookIoType: row.bookIoType ?? null, curCode: cur, itemLClassCode: l, itemSClassCode: s,
    });
  };

  // [E6] corpName[거래처].TriggerClick [result != null] (L323) → Sys15_Lookup_Corp.open(true, true, …): 거래처 없으면(선택안함) 비운다
  const onCorpResult = (c: Corp | null) => {
    setCorpOpen(false);
    set(c ? { corpId: c.corpId, corpName: c.corpName } : { corpId: null, corpName: null });
  };

  // [E7] classTreeFullName.TriggerClick [trCode.getValue() == null] (L344) → isBookYn()
  const openClass = () => {
    if (f.trCode == null) { message.warning('거래유형을 선택해주세요.'); return; }
    if (isBookYn(f.bookIoType)) {
      // 보유 팝업창은 비품폐기(5013)·비품매각(5014)만 있다
      if (f.trCode === '5013' || f.trCode === '5014') setBookOpen(true);
      else message.warning('보유팝업창이 존재하지 않는 거래입니다. 관리자에게 문의하세요.');
    } else {
      setInfoOpen(true);
    }
  };
  const onBookResult = (b: AstBookDepn) => {
    setBookOpen(false);
    // 거래일 당일 감가상각처리를 했다면 거래불가!!
    if (b.depnDate != null && f.date != null && b.depnDate === f.date.format(FORMAT) && (b.depnCost ?? 0) > 0) {
      message.warning('당일 감가상각된 자산입니다. 감각상각 취소후 거래해주세요.');
      set({ astClassTreeId: null, classTreeFullName: null, bookAmt: null, purTrId: null, itemLClassCode: null });
      return;
    }
    set({ astClassTreeId: b.astClassTreeId, classTreeFullName: b.itemFullName, bookAmt: b.purAmt, purTrId: b.purTrId, itemLClassCode: '50' });  // 50:유형자산
  };
  const onInfoResult = async (node: AstTrCodeTreeNode | null) => {
    setInfoOpen(false);
    if (!node) return;
    try {
      // 고른 종목의 대·소분류(Ast01_ClassTreeModel.getItemLClassCode·getItemSClassCode) — 비품원장 대상 판정에 쓴다
      const item = await astApi.getClassTree(node.classTreeId);
      set({ astClassTreeId: node.classTreeId, classTreeFullName: node.classTreeFullName, curCode: node.curCode, itemLClassCode: item.itemLClassCode ?? null, itemSClassCode: item.itemSClassCode ?? null });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E8] copyButton[거래 불러오기].Select (L407) → trCopy() L713-749: 고른 거래의 값을 채운다(일자·장부 관련은 그대로)
  const onTrCopy = (m: AstTrIntrinsic) => {
    setListOpen(false);
    set({
      trCode: m.trCode, trName: m.trName, bookIoType: m.bookIoType, astClassTreeId: m.astClassTreeId, classTreeFullName: m.classTreeFullName,
      itemLClassCode: m.itemLClassCode, itemSClassCode: m.itemSClassCode, curCode: m.curCode, corpId: m.corpId, corpName: m.corpName,
      contAmt: m.contAmt, tax: m.tax, amt: m.amt, settleMngYn: m.settleMngYn, depositId: m.depositId, depositName: m.depositName, note: m.note,
      rcvPayType: m.rcvPayCode ?? f.rcvPayType, financeYn: m.financeYn,
    });
  };

  // success() L640-662: 예금원장정리(결과는 쓰지 않는다) → selectById → 화면 갱신, NEW면 "저장이 완료되었습니다." 뒤 닫기, MODI면 "분개생성이 완료되었습니다."
  const success = async (trId: number) => {
    if (f.date) void astApi.cleanDepositBook(f.date.format(FORMAT)).catch(() => undefined);
    const saved = await astApi.getTrIntrinsic(trId);
    if (!modi) {
      message.success('저장이 완료되었습니다.');
      onChanged(saved, true);
      onClose();
    } else {
      onChanged(saved, false);
      message.success('분개생성이 완료되었습니다.');
    }
  };

  // [E10] journalButton[분개재생성].Select (L419) → createJournal() L608-638: 거래유형이 없으면 NEW는 곧바로 success(), MODI는 안내
  const createJournal = async (trId: number) => {
    if (f.trCode == null) {
      if (!modi) await success(trId); else message.warning('거래유형이 없으면 자동분개 생성이 불가합니다.');
      return;
    }
    try {
      await actApi.createJournal(trId, f.trCode);
      await success(trId);
    } catch (err) {
      message.error(errorMessage(err, '분개생성 실패'));
    }
  };

  // [E9] updateButton[저장].Select (L413) → preUpdate() L528-577 → update() L579-606
  const preUpdate = async () => {
    if (!f.date) return message.warning('일자는 필수입력 항목입니다');
    if (!f.trCode) return message.warning('거래유형은 필수선택 항목입니다');
    if (f.depositId == null && !f.settleMngYn) return message.warning('미수/미지급 거래가 아닌 경우 예금계좌는 필수선택 항목입니다.');
    setSaving(true);
    try {
      // 감가상각 검사(자산만)와 회계마감 검사(act.Act04_GenLedger.checkClose)·저장(ast.Ast06_Tr.update/updateDepn)은 서버가 한 트랜잭션으로 한다
      const trId = await astApi.saveTrIntrinsic({
        trId: savedId.current ?? tr?.trId ?? null, date: f.date.format(FORMAT), trCode: f.trCode, corpId: f.corpId, astClassTreeId: f.astClassTreeId,
        contAmt: f.contAmt, tax: f.tax, amt: f.amt, settleMngYn: f.settleMngYn, depositId: f.depositId, note: f.note, curCode: f.curCode,
        purTrId: f.purTrId, bookAmt: f.bookAmt, itemLClassCode: f.itemLClassCode, itemSClassCode: f.itemSClassCode, selfPur: !isBookYn(f.bookIoType),
      });
      savedId.current = trId;
      if (!modi) {
        await createJournal(trId);  // 최초 등록인 경우 분개 자동생성
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(await astApi.getTrIntrinsic(trId), false);
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
        width={640}
        maskClosable={false}
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {!modi && <Button type="select" onClick={() => setListOpen(true)}>거래 불러오기</Button>}
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {modi && <Button type="generate" onClick={() => createJournal(savedId.current ?? tr!.trId)}>분개재생성</Button>}
              {/* [E11] closeButton[닫기].Select ["NEW".equals(actionName)] (L425) → NEW: callback(null), 그 밖: callback(trModel), hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <FieldRow label="거래일자" labelWidth={LABEL} width={230}>
            <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} value={f.date} disabled={bookLocked} onChange={d => d && set({ date: d })} />
          </FieldRow>
          <FieldRow label="거래유형" labelWidth={LABEL} width={450}>
            <LookupInput value={f.trName ?? ''} width={320} disabled={bookLocked} onOpen={() => setTrCodeOpen(true)} />
          </FieldRow>
          <FieldRow label="거래처" labelWidth={LABEL} width={450}>
            <LookupInput value={f.corpName ?? ''} width={320} onOpen={() => setCorpOpen(true)} onClear={() => onCorpResult(null)} />
          </FieldRow>
          <FieldRow label="종목(자산구분)" labelWidth={LABEL} width={450}>
            <LookupInput value={f.classTreeFullName ?? ''} width={320} disabled={bookLocked} onOpen={openClass} />
          </FieldRow>
          {/* [E1] contAmt[거래금액].ValueChange (L200) · [E2] tax[세금].ValueChange (L206) → setAmt() */}
          <FieldRow label="거래금액" labelWidth={LABEL} width={300}>
            <LongInput value={f.contAmt} onChange={v => setF(p => p && withAmt({ ...p, contAmt: v }))} />
          </FieldRow>
          <FieldRow label="세금" labelWidth={LABEL} width={300}>
            <LongInput value={f.tax} onChange={v => setF(p => p && withAmt({ ...p, tax: v }))} />
          </FieldRow>
          <FieldRow label="결제금액" labelWidth={LABEL} width={300}>
            <LongInput value={f.amt} onChange={v => set({ amt: v })} />
          </FieldRow>
          {/* [E3] settleMngToggleGroup.ValueChange (L219), [E4] depositName.TriggerClick [result == null] (L246) → Ast01_Lookup_CorpAccount.open(일자, "NOT") */}
          <FieldRow label="결제구분" labelWidth={LABEL}>
            <SettleMngField date={f.date} settleMngYn={f.settleMngYn} depositName={f.depositName} onChange={v => set(v)} />
          </FieldRow>
          <FieldRow label="적요" labelWidth={LABEL}>
            <Input maxLength={200} value={f.note ?? ''} onChange={e => set({ note: e.target.value === '' ? null : e.target.value })} />
          </FieldRow>
          {modi && <JournalNotice />}
        </div>
      </Modal>
      <Ast05_Lookup_TrCodeWindow open={trCodeOpen} windowClassName={WINDOW_CLASS} onResult={row => void onTrCodeResult(row)} onClose={() => setTrCodeOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} regYn empYn onResult={onCorpResult} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_Info open={infoOpen} assetType="1" onResult={node => void onInfoResult(node)} onClose={() => setInfoOpen(false)} />
      <Ast13_Lookup_BookDepn open={bookOpen} holdDate={f.date ?? dayjs()} onResult={onBookResult} onClose={() => setBookOpen(false)} />
      <Ast06_Lookup_TrList open={listOpen} onResult={onTrCopy} onClose={() => setListOpen(false)} />
    </>
  );
};
