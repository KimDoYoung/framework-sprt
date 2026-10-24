/**
 * 임원선택 조회창 (N01) — 책무점검 현황 임원별 탭의 임원 칸에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm01_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 600×600(원본) → 열 폭 합계(100+150+250+행번호·선택 60+여백 130) 기준 700 (03 원칙 21): 검색줄(검색 + 임원명/직위/조직명 칸 200 + [조회]) + 단일 선택 그리드(임원명 100 가운데·직위 150·조직명 250) + [확인][닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmHrLookup } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmHrLookup>();

/** buildGrid() L119-126 (setChecked SINGLE) */
const buildGrid = () => [
  gb.textCenter('personName', 100, '임원명'),  // L122
  gb.text('posName', 150, '직위'),  // L123
  gb.text('orgName', 250, '조직명'),  // L124
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(선택한 임원) — 닫기는 onClose */
  onSelect: (hr: TdmHrLookup) => void;
  onClose: () => void;
}

export const Tdm01_Lookup_SelectSingle: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmHrLookup>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmHrLookup[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L128-140: tdm.Tdm01_Hr.selectByEndDate (companyId, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await tdmApi.searchHrLookup(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L48-51: 원본은 열 때마다 새 창 → 입력을 비우고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // confirm() L142-150: 선택이 없으면 메시지, 있으면 callback(선택) + hide()
  const confirm = () => {
    const hr = gridRef.current?.api.getSelectedRows()[0];
    if (!hr) {
      message.warning('선택된 담당임원이 없습니다');
      return;
    }
    onSelect(hr);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="임원선택"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] updateButton[확인].Select (L105) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L111) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L99) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            {/* [E0] searchText.KeyPress [Enter] (L85) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="임원명/직위/조직명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L93) → confirm() */}
          <SingleGrid<TdmHrLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.personId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
