/**
 * [1135] 준법감시 > 40. 이익제공(수령)현황 > 판촉물 구매 및 제공내역 (L05)
 * AS-IS: myApp/client/vi/bmt/Bmt01_Tab_Buy.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L90-126: center(50%, 여백 20) = 툴바(조회기간 ~ · ☑재고없음 제외 · [조회][등록][저장][삭제]) + 셀 편집 그리드(행번호, 체크박스 없음),
 *   south(50%, 여백 0 20 20 20) = `Biz01_TabPage_List`(제공내역, 상신상태 "완료"인 구매내역에만 켜진다)
 * 결재요청 아이콘(updateCheck L240-258 이후 checkAppr·checkdcr·insertLinkApproval·updateApprId)은 검사까지만 한다.
 *   그 뒤 전자결재 편집창(Apr01_Edit_ApprDoc)·문서분류 조회창(Dcr01_Lookup_Class)은 다른 도메인이라 아직 없다 — L05 작업기록 "다음 단계"
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화는 원본 버튼이 넷 붙어 넣지 않음), 저장 = 저장(n)(UX-03), 그리드 날짜 폭(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, DatePicker, message, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { bmtBuyApi } from '@/api/bmt';
import { sysApi } from '@/api/sys';
import { BmtBuy } from '@/types/bmt';
import { TransInfo } from '@/types/emp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Biz01_TabPage_List, Biz01_TabPage_ListHandle } from '../biz/Biz01_TabPage_List';

const gb = gbFor<BmtBuy>();
/** setChecked 없음 → 체크박스 없는 단일 선택. 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false } as const;

/** 상신·결재중·완료는 고치거나 지울 수 없다 (update() L469, deleteRow() L418, checkAppr() L264) */
const isLocked = (r: BmtBuy) => r.apprStatusName === '상신' || r.apprStatusName === '완료' || r.apprStatusName === '결재중';

