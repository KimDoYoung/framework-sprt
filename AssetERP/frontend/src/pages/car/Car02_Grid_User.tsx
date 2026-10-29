/**
 * 전용차량 사용자관리 그리드 (T10) — Car01_Tab_Info 아래 오른쪽(나머지 폭)에 붙는 그리드
 * AS-IS: myApp/client/vi/car/Car02_Grid_User.java (203줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-63: 툴바(조회·등록·저장·삭제, 높이 50) + 셀 편집 그리드(체크 다중). 차량구분이 전용차량(1)이 아니면 통째로 비활성
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { CarUser } from '@/types/car';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<CarUser>();

interface Props {
  /** retrieve(infoId) L118-121: 고른 차량정보. 저장 전 새 행이면 undefined(AS-IS infoId == null) */
  infoId?: number;
  /** 전용차량(1)일 때만 true — AS-IS userGrid.setEnabled */
  enabled: boolean;
}

export const Car02_Grid_User: React.FC<Props> = ({ infoId, enabled }) => {
  // [E0] 화면 열림 (생성자 L52-63) → settings() — 버튼 이벤트 연결(아래 E1~E4), 툴바 + 그리드 배치
  const infoIdRef = useRef(infoId);
  infoIdRef.current = infoId;
  const [lookupTarget, setLookupTarget] = useState<CarUser | null>(null);

  const crud = useGridCrud<CarUser>({
    idField: 'userId',
    // retrieve() L140-146: grid.store.clear() 뒤 car.Car02_User.selectByInfoId(infoId)
    search: useCallback(async () => (infoIdRef.current == null ? [] : carApi.searchUsers(infoIdRef.current)), []),
    // update() L149-169: GridUpdate → car.Car02_User.update (저장된 행으로 제자리 교체)
    save: useCallback((rows: CarUser[]) => carApi.saveUsers(rows), []),
    // deleteRow() L172-195: [YES] → car.Car02_User.delete
    remove: useCallback((ids: number[]) => carApi.deleteUsers(ids), []),
    deleteConfirm: '선택한 내용을 삭제하시겠습니까?',
    newRow: useCallback(() => ({ infoId: infoIdRef.current }), []),
    // update() L156-164: 시작일자·직원 필수
    validate: useCallback((changed: CarUser[]) => {
      for (const r of changed) {
        if (!r.startDate) return '시작일자는 필수선택 항목입니다.';
        if (r.personId == null) return '직원은 필수선택 항목입니다.';
      }
      return undefined;
    }, []),
  });

  // 차량정보를 고르면 그 사용자 목록을 읽는다(Tab의 userGrid.retrieve(infoId))
  useEffect(() => { void crud.retrieve(); }, [infoId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[등록].Select [infoId == null] (L72) → insertRow() L198-202
  const insertRow = () => {
    if (infoId == null) { message.warning('차량정보를 먼저 선택해주세요'); return; }
    crud.addRow();
  };

  /** buildGrid() L97-116 (setChecked MULTI) */
  const columnDefs = useMemo<ColDef<CarUser>[]>(() => [
    gb.date('startDate', 100, '시작일자', { editor: 'date' }),  // L110
    gb.date('closeDate', 100, '종료일자', { editor: 'date' }),  // L111
    // L112 personName + lookupEmpInfo(LookupTriggerField, setEditable(false)) — 아이콘으로 사원찾기 (E5)
    gb.text('personNm', 100, '직원', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<CarUser>) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setLookupTarget(p.data); }} />
          {p.value}
        </>
      ),
    }),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box',
      opacity: enabled ? 1 : 0.6, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
        {/* [E1] retrieveButton[조회].Select (L66) → retrieve() */}
        <Button type="search" onClick={crud.retrieve}>조회</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L83) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L89) → deleteRow() → [E6] messageBox.DialogHide [YES] (L175) */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CarUser> crud={crud} columnDefs={columnDefs} />
      </div>
      {/* [E5] lookupEmpInfo.TriggerClick (L99) → openLookupEmpInfo() L123-137: open(new Date(), true, cb) → 그 행의 직원 ID·이름·차량정보 ID를 변경으로 */}
      <Emp00_Lookup_SelectSingle
        open={lookupTarget != null}
        separateAddTitle
        noneLabel={null}
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={r => {
          if (lookupTarget && r) crud.updateRow(lookupTarget.userId, { personId: r.personId, personNm: r.korNm, infoId });
          setLookupTarget(null);
        }}
        onClose={() => setLookupTarget(null)}
      />
    </div>
  );
};
