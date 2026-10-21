/**
 * 계좌대체 등록·변경 창 (I06) — Flt10_Tab_AcntTransfer [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_AcntTransfer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open()/openNew() L81-127: 600×500 모달. NEW = 제목 "등록"(거래일 오늘·구분 30N·금액 0), MODI = 제목 "거래변경"(거래일·종목 잠금)
 * getEditor() L212-270: 위 상자(거래일자 · 종목(트리거) · 종목유형 · 출고계좌 · 보유수량 · 보유금액) + 아래 상자(입고계좌(트리거) · 입고수량 · 입고금액), 라벨 130, [저장][닫기]
 * 원본은 [등록]에서 그리드에 임시 행을 먼저 넣고 닫기에서 지운다 — TOBE는 임시 행 없이 저장이 성공하면 부른 쪽이 다시 조회한다(`onSaved`)
 * UX보강(10): 조회창 UX-05·06
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, InputNumber, Input, message, Space } from 'antd';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltAcntTransfer, FltBook, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Flt03_Lookup_Account, accountLabel } from './Flt03_Lookup_Account';
import { Flt11_Lookup_BookList } from './Flt11_Lookup_BookList';

const DATE_FORMAT = 'YYYY-MM-DD';

/** 열기 방식 — NEW: openNew() 등록, MODI: open(row, "MODI") 변경 */
export type AcntTransferTarget = { mode: 'NEW' } | { mode: 'MODI'; row: FltAcntTransfer };

