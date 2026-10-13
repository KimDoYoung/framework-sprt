/**
 * 특정매뉴 권한 탭 (A15-4) — Sys01_Tab_Company 아래 탭 6번째.
 * AS-IS: myApp/client/vi/sys/Sys50_TabPage_SpecificMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃 getEditor() L1-337: 툴바(구분 콤보·조회·저장·등록·삭제·요청이력) + 셀 편집 그리드(행번호, 체크박스 없음)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space, Typography, Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { Code, MenuLookup, SpecificMenu } from '@/types/sys';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';
import { Sys06_Lookup_SelectMulti } from './Sys06_Lookup_SelectMulti';
import { Sys51_Lookup_SpecificMenuPerson } from './Sys51_Lookup_SpecificMenuPerson';
import { Sys52_Lookup_SpecificMenuLink } from './Sys52_Lookup_SpecificMenuLink';
import { Sys54_Lookup_SpecificMenuHistory } from './Sys54_Lookup_SpecificMenuHistory';

type Row = SpecificMenu;
const gb = gbFor<Row>();

/** AS-IS buildGrid() L117-174 */
const buildGrid = (
  works: Code[],
  openLink: (r: Row) => void,
  openPerson: (r: Row) => void,
  openLookupMenuInfo: (r: Row) => void,
) => [
  // [E6] specificWorkComboBox[SpecificWorkCode].Collapse (L119) → addChange(specificWorkCode, getCode()) + addChange(specificWorkName, getName())
  gb.text('specificWorkNm', 200, '특정업무', {
    editor: 'select',
    values: works.map(c => c.name),
    valueSetter: p => {
      p.data.specificWorkNm = p.newValue;
      p.data.specificWorkCd = works.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
  iconCell<Row>('edit', 'actionCell01', 100, '문서권한', openLink),  // L132 actionCell01 → Sys52_Lookup_SpecificMenuLink
  // L133 lookupMenuInfo(LookupTriggerField) — [E7] lookupMenuInfo.TriggerClick (L128) → openLookupMenuInfo(): 글자는 직접 못 고치고 조회창으로 고른다
  gb.text('menuNm', 500, '매뉴명', {
    cellStyle: { color: '#1677ff' },
    onCellDoubleClicked: p => { if (p.data) openLookupMenuInfo(p.data); },
    cellRenderer: (p: CustomCellRendererProps<Row>) => (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.value}</span>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) openLookupMenuInfo(p.data); }} />
      </span>
    ),
  }),
  iconCell<Row>('edit', 'actionCell02', 100, '사원권한', openPerson),  // L134 actionCell02 → Sys51_Lookup_SpecificMenuPerson
  gb.text('note', 500, '비고', { editor: 'text' }),  // L135
];

