/**
 * 담당자 관리 모달 (R08)
 * AS-IS: myApp/client/vi/ast/Ast10_Lookup_Manager.java (310줄)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Radio } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstManager } from '@/types/ast';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { OrgInfo, TransInfo } from '@/types/emp';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  linkId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const gb = gbFor<AstManager>();

export const Ast10_Lookup_Manager: React.FC<Props> = ({ open, linkId, onClose, onSuccess }) => {
  const [rows, setRows] = useState<AstManager[]>([]);
  const [selectedRows, setSelectedRows] = useState<AstManager[]>([]);
  const [loading, setLoading] = useState(false);
  const deletedIdsRef = useRef<number[]>([]);

  const [managerType, setManagerType] = useState<'1' | '2'>('1'); // 1: 사원, 2: 부서
  const [empLookupOpen, setEmpLookupOpen] = useState(false);
  const [orgLookupOpen, setOrgLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L135-166) → show()
  // [E1] anchor.MouseDown (L85) → retrieve()
  useEffect(() => {
    if (open && linkId) {
      retrieve();
    } else if (!open) {
      deletedIdsRef.current = [];
      setSelectedRows([]);
    }
  }, [open, linkId]);

  const retrieve = async () => {
    if (!linkId) return;
    setLoading(true);
    deletedIdsRef.current = [];
    setSelectedRows([]);
    try {
      const data = await astApi.searchManagers(linkId);
      setRows(data);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: ColDef<AstManager>[] = useMemo(
    () => [
      gb.textCenter('managerName', 70, '구분'),
      gb.text('orgName', 250, '부서'),
      gb.textCenter('personName', 100, '성명'),
      gb.boolean('reprYn', 50, '대표', {
        editable: true,
        onCellValueChanged: (params) => {
          const updated = params.data;
          setRows((prev) => prev.map((r) => (r.managerId === updated.managerId ? updated : r)));
        },
      }),
    ],
    []
  );

  // [E2] insertButton[행 추가].Select (L99) → insertRow()
  const insertRow = () => {
    if (managerType === '1') {
      setEmpLookupOpen(true);
    } else {
      setOrgLookupOpen(true);
    }
  };

  const handleEmpSelect = (selectedEmps: TransInfo[]) => {
    if (!linkId) return;
    const newItems: AstManager[] = selectedEmps.map((emp, idx) => ({
      managerId: -(Date.now() + idx),
      companyId: 0,
      linkId,
      managerType: '1',
      managerName: '사원',
      orgId: emp.orgCodeId ?? null,
      orgName: emp.orgKorNm ?? null,
      personId: emp.personId,
      personName: emp.korNm ?? null,
      reprYn: 'false',
      linkContent: 'ast01_class_tree_id',
    }));
    setRows((prev) => [...prev, ...newItems]);
  };

  const handleOrgSelect = (selectedOrgs: OrgInfo[]) => {
    if (!linkId) return;
    const newItems: AstManager[] = selectedOrgs.map((org, idx) => ({
      managerId: -(Date.now() + idx),
      companyId: 0,
      linkId,
      managerType: '2',
      managerName: '부서',
      orgId: org.orgCodeId,
      orgName: org.korNm ?? null,
      personId: null,
      personName: null,
      reprYn: 'false',
      linkContent: 'ast01_class_tree_id',
    }));
    setRows((prev) => [...prev, ...newItems]);
  };

  // [E3] deleteButton[행 삭제].Select (L105) → deleteRow()
  const deleteRow = () => {
    if (selectedRows.length === 0) {
      message.warning('삭제할 담당자를 선택하세요.');
      return;
    }
    selectedRows.forEach((r) => {
      if (r.managerId > 0) deletedIdsRef.current.push(r.managerId);
    });
    const removeIds = new Set(selectedRows.map((r) => r.managerId));
    setRows((prev) => prev.filter((r) => !removeIds.has(r.managerId)));
    setSelectedRows([]);
  };

  // [E4] updateButton[저장].Select (L142) → preCheck()
  const preCheck = async () => {
    if (!linkId) return;
    try {
      if (deletedIdsRef.current.length > 0) {
        await astApi.deleteManagers(deletedIdsRef.current);
        deletedIdsRef.current = [];
      }
      if (rows.length > 0) {
        await astApi.saveManagers(
          linkId,
          rows.map((r) => ({
            managerId: r.managerId > 0 ? r.managerId : null,
            linkId,
            managerType: r.managerType,
            orgId: r.orgId,
            personId: r.personId,
            reprYn: r.reprYn,
            linkContent: r.linkContent,
          }))
        );
      }
      message.success('담당자가 저장되었습니다.');
      onSuccess?.();
      retrieve();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E5] closeButton[닫기].Select (L148) → callback(), hide()
  const hide = () => {
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        title="담당자 관리"
        onCancel={hide}
        width={580}
        footer={[
          <Button key="addRow" type="default" onClick={insertRow}>
            행 추가
          </Button>,
          <Button key="removeRow" type="delete" onClick={deleteRow}>
            행 삭제
          </Button>,
          <Button key="save" type="save" onClick={preCheck}>
            저장
          </Button>,
          <Button key="close" type="close" onClick={hide}>
            닫기
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Radio.Group value={managerType} onChange={(e) => setManagerType(e.target.value)}>
            <Radio value="1">사원</Radio>
            <Radio value="2">부서</Radio>
          </Radio.Group>
        </div>

        <div style={{ height: 320, boxSizing: 'border-box' }}>
          <MultiGrid<AstManager>
            columnDefs={columnDefs}
            rowData={rows}
            loading={loading}
            onSelectionChanged={(e) => setSelectedRows(e.api.getSelectedRows())}
            getRowId={(p) => String(p.data.managerId)}
          />
        </div>
      </Modal>

      <Emp00_Lookup_SelectMulti
        open={empLookupOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        onClose={() => setEmpLookupOpen(false)}
        onResult={handleEmpSelect}
      />

      {orgLookupOpen && (
        <Org00_Lookup_SelectMulti
          baseDate={dayjs().format('YYYY-MM-DD')}
          onClose={() => setOrgLookupOpen(false)}
          onSelect={handleOrgSelect}
        />
      )}
    </>
  );
};
