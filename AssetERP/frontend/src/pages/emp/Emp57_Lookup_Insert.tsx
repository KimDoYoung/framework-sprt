/**
 * 그룹설정 창 — 주소록 관리(Emp10_Tab_AddrBook)·공용주소록 관리(Emp10_Tab_PublicAddrBook)의 [그룹설정]이 연다 (G11)
 * AS-IS: myApp/client/vi/emp/Emp57_Lookup_Insert.java (216줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L50-79: 모달 1200×600 "그룹설정", 왼쪽 500 = 툴바 [등록][삭제] + 그룹 그리드(단일 선택, 4열: 수정 아이콘 40 · 그룹명 230 · 전체공개 70 · 등록자 100,
 *   테두리), 오른쪽 나머지 = 그룹 담당자 탭(Emp57_TabPage_Insert), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empAddrBookApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBookGroup } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Emp57_Edit_GroupName } from './Emp57_Edit_GroupName';
import { Emp57_TabPage_Insert } from './Emp57_TabPage_Insert';

const gb = gbFor<EmpAddrBookGroup>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp57_Lookup_Insert: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<EmpAddrBookGroup>>(null);
  const [rows, setRows] = useState<EmpAddrBookGroup[]>([]);
  // grid.RowClick → tabPage.retrieve(addrBookGroupId) (L102-107). 목록을 다시 읽어도(retrieve) 바뀌지 않고, 삭제 뒤에는 null (L205-208)
  const [parentId, setParentId] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ group: EmpAddrBookGroup | null } | null>(null);

  // retrieve() L134-143: 서비스 emp.Emp57_AddrBookGroup.getPersonList(personId)
  const retrieve = useCallback(async () => {
    try {
      setRows(await empAddrBookApi.searchGroups());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 open() L50-79: settings(), show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    setParentId(null);
    setEditing(null);
    void retrieve();
  }, [open, retrieve]);

  // deleteAll() L199-211: 서비스 emp.Emp57_AddrBookGroup.deleteAll(addrBookGroupId) → retrieve(), tabPage.retrieve(null)
  const deleteAll = async (group: EmpAddrBookGroup) => {
    try {
      await empAddrBookApi.deleteGroup(group.addrBookGroupId);
      setParentId(null);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E2] deleteButton[삭제].Select (L90) → deleteRow() L155-197: 등록자가 내가 아니면 다른 문구(폭 550), 맞으면 "해당 정보를 삭제하시겠습니까?"(폭 350) → [E5]·[E6] [YES] → deleteAll()
  const deleteRow = () => {
    const group = gridRef.current?.api.getSelectedRows()[0];
    if (!group) {
      message.warning('삭제할 그룹을 선택해주세요');
      return;
    }
    const mine = group.personId === user.userId;
    Modal.confirm({
      title: '확인',
      content: mine ? '해당 정보를 삭제하시겠습니까?' : '해당 내용을 등록한 사용자가 아닙니다. 그래도 삭제를 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: mine ? 350 : 550,
      onOk: () => deleteAll(group),
    });
  };

  // buildGrid() L110-132
  const columnDefs = useMemo(() => [
    // L127 addCell(actionCell, 40, "수정", ImageCell("Edit")) → Emp57_Edit_GroupName.edit(selectModel, retrieve)
    iconCell<EmpAddrBookGroup>('edit', 'actionCell', 40, '수정', row => setEditing({ group: row })),
    gb.text('groupName', 230, '그룹명'),  // L128
    gb.booleanYn2('publicYn', 70, '전체공개'),  // L129
    gb.textCenter('personName', 100, '등록자'),  // L130
  ], []);

  return (
    <LookupModal
      open={open}
      title="그룹설정"
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancelButton[닫기].Select (L96) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex' }}>
        <div style={{ width: 500, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
          <div>
            {/* [E1] insertButton[등록].Select (L84) → insertRow() L145-153: Emp57_Edit_GroupName.insert(retrieve) */}
            <Button type="register" onClick={() => setEditing({ group: null })}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<EmpAddrBookGroup>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.addrBookGroupId)}
              // [E4] grid.RowClick (L102) → tabPage.retrieve(addrBookGroupId) L102-107
              onSelect={row => { if (row) setParentId(row.addrBookGroupId); }}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', borderLeft: 'none', padding: 8, boxSizing: 'border-box' }}>
          <Emp57_TabPage_Insert parentId={parentId} />
        </div>
      </div>
      <Emp57_Edit_GroupName open={editing != null} group={editing?.group ?? null} onSaved={() => void retrieve()} onClose={() => setEditing(null)} />
    </LookupModal>
  );
};
