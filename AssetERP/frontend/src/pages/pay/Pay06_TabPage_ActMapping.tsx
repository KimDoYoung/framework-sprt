/**
 * 계약서 Mapping 탭 — Sys00_Lookup_Mapping(Mapping 창)의 "계약서" 탭 (EE67)
 * AS-IS: myApp/client/vi/pay/Pay06_TabPage_ActMapping.java (234줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-102: 툴바 [행 추가][행 삭제] + 오른쪽 새로고침 아이콘, 체크 다중 셀 편집 그리드
 *   매뉴 150 · 사원구분 100(콤보 EmpKindCode) · 제목 400 · 내용 60(아이콘) · 비고 400. 삭제는 화면에서만 빼 두었다가 [저장]에서 서버에 보낸다(deleteList)
 * 매뉴는 menuCode "D01"(연봉계약현황) 고정. [저장]은 부모 창이 updateCheck()로 부른다
 * 같은 API(pay/act-mappings)·내용 편집창(Pay06_Lookup_ActMapping)은 S13 계약서 Mapping(Pay06_Lookup_ActList)과 같다
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PayActMapping } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay06_Lookup_ActMapping } from './Pay06_Lookup_ActMapping';

const gb = gbFor<PayActMapping>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

const MENU_CODE = 'D01';
const MENU_NAME = '연봉계약현황';

export interface Pay06_TabPage_ActMappingHandle {
  /** updateCheck() L230-233 → update() */
  updateCheck: () => Promise<void>;
}

export const Pay06_TabPage_ActMapping = forwardRef<Pay06_TabPage_ActMappingHandle, { active: boolean }>(({ active }, ref) => {
  // deleteList: [행 삭제]로 화면에서 뺀 기존 행. [저장]에서 서버에 보낸다
  const deleteList = useRef<number[]>([]);
  const [kinds, setKinds] = useState<Code[]>([]);
  const [mappingRow, setMappingRow] = useState<PayActMapping | null>(null);

  const crud = useGridCrud<PayActMapping>({
    idField: 'actMappingId',
    // retrieve() L162-170: pay.Pay06_ActMapping.selectByLinkCode(companyId, linkCode "D01", kindCode "%")
    search: useCallback(() => payApi.searchActMappings(MENU_CODE), []),
    save: useCallback(async () => [], []),
    remove: useCallback(async () => 0, []),
    // insertRow() L143-152: 회사·linkCode = menuCode·linkName = menuName·defaultYn false
    newRow: () => ({ linkCode: MENU_CODE, linkName: MENU_NAME, defaultYn: false }),
    firstEditField: 'title',
  });
  const { retrieve: retrieveRows } = crud;

  // retrieve() L162-170: deleteList.clear() 뒤 조회 — 새로고침 아이콘(E1)도 같다
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    await retrieveRows();
  }, [retrieveRows]);

  // [E0] 화면 열림 (생성자 L59-102) → retrieve(). 콤보는 buildGrid() L104-141의 ComboBoxField("EmpKindCode")
  useEffect(() => {
    if (!active) return;
    void retrieve();
    sysApi.searchCodes('EmpKindCode').then(setKinds).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // [E3] deleteButton[행 삭제].Select (L74) → deleteRow() L154-160: 고른 행을 deleteList에 담고 화면에서 뺀다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    deleteList.current = [...deleteList.current, ...selected.filter(r => r.actMappingId > 0).map(r => r.actMappingId)];
    crud.removeRows(selected.map(r => r.actMappingId));
  };

  // update() L172-228: 기본설정(defaultYn)이 둘 이상이면 "기본설정 값은 단일이어야합니다". 열은 숨겨져 있어 DB에 저장된 값만 센다
  const update = async () => {
    crud.gridRef.current?.api.stopEditing();
    if (crud.rows.filter(r => r.defaultYn).length > 1) {
      message.warning('기본설정 값은 단일이어야합니다');
      return;
    }
    const changed = crud.getChanged();
    try {
      if (changed.length > 0) await payApi.saveActMappings(changed);
      if (deleteList.current.length > 0) await payApi.deleteActMappings(deleteList.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    // L226: 바뀐 게 없어도 "정상적으로 저장되었습니다"
    message.success('정상적으로 저장되었습니다');
    await retrieve();
  };
  useImperativeHandle(ref, () => ({ updateCheck: update }));

  // buildGrid() L104-141: 체크 다중, 매뉴 150(가운데) · 사원구분 100(콤보 EmpKindCode, [E4] Collapse → kindCode) · 제목 400 · 내용 60(Edit 아이콘) · 비고 400
  const columnDefs = useMemo(() => [
    gb.textCenter('linkName', 150, '매뉴'),
    gb.text('kindName', 100, '사원구분', {
      editor: 'select',
      values: [...new Set(kinds.map(c => c.name))],
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d.kindName = p.newValue;
        d.kindCode = kinds.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
    gb.text('title', 400, '제목', { editor: 'text' }),
    iconCell<PayActMapping>('edit', 'actionCell', 60, '내용', row => setMappingRow(row)),
    gb.text('note', 400, '비고', { editor: 'text' }),
  ], [kinds]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E2] insertButton[행 추가].Select (L68) → insertRow() — crud.addRow (항상 맨 아래, 03 원칙 17) */}
          <Button type="addRow" onClick={() => crud.addRow()}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
        </div>
        {/* [E1] anchor.MouseDown (L62) → retrieve() */}
        <ReloadOutlined style={{ cursor: 'pointer', paddingRight: 8 }} onMouseDown={() => void retrieve()} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<PayActMapping> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
      </div>
      {/* 내용 아이콘 L109-125: Pay06_Lookup_ActMapping.open(model, callback) → 선택 행의 content만 addChange (저장은 [저장]에서) */}
      <Pay06_Lookup_ActMapping
        model={mappingRow}
        onResult={row => crud.updateRow(row.actMappingId, { content: row.content })}
        onClose={() => setMappingRow(null)}
      />
    </div>
  );
});
Pay06_TabPage_ActMapping.displayName = 'Pay06_TabPage_ActMapping';
