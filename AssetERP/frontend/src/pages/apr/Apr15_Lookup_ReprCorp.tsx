/**
 * 대표명의 조회창 — Apr16_Lookup_StampDocReg(구분 = 법인등기부등본)의 [대표명의]에서 연다 (T23)
 * AS-IS: myApp/client/vi/apr/Apr15_Lookup_ReprCorp.java (184줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-80: 모달 580×550 "대표명의", 툴바(검색 200 · [조회]) + 체크박스 단일 그리드(구분 80 · 대표회사 250 · 대표자 170), 아래 가운데 [확인][해당사항 없음][닫기]
 * 원본 retrieve() L141-162는 검색어가 "" 일 때만 "%%"를 만들고 아니면 null을 보내 입력한 검색어가 걸리지 않는다 — 그대로 둔다(서버가 검색어를 받지 않는다)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprReprCorpLookup } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<AprReprCorpLookup>();

interface Props {
  open: boolean;
  /** open(isCompanyAdd, callback) — true면 회사 자신(법인)도 한 행으로 보인다 */
  companyAddYn: boolean;
  /** callback.execute(고른 행) · [해당사항 없음]은 null */
  onResult: (row: AprReprCorpLookup | null) => void;
  onClose: () => void;
}

export const Apr15_Lookup_ReprCorp: React.FC<Props> = ({ open, companyAddYn, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AprReprCorpLookup>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprReprCorpLookup[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L141-162: apr.Apr15_ReprCorp.selectByCompanyId(companyId, corpRegYn true, useYn true, companyAddYn)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await aprStampDocApi.searchReprCorpLookup(companyAddYn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L49-54, open L56-80) → setting(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // confirm() L164-175
  const confirm = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0];
    if (!row) { message.warning('선택된 대표회사가 없습니다'); return; }
    onResult(row);
    onClose();
  };

  // buildGrid() L129-139
  const columnDefs = useMemo(() => [
    gb.textCenter('corpTypeName', 80, '구분'),  // L134
    gb.text('corpName', 250, '대표회사'),  // L135
    gb.text('reprName', 170, '대표자'),  // L136
  ], []);

  return (
    <LookupModal
      open={open}
      title="대표명의"
      width={580}
      maskClosable={false}
      destroyOnClose
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] confirmButton[확인].Select (L99) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] nullButton[해당사항 없음].Select [callback != null] (L105) → callback(null), hide() */}
            <Button type="unassign" onClick={() => { onResult(null); onClose(); }}>해당사항 없음</Button>
            {/* [E5] closeButton[닫기].Select (L114) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L84) → retrieve(), [E2] retrieveButton[조회].Select (L93) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E6] grid.CellDoubleClick (L121) → confirm() */}
          <SingleGrid<AprReprCorpLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.reprCorpId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
