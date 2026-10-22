/**
 * 작성그룹 공유 페이지 (K04) — Sch22_Lookup_WriteGroup의 오른쪽. 고른 작성그룹의 공유(부서·직원)를 읽고 더하고 지운다
 * AS-IS: myApp/client/vi/sch/Sch02_Page_Share.java (274줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L63-88): 툴바 50([부서추가][직원추가][행 삭제][저장] + 새로고침 아이콘) + 그리드(구분 70 가운데 · 작성부서 250 · 작성자 100 가운데 · 적용시작일 100 · 적용종료일 100, 체크 다중).
 *   작성그룹이 없으면 전체 비활성(retrieve(null) → setEnabled(false) + store.clear)
 * 삭제(deleteRow L226-251)는 작성내역 검사 뒤 그리드에서만 빼고 deleteList에 모아 두었다가, [저장]에서 먼저 지운 뒤 저장한다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch02Share } from '@/types/sch';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<Sch02Share>();

/** AS-IS grid() L125-136 (setChecked MULTI) */
const COLUMNS = [
  gb.textCenter('shareName', 70, '구분'),  // L129
  gb.text('orgName', 250, '작성부서'),  // L130
  gb.textCenter('personName', 100, '작성자'),  // L131
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L132
  gb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L133
];

interface Props {
  /** 고른 작성그룹 (없으면 비활성: AS-IS retrieve(null)) */
  writeGroupId: number | null;
}

export const Sch02_Page_Share: React.FC<Props> = ({ writeGroupId }) => {
  const groupRef = useRef<number | null>(writeGroupId);
  groupRef.current = writeGroupId;
  /** deleteList — 그리드에서 뺀 저장된 공유 id. [저장]에서 지운다 */
  const deleteList = useRef<number[]>([]);
  const [orgOpen, setOrgOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);

  const crud = useGridCrud<Sch02Share>({
    idField: 'shareId',
    // retrieve(Long writeGroupId) L253-273: sch.Sch02_Share.selectByInfoId2(infoId)
    search: useCallback(() => (groupRef.current == null ? Promise.resolve([]) : schApi.searchWriteGroupShares(groupRef.current)), []),
    // update() L202-224: sch.Sch02_Share.update
    save: useCallback((rows: Sch02Share[]) => schApi.saveWriteGroupShares(groupRef.current as number, rows), []),
    remove: useCallback((ids: number[]) => schApi.deleteWriteGroupShares(groupRef.current as number, ids), []),
    newRow: () => ({}),
    deleteConfirm: false,
  });

  // [E0] 화면 열림 (생성자 L63-88) → settings(), retrieve(null). 부르는 쪽 SelectionChanged → retrieve(writeGroupId)
  useEffect(() => {
    deleteList.current = [];
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeGroupId]);

  const enabled = writeGroupId != null;

  // [E2] insertButton01[부서추가].Select (L91) → insertRow("org") → openLookupOrgInfo() L138-167: Org00_Lookup_SelectMulti(오늘) → 고른 조직마다 새 행(구분 "부서"·shareCode "2")을 변경으로
  const openLookupOrgInfo = (orgs: OrgInfo[]) => {
    if (orgs.length === 0) return;
    crud.addRows(orgs.map(o => ({ shareCode: '2', shareName: '부서', infoId: writeGroupId, orgId: o.orgCodeId, orgName: o.parentFullNm })), true);
  };

  // [E3] insertButton02[직원추가].Select (L97) → insertRow("emp") → openLookupEmpInfo() L169-200: Emp00_Lookup_SelectMulti(오늘) → 고른 직원마다 새 행(구분 "직원"·shareCode "1")을 변경으로
  const openLookupEmpInfo = (list: TransInfo[]) => {
    if (list.length === 0) return;
    crud.addRows(list.map(t => ({ shareCode: '1', shareName: '직원', infoId: writeGroupId, orgId: t.orgCodeId, orgName: t.parentFullNm, personId: t.personId, personName: t.korNm })), true);
  };

  // [E5] deleteButton[행 삭제].Select (L109) → deleteRow() L226-251: sch.Sch02_Share.checkWriteGroup — 작성내역이 있으면 메시지만, 없으면 그리드에서 빼고 deleteList에 모은다
  const deleteRow = async () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    const saved = selected.map(r => r.shareId).filter(id => id > 0);
    try {
      if (saved.length > 0) await schApi.checkDeleteWriteGroupShares(saved);
    } catch (err) {
      message.warning(errorMessage(err, '작성내역이 존재하여 삭제할 수 없습니다'));
      return;
    }
    deleteList.current.push(...saved);
    crud.removeRows(selected.map(r => r.shareId));
  };

  // [E4] updateButton[저장].Select (L103) → update() L202-224: 바뀐 행의 적용시작일 검사("적용시작일을 입력하세요") → 모은 삭제(sch.Sch02_Share.delete) → sch.Sch02_Share.update
  const update = async () => {
    if (crud.getChanged().some(r => !r.startDate)) {
      message.warning('적용시작일을 입력하세요');
      return;
    }
    try {
      if (deleteList.current.length > 0) {
        await schApi.deleteWriteGroupShares(groupRef.current as number, deleteList.current);
        deleteList.current = [];
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
      return;
    }
    await crud.saveRows();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, boxSizing: 'border-box', opacity: enabled ? 1 : 0.6, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Button type="addRow" onClick={() => setOrgOpen(true)}>부서추가</Button>
        <Button type="addRow" onClick={() => setEmpOpen(true)}>직원추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
        <Button type="save" onClick={update}>저장</Button>
        {/* [E1] anchor.MouseDown (L68) → retrieve(infoId) */}
        <ReloadOutlined style={{ cursor: 'pointer', marginLeft: 6 }} title="새로고침" onMouseDown={() => { deleteList.current = []; void crud.retrieve(); }} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Sch02Share> crud={crud} columnDefs={COLUMNS} />
      </div>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={openLookupOrgInfo}
        onClose={() => setOrgOpen(false)}
      />
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={openLookupEmpInfo} onClose={() => setEmpOpen(false)} />
    </div>
  );
};
