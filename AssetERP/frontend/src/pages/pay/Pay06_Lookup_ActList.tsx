/**
 * 계약서 Mapping (S13) — Pay01_Tab_Annual의 [계약서 양식작성]에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay06_Lookup_ActList.java (314줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-169: 1200×400 모달 "계약서 Mapping"(닫기 X 없음), 위 툴바([행 추가][행 삭제][문서분류지정] + 새로고침 아이콘), 그리드(체크 다중 + 셀 편집:
 *   매뉴 150 · 사원구분 120(콤보 EmpKindCode) · 제목 400 · 내용 60(아이콘) · 비고 440), 아래 가운데 [저장][닫기]. 삭제는 화면에서만 빼 두었다가 [저장]에서 서버에 보낸다(deleteList)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PayActMapping } from '@/types/pay';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Pay06_Lookup_ActMapping } from './Pay06_Lookup_ActMapping';

const gb = gbFor<PayActMapping>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

interface Props {
  open: boolean;
  /** open(menuCode, menuName, callback) L69·L76 — 매뉴 코드(없으면 retrieve가 "D01")와 이름 */
  menuCode: string;
  menuName: string;
  /** [닫기]의 callback.execute() — 부른 쪽이 문서분류 안내를 다시 읽는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Pay06_Lookup_ActList: React.FC<Props> = ({ open, menuCode, menuName, onClosed, onClose }) => {
  // deleteList: [행 삭제]로 화면에서 뺀 기존 행. [저장]에서 서버에 보낸다
  const deleteList = useRef<number[]>([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [kinds, setKinds] = useState<Code[]>([]);
  const [mappingRow, setMappingRow] = useState<PayActMapping | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);

  const crud = useGridCrud<PayActMapping>({
    idField: 'actMappingId',
    // retrieve() L232-246: pay.Pay06_ActMapping.selectByLinkCode(companyId, kindCode "%", linkCode = menuCode ?? "D01")
    search: useCallback(() => payApi.searchActMappings(menuCode || 'D01'), [menuCode]),
    save: useCallback(async () => [], []),
    remove: useCallback(async () => 0, []),
    // insertRow() L213-222: 회사·linkCode = menuCode·linkName = menuName·defaultYn false
    newRow: () => ({ linkCode: menuCode, linkName: menuName, defaultYn: false }),
    firstEditField: 'title',
  });
  const { retrieve: retrieveRows } = crud;

  // retrieve() L232-246: deleteList.clear() 뒤 조회 — 새로고침 아이콘(E1)도 같다
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    setDeleteCount(0);
    await retrieveRows();
  }, [retrieveRows]);

  // [E0] 화면 열림 (생성자 L84-169) → show(), retrieve(). 콤보는 buildGrid() L171-211의 ComboBoxField("EmpKindCode")
  useEffect(() => {
    if (!open) return;
    void retrieve();
    sysApi.searchCodes('EmpKindCode').then(setKinds).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] insertButton[행 추가].Select (L101) → insertRow() — crud.addRow (항상 맨 아래, 03 원칙 17)

  // [E3] deleteButton[행 삭제].Select (L107) → deleteRow() L224-230: 고른 행을 deleteList에 담고 화면에서 뺀다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    deleteList.current = [...deleteList.current, ...selected.filter(r => r.actMappingId > 0).map(r => r.actMappingId)];
    setDeleteCount(deleteList.current.length);
    crud.removeRows(selected.map(r => r.actMappingId));
  };

  // [E5] updateButton[저장].Select (L126) → updateCheck() L306-309 → update() L248-304
  const updateCheck = async () => {
    // 기본설정(defaultYn)이 둘 이상이면 "기본설정 값은 단일이어야합니다" (L278-287). 열은 숨겨져 있어 DB에 저장된 값만 센다
    const all = (crud.rows as PayActMapping[]);
    if (all.filter(r => r.defaultYn).length > 1) {
      message.warning('기본설정 값은 단일이어야합니다');
      return;
    }
    const changed = crud.getChanged();
    if (changed.length + deleteList.current.length === 0) {
      message.warning('변경된 내용이 없습니다');
      return;
    }
    try {
      if (changed.length > 0) await payApi.saveActMappings(changed);
      if (deleteList.current.length > 0) await payApi.deleteActMappings(deleteList.current);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('정상적으로 저장되었습니다');
    await retrieve();
  };

  // [E6] cancleButton[닫기].Select [callback != null] (L132) → callback.execute(), hide()
  const close = () => {
    onClosed?.();
    onClose();
  };

  // buildGrid() L171-211: 체크 다중, 매뉴 150(가운데) · 사원구분 120(콤보 EmpKindCode, [E7] Collapse → kindCode) · 제목 400 · 내용 60(Edit 아이콘) · 비고 440
  const columnDefs = useMemo(() => [
    gb.textCenter('linkName', 150, '매뉴'),
    gb.text('kindName', 120, '사원구분', {
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
    gb.text('note', 440, '비고', { editor: 'text' }),
  ], [kinds]);

  const saveCount = { ...crud.changes, modified: crud.changes.modified + deleteCount };

  return (
    <>
      <LookupModal
        open={open}
        title="계약서 Mapping"
        width={1250}
        maskClosable={false}
        closable={false}
        onCancel={close}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" count={saveCount} onClick={updateCheck}>저장</Button>
              <Button type="close" onClick={close}>닫기</Button>
            </Space>
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 340 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="addRow" onClick={() => crud.addRow()}>행 추가</Button>
            <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            {/* [E4] dcrLinkButton[문서분류지정].Select (L113) → Dcr30_Lookup_Link.open("D01", callback{}) */}
            <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
            {/* [E1] anchor.MouseDown (L95) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<PayActMapping> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
          </div>
        </div>
      </LookupModal>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="D01" onClose={() => setLinkOpen(false)} />
      {/* 내용 아이콘 L175-191: Pay06_Lookup_ActMapping.open(model, callback) → 선택 행의 content만 addChange (저장은 [저장]에서) */}
      <Pay06_Lookup_ActMapping
        model={mappingRow}
        onResult={row => crud.updateRow(row.actMappingId, { content: row.content })}
        onClose={() => setMappingRow(null)}
      />
    </>
  );
};
