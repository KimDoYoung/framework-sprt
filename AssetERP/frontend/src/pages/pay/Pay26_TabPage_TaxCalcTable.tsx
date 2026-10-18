/**
 * 과세표준 구간별 기본세율 탭 (E22-3) — Pay20_Tab_DeductAdmin 하위 7번째 탭
 * AS-IS: myApp/client/vi/pay/Pay26_TabPage_TaxCalcTable.java (197줄, 새 원본 IDMS-IC) — 적용일 목록 탭: 위 툴바 + 왼쪽 적용일 그리드 15% | 오른쪽 Pay26_TabPage_TaxCalc 85%
 * 서비스 pay.Pay26_TaxCalcTable.selectByAll (L129)·deleteByDate (L163). 조회·첫 행 선택·삭제 로직은 usePayDateList(적용일 목록 탭 공통)
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayStartDate } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { PayTabPageHandle } from './Pay20_TabPage_Item';
import { Pay26_TabPage_TaxCalc } from './Pay26_TabPage_TaxCalc';
import { Pay26_Popup_TaxCalcCreate } from './Pay26_Popup_TaxCalcCreate';
import { usePayDateList } from './usePayDateList';

const gb = gbFor<PayStartDate>();

// [E0] 화면 열림 (생성자 L48-50) → settings() L52-108: 툴바([조회] · 관리자 회사만 [등록][삭제]) + 왼쪽 적용시작일 그리드 15% | 오른쪽 Pay26_TabPage_TaxCalc 85%, 마지막에 retrieve()
export const Pay26_TabPage_TaxCalcTable = forwardRef<PayTabPageHandle>((_props, ref) => {
  const list = usePayDateList(payApi.searchTaxCalcDates, payApi.deleteTaxCalcDate);
  const [openCreate, setOpenCreate] = useState(false);
  const columnDefs = useMemo(() => [gb.date('startDate', 190, '적용시작일')], []);  // buildGrid() L110-115

  useImperativeHandle(ref, () => ({ retrieve: list.retrieve }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap style={{ flex: 'none' }}>
        {/* [E1] retrieveButton[조회].Select (L64) → retrieve() L123-137 */}
        <Button type="search" onClick={list.retrieve}>조회</Button>
        {list.isAdminCompany && <>
          {/* [E2] insertButton[등록].Select (L70) → insert() L139-146: 적용일 생성 창을 열고 끝나면 retrieve() */}
          <Button type="register" onClick={() => setOpenCreate(true)}>등록</Button>
          {/* [E3] deleteButton[삭제].Select (L76) → deleteRow() L148-183 → [E5] msgBox.DialogHide [YES] (L156) → pay.Pay26_TaxCalcTable.deleteByDate → retrieve() */}
          <Button type="delete" onClick={list.deleteRow}>삭제</Button>
        </>}
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: '0 0 15%', minWidth: 0 }}>
          {/* [E4] grid.SelectionChanged (L101) → retrievePage(): 고른 적용일의 상세를 읽는다 */}
          <SingleGrid<PayStartDate>
            gridRef={list.gridRef}
            rowData={list.dates}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.id)}
            onSelect={list.setSelected}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pay26_TabPage_TaxCalc date={list.selected} tick={list.tick} />
        </div>
      </div>
      <Pay26_Popup_TaxCalcCreate open={openCreate} onCreated={list.retrieve} onClose={() => setOpenCreate(false)} />
    </div>
  );
});
