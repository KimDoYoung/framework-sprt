/**
 * 기타설정 탭 (E22-3) — Pay20_Tab_DeductAdmin 하위 9번째 탭
 * AS-IS: myApp/client/vi/pay/Pay29_TabPage_OtherSetupDate.java (218줄, 새 원본 IDMS-IC) — 적용일 목록 탭: 위 툴바 + 왼쪽 적용일 그리드 15% | 오른쪽 Pay29_TabPage_OtherSetup 85%
 * 서비스 pay.Pay29_OtherSetup.selectByAll (L147)·deleteByDate (L181). 조회·첫 행 선택·삭제 로직은 usePayDateList(적용일 목록 탭 공통)
 * 부모(Pay20_Tab_DeductAdmin)가 forwardRef 핸들로 retrieve()를 부른다(탭을 고를 때 retrieveTabpage)
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Space } from 'antd';
import { payApi } from '@/api/pay';
import { PayStartDate } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { PayTabPageHandle } from './Pay20_TabPage_Item';
import { Pay29_TabPage_OtherSetup } from './Pay29_TabPage_OtherSetup';
import { Pay29_Popup_OtherSetupCreate } from './Pay29_Popup_OtherSetupCreate';
import { usePayDateList } from './usePayDateList';

const gb = gbFor<PayStartDate>();

// [E0] 화면 열림 (생성자 L52-54) → settings() L56-126: 툴바([조회] · 관리자 회사만 [등록][삭제]) + 왼쪽 적용시작일 그리드 15% | 오른쪽 Pay29_TabPage_OtherSetup 85%, 마지막에 retrieve()
export const Pay29_TabPage_OtherSetupDate = forwardRef<PayTabPageHandle>((_props, ref) => {
  const list = usePayDateList(payApi.searchOtherSetupDates, payApi.deleteOtherSetupDate);
  const [openCreate, setOpenCreate] = useState(false);
  const columnDefs = useMemo(() => [gb.date('startDate', 190, '적용시작일')], []);  // buildGrid() L110-115

  useImperativeHandle(ref, () => ({ retrieve: list.retrieve }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap style={{ flex: 'none' }}>
        {/* [E1] retrieveButton[조회].Select (L68) → retrieve() L141-155 */}
        <Button type="search" onClick={list.retrieve}>조회</Button>
        {list.isAdminCompany && <>
          {/* [E2] insertButton[등록].Select (L74) → insert() L157-164: 적용일 생성 창을 열고 끝나면 retrieve() */}
          <Button type="register" onClick={() => setOpenCreate(true)}>등록</Button>
          {/* [E3] deleteButton[삭제].Select (L80) → deleteRow() L166-201 → [E5] msgBox.DialogHide [YES] (L174) → pay.Pay29_OtherSetup.deleteByDate → retrieve() */}
          <Button type="delete" onClick={list.deleteRow}>삭제</Button>
        </>}
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: '0 0 15%', minWidth: 0 }}>
          {/* [E4] grid.SelectionChanged (L119) → retrievePage(): 고른 적용일의 상세를 읽는다 */}
          <SingleGrid<PayStartDate>
            gridRef={list.gridRef}
            rowData={list.dates}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.id)}
            onSelect={list.setSelected}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pay29_TabPage_OtherSetup date={list.selected} tick={list.tick} />
        </div>
      </div>
      {/* buttonBarBottom(south 60): 국민연금 상ㆍ하한액 적용예시 안내 */}
      <div style={{ flex: 'none', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
        ※ 국민연금 상ㆍ하한액 적용예시<br />
        2024.7.1부터 소득월액 390,000원 미만으로 신고한 가입자는 월소득액을 390,000원으로 6,170,000원 초과자는 월소득액을 6,170,000으로 결정하여 국민연금을 계산한다.
      </div>
      <Pay29_Popup_OtherSetupCreate open={openCreate} onCreated={list.retrieve} onClose={() => setOpenCreate(false)} />
    </div>
  );
});
