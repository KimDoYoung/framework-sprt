/**
 * 결재선 지정그룹 조회창 (E16, apr 도메인) — Dcr01_Grid_DocType의 추가결재 칸 트리거에서 연다
 * AS-IS: myApp/client/vi/apr/Apr30_Lookup_ApprStepGroup.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-71: 모달 700×500 "지정그룹", 위 툴바([조회]) + 그리드(문서결재선 그룹명 250 · 비고 350), 아래 가운데 [확인][선택안함][취소]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprStepGroup } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<AprApprStepGroup>();

interface Props {
  /** open(callback) L43 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(그룹) — [확인]·더블클릭, [선택안함]은 null */
  onResult: (group: AprApprStepGroup | null) => void;
  onClose: () => void;
}

export const Apr30_Lookup_ApprStepGroup: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [rows, setRows] = useState<AprApprStepGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<AprApprStepGroup>>(null);

  // buildGrid() L106-112
  const columnDefs = useMemo(() => [
    gb.text('apprStepGroupName', 250, '문서결재선 그룹명'),  // L109
    gb.text('note', 350, '비고'),  // L110
  ], []);

  // [E1] retrieveButton[조회].Select (L74) → retrieve() L114-123: 서비스 apr.Apr30_ApprStepGroup.selectByCompanyId(companyId)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await aprApi.searchApprStepGroups());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L47-71) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] oKButton[확인].Select (L80) · [E5] grid.CellDoubleClick (L98) → confirm("update") L125-140: 고른 것이 없으면 "선택된 지정그룹이 없습니다"
  const confirm = (group?: AprApprStepGroup) => {
    const picked = group ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!picked) {
      message.warning('선택된 지정그룹이 없습니다');
      return;
    }
    onResult(picked);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="지정그룹"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E3] noneButton[선택안함].Select (L86) → confirm("none"): callback.execute(null); hide() */}
            <Button type="select" onClick={() => { onResult(null); onClose(); }}>선택안함</Button>
            {/* [E4] hideButton[취소].Select (L92) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space style={{ height: 42 }}>
          <Button type="search" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprApprStepGroup> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading}
            getRowId={p => String(p.data.apprStepGroupId)} onRowDoubleClicked={e => { if (e.data) confirm(e.data); }} />
        </div>
      </div>
    </Modal>
  );
};
