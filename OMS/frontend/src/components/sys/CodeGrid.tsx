import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { Code, CodeKind } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';

interface CodeGridProps {
  codeKind?: CodeKind;
  /** 코드가 속한 회사 (시스템 코드는 0). KFS 관리자가 아니면 서버가 로그인 회사로 바꾼다 */
  companyId?: number;
  /** 저장·등록·삭제 가능 */
  editable: boolean;
}

/** 공통코드 그리드 (AS-IS client/vi/sys/Sys09_Grid_Code): 상세코드구분명 검색 + 조회/저장/등록/삭제 */
export const CodeGrid: React.FC<CodeGridProps> = ({ codeKind, companyId, editable }) => {
  const [searchText, setSearchText] = useState('');

  const search = useCallback(
    async () => (codeKind ? sysApi.searchCodes(codeKind.codeKindId, companyId, searchText) : []),
    [codeKind, companyId, searchText],
  );
  // AS-IS insertRow: 시작일 기본값 1910-01-01
  const newRow = useCallback((): Partial<Code> => ({
    companyId: companyId ?? null, codeKindId: codeKind?.codeKindId, code: '', name: '', seq: '',
    closeYn: false, applyDate: '1910-01-01', closeDate: null, note: null,
  }), [codeKind, companyId]);

  const crud = useGridCrud<Code>({
    idField: 'codeId',
    search,
    save: sysApi.updateCodes,
    remove: sysApi.deleteCodes,
    newRow,
    firstEditField: 'code',
    deleteConfirm: '선택한 코드를 삭제하시겠습니까?',
  });

  // 코드종류·회사가 바뀌면 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [codeKind, companyId]);

  const columnDefs = useMemo<ColDef<Code>[]>(() => {
    const col = (c: ColDef<Code>) => (editable ? editableCol(c) : c);
    return [
      col({ field: 'code', headerName: '코드', width: 80 }),
      col({ field: 'name', headerName: '코드명', width: 160 }),
      col({ field: 'seq', headerName: '조회순서', width: 90 }),
      { field: 'closeYn', headerName: '미사용', width: 80, editable, cellDataType: 'boolean' },
      col({ field: 'applyDate', headerName: '시작일자', width: 120, cellDataType: 'dateString' }),
      { field: 'closeDate', headerName: '종료일자', width: 120, editable, cellDataType: 'dateString' },
      { field: 'note', headerName: '상세설명', flex: 1, minWidth: 200, editable },
    ];
  }, [editable]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>상세코드구분명{codeKind ? ` — ${codeKind.kindNm}` : ''}</Typography.Text>
        <Input style={{ width: 150 }} value={searchText} allowClear onChange={e => setSearchText(e.target.value)} onPressEnter={crud.retrieve} />
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.saveRows} disabled={!editable || !codeKind}>저장</Button>
        <Button onClick={crud.addRow} disabled={!editable || !codeKind}>등록</Button>
        <Button danger onClick={crud.deleteChecked} disabled={!editable || !codeKind}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Code> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
    </div>
  );
};
