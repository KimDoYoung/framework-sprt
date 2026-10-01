import React, { useCallback, useEffect, useState } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { TrashFile } from '../../types/sys';

const cols: ColDef<TrashFile>[] = [
  { field: 'parentId', headerName: 'parentId', width: 160 },
  { field: 'regDate', headerName: '등록일', width: 110, cellDataType: 'dateString' },
  { field: 'fileNm', headerName: '첨부파일', flex: 1, minWidth: 300 },
  { field: 'serverPath', headerName: '경로', width: 300 },
  { field: 'size', headerName: '용량(KB)', width: 100, type: 'rightAligned' },
];

/**
 * 미사용 파일조회 (AS-IS client/vi/sys/Sys10_Tab_TrashFileList). 어떤 업무 데이터에서도 참조하지 않는 sys10 파일 목록 (DB 함수 find_orphan_sys10_files).
 * AS-IS의 보기·받기·삭제·일괄삭제는 파일 본체(AS-IS 서버 경로)가 필요해 공통 파일 정책(sys10) 결정 후 변환한다 (OMS-convert §5).
 */
export const Sys10TrashFileListView: React.FC = () => {
  const [rows, setRows] = useState<TrashFile[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await sysApi.searchTrashFiles());
    } catch (err) {
      message.error(errorMessage(err, '미사용 파일 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { retrieve(); }, [retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Button type="primary" onClick={retrieve}>조회</Button>
        <Typography.Text type="secondary">{rows.length.toLocaleString()}건 · 보기·받기·삭제는 파일 정책 결정 후 제공</Typography.Text>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<TrashFile> rowData={rows} loading={loading} columnDefs={cols} getRowId={p => String(p.data.fileId)} />
      </div>
    </div>
  );
};
