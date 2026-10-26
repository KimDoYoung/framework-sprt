/**
 * 펀드찾기 조회창 (P01) — Fnd01_Edit_FundPlan의 확정펀드 칸에서 연다 (openLookupFundCode L291-303)
 * AS-IS: myApp/client/vi/fnd/Fnd00_Lookup_FundCode.java (221줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-142: 모달 1000×500 "펀드찾기", 위 = 툴바(검색 250 · 펀드유형 200 · 해지펀드포함 · [조회]), 아래 = 단일 체크 그리드, 아래 가운데 [확인][취소]
 * 펀드유형 콤보는 서버 SQL(fnd00_fund.selectByLookupFundCode)이 쓰지 않는 조건이라 고르기만 하고 조회에는 영향이 없다 — 원본 그대로
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundLookup } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<FundLookup>();
/** setChecked(SINGLE) — 체크박스 한 행. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
const ALL_CODE: [string, string] = ['%', '전체'];

interface Props {
  open: boolean;
  /** confirm() L193-205: 고른 펀드 (callback.execute(selectFundModel)) */
  onResult: (row: FundLookup) => void;
  onClose: () => void;
}

export const Fnd00_Lookup_FundCode: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<FundLookup>>(null);
  const [fundName, setFundName] = useState('');
  const [fundTypeCode, setFundTypeCode] = useState('%');
  const [closeYn, setCloseYn] = useState(false);
  const [rows, setRows] = useState<FundLookup[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L162-191: fnd.Fnd00_Fund.selectByLookupFundCode (검색어 "%…%"는 서버가 감싼다)
  const load = async (name: string, close: boolean) => {
    setBusy(true);  // grid.mask("Loading")
    try {
      setRows(await fndApi.searchFundLookup(close, name));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 → open() L65-142: 펀드유형 "전체", 해지펀드포함 해제, show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setFundName('');
    setFundTypeCode('%');
    setCloseYn(false);
    setRows([]);
    void load('', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] okButton[확인].Select (L115) · [E5] grid.CellDoubleClick (L132) → confirm() L193-205
  const confirm = (row?: FundLookup) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('조회할 펀드를 선택해주세요');
      return;
    }
    onResult(target);
    onClose();
  };

  // buildGrid(): 행번호·단일 체크·펀드코드 80·펀드명 300·펀드유형 100·운용부서 200·설정일 100·해지구분 80·비고 200
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 80, '펀드코드'),
    gb.text('fundName', 300, '펀드명'),
    gb.text('fundTypeName', 100, '펀드유형'),
    gb.text('orgCodeName', 200, '운용부서'),
    gb.date('startDate', 100, '설정일'),
    gb.text('closeName', 80, '해지구분'),
    gb.text('note', 200, '비고'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="펀드찾기"
      width={1120}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L123) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] fundNameText.KeyPress [Enter] (L77), [E2] retrieveButton[조회].Select (L101) → retrieve() */}
        <SearchBar onSearch={() => load(fundName, closeYn)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 215 }} placeholder="전체" value={fundName} onChange={e => setFundName(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="펀드유형">
            <SystemCodeComboBox kindCd="FundTypeCode" altCode={ALL_CODE} style={{ width: 144 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? '%')} />
          </SearchBar.Field>
          <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<FundLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fundId)}
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
