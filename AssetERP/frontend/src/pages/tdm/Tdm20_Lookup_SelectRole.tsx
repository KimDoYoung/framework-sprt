/**
 * 직책 조회창 (N10) — 직책별 부서승인선 등록(Tdm09_Tab_ApprStep)의 책무직책 칸이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm20_Lookup_SelectRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 530×450(원본, 열 420+행번호·선택 60+여백 130 = 610이라 610): 검색줄(기준일 + 검색 + [조회]) + 단일 선택 그리드 + [확인]([전체])[닫기]
 * 만든 것은 open(callback)·openAll(stdDate, callback) 경로(selectByDate). openAll(…, orgId)의 orgId·openTarget(selectCheckTargetRole)은 쓰는 화면이 생길 때 추가
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmRole>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L171-177 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('roleName', 420, '직책'),  // L174
];

interface Props {
  open: boolean;
  /** AS-IS openAll → allButtonYn: [전체] 버튼 (닫기만 한다, E6) */
  allButton?: boolean;
  /** AS-IS openAll(stdDate, …)의 기준일 — 없으면 오늘 */
  stdDate?: string | null;
  /** AS-IS callback.execute(고른 직책). 닫기는 onClose */
  onSelect: (role: TdmRole) => void;
  onClose: () => void;
}

export const Tdm20_Lookup_SelectRole: React.FC<Props> = ({ open, allButton = false, stdDate, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmRole>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmRole[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L179-206: tdm.Tdm20_Role.selectByDate (companyId는 서버, baseDate, searchText = '%' + 글자 + '%')
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    try {
      setRows(await tdmApi.searchRoles({ baseDate: date.format(FORMAT), allYn: false, searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L60-65) → open() L90-120 → retrieve()
  useEffect(() => {
    if (!open) return;
    const date = stdDate ? dayjs(stdDate) : dayjs();
    setBaseDate(date);
    setSearchText('');
    setRows([]);
    void retrieve(date, '');
  }, [open, stdDate, retrieve]);

  // confirm() L208-216: 선택이 없으면 "선택된 직책이 없습니다", 있으면 callback + hide()
  const confirm = (fallback?: TdmRole) => {
    const selected = gridRef.current?.api.getSelectedRows()[0] ?? fallback;
    if (!selected) {
      message.warning('선택된 직책이 없습니다');
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="직책"
      width={610}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[확인].Select (L150) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E6] allButton[전체].Select (L162) → hide() */}
            {allButton && <Button type="reset" onClick={onClose}>전체</Button>}
            {/* [E5] closeButton[닫기].Select (L156) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L144) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L130) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="직책" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L138) → confirm() */}
          <SingleGrid<TdmRole>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.roleId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
