/**
 * 급여 항목 탭페이지 (S16) — Pay10_Tab_Month 오른쪽 60%.
 * AS-IS: myApp/client/vi/pay/Pay11_TabPage_MonthItem.java (457줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-120: 위 좌우 50:50 (왼쪽 [행 추가][행 삭제][저장] + 지급 그리드 / 오른쪽 [행 추가][행 삭제][저장][소득세 재계산] + 공제 그리드),
 *   아래 [근로시간][비고작성][임금계산방법][4대보험 연말정산 납부상세]. 그리드는 체크 다중 셀 편집 + 합계 행 "계"
 * 부모(Pay10_Tab_Month)가 forwardRef 핸들로 enabled()·retrieve()·init()를 부른다
 * 삭제는 화면에서만 빼 두었다가 [저장]에서 서버에 한꺼번에 보낸다(deleteList1·2). 임금계산방법(Pay04_Lookup_Formula)은 다음 단계 — 안내만
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayItem, PayMonth, PayMonthItem } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay09_Lookup_Note } from './Pay09_Lookup_Note';
import { Pay10_Lookup_Work } from './Pay10_Lookup_Work';
import { Pay20_Lookup_SelectMulti } from './Pay20_Lookup_SelectMulti';
import { Pay32_Lookup_Detail } from './Pay32_Lookup_Detail';

const gb = gbFor<PayMonthItem>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;
const NEED_MONTH = '좌측 급여정보를 먼저 선택해주세요';

export interface PayMonthItemHandle {
  /** enabled(payCode, date, monthId) L423-456: checkAppr 결과가 실패면 편집 버튼 7개를 비활성 */
  enabled: (payCode: string, payDate: string, monthId: number | null) => Promise<void>;
  /** retrieve(monthModel) L395-409: 지급(1)·공제(2) 두 그리드를 다시 읽고 삭제 목록을 비운다 */
  retrieve: (month: PayMonth) => Promise<void>;
  /** init() L411-416: 두 그리드를 비운다 */
  init: () => void;
}