interface Props {
  /** null이면 닫힘 */
  target: AcntTransferTarget | null;
  /** 저장(update) 성공 — 부른 쪽이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

/** 등록 창이 들고 있는 값 — 화면에는 없는 보유수량·보유금액은 종목을 고를 때만 채워진다 */
interface Form {
  trId: number;
  regDate: string;
  trItemType: string | null;
  trItemTypeName: string | null;
  trItemCode: string | null;
  trItemName: string | null;
  holdQty: number | null;
  holdAmt: number | null;
  outAccountId: number | null;
  outAccountInfo: string | null;
  accountId: number | null;
  accountInfo: string | null;
  trQty: number | null;
  trAmt: number | null;
}

const newForm = (): Form => ({
  trId: 0, regDate: dayjs().format(DATE_FORMAT), trItemType: null, trItemTypeName: null, trItemCode: null, trItemName: null,
  holdQty: null, holdAmt: null, outAccountId: null, outAccountInfo: null, accountId: null, accountInfo: null, trQty: null, trAmt: 0,
});

const fromRow = (r: FltAcntTransfer): Form => ({
  trId: r.trId, regDate: r.regDate, trItemType: r.trItemType, trItemTypeName: r.trItemTypeName, trItemCode: r.trItemCode, trItemName: r.trItemName,
  holdQty: null, holdAmt: null, outAccountId: r.outAccountId, outAccountInfo: r.outAccountInfo, accountId: r.accountId, accountInfo: r.accountInfo,
  trQty: r.trQty, trAmt: r.trAmt,
});

const qtyFormatter = (v: number | string | undefined) => (v == null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const amtParser = (v: string | undefined) => Number((v ?? '').replace(/,/g, ''));

const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', margin: '17px 15px 17px 5px' };
const labelStyle: React.CSSProperties = { width: 130, fontWeight: 'bold', flexShrink: 0 };

export const Flt10_Lookup_AcntTransfer: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [form, setForm] = useState<Form>(newForm);
  const [bookOpen, setBookOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const savedIdRef = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';

  // [E0] 화면 열림 (생성자 L77-79) → 초기화: open()/openNew() L81-127 — 열 때마다 처음 값으로
  useEffect(() => {
    if (!target) return;
    setForm(target.mode === 'MODI' ? fromRow(target.row) : newForm());
    savedIdRef.current = null;
  }, [target]);

  const patch = (p: Partial<Form>) => setForm(f => ({ ...f, ...p }));

  // [E1] trItemName[종목].TriggerClick (L144): Flt11_Lookup_BookList.open(null, 사용자, 거래일자) → 첫 행으로 종목·출고계좌를 채운다
  const pickBook = (list: FltBook[]) => {
    setBookOpen(false);
    const b = list[0];
    if (!b) return;
    patch({
      trItemType: b.itemType, trItemTypeName: b.itemTypeName, trItemCode: b.itemCode, trItemName: b.itemName,
      holdQty: b.bookQty, holdAmt: b.bookAmt, outAccountId: b.accountId, outAccountInfo: b.accountInfo,
    });
  };

  // [E2] accountInfo[입고계좌].TriggerClick (L172): Flt03_Lookup_Account.open(거래일자) — 선택 없음이면 비운다
  const pickAccount = (acc: FltTrAccount | null) => {
    setAcctOpen(false);
    patch(acc ? { accountId: acc.accountId, accountInfo: accountLabel(acc) } : { accountId: null, accountInfo: null });
  };

  // createBook() L318-342: 서비스 flt.Flt10_Tr.insertFloorTrBook(종목 한정) → "저장이 완료되었습니다." → 닫기
  const createBook = async () => {
    try {
      await fltApi.createAcntTransferBook({ trItemType: form.trItemType, trItemName: form.trItemName, trItemCode: form.trItemCode, regDate: form.regDate });
    } catch (err) {
      message.error(errorMessage(err, '원장정리에 실패했습니다'));
      return;
    }
    message.success('저장이 완료되었습니다.');
    onClose();
  };

  // update() L301-316: 서비스 flt.Flt10_Tr.update → 성공하면 createBook()
  const update = async () => {
    setSaving(true);
    try {
      const [saved] = await fltApi.updateAcntTransfers([{
        trId: savedIdRef.current ?? form.trId, trType: '30N', regDate: form.regDate, trDate: form.regDate,
        trItemType: form.trItemType, trItemTypeName: form.trItemTypeName, trItemName: form.trItemName, trItemCode: form.trItemCode,
        trQty: form.trQty, trAmt: form.trAmt, outAccountId: form.outAccountId, outAccountInfo: form.outAccountInfo,
        accountId: form.accountId, accountInfo: form.accountInfo,
      }]);
      savedIdRef.current = saved?.trId ?? savedIdRef.current;
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      setSaving(false);
      return;
    }
    onSaved();
    await createBook();
    setSaving(false);
  };

  // [E3] updateButton[저장].Select (L192) → preUpdate() L272-299
  const preUpdate = () => {
    if (!form.regDate) { message.warning('일자는 필수입력 항목입니다.'); return; }
    if (form.trItemName == null) { message.warning('출고종목 및 계좌를 선택하세요'); return; }
    if (form.accountInfo == null) { message.warning('입고계좌는 필수입력 항목입니다.'); return; }
    if (form.accountId === form.outAccountId) { message.warning('입고계좌가 출고계좌와 동일합니다.'); return; }
    if (form.trQty == null || form.trQty === 0) { message.warning('입고수량은 필수입력 항목입니다.'); return; }
    void update();
  };

  const row = (label: string, node: React.ReactNode) => (
    <div style={rowStyle}><span style={labelStyle}>{label}</span>{node}</div>
  );

  return (
    <>
      <LookupModal
        open={target != null}
        title={modi ? '거래변경' : '등록'}
        width={600}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={preUpdate}>저장</Button>
              {/* [E4] closeButton[닫기].Select (L198) → NEW면 임시 행 제거 후 hide() — TOBE는 임시 행이 없다 */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ border: '1px solid #d9d9d9', margin: 5, boxSizing: 'border-box' }}>
          {row('거래일자', (
            <DatePicker style={{ width: 150 }} allowClear={false} disabled={modi} value={dayjs(form.regDate)} format={DATE_FORMAT}
              onChange={d => d && patch({ regDate: d.format(DATE_FORMAT) })} />
          ))}
          {row('종목', <LookupInput value={form.trItemName ?? ''} width={300} disabled={modi} onOpen={() => setBookOpen(true)} />)}
          {row('종목유형', <Input style={{ width: 300 }} disabled value={form.trItemTypeName ?? ''} />)}
          {row('출고계좌', <Input style={{ width: 300 }} disabled value={form.outAccountInfo ?? ''} />)}
          {row('보유수량', <InputNumber style={{ width: 200 }} controls={false} disabled value={form.holdQty} formatter={qtyFormatter} />)}
          {row('보유금액', <InputNumber style={{ width: 200 }} controls={false} disabled value={form.holdAmt} formatter={qtyFormatter} />)}
        </div>
        <div style={{ border: '1px solid #d9d9d9', margin: 5, boxSizing: 'border-box' }}>
          {row('입고계좌', <LookupInput value={form.accountInfo ?? ''} width={300} onOpen={() => setAcctOpen(true)} />)}
          {row('입고수량', (
            <InputNumber style={{ width: 200 }} controls={false} min={0} precision={6} value={form.trQty} formatter={qtyFormatter}
              onChange={v => patch({ trQty: v == null ? null : Number(v) })} />
          ))}
          {row('입고금액', (
            <InputNumber style={{ width: 200 }} controls={false} precision={0} value={form.trAmt} formatter={qtyFormatter} parser={amtParser}
              onChange={v => patch({ trAmt: v == null ? null : Number(v) })} />
          ))}
        </div>
      </LookupModal>
      <Flt11_Lookup_BookList open={bookOpen} accountId={null} stdDate={form.regDate} expectYn={false} onResult={pickBook} onClose={() => setBookOpen(false)} />
      <Flt03_Lookup_Account open={acctOpen} baseDate={form.regDate} onResult={pickAccount} onClose={() => setAcctOpen(false)} />
    </>
  );
};
