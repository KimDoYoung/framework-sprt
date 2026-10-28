/**
 * 휴가기준관리 창 — 휴가관리(Emp20_Tab_LeaveManager, S06)의 [기본설정]에서 연다 (AS-IS open()).
 * AS-IS: myApp/client/vi/sys/Sys31_Lookup_LeaveCompany.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L48-84: 모달 900×600 "휴가기준관리"(닫기 X 없음), 툴바(왼쪽 [조회][저장] · 오른쪽 [특별휴가 추가]), 셀 편집 그리드 5열(행번호만, 체크 없음), 아래 안내 글, 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys09_Lookup_Code } from '@/components/lookup/Sys09_Lookup_Code';
import { sysApi, sysLeaveCompanyApi } from '@/api/sys';
import { Code, LeaveCompany } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<LeaveCompany>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sys31_Lookup_LeaveCompany: React.FC<Props> = ({ open, onClose }) => {
  const [calcCodes, setCalcCodes] = useState<Code[]>([]);
  const [codeOpen, setCodeOpen] = useState(false);

  const crud = useGridCrud<LeaveCompany>({
    idField: 'leaveCompanyId',
    // retrieve() L138-149: 서비스 sys.Sys31_LeaveCompany.selectByCompanyId(companyId)
    search: useCallback(() => sysLeaveCompanyApi.search(), []),
    // update() L151-160: GridUpdate → sys.Sys31_LeaveCompany.update → "저장이 완료되었습니다." 뒤 retrieve()
    save: useCallback(async (rows: LeaveCompany[]) => { await sysLeaveCompanyApi.save(rows); return rows; }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
    reloadAfterSave: true,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L48-84, open() L86-88) → settings(), show(), retrieve(). 콤보는 buildGrid() L120의 ComboBoxField("LeaveDaysCalcType")
  useEffect(() => {
    if (!open) return;
    void retrieve();
    sysApi.searchCodes('LeaveDaysCalcType').then(setCalcCodes).catch(() => undefined);
  }, [open, retrieve]);

  // buildGrid() L117-136 — [E5] calcTypeCombo[LeaveDaysCalcType].Collapse (L121): 이름과 코드(calcCode)를 같이 바꾼다
  const columnDefs = useMemo(() => [
    gb.text('leaveName', 150, '휴가구분'),  // L129
    gb.text('spcLeaveName', 400, '특별휴가<br>상세구분'),  // L130
    gb.longCenter('days', 100, '특별휴가<br>기간(일)', { editor: 'number' }),  // L131
    gb.text('calcName', 100, '기간계산기준', {  // L132
      editor: 'select',
      values: [...new Set(calcCodes.map(c => c.name))],
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.calcName = p.newValue;
        d.calcCode = calcCodes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.boolean('unUseYn', 80, '미사용', { editable: true }),  // L133
  ], [calcCodes]);

  return (
    <LookupModal
      open={open}
      title="휴가기준관리"
      width={990}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E4] cancelButton[닫기].Select (L109) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 480, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L91) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          {/* [E2] updateButton[저장].Select (L97) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <div style={{ flex: 1 }} />
          {/* [E3] spcLeaveButton[특별휴가 추가].Select (L103) → lookupCode() L162-169: Sys09_Lookup_Code.edit("SpecialLeaveCode", callback{}) */}
          <Button type="register" onClick={() => setCodeOpen(true)}>특별휴가 추가</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<LeaveCompany> crud={crud} columnDefs={columnDefs} />
        </div>
        <div style={{ margin: '12px 0 0 10px', fontSize: 13, fontWeight: 'bold', color: '#4A7DB1' }}>
          ※ "특별휴가기간" 미입력시 기간체크 없음
        </div>
      </div>
      <Sys09_Lookup_Code open={codeOpen} codeKind="SpecialLeaveCode" onResult={() => undefined} onClose={() => setCodeOpen(false)} />
    </LookupModal>
  );
};
