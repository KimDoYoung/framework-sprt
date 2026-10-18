/**
 * 문서분류 조회창 (E13-3) — Tdm43_Page_Relate의 연관문서분류 [추가]에서 연다 (연결 문서분류를 고른다).
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L54-79: 모달 750×650 "문서분류", 위 툴바(검색 300 "분류코드/문서분류명" · [조회]) + 체크박스 다중 그리드(분류코드 100 · 문서분류명 550), 아래 가운데 [확인][닫기]
 * open(relateTable, relateId, callback): 'TDM47' + 점검항목 ID면 그 점검항목에 아직 연결 안 된 문서분류만
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTreeLookup } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<DcrClassTreeLookup>();

interface Props {
  /** open(relateTable, relateId, callback) L54 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(selectList) — confirm() L143-155 */
  onResult: (list: DcrClassTreeLookup[]) => void;
  /** 'TDM47'(책무매뉴얼 점검항목)과 그 ID: 그 점검항목에 아직 연결 안 된 문서분류만 (E13-3 Tdm43_Page_Relate) */
  relateTable?: string;
  relateId?: number;
  onClose: () => void;
}

export const Dcr01_Lookup_SelectMulti: React.FC<Props> = ({ open, onResult, relateTable, relateId, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<DcrClassTreeLookup[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<DcrClassTreeLookup>>(null);

  // [E2] retrieveButton[조회].Select (L93) → retrieve() L125-141: 서비스 dcr.Dcr01_ClassTree.selectByText(companyId, typeCode T, searchText %…%, relateTable, relateId, useYn true)
  const retrieve = async (text: string) => {
    setLoading(true);  // grid.mask()
    try {
      setRows(await dcrApi.searchLookup(text, relateTable, relateId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E0] 화면 열림 (생성자 L47-52, open() L54-79) → setting(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // buildGrid()
  const columnDefs = useMemo(() => [
    gb.textCenter('classTreeCode', 100, '분류코드'),
    gb.textArea('classTreeFullName', 550, '문서분류명'),
  ], []);

  // [E3] confirmButton[확인].Select (L99) → confirm() L143-155: 선택이 없으면 "선택한 문서분류가 없습니다", 있으면 callback.execute(selectList); hide()
  const confirm = () => {
    const selectList = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selectList.length === 0) {
      message.warning('선택한 문서분류가 없습니다');
      return;
    }
    onResult(selectList);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="문서분류"
      width={750}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L105) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 520 }}>
        {/* [E1] searchText.KeyPress [Enter] (L84) → retrieve() */}
        <SearchBar searchText="조회" onSearch={() => retrieve(searchText)} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="분류코드/문서분류명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<DcrClassTreeLookup> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.classTreeId)} loading={loading} />
        </div>
      </div>
    </Modal>
  );
};
