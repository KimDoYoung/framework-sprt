/**
 * 권리행사/기타입출고 등록·변경 창 (I07) — Flt10_Tab_RightsExercise [등록]·변경 아이콘에서 연다
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_RightsExercise.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * openNew()/open() L94-142: 530×430 모달. NEW = 제목 "등록"(거래일 오늘·금액 0), MODI = 제목 "거래변경"(거래일·구분·계좌·종목유형·종목 잠금)
 * getEditor() L321-368: 거래일자 · 거래구분 · 계좌(트리거) · 종목유형 · 종목(코드 + 이름 트리거) · 수량 · 금액 · 비고, 라벨 100, [저장][닫기]
 * 원본은 [등록]에서 그리드에 임시 행을 먼저 넣고 닫기에서 지운다 — TOBE는 임시 행 없이 저장이 성공하면 부른 쪽이 다시 조회한다(`onSaved`)
 * UX보강(10): 조회창 UX-05·06
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBook, FltItemTypeCode, FltRightsExercise, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';
import { Flt03_Lookup_Account, accountLabel } from './Flt03_Lookup_Account';
import { Flt10_Lookup_Item } from './Flt10_Lookup_Item';
import { Flt11_Lookup_BookList } from './Flt11_Lookup_BookList';

const DATE_FORMAT = 'YYYY-MM-DD';

/** 열기 방식 — NEW: openNew() 등록, MODI: open(row, "MODI") 변경 */
export type RightsExerciseTarget = { mode: 'NEW' } | { mode: 'MODI'; row: FltRightsExercise };