export const Sys50_TabPage_SpecificMenu: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [works, setWorks] = useState<Code[]>([]);
  const [specificWorkCd, setSpecificWorkCd] = useState('%'); // specificWorkComboBoxField ComboBoxField("SpecificWorkCode", "%", "전체")
  const [lookupRow, setLookupRow] = useState<Row>();
  const [lookupOpen, setLookupOpen] = useState(false);
  const [linkRow, setLinkRow] = useState<Row>();
  const [personRow, setPersonRow] = useState<Row>();
  const [historyOpen, setHistoryOpen] = useState(false);

  const crud = useGridCrud<Row>({
    idField: 'specificMenuId',
    // retrieve() L251-256: companyId, specificWorkCode → sys.Sys50_SpecificMenu.selectBySpecificWorkCode
    search: useCallback(
      () => (companyId ? sysApi.searchSpecificMenus(companyId, specificWorkCd) : Promise.resolve([])),
      [companyId, specificWorkCd]),
    // update() L259-278: GridUpdate → sys.Sys50_SpecificMenu.update
    save: useCallback((rows: Row[]) => sysApi.updateSpecificMenus(companyId!, rows), [companyId]),
    remove: useCallback((ids: number[]) => sysApi.deleteSpecificMenus(companyId!, ids), [companyId]),
    // insertRow() L281-291: insertModel.setCompanyId(companyId) — 아무것도 안 고치고 저장하면 저장 안 됨
    newRow: useCallback(() => ({ companyId }), [companyId]),
    firstEditField: 'specificWorkNm',
    // update() L259-278: 변경 행마다 특정업무·매뉴 필수
    validate: changed => {
      for (const r of changed) {
        if (!r.specificWorkCd) return '특정업무 구분은 필수선택 항목입니다';
        if (r.menuId == null) return '매뉴는 필수선택 항목입니다';
      }
      return undefined;
    },
    // deleteRow() L294-315 → [E8] msgBox.DialogHide [YES] (L297) → sys.Sys50_SpecificMenu.delete (useGridCrud 안)
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  // [E5] historyButton[요청이력].Select (L93) → openHistory() L240-248: 회사가 없으면 막는다
  const openHistory = () => {
    if (!companyId) {
      message.warning('회사를 선택해주세요');
      return;
    }
    setHistoryOpen(true);
  };

  // [E3] insertButton[등록].Select (L81) → insertRow() L281-291
  const insertRow = () => {
    if (!companyId) {
      message.warning('회사를 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // actionCell01/02 L136-170: 특정업무·매뉴가 없으면 막는다. 저장 전 새 행(임시 ID)은 하위 행을 걸 곳이 없어 같은 안내를 한다(작업기록 결정)
  const checkSaved = (r: Row) => {
    if (!r.specificWorkCd || r.menuId == null || r.specificMenuId <= 0) {
      message.warning('저장 후 권한설정을 진행해주세요');
      return false;
    }
    return true;
  };
  const openLink = useCallback((r: Row) => { if (checkSaved(r)) setLinkRow(r); }, []);
  const openPerson = useCallback((r: Row) => { if (checkSaved(r)) setPersonRow(r); }, []);

  // [E7] lookupMenuInfo.TriggerClick (L128) → openLookupMenuInfo() L176-233
  const openLookupMenuInfo = useCallback((r: Row) => {
    // 변경된 행마다 특정업무 구분이 있어야 한다 (L177-186)
    if (crud.getChanged().some(c => !c.specificWorkCd)) {
      message.warning('특정업무 구분은 필수선택 항목입니다');
      return;
    }
    setLookupRow(r);
    setLookupOpen(true);
  }, [crud]);

  // openLookupMenuInfo() L195-230 콜백: 첫 매뉴는 고른 행에 addChange(menuId, menuName), 나머지는 행을 더 넣고 특정업무(있으면)·매뉴를 addChange
  const onMenus = (menus: MenuLookup[] | null) => {
    setLookupOpen(false);
    if (!menus || !lookupRow) return;
    const selected = lookupRow;
    const [first, ...rest] = menus;
    crud.updateRow(selected.specificMenuId, { menuId: first.menuId, menuNm: first.menuFullNm });
    if (rest.length > 0) {
      crud.addRows(rest.map(m => ({
        ...(selected.specificWorkNm ? { specificWorkNm: selected.specificWorkNm, specificWorkCd: selected.specificWorkCd } : {}),
        menuId: m.menuId,
        menuNm: m.menuFullNm,
      })), true);
    }
  };

  const columnDefs = useMemo(() => buildGrid(works, openLink, openPerson, openLookupMenuInfo), [works, openLink, openPerson, openLookupMenuInfo]);

  useEffect(() => { sysApi.searchCodes('SpecificWorkCode').then(setWorks).catch(() => setWorks([])); }, []);

  // [E0] 화면 열림 / retrieve(param) L318-321 → retrieve(companyId) L235-238 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) crud.retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
      <Space>
        <Typography.Text strong>구분</Typography.Text>
        <CodeSelect kindCd="SpecificWorkCode" altCode={['%', '전체']} style={{ width: 150 }} value={specificWorkCd}
          onChange={v => setSpecificWorkCd(v ?? '%')} />
        {/* [E1] retrieveButton[조회].Select (L69) → retrieve() */}
        <Button type="search" onClick={crud.retrieve}>조회</Button>
        {/* [E2] updateButton[저장].Select (L75) → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E4] deleteButton[삭제].Select (L87) → deleteRow() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        <Button type="view" onClick={openHistory}>요청이력</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* 체크박스 없음(setChecked 없음) = 단일 선택, 삭제는 선택한 행 */}
        <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
      </div>
      {/* openLookupMenuInfo(): Sys06_Lookup_SelectMulti.open(searchText = 고른 행의 특정업무명, callback) */}
      <Sys06_Lookup_SelectMulti open={lookupOpen} searchText={lookupRow?.specificWorkNm} onResult={onMenus} />
      <Sys52_Lookup_SpecificMenuLink companyId={companyId} specificMenu={linkRow} onClose={() => setLinkRow(undefined)} />
      <Sys51_Lookup_SpecificMenuPerson companyId={companyId} specificMenu={personRow} onClose={() => setPersonRow(undefined)} />
      <Sys54_Lookup_SpecificMenuHistory companyId={historyOpen ? companyId : undefined} onClose={() => setHistoryOpen(false)} />
    </div>
  );
};
