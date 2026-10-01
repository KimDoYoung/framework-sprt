import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, DatePicker, Input, Select, Space, Splitter, Tabs, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '../../api/emp';
import { errorMessage } from '../../api/client';
import { TransInfo } from '../../types/emp';
import { PersonTab } from './emp00/PersonTab';
import { TransTab } from './emp00/TransTab';
import { AddTitleTab } from './emp00/AddTitleTab';
import { PersonCreateModal } from './emp00/PersonCreateModal';

// AS-IS 재직구분 콤보 → transCode
const WORK_TYPES = [
  { label: '전체', value: '000' },
  { label: '재직', value: '100' },
  { label: '겸직', value: '800' },
  { label: '퇴직', value: '900' },
];

/**
 * 사원정보 관리 (AS-IS client/vi/emp/Emp00_Tab_TransInfo): 위 사원 목록, 아래 기본정보·일반발령·겸직발령 탭.
 * 변환하지 않은 것: 기타정보 탭(AS-IS도 데이터 없음), 사진, 엑셀 템플릿·업로드(파일 정책 결정 후). 다운로드는 그리드 CSV.
 */
export const Emp00TransInfoView: React.FC = () => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [transDate, setTransDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [transCode, setTransCode] = useState('100');
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TransInfo>();
  const [createOpen, setCreateOpen] = useState(false);

  const retrieve = useCallback(async (code = transCode) => {
    setLoading(true);
    try {
      setRows(await empApi.searchTransInfos({ searchText, transCode: code, transDate: transDate.format('YYYY-MM-DD'), isSeparateAddTitle: true }));
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText, transCode, transDate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  /** AS-IS updateTransInfoGrid: 발령·기본정보가 바뀌면 그 사원 행만 다시 읽는다 */
  const refreshSelected = useCallback(async () => {
    if (!selected) return;
    try {
      const updated = await empApi.getTransInfo(selected.personId);
      if (!updated) return;
      setRows(prev => prev.map(r => (r.personId === updated.personId ? updated : r)));
      setSelected(updated);
    } catch (err) {
      message.error(errorMessage(err, '사원 조회 실패'));
    }
  }, [selected]);

  const columnDefs = useMemo<ColDef<TransInfo>[]>(() => [
    { field: 'parentFullNm', headerName: '본부(부서)', width: 240 },
    { field: 'korNm', headerName: '성명', width: 100 },
    { field: 'empNo', headerName: '사번', width: 90 },
    { field: 'posNm', headerName: '직위', width: 90 },
    { field: 'titleNm', headerName: '직책', width: 100 },
    { field: 'kindNm', headerName: '구분', width: 80 },
    { field: 'financeProYn', headerName: '전문인력', width: 90, valueFormatter: p => (p.value ? 'Y' : 'N'), cellStyle: { textAlign: 'center' } },
    { field: 'hireDate', headerName: '입사일', width: 110 },
    { field: 'officeDetail', headerName: '내선번호', width: 90 },
    { field: 'mobileTelno', headerName: '휴대폰', width: 130 },
    { field: 'emailAddr', headerName: '이메일', width: 220 },
    { field: 'orderSeq', headerName: '출력순서', width: 90, cellStyle: { textAlign: 'center' } },
  ], []);

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>조회일자</Typography.Text>
          <DatePicker value={transDate} allowClear={false} onChange={d => d && setTransDate(d)} />
          <Typography.Text strong>조직/사번/성명</Typography.Text>
          <Input style={{ width: 160 }} value={searchText} allowClear onChange={e => setSearchText(e.target.value)} onPressEnter={() => retrieve()} />
          <Typography.Text strong>재직구분</Typography.Text>
          <Select style={{ width: 100 }} value={transCode} options={WORK_TYPES} onChange={v => { setTransCode(v); retrieve(v); }} />
          <Button type="primary" onClick={() => retrieve()}>조회</Button>
          <Button onClick={() => setCreateOpen(true)}>등록</Button>
          <Button onClick={() => gridRef.current?.api?.exportDataAsCsv({ fileName: `사원정보_${transDate.format('YYYYMMDD')}.csv` })}>다운로드</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<TransInfo>
            ref={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.personId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={e => {
              // AS-IS: 조회 후 첫 행 선택 (선택했던 사원이 있으면 유지)
              const keep = selected && e.api.getRowNode(String(selected.personId));
              (keep ?? e.api.getDisplayedRowAtIndex(0))?.setSelected(true);
              if (e.api.getDisplayedRowCount() === 0) setSelected(undefined);
            }}
            onSelectionChanged={e => { const r = e.api.getSelectedRows()[0]; if (r) setSelected(r); }}
          />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={420} min={260} style={{ padding: '0 12px 12px' }}>
        <Tabs
          style={{ height: '100%' }}
          items={[
            {
              key: 'person', label: '기본정보',
              children: <PersonTab personId={selected?.personId} onSaved={refreshSelected}
                onDeleted={() => { setSelected(undefined); retrieve(); }} />,
            },
            { key: 'trans', label: '일반발령', children: <div style={{ height: 320 }}><TransTab person={selected} onChanged={refreshSelected} /></div> },
            { key: 'addTitle', label: '겸직발령', children: <div style={{ height: 320 }}><AddTitleTab personId={selected?.personId} /></div> },
          ]}
        />
      </Splitter.Panel>

      <PersonCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={t => {
          setCreateOpen(false);
          if (t) {
            setRows(prev => [...prev, t]);
            setSelected(t);
            setTimeout(() => gridRef.current?.api?.getRowNode(String(t.personId))?.setSelected(true));
          }
        }}
      />
    </Splitter>
  );
};