export const Pay11_TabPage_MonthItem = forwardRef<PayMonthItemHandle>((_props, ref) => {
  // [E0] 화면 열림 (생성자 L67-120) → settings(): 지급·공제 두 그리드와 아래 버튼 4개
  const [month, setMonth] = useState<PayMonth | null>(null);
  const monthRef = useRef<PayMonth | null>(null);
  const [editable, setEditable] = useState(true);
  const deleteList1 = useRef<number[]>([]);
  const deleteList2 = useRef<number[]>([]);
  const [deleteCount1, setDeleteCount1] = useState(0);
  const [deleteCount2, setDeleteCount2] = useState(0);
  const [itemLookup, setItemLookup] = useState<string | null>(null);
  const [workOpen, setWorkOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const makeCrud = (itemType: string) => ({
    idField: 'monthItemId' as const,
    search: () => (monthRef.current ? payApi.searchMonthItems(monthRef.current.monthId, itemType) : Promise.resolve([] as PayMonthItem[])),
    save: async () => [] as PayMonthItem[],
    remove: async () => 0,
    newRow: () => ({ monthId: monthRef.current?.monthId ?? 0, itemType, itemCd: '' }),
    firstEditField: 'itemAmt' as const,
  });
  const crud1 = useGridCrud<PayMonthItem>(makeCrud('1'));
  const crud2 = useGridCrud<PayMonthItem>(makeCrud('2'));
  const { retrieve: retrieve1, clear: clear1 } = crud1;
  const { retrieve: retrieve2, clear: clear2 } = crud2;

  const retrieve = useCallback(async (m: PayMonth) => {
    monthRef.current = m;
    setMonth(m);
    deleteList1.current = [];
    deleteList2.current = [];
    setDeleteCount1(0);
    setDeleteCount2(0);
    await Promise.all([retrieve1(), retrieve2()]);
  }, [retrieve1, retrieve2]);

  useImperativeHandle(ref, () => ({
    enabled: async (payCode, payDate, monthId) => {
      try {
        const res = await payApi.checkMonthAppr(payCode, payDate, monthId);
        setEditable(res.ok);
      } catch {
        // 원본은 응답이 없으면 아무것도 바꾸지 않는다
      }
    },
    retrieve,
    init: () => {
      monthRef.current = null;
      setMonth(null);
      clear1();
      clear2();
    },
  }), [retrieve, clear1, clear2]);

  // buildGrid1() L216-224 / buildGrid2() L226-233 — 합계 행 "계"
  const columns1 = useMemo(() => [
    gb.text('itemNm', 150, '급여항목'),
    gb.textCenter('nonTaxTypeNm', 100, '과세구분'),
    gb.long('itemAmt', 150, '지급액', { editor: 'number' }),
  ], []);
  const columns2 = useMemo(() => [
    gb.text('itemNm', 150, '공제항목'),
    gb.long('itemAmt', 150, '공제액', { editor: 'number' }),
  ], []);

  // [E1][E4] insertButton[행 추가].Select (L123·L142) → insertRow(itemType) L235-280: Pay20_Lookup_SelectMulti.open(itemType) → 고른 항목마다 행
  const insertRow = (itemType: string) => {
    if (!month) {
      message.warning(NEED_MONTH);
      return;
    }
    setItemLookup(itemType);
  };
  const itemsPicked = (list: PayItem[]) => {
    const itemType = itemLookup;
    setItemLookup(null);
    if (!month || !itemType) return;
    const crud = itemType === '1' ? crud1 : crud2;
    crud.addRows(list.map(m => ({
      monthId: month.monthId,
      itemType: m.itemType ?? itemType,
      itemCd: m.itemCd ?? '',
      itemNm: m.itemName,
      ...(itemType === '1' ? { nonTaxTypeNm: m.nonTaxTypeName } : {}),
    })), true);
  };

  // [E2][E5] deleteButton[행 삭제].Select (L129·L148) → deleteRow(itemType) L282-299: 고른 행을 삭제 목록에 담고 화면에서 뺀다
  const deleteRow = (itemType: string) => {
    if (!month) {
      message.warning(NEED_MONTH);
      return;
    }
    const crud = itemType === '1' ? crud1 : crud2;
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    const list = itemType === '1' ? deleteList1 : deleteList2;
    list.current = [...list.current, ...selected.filter(r => r.monthItemId > 0).map(r => r.monthItemId)];
    (itemType === '1' ? setDeleteCount1 : setDeleteCount2)(list.current.length);
    crud.removeRows(selected.map(r => r.monthItemId));
  };

  // [E3][E6] updateButton[저장].Select (L135·L154) → update(itemType) L301-374
  // 지급(1): 변경 행 저장 → 삭제 → 소득세·지방세 재계산 / 공제(2): 변경·삭제 행마다 221·231·241 연말정산 검증. 변경이 없으면 아무 일도 하지 않는다
  const update = async (itemType: string) => {
    if (!month) {
      message.warning(NEED_MONTH);
      return;
    }
    const crud = itemType === '1' ? crud1 : crud2;
    const del = itemType === '1' ? deleteList1.current : deleteList2.current;
    const changed = crud.getChanged();
    if (changed.length === 0 && del.length === 0) return;
    try {
      await payApi.saveMonthItems(
        month.monthId,
        itemType,
        changed.map(r => ({ monthItemId: r.monthItemId > 0 ? r.monthItemId : null, itemCd: r.itemCd, itemAmt: r.itemAmt ?? null })),
        del,
      );
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
      return;
    }
    await retrieve(month);
  };

  // [E7] recalculationButton[소득세 재계산].Select (L160) → recalculation() L376-393
  const recalculation = async () => {
    if (!month) return;
    try {
      await payApi.recalculateTax(month.monthId);
    } catch (err) {
      message.warning(errorMessage(err, '재계산 실패'));
      return;
    }
    await retrieve(month);
  };

  const name = month ? `${month.personNm ?? ''} ${month.posNm ?? ''} (${month.personNo ?? ''})` : '';
  const needMonth = (open: () => void) => () => (month ? open() : message.warning(NEED_MONTH));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%', background: '#fff' }}>
          <Splitter.Panel defaultSize="50%" min={260}>
            <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="addRow" disabled={!editable} onClick={() => insertRow('1')}>행 추가</Button>
                <Button type="removeRow" disabled={!editable} onClick={() => deleteRow('1')}>행 삭제</Button>
                <Button type="save" disabled={!editable} count={{ ...crud1.changes, modified: crud1.changes.modified + deleteCount1 }} onClick={() => update('1')}>저장</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<PayMonthItem> crud={crud1} columnDefs={columns1} rowSelection={MULTI_SELECTION}
                  sumRow={{ labelField: 'itemNm', label: '계', sum: ['itemAmt'] }} />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel min={260}>
            <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="addRow" disabled={!editable} onClick={() => insertRow('2')}>행 추가</Button>
                <Button type="removeRow" disabled={!editable} onClick={() => deleteRow('2')}>행 삭제</Button>
                <Button type="save" disabled={!editable} count={{ ...crud2.changes, modified: crud2.changes.modified + deleteCount2 }} onClick={() => update('2')}>저장</Button>
                <Button type="view" disabled={!editable} onClick={recalculation}>소득세 재계산</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<PayMonthItem> crud={crud2} columnDefs={columns2} rowSelection={MULTI_SELECTION}
                  sumRow={{ labelField: 'itemNm', label: '계', sum: ['itemAmt'] }} />
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
        {/* [E8] workTimeButton[근로시간].Select (L166) */}
        <Button type="view" onClick={needMonth(() => setWorkOpen(true))}>근로시간</Button>
        {/* [E9] noteButton[비고작성].Select (L179) */}
        <Button type="view" onClick={needMonth(() => setNoteOpen(true))}>비고작성</Button>
        {/* [E10] formulaButton[임금계산방법].Select (L196) → lookupformula() — Pay04_Lookup_Formula는 다음 단계 */}
        <Button type="view" onClick={() => message.info('임금계산방법 창(Pay04_Lookup_Formula)은 다음 단계에서 지원합니다')}>임금계산방법</Button>
        {/* [E11] insureDetailButton[4대보험 연말정산 납부상세].Select (L202) */}
        <Button type="view" onClick={needMonth(() => setDetailOpen(true))}>4대보험 연말정산 납부상세</Button>
      </div>
      <Pay20_Lookup_SelectMulti itemType={itemLookup} onResult={itemsPicked} onClose={() => setItemLookup(null)} />
      <Pay10_Lookup_Work
        month={workOpen ? month : null}
        name={name}
        onSaved={patch => { if (month) { const next = { ...month, ...patch }; monthRef.current = next; setMonth(next); } }}
        onClose={() => setWorkOpen(false)}
      />
      <Pay09_Lookup_Note target={noteOpen && month ? { payCode: month.payCd, payDate: month.date } : null} onClose={() => setNoteOpen(false)} />
      <Pay32_Lookup_Detail target={detailOpen && month ? { personId: month.personId, payDate: month.date } : null} onClose={() => setDetailOpen(false)} />
    </div>
  );
});
Pay11_TabPage_MonthItem.displayName = 'Pay11_TabPage_MonthItem';
