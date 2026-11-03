/**
 * AssetERP 계약사 조회창 (EE23) — Biz55_Tab_ErpFeeCharge의 [생성]이 연다
 * AS-IS: myApp/client/vi/biz/Biz55_Lookup_ErpCompany.java (169줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(stdDate, callback) L50-82: 모달 600×500 "계약사목록", 검색 줄 = 검색 [텍스트] [조회] / 그리드(체크 다중 6열) / [생성][닫기]. 열 때 retrieve()
 * retrieve() L137-149: biz.Biz51_ErpContCorp.selectErpCompany(searchText "%…%", stdDate) — 그 달에 청구가 아직 없는 계약사만
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05·06(MultiGrid rowClick). 모달 폭은 열 폭 합계로 손으로 정한다(03 원칙 21: 열 480+행번호·선택 60+여백 130 → 700)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizErpFeeChargeApi } from '@/api/bizErp';
import { errorMessage } from '@/api/client';
import { BizErpCompany } from '@/types/bizErp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizErpCompany>();

interface Props {
  open: boolean;
  /** 청구년월의 1일 'yyyy-MM-dd' (AS-IS stdDate) */
  stdDate: string;
  /** callback.execute(list) — [생성] 또는 행 더블클릭 (고른 계약사들). 닫는 것은 부르는 쪽 */
  onResult: (rows: BizErpCompany[]) => void;
  onClose: () => void;
}

export const Biz55_Lookup_ErpCompany: React.FC<Props> = ({ open, stdDate, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<BizErpCompany>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizErpCompany[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid
  const columnDefs = useMemo(() => [
    gb.text('corpName', 200, '계약사명'),
    gb.date('contEndDate', 100, '계약종료일'),
    gb.date('erpEndDate', 120, '시스템 사용종료일'),
    gb.textCenter('serviceTypeName', 100, '서비스종류'),
  ], []);

  // [E1] searchText.KeyPress [Enter] (L87) · [E3] retrieveButton[조회].Select (L103) → retrieve() L137-149
  const retrieve = async (text = searchText) => {
    setLoading(true);
    try {
      setRows(await bizErpFeeChargeApi.companies(stdDate, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L98-100) → open() L50-82 → retrieve()
  useEffect(() => {
    if (open) { setSearchText(''); void retrieve(''); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E4] createButton[생성].Select (L110) · [E2] grid.RowDoubleClick (L96) → create() L151-160: 선택이 없으면 "운용사를 선택해주세요"
  const create = (picked: BizErpCompany[] = gridRef.current?.api?.getSelectedRows() ?? []) => {
    if (picked.length === 0) { message.warning('운용사를 선택해주세요'); return; }
    onResult(picked);
  };

  return (
    <LookupModal
      open={open}
      title="계약사목록"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={() => create()}>생성</Button>
            {/* [E5] cancelButton[닫기].Select (L116) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BizErpCompany>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.erpContCorpId)}
            loading={loading}
            rowClick
            onRowDoubleClicked={e => { if (e.data) create([e.data]); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
