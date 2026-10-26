/**
 * 조직찾기 조회창 (P02) — Fnd08_Tab_OrgAuthTempFund의 권한부서 칸에서 연다
 * AS-IS: myApp/client/vi/fnd/Fnd08_Lookup_OrgCode.java (154줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L44-114: 모달 700×500 "조직찾기", 위 = 툴바(기준일 140 · 조직명 200 · [조회]), 아래 = 단일 체크 그리드, 아래 가운데 [확인][취소]. 열 때 조회한다
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<OrgInfo>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** confirm() L139-149: 고른 조직 (callback.execute(orgCodeModel)) */
  onResult: (row: OrgInfo) => void;
  onClose: () => void;
}

export const Fnd08_Lookup_OrgCode: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<OrgInfo>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs());
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<OrgInfo[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L131-137: org.Org01_Code.selectByKorName(로그인 회사, 조직명, 기준일) — 검색어 "%…%"는 서버가 감싼다
  const load = async (name: string, date: Dayjs) => {
    setBusy(true);
    try {
      setRows(await orgCodeApi.searchByKorName(name, date.format(FORMAT)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 → open() L44-114: 기준일 오늘, show(), retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs();
    setBaseDate(today);
    setKorName('');
    setRows([]);
    void load('', today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] oKButton[확인].Select · [E5] grid.CellDoubleClick (L98) → confirm() L139-149
  const confirm = (row?: OrgInfo) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('선택된 조직이 없습니다');
      return;
    }
    onResult(target);
    onClose();
  };

  // buildGrid(): 행번호·단일 체크·조직코드 80·조직명 300·조직구분 80·최근변경일 100
  const columnDefs = useMemo(() => [
    gb.text('orgCd', 80, '조직코드'),
    gb.text('parentFullNm', 300, '조직명'),
    gb.text('levelNm', 80, '조직구분'),
    gb.date('modDate', 100, '최근변경일'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="조직찾기"
      width={750}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] korName.KeyPress [Enter] (L66), [E2] retrieveButton[조회].Select (L77) → retrieve() */}
        <SearchBar onSearch={() => load(korName, baseDate)} loading={busy}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="조직명">
            <SearchBar.Input style={{ width: 150 }} value={korName} onChange={e => setKorName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<OrgInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.orgCodeId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
      </div>
    </LookupModal>
  );
};
