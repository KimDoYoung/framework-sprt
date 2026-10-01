import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, DatePicker, Space, Typography, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { orgApi } from '../../api/org';
import { errorMessage } from '../../api/client';
import { OrgCode } from '../../types/org';
import { useTreeGrid } from '../../hooks/useTreeGrid';
import { OrgCreateModal } from './org01/OrgCreateModal';
import { OrgHistoryModal } from './org01/OrgHistoryModal';
import { OrgChartModal } from './org01/OrgChartModal';

/** 조직정보 등록 (AS-IS client/vi/org/Org01_Tab_OrgCode). 기준일 조직 트리 + 하위조직 등록 + 이력 편집 */
export const Org01OrgCodeView: React.FC = () => {
  const gridRef = useRef<AgGridReact<OrgCode>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [orgs, setOrgs] = useState<OrgCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OrgCode>();
  const [createParent, setCreateParent] = useState<OrgCode>();
  const [editTarget, setEditTarget] = useState<OrgCode>();
  const [chartOpen, setChartOpen] = useState(false);
  const focusAfterLoad = useRef<number | undefined>(undefined);

  const tree = useTreeGrid<OrgCode>({ gridRef, rows: orgs, idField: 'codeId', parentField: 'parentCodeId', levelField: 'level' });

  const retrieve = useCallback(async (focusCodeId?: number) => {
    focusAfterLoad.current = focusCodeId;
    setLoading(true);
    try {
      setOrgs(await orgApi.searchOrgCodes(baseDate.format('YYYY-MM-DD')));
    } catch (err) {
      message.error(errorMessage(err, '조직 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [baseDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const insertChild = () => {
    if (!selected) {
      message.warning('먼저 상위 조직을 선택해주세요');
      return;
    }
    setCreateParent(selected);
  };

  const EditCell = useCallback((p: ICellRendererParams<OrgCode>) => (
    p.data ? <EditOutlined style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => setEditTarget(p.data)} /> : null
  ), []);

  const columnDefs = useMemo<ColDef<OrgCode>[]>(() => [
    tree.treeCol({ field: 'korNm', headerName: '조직명', width: 380 }),
    { field: 'orgCd', headerName: '조직코드', width: 100 },
    { field: 'levelNm', headerName: '조직구분', width: 100 },
    { field: 'orgHeadList', headerName: '조직 장', width: 140 },
    { field: 'sortOrder', headerName: '조회순서', width: 90 },
    { field: 'modDate', headerName: '최근변경일', width: 110 },
    { headerName: '수정', width: 70, cellRenderer: EditCell, cellStyle: { textAlign: 'center' } },
    { field: 'modReason', headerName: '변경사유', width: 250 },
    { field: 'openDate', headerName: '개설일', width: 110 },
    { field: 'closeDate', headerName: '폐쇄일', width: 110 },
  ], [tree, EditCell]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>기준일</Typography.Text>
        <DatePicker value={baseDate} allowClear={false} onChange={d => d && setBaseDate(d)} />
        <Button type="primary" onClick={() => retrieve()}>조회</Button>
        <Button onClick={insertChild}>하위조직등록</Button>
        <Button onClick={() => setChartOpen(true)}>조직도보기</Button>
        <Button onClick={tree.expandAll}>펼치기</Button>
        <Button onClick={tree.collapseAll}>감추기</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<OrgCode>
          ref={gridRef}
          rowData={orgs}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.codeId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0])}
          onRowDataUpdated={e => {
            const id = focusAfterLoad.current;
            if (id == null) return;
            focusAfterLoad.current = undefined;
            tree.reveal(id);
            setTimeout(() => {
              const node = e.api.getRowNode(String(id));
              if (node?.rowIndex != null) { node.setSelected(true, true); e.api.ensureIndexVisible(node.rowIndex, 'middle'); }
            });
          }}
          {...tree.gridProps}
        />
      </div>

      <OrgCreateModal parent={createParent} orgs={orgs} onClose={() => setCreateParent(undefined)}
        onSaved={o => { setCreateParent(undefined); retrieve(o.codeId); }} />
      <OrgHistoryModal target={editTarget} orgs={orgs} onClose={() => setEditTarget(undefined)}
        onChanged={() => retrieve(editTarget?.codeId)} />
      <OrgChartModal open={chartOpen} orgs={orgs} baseDate={baseDate.format('YYYY-MM-DD')} onClose={() => setChartOpen(false)} />
    </div>
  );
};
