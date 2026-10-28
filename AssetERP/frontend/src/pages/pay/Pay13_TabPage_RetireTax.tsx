/**
 * 소득세 정산 탭 (S22) — Pay10_Tab_Retire의 세 번째 탭 "소득세 정산".
 * AS-IS: myApp/client/vi/pay/Pay13_TabPage_RetireTax.java (1042줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L111-268: 위 [출력/다운로드], 그 아래 두 칸(왼쪽 0.5 · 오른쪽 0.5)
 *   왼쪽: 1. 총소득액([행 추가][행 삭제][저장]) · 그리드 300 / 2. 근로소득공제(당해·전년 금액 + [저장][근로소득공제표]) / 3. 근로소득금액([저장]) /
 *        4. 종합소득공제([행 추가][행 삭제][저장][인적공제금액]) · 그리드 200
 *   오른쪽: 5. 차감소득금액(과세표준)([저장]) / 6. 산출세액([저장][산출세액표]) / 7. 세액공제([행 추가][행 삭제][저장][산출기준]) · 그리드 150 /
 *        8. 결정세액([저장]) / 9. 기납부세액([저장]) · 그리드 150(종(전)·주(현)근무지) / 10. 차감징수세액([저장])
 * 그리드(1·4·7): 구분 180 · 당해년도 150 · 전년도 150(금액 셀 편집), 그리드 9: 구분 180 · 당해년도 150 · 전년도 150(금액 셀 편집). 행번호 있음
 * retrieve(param) L840-869: pay.Pay10_Month.getRetireInfo(personId) — 퇴직정산서가 없으면 안내, 있으면 retrieve() L933-1008 =
 *   pay.Pay14_RetireTaxItem.selectByMonthId(itemType 1·3·4) · pay.Pay13_RetireTax.getOfficePayTax · selectByMonthId(금액 필드)
 * [E1] downloadButton[출력/다운로드].Select (L289) → RDViewer(mrd Pay13_Rd_RetireTax, monthId)
 * [E2]~[E10] insertRow/deleteRow/update(itemType) → L480-527·L529-546·L548-649: 행 추가는 Pay20_Lookup_SelectMulti(항목구분 1·3·4), 삭제는 [저장]까지 미룸(deleteList),
 *   저장 = pay.Pay14_RetireTaxItem.insertRetireTaxItem(personId, updateList, deleteList, menuNum 1·4·7)
 * [E11]~[E17] updateButton2·3·5·6·8·9·10 → updateAmt(menuNum) L651-830: 2·3·5·6·8·10 = pay.Pay13_RetireTax.insertRetireTax, 9 = insertOfficePayTax
 * [E18]~[E21] viewButton2·4·6·7 [monthId != null] (L410-445) → Pay24_Lookup_DeductTable · Pay25_Lookup_PersonDeduct · Pay26_Lookup_TaxCalcTable · Pay27_Lookup_TaxDeductTable
 */
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { InputNumber, message } from 'antd';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayItem, PayRetireTaxDetail, PayRetireTaxItem, PayRetireTaxOffice } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay20_Lookup_SelectMulti } from './Pay20_Lookup_SelectMulti';
import { Pay24_Lookup_DeductTable } from './Pay24_Lookup_DeductTable';
import { Pay25_Lookup_PersonDeduct } from './Pay25_Lookup_PersonDeduct';
import { Pay26_Lookup_TaxCalcTable } from './Pay26_Lookup_TaxCalcTable';
import { Pay27_Lookup_TaxDeductTable } from './Pay27_Lookup_TaxDeductTable';
import { RETIRE_NO_MONTH, RetireTabHandle, RetireTabParam } from './payRetireTab';

