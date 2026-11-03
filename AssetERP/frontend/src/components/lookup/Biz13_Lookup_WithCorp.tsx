/**
 * 운용사목록 조회창 (EE16) — scm Scm01_Edit_DevMng의 요청사 트리거가 연다 (다른 도메인에서도 쓰는 공통 창)
 * AS-IS: myApp/client/vi/biz/Biz13_Lookup_WithCorp.java (164줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L48-78: 모달 540×500 "운용사목록", 검색 줄 = 검색 [운용사명 150] [조회] / 그리드(체크 단일) / [확인][닫기], 열 때 검색칸에 커서
 * 열 때 조회하지 않는다(retrieve()는 Enter·[조회]만). confirm() L146-155: 고른 것이 없으면 "운용사를 선택해주세요"
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizWithCorpApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizWithCorp } from '@/types/biz';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizWithCorp>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(model) — [확인]·행 더블클릭 */
  onResult: (row: BizWithCorp) => void;
  onClose: () => void;
}

export const Biz13_Lookup_WithCorp: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BizWithCorp>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizWithCorp[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid() L120-130
  const columnDefs = useMemo(() => [
    gb.textCenter('corpCd', 80, '운용사코드'),
    gb.text('corpNm', 250, '운용사명'),
    gb.text('manageTypeNm', 120, '운영구분'),
  ], []);

  // [E1] searchText.KeyPress [Enter] (L83) · [E3] retrieveButton[조회].Select (L99) → retrieve() L132-144: biz.Biz13_WithCorp.selectByText(companyId, "%검색어%")
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await bizWithCorpApi.searchWithCorps(searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E2] grid.RowDoubleClick (L92) · [E4] confirmButton[확인].Select (L106) → confirm() L146-155
  const confirm = (row?: BizWithCorp) => {
    const picked = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!picked) { message.warning('운용사를 선택해주세요'); return; }
    onResult(picked);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="운용사목록"
      width={640}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] cancelButton[닫기].Select (L112) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="운용사명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BizWithCorp>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.withCorpId)}
            loading={loading}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => e.data && confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
