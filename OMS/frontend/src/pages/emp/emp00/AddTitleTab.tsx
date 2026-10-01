import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal, Space, Typography, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { empApi } from '../../../api/emp';
import { errorMessage } from '../../../api/client';
import { AddTitle } from '../../../types/emp';
import { AddTitleModal } from './AddTitleModal';

/** 겸직발령 탭 (AS-IS Emp04_TabPage_AddTitle). 등록·수정은 팝업, 삭제는 겸직 행만 */
export const AddTitleTab: React.FC<{ personId?: number }> = ({ personId }) => {
  const gridRef = useRef<AgGridReact<AddTitle>>(null);
  const [rows, setRows] = useState<AddTitle[]>([]);
  const [target, setTarget] = useState<Partial<AddTitle> & { personId: number }>();

  const retrieve = useCallback(async () => {
    if (personId == null) { setRows([]); return; }
    try {
      setRows(await empApi.searchAddTitles(personId));
    } catch (err) {
      message.error(errorMessage(err, '겸직 조회 실패'));
    }
  }, [personId]);

  useEffect(() => { retrieve(); }, [retrieve]);

  const remove = () => {
    const checked = gridRef.current?.api?.getSelectedRows()[0];
    if (!checked) {
      message.warning('삭제할 겸직을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제', content: '선택한 정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await empApi.deleteAddTitle(checked.addTitleId);
          retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const EditCell = useCallback((p: ICellRendererParams<AddTitle>) => (
    p.data ? <EditOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => setTarget(p.data)} /> : null
  ), []);

  const columnDefs = useMemo<ColDef<AddTitle>[]>(() => [
    { field: 'startDate', headerName: '겸직시작일', width: 120 },
    { field: 'closeDate', headerName: '종료일', width: 120 },
    { field: 'orgNm', headerName: '조직', width: 200 },
    { field: 'titleNm', headerName: '직책', width: 100 },
    { field: 'posNm', headerName: '직위', width: 100 },
    { field: 'empNo', headerName: '겸직사번', width: 120 },
    { field: 'transReason', headerName: '겸직사유', flex: 1, minWidth: 200 },
    { headerName: '수정', width: 70, cellRenderer: EditCell, cellStyle: { textAlign: 'center' } },
  ], [EditCell]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>겸직발령</Typography.Text>
        <Button type="primary" onClick={retrieve} disabled={personId == null}>조회</Button>
        <Button onClick={() => personId != null && setTarget({ personId })} disabled={personId == null}>등록</Button>
        <Button danger onClick={remove} disabled={personId == null}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<AddTitle> ref={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.addTitleId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
      <AddTitleModal target={target} onClose={() => setTarget(undefined)} onSaved={() => { setTarget(undefined); retrieve(); }} />
    </div>
  );
};