const gb = gbFor<PayRetireTaxItem>();
const gbOffice = gbFor<PayRetireTaxOffice>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const TITLE: React.CSSProperties = { fontSize: 14, fontWeight: 700, flex: 'none' };
const BAR: React.CSSProperties = { height: 45, display: 'flex', alignItems: 'center', gap: 8, flex: 'none' };
const NUM_FMT = (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** buildGrid1()·buildGrid4()·buildGrid7() L448-470 */
const buildItemGrid = () => [
  gb.text('itemName', 180, '구분'),  // L450
  gb.long('itemAmt', 150, '당해년도', { editor: 'number' }),  // L451
  gb.long('pyItemAmt', 150, '전년도', { editor: 'number' }),  // L452
];

/** buildGrid9() L472-478 */
const buildOfficeGrid = () => [
  gbOffice.text('titleName', 180, '구분'),  // L474
  gbOffice.long('officePayTax', 150, '당해년도', { editor: 'number' }),  // L475
  gbOffice.long('pyOfficePayTax', 150, '전년도', { editor: 'number' }),  // L476
];

type Amount = { cur: number | null; py: number | null };
type AmountKey = 2 | 3 | 5 | 6 | 8 | 10;
const EMPTY_AMOUNTS: Record<AmountKey, Amount> = {
  2: { cur: null, py: null }, 3: { cur: null, py: null }, 5: { cur: null, py: null },
  6: { cur: null, py: null }, 8: { cur: null, py: null }, 10: { cur: null, py: null },
};

/** 금액 필드 한 줄: "N. 이름" + 당해·전년 LongField + 단추들 */
const AmountBar: React.FC<{ no: number; label: string; amount: Amount; onChange: (a: Amount) => void; onSave: () => void; children?: React.ReactNode }> =
  ({ label, amount, onChange, onSave, children }) => (
    <div style={BAR}>
      <span style={{ ...TITLE, width: 180 }}>{label}</span>
      <InputNumber value={amount.cur} onChange={v => onChange({ ...amount, cur: v })} formatter={NUM_FMT} controls={false} style={{ width: 140 }} />
      <InputNumber value={amount.py} onChange={v => onChange({ ...amount, py: v })} formatter={NUM_FMT} controls={false} style={{ width: 140 }} />
      <Button type="save" onClick={onSave}>저장</Button>
      {children}
    </div>
  );

// [E0] 화면 열림 (생성자 L111-268) → settings(), setRightPadding(): 단추·금액 필드·그리드 4개
export const Pay13_TabPage_RetireTax = forwardRef<RetireTabHandle>((_props, ref) => {
  const ctx = useRef<{ personId: number | null; monthId: number | null }>({ personId: null, monthId: null });
  const detail = useRef<PayRetireTaxDetail | null>(null);
  const [amounts, setAmounts] = useState<Record<AmountKey, Amount>>(EMPTY_AMOUNTS);
  const [deleteIds, setDeleteIds] = useState<Record<string, number[]>>({ '1': [], '3': [], '4': [] });
  const [selectType, setSelectType] = useState<string | null>(null);
  const [viewMonthId, setViewMonthId] = useState<{ kind: 'deduct' | 'person' | 'taxCalc' | 'taxDeduct'; monthId: number } | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const itemColumns = useMemo(buildItemGrid, []);
  const officeColumns = useMemo(buildOfficeGrid, []);

  const itemCrud = (key: 'incomes' | 'deducts' | 'credits', itemType: string) => ({
    idField: 'retireTaxItemId' as const,
    search: () => Promise.resolve(detail.current?.[key] ?? []),
    newRow: () => ({ monthId: ctx.current.monthId ?? 0, itemType }),
    save: async (rows: PayRetireTaxItem[]) => rows,
    remove: async () => 0,
  });
  const crud1 = useGridCrud<PayRetireTaxItem>(itemCrud('incomes', '1'));
  const crud4 = useGridCrud<PayRetireTaxItem>(itemCrud('deducts', '3'));
  const crud7 = useGridCrud<PayRetireTaxItem>(itemCrud('credits', '4'));
  const crud9 = useGridCrud<PayRetireTaxOffice>({
    idField: 'retireTaxId',
    search: () => Promise.resolve(detail.current?.offices ?? []),
    newRow: () => ({ titleName: '' }),
    save: async rows => rows,
    remove: async () => 0,
  });

  const clear = useCallback(() => {
    ctx.current.monthId = null;
    detail.current = null;
    setAmounts(EMPTY_AMOUNTS);
    setDeleteIds({ '1': [], '3': [], '4': [] });
    crud1.clear(); crud4.clear(); crud7.clear(); crud9.clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieve() L933-1008
  const retrieveAll = useCallback(async () => {
    const monthId = ctx.current.monthId;
    if (monthId == null) return;
    detail.current = await payApi.getRetireTax(monthId);
    const t = detail.current.tax;
    setAmounts(t == null ? EMPTY_AMOUNTS : {
      2: { cur: t.incomeDeduct ?? null, py: t.pyIncomeDeduct ?? null },
      3: { cur: t.incomeAmt ?? null, py: t.pyIncomeAmt ?? null },
      5: { cur: t.taxBase ?? null, py: t.pyTaxBase ?? null },
      6: { cur: t.calcTax ?? null, py: t.pyCalcTax ?? null },
      8: { cur: t.decideTax ?? null, py: t.pyDecideTax ?? null },
      10: { cur: t.settleTax ?? null, py: t.pySettleTax ?? null },
    });
    setDeleteIds({ '1': [], '3': [], '4': [] });
    await Promise.all([crud1.retrieve(), crud4.retrieve(), crud7.retrieve(), crud9.retrieve()]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieve(param) L840-869: getRetireInfo(personId)
  const retrieve = useCallback(async (param: RetireTabParam) => {
    ctx.current = { personId: param.personId, monthId: null };
    try {
      const month = param.personId == null ? null : await payApi.getRetireMonth(param.personId);
      if (month == null) {
        clear();
        message.warning(RETIRE_NO_MONTH);
        return;
      }
      ctx.current.monthId = month.monthId;
      await retrieveAll();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [clear, retrieveAll]);

  useImperativeHandle(ref, () => ({ retrieve, clear }));

  // [E1] downloadButton[출력/다운로드].Select (L289-306) → RDViewer.viewer(mrd Pay13_Rd_RetireTax, rv monthId)
  const download = async () => {
    if (ctx.current.monthId == null) return;
    try {
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay13_Rd_RetireTax', options: '/rhtmlimportopt [2]', rv: { monthId: String(ctx.current.monthId) } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  const gridOf = (itemType: string) => (itemType === '1' ? crud1 : itemType === '3' ? crud4 : crud7);

  // [E2]·[E5]·[E8] insertButton1·4·7[행 추가].Select → insertRow(itemType) L480-527: Pay20_Lookup_SelectMulti.open(itemType)
  const insertRow = (itemType: string) => {
    if (ctx.current.monthId == null) return;
    setSelectType(itemType);
  };
  const onSelectItems = (itemType: string, items: PayItem[]) => {
    gridOf(itemType).addRows(items.map(it => ({ monthId: ctx.current.monthId ?? 0, itemType, itemName: it.itemName })), true);
  };

  // [E3]·[E6]·[E9] deleteButton1·4·7[행 삭제].Select → deleteRow(itemType) L529-546: 그리드에서 빼고 deleteList에 둔다
  const deleteRow = (itemType: string) => {
    const crud = gridOf(itemType);
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const ids = selected.map(r => r.retireTaxItemId);
    setDeleteIds(prev => ({ ...prev, [itemType]: [...prev[itemType], ...ids.filter(id => id > 0)] }));
    crud.removeRows(ids);
  };

  // [E4]·[E7]·[E10] updateButton1·4·7[저장].Select → update(itemType) L548-649: pay.Pay14_RetireTaxItem.insertRetireTaxItem(personId, updateList, deleteList, menuNum 1·4·7)
  const update = async (itemType: string) => {
    const crud = gridOf(itemType);
    const changed = crud.getChanged();
    if (changed.length === 0 && deleteIds[itemType].length === 0) return;
    const { personId, monthId } = ctx.current;
    if (personId == null || monthId == null) return;
    const menuNum = itemType === '1' ? 1 : itemType === '3' ? 4 : 7;
    try {
      await payApi.saveRetireTaxItems(personId, monthId, menuNum, changed, deleteIds[itemType]);
      await retrieveAll();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E11]~[E17] updateButton2·3·5·6·8·9·10[저장].Select → updateAmt(menuNum) L651-830
  const updateAmt = async (menuNum: AmountKey | 9) => {
    const { personId, monthId } = ctx.current;
    if (personId == null || monthId == null) return;
    try {
      if (menuNum === 9) {
        const pre = crud9.rows.find(r => r.retireTaxId === 1);
        const cur = crud9.rows.find(r => r.retireTaxId === 2);
        await payApi.saveRetireOfficePayTax(personId, monthId, {
          preOfficePayTax: pre?.officePayTax ?? null, pyPreOfficePayTax: pre?.pyOfficePayTax ?? null,
          curOfficePayTax: cur?.officePayTax ?? null, pyCurOfficePayTax: cur?.pyOfficePayTax ?? null,
        });
      } else {
        await payApi.saveRetireTaxAmount(personId, monthId, menuNum, amounts[menuNum].cur, amounts[menuNum].py);
      }
      await retrieveAll();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E18]~[E21] viewButton2·4·6·7[...].Select [monthId != null] (L410-445)
  const view = (kind: 'deduct' | 'person' | 'taxCalc' | 'taxDeduct') => {
    if (ctx.current.monthId != null) setViewMonthId({ kind, monthId: ctx.current.monthId });
  };
  const amountBar = (no: AmountKey, label: string, extra?: React.ReactNode) => (
    <AmountBar no={no} label={label} amount={amounts[no]} onChange={a => setAmounts(prev => ({ ...prev, [no]: a }))} onSave={() => updateAmt(no)}>{extra}</AmountBar>
  );
  const itemBar = (itemType: string, label: string, crud: ReturnType<typeof gridOf>, extra?: React.ReactNode) => (
    <div style={BAR}>
      <span style={TITLE}>{label}</span>
      <Button type="addRow" onClick={() => insertRow(itemType)}>행 추가</Button>
      <Button type="removeRow" onClick={() => deleteRow(itemType)}>행 삭제</Button>
      <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + deleteIds[itemType].length }} onClick={() => update(itemType)}>저장</Button>
      {extra}
    </div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ ...BAR, padding: '0 10px' }}>
        <Button type="download" onClick={download}>출력/다운로드</Button>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 5px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {itemBar('1', '1. 총소득액', crud1)}
          <div style={{ height: 300, flex: 'none' }}><CellEditGrid<PayRetireTaxItem> crud={crud1} columnDefs={itemColumns} rowSelection={SINGLE_SELECTION} /></div>
          {amountBar(2, '2. 근로소득공제', <Button type="view" onClick={() => view('deduct')}>근로소득공제표</Button>)}
          {amountBar(3, '3. 근로소득금액')}
          {itemBar('3', '4. 종합소득공제', crud4, <Button type="view" onClick={() => view('person')}>인적공제금액</Button>)}
          <div style={{ height: 200, flex: 'none' }}><CellEditGrid<PayRetireTaxItem> crud={crud4} columnDefs={itemColumns} rowSelection={SINGLE_SELECTION} /></div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {amountBar(5, '5. 차감소득금액(과세표준)')}
          {amountBar(6, '6. 산출세액', <Button type="view" onClick={() => view('taxCalc')}>산출세액표</Button>)}
          {itemBar('4', '7. 세액공제', crud7, <Button type="view" onClick={() => view('taxDeduct')}>산출기준</Button>)}
          <div style={{ height: 150, flex: 'none' }}><CellEditGrid<PayRetireTaxItem> crud={crud7} columnDefs={itemColumns} rowSelection={SINGLE_SELECTION} /></div>
          {amountBar(8, '8. 결정세액')}
          <div style={BAR}>
            <span style={TITLE}>9. 기납부세액</span>
            <Button type="save" onClick={() => updateAmt(9)}>저장</Button>
          </div>
          <div style={{ height: 150, flex: 'none' }}><CellEditGrid<PayRetireTaxOffice> crud={crud9} columnDefs={officeColumns} rowSelection={SINGLE_SELECTION} /></div>
          {amountBar(10, '10. 차감징수세액')}
        </div>
      </div>
      <Pay20_Lookup_SelectMulti itemType={selectType} onResult={items => { if (selectType) onSelectItems(selectType, items); setSelectType(null); }} onClose={() => setSelectType(null)} />
      <Pay24_Lookup_DeductTable monthId={viewMonthId?.kind === 'deduct' ? viewMonthId.monthId : null} onClose={() => setViewMonthId(null)} />
      <Pay25_Lookup_PersonDeduct monthId={viewMonthId?.kind === 'person' ? viewMonthId.monthId : null} onClose={() => setViewMonthId(null)} />
      <Pay26_Lookup_TaxCalcTable monthId={viewMonthId?.kind === 'taxCalc' ? viewMonthId.monthId : null} onClose={() => setViewMonthId(null)} />
      <Pay27_Lookup_TaxDeductTable monthId={viewMonthId?.kind === 'taxDeduct' ? viewMonthId.monthId : null} onClose={() => setViewMonthId(null)} />
      <RdViewer url={rdUrl} title="소득세 정산" onClose={() => setRdUrl(null)} />
    </div>
  );
});
Pay13_TabPage_RetireTax.displayName = 'Pay13_TabPage_RetireTax';
