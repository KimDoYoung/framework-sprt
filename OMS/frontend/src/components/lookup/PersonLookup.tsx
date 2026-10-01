import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { Trans } from '../../types/emp';

interface PersonLookupProps {
  open: boolean;
  onCancel: () => void;
  /** 체크한 사원 (multiple=false면 1명) */
  onOk: (rows: Trans[]) => void;
  multiple?: boolean;
  title?: string;
  /** 다른 회사 사원 (KFS 관리자 화면, AS-IS open(companyId, …)). 없으면 로그인 회사 */
  companyId?: number;
}

/** 사원 선택 팝업 (AS-IS client/vi/emp/Emp01_Lookup_PersonModel). 조직/직무/성명으로 검색 */
export const PersonLookup: React.FC<PersonLookupProps> = ({ open, onCancel, onOk, multiple = true, title = '사원 선택', companyId }) => {
  const gridRef = useRef<AgGridReact<Trans>>(null);
  const [text, setText] = useState('');
  const [rows, setRows] = useState<Trans[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await empApi.searchTrans(text, undefined, companyId));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [text, companyId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); }, [open]);

  const columnDefs = useMemo<ColDef<Trans>[]>(() => [
    { field: 'orgKorNm', headerName: '조직', width: 140 },
    { field: 'empNo', headerName: '사번', width: 80 },
    { field: 'korNm', headerName: '성명', width: 80 },
    { field: 'titleNm', headerName: '직책', flex: 1 },
  ], []);

  const handleOk = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('사원을 선택하세요.');
      return;
    }
    onOk(selected);
  };

  return (
    <Modal open={open} title={title} width={520} onOk={handleOk} onCancel={onCancel} okText="확인" cancelText="취소" destroyOnClose>
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text strong>조직/직무/성명</Typography.Text>
        <Input style={{ width: 180 }} value={text} onChange={e => setText(e.target.value)} onPressEnter={retrieve} allowClear />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ height: 400 }}>
        <AgGridReact<Trans>
          ref={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.transId)}
          rowSelection={multiple
            ? { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: true }
            : { mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDoubleClicked={e => { if (!multiple && e.data) onOk([e.data]); }}
        />
      </div>
    </Modal>
  );
};
