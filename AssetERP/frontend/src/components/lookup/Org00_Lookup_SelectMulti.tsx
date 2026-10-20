/**
 * 조직찾기 조회창 — 여러 조직 선택 (G07 Org10_Lookup_RoleStamp에서 처음 씀). open(baseDate, callback)·open(baseDate, allButtonYn, callback)만 변환했다.
 * AS-IS: myApp/client/vi/org/Org00_Lookup_SelectMulti.java (215줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L66-151: 모달 450×500 "조직찾기", 위 툴바(기준일 100 · 조직명 100 · [조회]) + 체크박스 다중 그리드(조직코드 80 · 본부(실)명 270(open(baseDate)이면 숨김) · 본부(실)명 350), 아래 가운데 [확인]([전체])[닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { orgApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { gbFor } from '@/components/grid';
import { BaseGrid } from '@/components/grid/BaseGrid';

const gb = gbFor<OrgInfo>();

/** AS-IS buildGrid() L153-163 (setChecked MULTI). open(baseDate, …)는 openCheck → setHidden(3) → parentFullName을 숨긴다 */
const buildGrid = () => [
  gb.textCenter('orgCd', 80, '조직코드'),  // L158
  gb.text('parentFullNm', 270, '본부(실)명', { hide: true }),  // L159
  gb.text('korNm', 350, '본부(실)명'),  // L160
];

interface Props {
  /** 'yyyy-MM-dd' 기준일 — 있으면 열린다 (AS-IS open(baseDate, callback)). 기준일은 바꿔 조회할 수 있다 */
  baseDate?: string;
  /** allButtonYn (open(baseDate, allButtonYn, callback)) — true면 [전체]가 있고 한 조직만 고를 수 있다 */
  allButton?: boolean;
  onClose: () => void;
  /** confirm() L179-194: callback.execute(고른 조직들). [전체]는 callback.execute(null) (여기서는 onAll) */
  onSelect: (orgs: OrgInfo[]) => void;
  onAll?: () => void;
}

export const Org00_Lookup_SelectMulti: React.FC<Props> = ({ baseDate: openDate, allButton = false, onClose, onSelect, onAll }) => {
  const [baseDate, setBaseDate] = useState(openDate);
  const gridRef = useRef<AgGridReact<OrgInfo>>(null);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<OrgInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L165-177: selectByKorName(companyId, korName, baseDate)
  const retrieve = useCallback(async () => {
    if (!baseDate) return;
    try {
      setRows(await orgApi.searchOrgInfos(korName, baseDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [korName, baseDate]);

  // [E4] allButton[전체] (L106) · [E5] cancelButton[닫기] (L115) → hide()
  const hide = () => { setKorName(''); setRows([]); onClose(); };

  // [E3] oKButton[확인].Select (L100) · [E6] grid.CellDoubleClick (L143) → confirm() L179-194
  const confirm = (picked?: OrgInfo[]) => {
    const orgs = picked ?? gridRef.current?.api.getSelectedRows() ?? [];
    if (orgs.length === 0) {
      message.warning('조직을 선택해주세요');
      return;
    }
    if (allButton && orgs.length > 1) {
      message.warning('하나의 조직만 선택하세요');
      return;
    }
    onSelect(orgs);
    hide();
  };

  // open() L66-151 끝: show() → retrieve()
  useEffect(() => { setBaseDate(openDate); }, [openDate]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (openDate && baseDate === openDate) retrieve(); }, [openDate, baseDate]);

  return (
    <LookupModal
      open={!!openDate}
      title="조직찾기"
      width={450}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {allButton && <Button type="unassign" onClick={() => { onAll?.(); hide(); }}>전체</Button>}
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L93) → retrieve(). 폭 450 한 줄이라 초기화(UX-02)는 넣지 않는다 */}
        <SearchBar onSearch={retrieve} style={{ flexWrap: 'nowrap' }}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} value={baseDate ? dayjs(baseDate) : null} format="YYYY-MM-DD"
              allowClear={false} onChange={d => d && setBaseDate(d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="조직명">
            {/* [E1] korName.KeyPress [Enter] (L84) → retrieve() */}
            <SearchBar.Input style={{ width: 100 }} value={korName} onChange={e => setKorName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BaseGrid<OrgInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.orgCodeId)}
            rowSelection={{ mode: 'multiRow', checkboxes: true, enableClickSelection: true }}
            // 더블클릭 = 클릭 두 번이라 다중 선택에서는 선택이 풀릴 수 있어, 고른 행이 없으면 더블클릭한 행으로 확인한다
            onRowDoubleClicked={e => {
              const sel = gridRef.current?.api.getSelectedRows() ?? [];
              confirm(sel.length ? sel : e.data ? [e.data] : []);
            }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