interface Props {
  /** null이면 닫힘 */
  target: RightsExerciseTarget | null;
  /** 저장(update) 성공 — 부른 쪽이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

/** 등록 창이 들고 있는 값 */
interface Form {
  trId: number;
  trType: string | null;
  regDate: string;
  accountId: number | null;
  accountInfo: string | null;
  trItemType: string | null;
  trItemTypeName: string | null;
  trItemCode: string | null;
  trItemName: string | null;
  trQty: number | null;
  trAmt: number | null;
  trNote: string | null;
}

const newForm = (): Form => ({
  trId: 0, trType: null, regDate: dayjs().format(DATE_FORMAT), accountId: null, accountInfo: null,
  trItemType: null, trItemTypeName: null, trItemCode: null, trItemName: null, trQty: null, trAmt: 0, trNote: null,
});

const fromRow = (r: FltRightsExercise): Form => ({
  trId: r.trId, trType: r.trType, regDate: r.regDate, accountId: r.accountId, accountInfo: r.accountInfo,
  trItemType: r.trItemType, trItemTypeName: r.trItemTypeName, trItemCode: r.trItemCode, trItemName: r.trItemName,
  trQty: r.trQty, trAmt: r.trAmt, trNote: r.trNote,
});

const qtyFormatter = (v: number | string | undefined) => (v == null || v === '' ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const amtParser = (v: string | undefined) => Number((v ?? '').replace(/,/g, ''));

const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', margin: '17px 15px 17px 10px' };
const labelStyle: React.CSSProperties = { width: 100, fontWeight: 'bold', flexShrink: 0 };

export const Flt10_Lookup_RightsExercise: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [form, setForm] = useState<Form>(newForm);
  const [itemTypes, setItemTypes] = useState<FltItemTypeCode[]>([]);
  const [listStockYn, setListStockYn] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [stkOpen, setStkOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const savedIdRef = useRef<number | null>(null);
  const modi = target?.mode === 'MODI';
  /** trType.substring(2, 3): 'I' 입고 / 'O' 출고 */
  const inOutType = form.trType ? form.trType.substring(2, 3) : null;

  // setting() L144-232: 종목유형 ComboBox 조회(회사, 거래일자 기준) — 입고('I')는 신고대상이 아닌 종목유형만(targetYn=false)
  const retrieveItemTypes = async (regDate: string) => {
    try {
      setItemTypes(await fltApi.searchItemTypeCodes(regDate));
    } catch {
      setItemTypes([]);
    }
  };

  // [E0] 화면 열림 (생성자 L90-92) → 초기화: openNew()/open() L94-142 — 열 때마다 처음 값으로
  useEffect(() => {
    if (!target) return;
    const f = target.mode === 'MODI' ? fromRow(target.row) : newForm();
    setForm(f);
    setListStockYn(false);
    savedIdRef.current = null;
    void retrieveItemTypes(f.regDate);
  }, [target]);

  const patch = (p: Partial<Form>) => setForm(f => ({ ...f, ...p }));

  const typeOptions = useMemo(() => {
    const list = itemTypes
      .filter(t => inOutType !== 'I' || !t.targetYn)
      .map(t => ({ value: t.code, label: t.name }));
    if (form.trItemType && !list.some(o => o.value === form.trItemType)) {
      list.push({ value: form.trItemType, label: form.trItemTypeName ?? form.trItemType });
    }
    return list;
  }, [itemTypes, inOutType, form.trItemType, form.trItemTypeName]);

  // [E1] trTypeName[거래구분].Collapse ["I".equals(InOutType)] (L157) → setEnabled() — 구분을 고르면 종목유형 ComboBox를 다시 구성한다
  const onTrTypeChange = (code: string | undefined) => {
    patch({ trType: code ?? null });
    void retrieveItemTypes(form.regDate);
  };

  // [E3] trItemTypeName[종목유형].Collapse (L194): listStockYn = etcCode(주식시세 적용 여부) — true면 종목은 목록에서만 고른다
  const onItemTypeChange = (code: string | undefined) => {
    const t = itemTypes.find(x => x.code === code);
    setListStockYn(t?.stkPriceYn ?? false);
    patch({ trItemType: code ?? null, trItemTypeName: t?.name ?? null });
  };

  // lookupBook() L264-283: Flt11_Lookup_BookList.open(null, 사용자, 거래일자) → 첫 행으로 계좌·종목을 채운다
  const lookupBook = (list: FltBook[]) => {
    setBookOpen(false);
    const b = list[0];
    if (!b) return;
    patch({
      accountId: b.accountId, accountInfo: b.accountInfo, trItemType: b.itemType, trItemTypeName: b.itemTypeName,
      trItemCode: b.itemCode, trItemName: b.itemName,
    });
  };

  // lookupAccount() L247-262: Flt03_Lookup_Account.open(거래일자) — 선택 없음이면 비운다
  const lookupAccount = (acc: FltTrAccount | null) => {
    setAcctOpen(false);
    patch(acc ? { accountId: acc.accountId, accountInfo: accountLabel(acc) } : { accountId: null, accountInfo: null });
  };

  // [E2] accountInfo[계좌].TriggerClick ["O".equals(InOutType)] (L178) → 출고는 보유내역(lookupBook), 그 밖은 계좌(lookupAccount)
  const openAccount = () => (inOutType === 'O' ? setBookOpen(true) : setAcctOpen(true));

  // [E4] trItemName.TriggerClick (L207) → lookupItem() L285-292: 주식시세 적용 종목유형이면 상장주식(Com50_Lookup_StkItem), 아니면 Flt10_Lookup_Item(오늘)
  const lookupItem = () => (listStockYn ? setStkOpen(true) : setItemOpen(true));

  // createBook() L420-444: 서비스 flt.Flt10_Tr.insertFloorTrBook(종목 한정) → "저장이 완료되었습니다." → 닫기
  const createBook = async () => {
    try {
      await fltApi.createRightsExerciseBook({ trItemType: form.trItemType, trItemName: form.trItemName, trItemCode: form.trItemCode, regDate: form.regDate });
    } catch (err) {
      message.error(errorMessage(err, '원장정리에 실패했습니다'));
      return;
    }
    message.success('저장이 완료되었습니다.');
    onClose();
  };

  // update() L403-418: 서비스 flt.Flt10_Tr.update → 성공하면 createBook()
  const update = async () => {
    setSaving(true);
    try {
      const [saved] = await fltApi.updateRightsExercises([{
        trId: savedIdRef.current ?? form.trId, trType: form.trType, trTypeName: null, regDate: form.regDate, trDate: form.regDate,
        accountId: form.accountId, accountInfo: form.accountInfo, trItemType: form.trItemType, trItemTypeName: form.trItemTypeName,
        trItemName: form.trItemName, trItemCode: form.trItemCode, trQty: form.trQty, trAmt: form.trAmt, trNote: form.trNote,
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

  // [E5] updateButton[저장].Select (L214) → preUpdate() L370-401
  const preUpdate = () => {
    if (!form.regDate) { message.warning('거래일자는 필수입력 항목입니다.'); return; }
    if (form.trType == null) { message.warning('거래구분을 선택하세요.'); return; }
    if (form.accountId == null) { message.warning('계좌를 선택하세요'); return; }
    if (form.trItemType == null) { message.warning('종목유형을 선택하세요'); return; }
    if (form.trItemName == null || form.trItemName === '') { message.warning('종목유형을 선택하세요'); return; }
    if (form.trQty == null || form.trQty === 0) { message.warning('수량을 입력하세요'); return; }
    void update();
  };

  const row = (label: string, node: React.ReactNode) => (
    <div style={rowStyle}><span style={labelStyle}>{label}</span>{node}</div>
  );

  // setEnabled() L234-245: 출고('O')는 종목유형·종목을 보유내역에서 받으므로 잠근다
  const itemLocked = modi || inOutType === 'O';

  return (
    <>
      <LookupModal
        open={target != null}
        title={modi ? '거래변경' : '등록'}
        width={560}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={preUpdate}>저장</Button>
              {/* [E6] closeButton[닫기].Select ["NEW".equals(actionName)] (L220) → NEW면 임시 행 제거 후 hide() — TOBE는 임시 행이 없다 */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {row('거래일자', (
          <DatePicker style={{ width: 150 }} allowClear={false} disabled={modi} value={dayjs(form.regDate)} format={DATE_FORMAT}
            onChange={d => d && patch({ regDate: d.format(DATE_FORMAT) })} />
        ))}
        {row('거래구분', (
          <SystemCodeComboBox kindGroupCd="FloorTrCode0002" style={{ width: 300 }} placeholder="선택하세요" allowClear={false} disabled={modi}
            value={form.trType ?? undefined} onChange={onTrTypeChange} />
        ))}
        {row('계좌', <LookupInput value={form.accountInfo ?? ''} width={350} disabled={modi} onOpen={openAccount} />)}
        {row('종목유형', (
          <Select<string> style={{ width: 300 }} disabled={itemLocked} options={typeOptions} value={form.trItemType ?? undefined}
            onChange={onItemTypeChange} />
        ))}
        {row('종목', (
          <Space.Compact>
            <Input style={{ width: 120 }} disabled value={form.trItemCode ?? ''} />
            {/* 주식시세 적용 종목유형이면 목록에서만 고르고(L199-203 setEditable(false)), 아니면 이름을 직접 쓸 수도 있다 */}
            <Input style={{ width: 230 }} disabled={itemLocked} readOnly={listStockYn} value={form.trItemName ?? ''}
              onChange={e => patch({ trItemName: e.target.value })}
              addonAfter={<SearchOutlined style={{ cursor: itemLocked ? 'not-allowed' : 'pointer' }} onClick={() => { if (!itemLocked) lookupItem(); }} />} />
          </Space.Compact>
        ))}
        {row('수량', (
          <InputNumber style={{ width: 200 }} controls={false} min={0} precision={6} value={form.trQty} formatter={qtyFormatter}
            onChange={v => patch({ trQty: v == null ? null : Number(v) })} />
        ))}
        {row('금액', (
          <InputNumber style={{ width: 200 }} controls={false} precision={0} value={form.trAmt} formatter={qtyFormatter} parser={amtParser}
            onChange={v => patch({ trAmt: v == null ? null : Number(v) })} />
        ))}
        {row('비고', <Input style={{ width: 350 }} value={form.trNote ?? ''} onChange={e => patch({ trNote: e.target.value })} />)}
      </LookupModal>
      <Flt11_Lookup_BookList open={bookOpen} accountId={null} stdDate={form.regDate} expectYn={false} onResult={lookupBook} onClose={() => setBookOpen(false)} />
      <Flt03_Lookup_Account open={acctOpen} baseDate={form.regDate} onResult={lookupAccount} onClose={() => setAcctOpen(false)} />
      <Com50_Lookup_StkItem mode={stkOpen ? 'VIEW' : null}
        onResult={item => { setStkOpen(false); patch({ trItemCode: item.itemCode, trItemName: item.itemName }); }}
        onClose={() => setStkOpen(false)} />
      <Flt10_Lookup_Item open={itemOpen} stdDate={dayjs().format(DATE_FORMAT)}
        onResult={name => { setItemOpen(false); patch({ trItemCode: null, trItemName: name }); }} onClose={() => setItemOpen(false)} />
    </>
  );
};
