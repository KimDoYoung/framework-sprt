import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { Code } from '../../types/sys';

interface CodeLookupProps {
  open: boolean;
  codeKindId?: number;
  /** KFS 관리자가 고른 회사 (없으면 로그인 회사) */
  companyId?: number;
  onCancel: () => void;
  onOk: (codes: Code[]) => void;
}

/** 공통코드 다중 선택 팝업 (AS-IS Sys09_Lookup_CodeKind, sys09_code.selectByCodeKindId) */
export const CodeLookup: React.FC<CodeLookupProps> = ({ open, codeKindId, companyId, onCancel, onOk }) => {
  const gridRef = useRef<AgGridReact<Code>>(null);
  const [text, setText] = useState('');
  const [rows, setRows] = useState<Code[]>([]);

  const retrieve = useCallback(async () => {
    if (codeKindId == null) return;
    try {
      setRows(await sysApi.searchCodes(codeKindId, companyId, text));
    } catch (err) {
      message.error(errorMessage(err, '코드 조회 실패'));
    }
  }, [codeKindId, companyId, text]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); }, [open]);

  const columnDefs = useMemo<ColDef<Code>[]>(() => [
    { field: 'code', headerName: '코드', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'name', headerName: '코드명', flex: 1 },
  ], []);

  const handleOk = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('코드를 선택해주세요');
      return;
    }
    onOk(selected);
  };

  return (
    <Modal open={open} title="코드목록" width={420} onOk={handleOk} onCancel={onCancel} okText="확인" cancelText="닫기" destroyOnClose>
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text strong>검색</Typography.Text>
        <Input style={{ width: 180 }} value={text} onChange={e => setText(e.target.value)} onPressEnter={retrieve} allowClear />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ height: 420 }}>
        <AgGridReact<Code> ref={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.codeId)}
          rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true }} />
      </div>
    </Modal>
  );
};
