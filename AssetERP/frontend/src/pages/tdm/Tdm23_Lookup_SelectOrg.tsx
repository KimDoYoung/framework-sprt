/**
 * 담당부서 조회창 (N10) — 직책에 연결된 부서 고르기. 직책별 부서승인선 등록(Tdm09_Tab_ApprStep)의 수행부서 칸이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm23_Lookup_SelectOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 450×500(원본, 열 합계 370+행번호·선택 60+여백 130 = 560이라 560): 검색줄(검색 + [조회]) + 체크 그리드(SINGLE / MULTI) + [확인]([선택안함])[닫기]
 * `tdm09`(AS-IS openTdm09)면 승인선(tdm09)에 이미 있는 직책-부서는 뺀다
 * UX보강(10): 검색 줄 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRoleOrgLookup } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmRoleOrgLookup>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L150-164 */
const buildGrid = () => [
  gb.textCenter('orgCode', 100, '부서코드'),  // L160
  gb.text('orgName', 270, '부서명'),  // L161
];

interface Props {
  /** AS-IS roleId — 값이 있으면 열림 */
  roleId: number | null;
  /** AS-IS openTdm09 → tdm09Yn: 승인선에 이미 있는 부서는 뺀다 */
  tdm09?: boolean;
  /** AS-IS selectMode "MULTI" — 체크 다중 (onSelectMulti) */
  multi?: boolean;
  /** AS-IS nullButtonYn: [선택안함] 버튼 (onSelect(null)) */
  nullButton?: boolean;
  /** AS-IS callback.execute(고른 부서) — [선택안함]이면 null. 닫기는 onClose */
  onSelect?: (org: TdmRoleOrgLookup | null) => void;
  onSelectMulti?: (orgs: TdmRoleOrgLookup[]) => void;
  onClose: () => void;
}

export const Tdm23_Lookup_SelectOrg: React.FC<Props> = ({ roleId, tdm09 = false, multi = false, nullButton = false, onSelect, onSelectMulti, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmRoleOrgLookup>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmRoleOrgLookup[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L166-185: tdm.Tdm23_RoleRelateOrg.selectByRoleId (companyId는 서버, stdDate = 오늘, searchText = '%' + 글자 + '%', tdm09Yn)
  const retrieve = useCallback(async (id: number, text: string) => {
    try {
      setRows(await tdmApi.searchRoleOrgLookup(id, dayjs().format(FORMAT), tdm09, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [tdm09]);

  // [E0] 화면 열림 (생성자 L53-58) → open() L70-97 → retrieve()
  useEffect(() => {
    if (roleId == null) return;
    setSearchText('');
    setRows([]);
    void retrieve(roleId, '');
  }, [roleId, retrieve]);

  // confirm() L187-203: 선택이 없으면 "담당부서를 선택하세요", MULTI면 목록, 아니면 한 행 + hide()
  const confirm = (fallback?: TdmRoleOrgLookup) => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    const list = selected.length === 0 && fallback ? [fallback] : selected;
    if (list.length === 0) {
      message.warning('담당부서를 선택하세요');
      return;
    }
    if (multi) onSelectMulti?.(list); else onSelect?.(list[0]);
    onClose();
  };

  return (
    <LookupModal
      open={roleId != null}
      title="담당부서"
      width={560}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] oKButton[확인].Select (L127) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] nullButton[선택안함].Select [callback != null] (L133) → callback.execute(null), hide() */}
            {nullButton && <Button type="select" onClick={() => { onSelect?.(null); onClose(); }}>선택안함</Button>}
            {/* [E6] cancelButton[닫기].Select (L142) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L121) → retrieve() */}
        <SearchBar onSearch={() => { if (roleId != null) return retrieve(roleId, searchText); }}>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L104) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="담당부서" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L114) → confirm() */}
          {multi ? (
            <MultiGrid<TdmRoleOrgLookup>
              gridRef={gridRef}
              rowClick
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.roleRelateOrgId)}
              onRowDoubleClicked={e => confirm(e.data)}
            />
          ) : (
            <SingleGrid<TdmRoleOrgLookup>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.roleRelateOrgId)}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              onRowDoubleClicked={e => confirm(e.data)}
            />
          )}
        </div>
      </div>
    </LookupModal>
  );
};
