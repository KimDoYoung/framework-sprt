/**
 * 고객찾기 조회창 (C03) — Emp01_Tab_UserInfo 고객사 트리거에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Lookup_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(callback) L55-84만 옮겼다(SINGLE: 선택 1건을 돌려줌). open("MULTI", …)는 쓰는 화면에서 더한다.
 * UX보강(10) B12-2: 검색 줄 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { CellDoubleClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<Company>();

/** AS-IS buildGrid() L138-153 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),
  gb.text('locNm', 100, '고객코드'),
  gb.textCenter('icamCompanyCd', 80, 'ICAM'),
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(result): 확인이면 고른 회사, 선택안함이면 null */
  onResult: (company: Company | null) => void;
  /** 취소: callback 없이 hide() */
  onClose: () => void;
}

export const Sys01_Lookup_Company: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const lastSelected = useRef<Company | undefined>(undefined);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L155-164: 서비스 sys.Sys01_Company.selectByName(companyName, useYn = "true")
  const retrieve = useCallback(async (companyName: string) => {
    try {
      setRows(await sysApi.searchCompanies(companyName, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L55-84: 원본은 열 때마다 새 창 → 입력을 비우고 show() 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    setKorName('');
    setRows([]);
    lastSelected.current = undefined;
    retrieve('');
  }, [open, retrieve]);

  // confirm() L166-183: 선택이 없으면 메시지, SINGLE이면 getSelectedItem()(마지막에 고른 행) → callback + hide()
  const confirm = (selected?: Company) => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
    const companyModel = selected ?? (selectedRows.includes(lastSelected.current!) ? lastSelected.current : selectedRows[selectedRows.length - 1]);
    if (!companyModel) {
      message.warning('고객사를 선택하세요');
      return;
    }
    onResult(companyModel);
  };

  // [E5] selectNotButton[선택안함].Select (L124) → confirmAll() L185-188: callback(null) + hide()
  const confirmAll = () => onResult(null);

  // [E6] cancelButton[취소].Select (L130) → hide()
  const hide = () => onClose();

  // [E3] grid.CellDoubleClick (L105) → confirm(): GXT는 더블클릭한 행이 선택된 뒤 confirm
  const onCellDoubleClicked = (e: CellDoubleClickedEvent<Company>) => {
    if (!e.data) return;
    e.api.deselectAll();
    e.node.setSelected(true);
    confirm(e.data);
  };

  return (
    <Modal
      open={open}
      title="고객찾기"
      width={500}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L112) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            <Button onClick={confirmAll}>선택안함</Button>
            <Button type="cancel" onClick={hide}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L99) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(korName)}>
          <SearchBar.Field label="고객명">
            {/* [E1] korName[고객명].KeyPress [Enter] (L91) → retrieve() */}
            <SearchBar.Input autoFocus style={{ width: 120 }} value={korName} onChange={e => setKorName(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Company>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.companyId)}
            onRowSelected={e => { if (e.node.isSelected() && e.data) lastSelected.current = e.data; }}
            onCellDoubleClicked={onCellDoubleClicked}
          />
        </div>
      </div>
    </Modal>
  );
};
