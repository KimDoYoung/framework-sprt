/**
 * 매뉴찾기 조회창 (A15-4) — Sys50_TabPage_SpecificMenu의 매뉴명 칸에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys06_Lookup_SelectMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(searchText, callback) L49-52 / open(callback) L54-84: 제목 "매뉴찾기", 600×600, 모달. 매뉴명 입력(300)·조회·"매뉴명만 검색" 체크 + 체크박스 다중 그리드
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuLookup } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<MenuLookup>();

/** AS-IS buildGrid() (setChecked MULTI) */
const buildGrid = () => [
  gb.text('parentPathNm', 300, '경로'),
  gb.text('menuNm', 200, '매뉴명'),
];

interface Props {
  open: boolean;
  /** open(searchText, callback)의 searchText — 매뉴명 칸에 미리 넣는다 */
  searchText?: string | null;
  /** AS-IS callback.execute(menuList): 확인이면 고른 매뉴 목록, 닫기(closeButton)이면 null */
  onResult: (menus: MenuLookup[] | null) => void;
}

export const Sys06_Lookup_SelectMulti: React.FC<Props> = ({ open, searchText, onResult }) => {
  const gridRef = useRef<AgGridReact<MenuLookup>>(null);
  const [menuName, setMenuName] = useState('');
  const [menuNameYn, setMenuNameYn] = useState(false); // settings() L87: setValue(false)
  const [rows, setRows] = useState<MenuLookup[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L136-148: '%' + 매뉴명 + '%' (서버가 만든다), menuNameYn → sys.Sys06_Menu.getAllMenuList
  const retrieve = useCallback(async (text: string, nameOnly: boolean) => {
    try {
      setRows(await sysApi.searchLookupMenus(text, nameOnly));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L54-84: 원본은 열 때마다 새 창 → 입력을 정하고 바로 retrieve()
  useEffect(() => {
    if (!open) return;
    const text = searchText ?? '';
    setMenuName(text);
    setMenuNameYn(false);
    setRows([]);
    retrieve(text, false);
  }, [open, searchText, retrieve]);

  // [E3] confirmButton[확인].Select (L106) / [E5] grid.CellDoubleClick (L119) → confirm() L150-160: 선택이 없으면 메시지(닫지 않음)
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) {
      message.warning('매뉴를 선택해주세요');
      return;
    }
    onResult(list);
  };

  return (
    <Modal
      open={open}
      title="매뉴찾기"
      width={600}
      maskClosable={false}
      closable={false}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L112) → callback.execute(null) + hide() */}
            <Button type="close" onClick={() => onResult(null)}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong>매뉴명</Typography.Text>
          {/* [E1] menuName.KeyPress [Enter] (L92) → retrieve() */}
          <Input autoFocus style={{ width: 300 }} value={menuName} onChange={e => setMenuName(e.target.value)}
            onPressEnter={() => retrieve(menuName, menuNameYn)} />
          {/* [E2] retrieveButton[조회].Select (L100) → retrieve() */}
          <Button type="search" onClick={() => retrieve(menuName, menuNameYn)}>조회</Button>
          <Checkbox checked={menuNameYn} onChange={e => setMenuNameYn(e.target.checked)}>매뉴명만 검색</Checkbox>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E5] grid.CellDoubleClick (L119) → confirm() */}
          <MultiGrid<MenuLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.menuId)}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
