/**
 * [1360] 관리자 > 02. 시스템관리 > 화면안내등록 (A12)
 * AS-IS: myApp/client/vi/sys/Sys06_Tab_MenuGuide.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-78: 툴바(메뉴명 콤보 · 검색 · 조회 · 저장) + 그리드(행번호, 체크박스 다중, 화면안내 셀 편집)
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Select } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, MenuGuide } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<MenuGuide>();
const ALL = '%';  // menuName: "전체" 또는 "%"

/** AS-IS buildGrid() L116-124 */
const buildGrid = () => [
  gb.text('menuFullName', 300, '메뉴'),  // L119 SQL 계산 컬럼(total_menu_nm)
  gb.text('menuName', 250, '화면명'),  // L120
  gb.textArea('note', 800, '화면안내', { editor: 'largeText' }),  // L121
];

const NEW_ROW: Partial<MenuGuide> = {};

export const Sys06_Tab_MenuGuide: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const [menus, setMenus] = useState<Code[]>([]);
  // settings() L80-114: 메뉴명 = 전체, 검색 빈칸(힌트 "메뉴/화면명")
  const sp = useSearchParams(() => ({ menuId: ALL, searchText: '' }));

  useEffect(() => {
    sysApi.searchMenuNames().then(setMenus).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, []);

  const crud = useGridCrud<MenuGuide>({
    idField: 'menuId',
    // retrieve() L126-155: menuId(전체면 null) · searchText("%…%" — 서버) → sys.Sys06_Menu.selectByMenuId
    search: useCallback(() => {
      const { menuId, searchText } = sp.current.current;
      return sysApi.searchMenuGuides(menuId === ALL ? undefined : Number(menuId), searchText);
    }, [sp.current]),
    // update() L190-207: GridUpdate → sys.Sys06_Menu.update, 성공하면 retrieveFocus() L157-188(같은 조건으로 다시 조회, 스크롤 유지)
    save: sysApi.updateMenuGuides,
    reloadAfterSave: true,
    // 행 추가·삭제 버튼이 없다(원본에 없음)
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // [E0] 화면 열림 (생성자 L46-78) → settings(), retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuOptions = useMemo(() => [{ value: ALL, label: '전체' }, ...menus.map(m => ({ value: m.code, label: m.name }))], [menus]);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E2] retrieveButton[조회].Select (L93) → retrieve(), [E4] searchText.KeyPress [Enter] (L106) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} onReset={sp.reset} loading={crud.loading} extra={
        /* [E3] updateButton[저장].Select (L99) → update(). 저장(n)은 UX-03 */
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      }>
        <SearchBar.Field label="메뉴명">
          {/* [E1] menuName[sys.Sys00_Common.selectMenuName].Collapse (L87) → retrieve() — 고르면 바로 조회 */}
          <Select style={{ width: 150 }} value={sp.values.menuId} options={menuOptions}
            onChange={v => { sp.set('menuId', v); sp.current.current = { ...sp.current.current, menuId: v }; crud.retrieve(); /* ref를 먼저 맞춰 새 값으로 조회 */ }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} placeholder="메뉴/화면명"
            value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<MenuGuide> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
