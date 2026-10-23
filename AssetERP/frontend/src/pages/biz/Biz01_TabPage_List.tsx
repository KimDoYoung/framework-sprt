/**
 * 판촉물 제공내역 (L05) — Bmt01_Tab_Buy 아래쪽 (promoList)
 * AS-IS: myApp/client/vi/biz/Biz01_TabPage_List.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L66-83: 툴바 "이익제공내역" + [등록][저장][삭제][상대처 관리 바로가기] / 셀 편집 그리드(행번호, 체크박스 다중, 6열)
 * 상위 화면이 `retrieve(구매내역, callback)`(핸들)로 연다. callback은 저장·삭제가 끝난 뒤 불린다(L174-182·L222-248).
 * 상대방 성명의 조회창 `Crm09_Lookup_SelectSingle`(crm 도메인)은 아직 없다 — 누르면 안내만 (L05 작업기록 "다음 단계")
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bizPromoApi } from '@/api/biz';
import { sysApi } from '@/api/sys';
import { BizBuyPromo } from '@/types/biz';
import { BmtBuy } from '@/types/bmt';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { openMenuByNo } from '@/utils/tempData';

const gb = gbFor<BizBuyPromo>();
/** setChecked(MULTI) = 체크박스 다중 선택. 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, enableClickSelection: false } as const;

/** 상대처 관리 바로가기가 여는 메뉴 화면번호 (L02·L03과 같다) */
const CONTACT_MENU_NO = '1405';

export interface Biz01_TabPage_ListHandle {
  /** AS-IS retrieve(selectedItem, callback) L167-172 → retrieve(selectedItem) L153-165 */
  retrieve: (buy: BmtBuy, callback: () => void) => void;
}

interface Props {
  /** AS-IS setEnabled — 상위 화면이 상신상태 "완료"인 구매내역에만 켠다 */
  enabled: boolean;
}

export const Biz01_TabPage_List = forwardRef<Biz01_TabPage_ListHandle, Props>(({ enabled }, ref) => {
  // [E0] 화면 열림 (생성자 L66-83) → setting() L85-116: 버튼 핸들러 연결. 처음엔 비활성 — 상위 화면이 상신상태 "완료"인 구매내역에만 `enabled`를 켠다
  const [purposes, setPurposes] = useState<Code[]>([]);
  const buyRef = useRef<BmtBuy | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const crud = useGridCrud<BizBuyPromo>({
    idField: 'promoId',
    // retrieve() L153-165: 서비스 biz.Biz01_Promo.selectByBuyId(companyId, buyId = 상위 구매내역)
    search: useCallback(async () => (buyRef.current ? bizPromoApi.searchBuyPromos(buyRef.current.buyId) : []), []),
    // update() L174-182: GridUpdate → biz.Biz01_Promo.updateAdd → callback.execute()
    save: bizPromoApi.saveBuyPromos,
    // deleteRow() L222-248: HtmlMessageBox "확인"/"해당 정보를 삭제하시겠습니까?"(폭 350) → [E7] DialogHide [YES] (L225) → biz.Biz01_Promo.delete → callback.execute()
    remove: bizPromoApi.deleteOthers,
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
    onChanged: () => callbackRef.current?.(),
    firstEditField: 'provideDate',
    // insertRow() L184-205: 구매내역의 값을 넘겨받은 새 행 (정산구분 2·제공/수령 1·등록자·회사는 서버)
    newRow: useCallback(() => {
      const buy = buyRef.current;
      return {
        buyId: buy?.buyId ?? null,
        provideContentName: buy?.provideContentName ?? null,
        provideContentCode: buy?.provideContentCode ?? null,
        // 구입금액 ÷ 구매수량 (Long 나눗셈 = 버림). 구매수량이 없으면 비운다
        provideAmt: buy?.buyAmt != null && buy.buyQty ? Math.trunc(buy.buyAmt / buy.buyQty) : null,
        personId: buy?.personId ?? null,
        providePurName: '판매(일반)',
        providePurCode: '10',
      };
    }, []),
  });

  useImperativeHandle(ref, () => ({
    retrieve: (buy, callback) => {
      callbackRef.current = callback;
      buyRef.current = buy;
      void crud.retrieve();
    },
  }));

  // buildGrid() L118-151: CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", ProvidePurCode001)
  useEffect(() => {
    sysApi.searchCodesByKindGroup('ProvidePurCode001').then(setPurposes).catch(() => setPurposes([]));
  }, []);

  // [E1] insertButton[등록].Select (L86) → insertRow() L184-205
  const insertRow = () => {
    if (!buyRef.current) {
      message.warning('상단의 구매품목을 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E4] contactPointButton[상대처 관리 바로가기].Select (L104) → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1405", …)
  const contactPoint = () => {
    if (!openMenuByNo(CONTACT_MENU_NO)) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
  };

  const columnDefs = useMemo(() => [
    gb.date('provideDate', 100, '제공일자', { editor: 'date' }),  // L143
    gb.textCenter('provideContentName', 150, '제공품목'),  // L144
    // [E5] providePurComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L128) → addChange(providePurCode, getCode())
    gb.textCenter('providePurName', 150, '제공목적', {  // L145
      editor: 'select',
      values: purposes.map(c => c.name),
      valueSetter: p => {
        p.data.providePurName = p.newValue;
        p.data.providePurCode = purposes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.textCenter('targetCompanyName', 200, '상대방 회사명'),  // L146
    // [E6 생략] lookuptargetInfo.TriggerClick (L137) → openLookupTargetInfo() L207-220: Crm09_Lookup_SelectSingle은 crm 도메인이라 아직 없다 (다음 단계)
    gb.textCenter('targetEmpName', 150, '상대방 성명', {  // L147 (LookupTriggerField)
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: BizBuyPromo; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); message.info('상대처 조회창(Crm09_Lookup_SelectSingle)은 아직 변환 전입니다'); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('note', 450, '비고', { editor: 'text' }),  // L148
  ], [purposes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9',
      opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
        <b>이익제공내역</b>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E2] updateButton[저장].Select (L92) → update() L174-182. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E3] deleteButton[삭제].Select (L98) → deleteRow() L222-248 */}
        <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        <Button type="goto" onClick={contactPoint}>상대처 관리 바로가기</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BizBuyPromo> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
      </div>
    </div>
  );
});
Biz01_TabPage_List.displayName = 'Biz01_TabPage_List';
