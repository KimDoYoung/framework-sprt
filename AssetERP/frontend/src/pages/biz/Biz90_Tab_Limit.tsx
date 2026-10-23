/**
 * 이익제공 기준관리(준감인) (L01) — 준법감시 > 40. 이익제공(수령)현황 > 이익제공 기준관리(준감인) #1130
 * AS-IS: myApp/client/vi/biz/Biz90_Tab_Limit.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-75: 위 = 툴바 [조회][등록][저장][삭제][직원 자동등록 설정], 아래 = 셀 편집 그리드(행번호, 체크박스 다중:
 *   적용시작일 100 · 제공/수령 150(콤보) · [편익 기준액] 일반 200 · 경조 200 · [편익상대방 한도액] 인별 1회 200 · 인별 연간 200 · 회사별 연간 200)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { bizLimitApi } from '@/api/biz';
import { sysApi } from '@/api/sys';
import { BizLimit } from '@/types/biz';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Biz04_Lookup_EmpSetup } from './Biz04_Lookup_EmpSetup';

const gb = gbFor<BizLimit>();
/** setHtmlGridStyle / setHtmlIconGridStyle(…, "0069B4"): 파란 굵은 글씨 헤더 */
const BLUE_HEADER = { color: '#0069B4', fontWeight: 'bold' } as const;

export const Biz90_Tab_Limit: React.FC = () => {
  const [rcvTypes, setRcvTypes] = useState<Code[]>([]);
  const [setupOpen, setSetupOpen] = useState(false);

  const crud = useGridCrud<BizLimit>({
    idField: 'limitId',
    // retrieve() L139-149: 서비스 biz.Biz90_Limit.selectByCompanyId(companyId = 로그인 회사)
    search: bizLimitApi.searchLimits,
    // update() L151-155: GridUpdate → biz.Biz90_Limit.update (UpdateDataModel — 필수값 검사 없음)
    save: bizLimitApi.saveLimits,
    // deleteRow() L184-188: GridDeleteData → biz.Biz90_Limit.delete
    remove: bizLimitApi.deleteLimits,
    // [E4] deleteButton[삭제].Select (L96) → deleteChk() L164-182: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 300) → [E7] msgBox.DialogHide [YES] (L167) → deleteRow()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // [E2] insertButton[등록].Select (L84) → insertRow() L157-162: GridInsertRow, companyId ← 로그인 회사(서버가 채운다)
    newRow: useCallback(() => ({}), []),
    firstEditField: 'startDate',
  });

  // [E0] 화면 열림 (생성자 L51-75) → setting(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    sysApi.searchCodes('ProvideRcvType').then(setRcvTypes).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // buildGrid() L111-137
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L124 (원본 100 — UX-08 편집 날짜는 120)
    // [E6] provideRcvComboBox[ProvideRcvType].Collapse (L116) → 고른 이름에 맞춰 코드(provideRcvType)도 바꾼다
    gb.textCenter('provideRcvTypeName', 150, '제공/수령', {  // L125
      editor: 'select',
      values: rcvTypes.map(c => c.name),
      valueSetter: p => {
        p.data.provideRcvTypeName = p.newValue;
        p.data.provideRcvType = rcvTypes.find(c => c.name === p.newValue)?.code ?? p.data.provideRcvType;
        return true;
      },
    }),
    // addHeaderGroupMap(0, 4, "편익 기준액"(setHtmlGridStyle), 1, 2) L119
    { ...gb.group('편익 기준액', [
      gb.long('saleRuleLimit1', 200, '일반', { editor: 'number', headerStyle: BLUE_HEADER }),  // L126 (색 0069B4)
      gb.long('saleRuleLimit2', 200, '경조', { editor: 'number', headerStyle: BLUE_HEADER }),  // L127
    ]), headerStyle: BLUE_HEADER },
    // addHeaderGroupMap(0, 6, "편익상대방 한도액") L120
    gb.group('편익상대방 한도액', [
      gb.long('companyLimit1', 200, '인별 1회', { editor: 'number' }),  // L128
      gb.long('companyLimit2', 200, '인별 연간', { editor: 'number' }),  // L129
      gb.long('companyLimit3', 200, '회사별 연간', { editor: 'number' }),  // L130
    ]),
  ], [rcvTypes]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L78) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L84) → insertRow() */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L90) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
          {/* [E5] empSetupButton[직원 자동등록 설정].Select (L102) → new Biz04_Lookup_EmpSetup().open() */}
          <Button type="assign" onClick={() => setSetupOpen(true)}>직원 자동등록 설정</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<BizLimit> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Biz04_Lookup_EmpSetup open={setupOpen} onClose={() => setSetupOpen(false)} />
    </div>
  );
};
