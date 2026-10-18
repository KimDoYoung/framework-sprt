/**
 * 근로소득 공제표 탭 (E22-2) — Pay20_Tab_DeductAdmin 하위 5번째 탭
 * AS-IS: myApp/client/vi/pay/Pay24_TabPage_DeductTable.java (196줄, 새 원본 IDMS-IC) — 적용일 목록 탭: 위 툴바 + 왼쪽 적용일 그리드 15% | 오른쪽 Pay24_TabPage_Deduct 85%
 * 서비스 pay.Pay24_DeductTable.selectByAll (L128)·deleteByDate (L162). 조회·첫 행 선택·삭제 로직은 usePayDateList(세 탭 공통)
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayStartDate } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { PayTabPageHandle } from './Pay20_TabPage_Item';
import { Pay24_TabPage_Deduct } from './Pay24_TabPage_Deduct';
import { Pay24_Popup_DeductTableCreate } from './Pay24_Popup_DeductTableCreate';
import { usePayDateList } from './usePayDateList';

const gb = gbFor<PayStartDate>();

// [E0] 화면 열림 (생성자 L48-50) → settings() L52-107: 툴바([조회] · 관리자 회사만 [등록][삭제]) + 왼쪽 적용시작일 그리드 15% | 오른쪽 Pay24_TabPage_Deduct 85%, 마지막에 retrieve()
export const Pay24_TabPage_DeductTable = forwardRef<PayTabPageHandle>((_props, ref) => {
  const list = usePayDateList(payApi.searchDeductTableDates, payApi.deleteDeductTableDate);
  const [openCreate, setOpenCreate] = useState(false);
  const columnDefs = useMemo(() => [gb.date('startDate', 190, '적용시작일')], []);  // buildGrid() L111

  useImperativeHandle(ref, () => ({ retrieve: list.retrieve }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap style={{ flex: 'none' }}>
        {/* [E1] retrieveButton[조회].Select (L63) → retrieve() L124-136 */}
        <Button type="search" onClick={list.retrieve}>조회</Button>
        {list.isAdminCompany && <>
          {/* [E2] insertButton[등록].Select (L69) → insert() L138-145: 적용일 생성 창을 열고 끝나면 retrieve() */}
          <Button type="register" onClick={() => setOpenCreate(true)}>등록</Button>
          {/* [E3] deleteButton[삭제].Select (L75) → deleteRow() L147-182 → [E5] msgBox.DialogHide [YES] (L155) → pay.Pay24_DeductTable.deleteByDate → retrieve() */}
          <Button type="delete" onClick={list.deleteRow}>삭제</Button>
        </>}
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: '0 0 15%', minWidth: 0 }}>
          {/* [E4] grid.SelectionChanged (L100) → retrievePage(): 고른 적용일의 상세를 읽는다 */}
          <SingleGrid<PayStartDate>
            gridRef={list.gridRef}
            rowData={list.dates}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.id)}
            onSelect={list.setSelected}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pay24_TabPage_Deduct date={list.selected} tick={list.tick} />
        </div>
      </div>
      <Pay24_Popup_DeductTableCreate open={openCreate} onCreated={list.retrieve} onClose={() => setOpenCreate(false)} />
    </div>
  );
});
