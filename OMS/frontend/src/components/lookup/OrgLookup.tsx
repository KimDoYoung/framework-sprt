import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, DatePicker, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { orgApi } from '../../api/org';
import { errorMessage } from '../../api/client';
import { OrgInfo } from '../../types/org';

interface OrgLookupProps {
  open: boolean;
  onCancel: () => void;
  onOk: (org: OrgInfo) => void;
  title?: string;
  /** 기준일 고정 (yyyy-MM-dd, AS-IS openFixDate — 발령일 기준 조직) */
  baseDate?: string;
  /** 다른 회사 조직 (KFS 관리자 화면). 없으면 로그인 회사 */
  companyId?: number;
}

/** 조직 선택 팝업 (AS-IS client/vi/org/Org00_Lookup_SelectSingle, 기본 모드 selectByKorName). 더블클릭으로 바로 선택 */
export const OrgLookup: React.FC<OrgLookupProps> = ({ open, onCancel, onOk, title = '조직 선택', baseDate: fixedDate, companyId }) => {
  const gridRef = useRef<AgGridReact<OrgInfo>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [korNm, setKorNm] = useState('');
  const [rows, setRows] = useState<OrgInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await orgApi.searchOrgInfos(korNm, baseDate.format('YYYY-MM-DD'), companyId));
    } catch (err) {
      message.error(errorMessage(err, '조직 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [korNm, baseDate, companyId]);

  // 기준일 고정이면 열 때 그 날짜로
  useEffect(() => { if (open && fixedDate) setBaseDate(dayjs(fixedDate)); }, [open, fixedDate]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); }, [open, baseDate]);

  const columnDefs = useMemo<ColDef<OrgInfo>[]>(() => [
    { field: 'orgCd', headerName: '조직코드', width: 90, cellStyle: { textAlign: 'center' } },
    { field: 'parentFullNm', headerName: '상위조직', width: 270 },
    { field: 'korNm', headerName: '조직명', flex: 1 },
  ], []);

  const handleOk = () => {
    const selected = gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) {
      message.warning('조직을 선택하세요.');
      return;
    }
    onOk(selected);
  };

  return (
    <Modal open={open} title={title} width={720} onOk={handleOk} onCancel={onCancel} okText="확인" cancelText="닫기" destroyOnClose>
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text strong>기준일</Typography.Text>
        <DatePicker value={baseDate} onChange={d => d && setBaseDate(d)} allowClear={false} disabled={!!fixedDate} />
        <Typography.Text strong>조직명</Typography.Text>
        <Input style={{ width: 160 }} value={korNm} onChange={e => setKorNm(e.target.value)} onPressEnter={retrieve} allowClear />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ height: 400 }}>
        <AgGridReact<OrgInfo>
          ref={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.orgCodeId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDoubleClicked={e => { if (e.data) onOk(e.data); }}
        />
      </div>
    </Modal>
  );
};