export const Bmt01_Tab_Buy: React.FC = () => {
  const user = useLoginUser();
  const promoRef = useRef<Biz01_TabPage_ListHandle>(null);
  const [contents, setContents] = useState<Code[]>([]);
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [pickRowId, setPickRowId] = useState<number | null>(null);
  // setting() L128-176: 조회기간 = 올해 1월 1일 ~ 이번 달 말일, 체크 "재고없음 제외" 켜짐
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs().endOf('month'), leftYn: true }));
  const { startDate, closeDate, leftYn } = sp.values;
  // num: 마지막으로 고른 행 번호 (retrieve 뒤 포커스). insertCheck: [등록]을 누르면 true가 되고 다시 false가 되지 않는다(원본 L405·L360-375 그대로)
  const num = useRef(0);
  const insertCheck = useRef(false);

  const crud = useGridCrud<BmtBuy>({
    idField: 'buyId',
    // retrieve() L382-400: 서비스 bmt.Bmt01_Buy.selectByCompanyId(companyId, personId = 로그인 사원, startDate, closeDate, leftYn)
    search: useCallback(() => {
      const v = sp.current.current;
      return bmtBuyApi.searchBuys(v.startDate.format('YYYY-MM-DD'), v.closeDate.format('YYYY-MM-DD'), v.leftYn);
    }, [sp]),
    // update() L445-477: GridUpdate → bmt.Bmt01_Buy.update
    save: bmtBuyApi.saveBuys,
    // deleteRow() L415-443: HtmlMessageBox "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350) → [E8] DialogHide [YES] (L425) → bmt.Bmt01_Buy.delete
    remove: bmtBuyApi.deleteBuys,
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
    // insertRow() L402-413: 회사·등록자·담당자(로그인 사원)를 넣은 새 행 (회사·등록자는 서버가 채운다)
    newRow: useCallback(() => ({ personId: user.userId, personName: user.name }), [user.userId, user.name]),
    firstEditField: 'buyDate',
    // update() L445-477: 변경 행마다 구입수량 → 구입금액 → 담당자 → 상신 여부 순서로 검사
    validate: changed => {
      for (const m of changed) {
        if (m.buyQty == null) return '구입수량을 입력해주세요';  // L455
        if (m.buyAmt == null) return '구입금액을 입력해주세요';  // L460
        if (m.personId == null) return '담당자를 지정해주세요';  // L465
        if (isLocked(m)) return '선택한 항목 중 수정불가능한 항목이 있습니다';  // L470
      }
      return undefined;
    },
  });

  // retrieveTabpage() L357-380: 상신상태가 "완료"인 구매내역이면 아래 목록을 켜고 읽는다 (아니면 끈다).
  //   아래 목록의 저장·삭제가 끝나면(callback) insertCheck가 꺼져 있을 때만 위 목록을 다시 읽는다
  const retrieveTabpage = useCallback((row: BmtBuy | undefined) => {
    if (!row) { setPromoEnabled(false); return; }
    if (row.apprStatusName === '완료') {
      setPromoEnabled(true);
      promoRef.current?.retrieve(row, () => { if (!insertCheck.current) void retrieve(); });
    } else {
      setPromoEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // retrieve() L382-400: 다시 읽으면 선택이 풀린다(GXT) → 아래 목록은 꺼지고, 마지막으로 고른 행에 포커스만 둔다
  const retrieve = useCallback(async () => {
    await crud.retrieve();
    const api = crud.gridRef.current?.api;
    api?.deselectAll();
    retrieveTabpage(undefined);
    setTimeout(() => {
      const n = api?.getDisplayedRowCount() ?? 0;
      if (api && n > 0) {
        const i = Math.min(num.current, n - 1);
        api.ensureIndexVisible(i);
        api.setFocusedCell(i, 'buyDate');
      }
    }, 0);
  }, [crud, retrieveTabpage]);

  useEffect(() => {
    sysApi.searchCodesByKindGroup('ProvideContentCode001').then(setContents).catch(() => setContents([]));
  }, []);

  // [E0] 화면 열림 (생성자 L90-126) → setting(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E1] grid.SelectionChanged [선택>0] (L144) → retrieveTabpage()
  const onSelectionChanged = (e: { api: { getSelectedRows: () => BmtBuy[] } }) => {
    const row = e.api.getSelectedRows()[0];
    if (!row) return;
    num.current = Math.max(0, crud.rows.findIndex(r => r.buyId === row.buyId));
    retrieveTabpage(row);
  };

  // [E3] insertButton[등록].Select (L158) → insertRow() L402-413
  const insertRow = () => {
    insertCheck.current = true;
    crud.addRow();
  };

  // [E5] deleteButton[삭제].Select (L170) → deleteRow() L415-443: 상신·완료·결재중이면 막고, 확인 → [E8] 삭제
  //   (선택한 행이 없으면 원본은 NullPointerException으로 아무 일도 안 한다)
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) return;
    if (isLocked(selected)) {
      message.warning('해당 항목은 삭제불가능합니다');
      return;
    }
    crud.deleteChecked();
  };

  // [E7] lookupEmpInfo.TriggerClick (L197) → openLookupEmpInfo() L225-238: 사원찾기(open(오늘, …)) → 선택 행의 담당자 ID·이름을 바꾼다
  const onPickEmp = (emp: TransInfo | null) => {
    const id = pickRowId;
    setPickRowId(null);
    if (!emp || id == null) return;
    crud.updateRow(id, { personId: emp.personId, personName: emp.korNm });
  };

  // 결재요청 아이콘 actionCell(ImageCell "Edit") → updateCheck() L240-258 → checkAppr() L260-289 → checkdcr() L291-323 → insertLinkApproval() L325-336 → updateApprId() L338-355
  //   검사까지만 한다. 전자결재(Apr01_Edit_ApprDoc)·분류 선택(Dcr01_Lookup_Class)은 다른 도메인이라 아직 없다
  const updateCheck = useCallback((r: BmtBuy) => {
    if (crud.hasChanges()) {
      message.warning('수정한 판촉물 구매내역을 저장 후 결재요청을 진행해주세요');
      return;
    }
    if (!r.buyDate) {
      message.warning('판촉물 구매내역을 입력 후 결재요청을 진행해주세요');
      return;
    }
    message.info('전자결재 화면(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  }, [crud]);

  // buildGrid() L178-223
  const columnDefs = useMemo(() => [
    gb.date('buyDate', 100, '구매일자', { editor: 'date' }),  // L211
    // [E6] provideContentComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L188) → addChange(provideContentCode, getCode()) (ProvideContentCode001)
    gb.textCenter('provideContentName', 200, '구매품목', {  // L212
      editor: 'select',
      values: contents.map(c => c.name),
      valueSetter: p => {
        p.data.provideContentName = p.newValue;
        p.data.provideContentCode = contents.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.long('buyQty', 100, '구매수량', { editor: 'number' }),  // L213
    gb.long('buyAmt', 200, '구입금액', { editor: 'number' }),  // L214
    gb.long('totalPeple', 100, '인원'),  // L215
    gb.long('averagePrice', 200, '인당 경제적가치'),  // L216
    gb.long('leftQty', 100, '재고량'),  // L217
    gb.textCenter('personName', 100, '담당자', {  // L218 (LookupTriggerField)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: BmtBuy; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setPickRowId(p.data.buyId); }} />
          {p.value}
        </>
      ),
    }),
    gb.textCenter('apprStatusName', 100, '상신상태'),  // L219
    iconCell<BmtBuy>('edit', 'actionCell', 80, '결재요청', updateCheck),  // L220 actionCell
  ], [contents, updateCheck]);

  return (
    <Splitter layout="vertical" style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="50%" min={200}>
        <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <div style={{ padding: 10 }}>
              {/* [E2] retrieveButton[조회].Select (L152) → retrieve() */}
              <SearchBar
                onSearch={retrieve}
                extra={(
                  <>
                    <Button type="register" onClick={insertRow}>등록</Button>
                    {/* [E4] updateButton[저장].Select (L164) → update() L445-477. 저장(n)은 UX-03 */}
                    <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                    <Button type="delete" onClick={deleteRow}>삭제</Button>
                  </>
                )}
              >
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
                </SearchBar.Field>
                <Checkbox checked={leftYn} onChange={e => sp.set('leftYn', e.target.checked)}>재고없음 제외</Checkbox>
              </SearchBar>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<BmtBuy> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} onSelectionChanged={onSelectionChanged} />
            </div>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={200}>
        <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
          <Biz01_TabPage_List ref={promoRef} enabled={promoEnabled} />
        </div>
      </Splitter.Panel>
      <Emp00_Lookup_SelectSingle open={pickRowId != null} noneLabel={null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPickEmp} onClose={() => setPickRowId(null)} />
    </Splitter>
  );
};
