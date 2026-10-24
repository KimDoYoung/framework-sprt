/**
 * 책무 대상 조직찾기 조회창 (E13에서 처음 씀) — openAll(기준일, 단일 선택, [전체] 버튼). N08에서 roleId·다중 선택(`single={false}` + `onSelectMulti`)을 더했다.
 * AS-IS: myApp/client/vi/org/Org00_Lookup_SelectTdm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 쓰는 곳: Tdm42_Tab_ManlManagerAdmin(부서, 기준일 = 오늘), Tdm23_Lookup_RoleRelateOrg(다중, roleId)
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { orgApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { OrgTdm } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<OrgTdm>();

/** AS-IS buildGrid() L161-170 (setChecked MULTI) */
const buildGrid = () => [
  gb.textCenter('orgCd', 80, '조직코드'),  // L166
  gb.text('korNmWithSubOrg', 420, '조직명'),  // L167
];

interface Props {
  /** 'yyyy-MM-dd' 기준일 — 있으면 열린다 (AS-IS open(stdDate, …)) */
  stdDate?: string;
  /** AS-IS isSingle — true면 하나만 고른다 ("하나의 조직만 선택해주세요") */
  single?: boolean;
  /** AS-IS openAll → isAllButton: [전체] 버튼 (callback.execute(null) 후 닫는다) */
  allButton?: boolean;
  /** AS-IS open(stdDate, roleId, …) — 그 직책에 이미 연결된 조직은 목록에서 뺀다 (N08 Tdm23_Lookup_RoleRelateOrg) */
  roleId?: number | null;
  onClose: () => void;
  /** AS-IS callback.execute(orgInfoModel) — [전체]는 null. `single`이면 이것을 부른다 */
  onSelect?: (org: OrgTdm | null) => void;
  /** AS-IS callback.execute(List<Org00_OrgInfoModel>) — `single={false}`일 때 고른 조직들 */
  onSelectMulti?: (orgs: OrgTdm[]) => void;
}

export const Org00_Lookup_SelectTdm: React.FC<Props> = ({ stdDate: openDate, single = true, allButton = false, roleId, onClose, onSelect, onSelectMulti }) => {
  const [stdDate, setStdDate] = useState(openDate);
  const gridRef = useRef<AgGridReact<OrgTdm>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<OrgTdm[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L172-187: org.Org00_OrgInfo.selectByTdmYn(companyId(로그인 회사), stdDate, "%검색어%", roleId)
  const retrieve = useCallback(async () => {
    if (!stdDate) return;
    try {
      setRows(await orgApi.searchTdmOrgs(stdDate, searchText, roleId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText, stdDate, roleId]);

  // [E5] cancelButton[닫기].Select (L146) → hide()
  const hide = () => { setSearchText(''); setRows([]); onClose(); };

  // [E3] oKButton[확인].Select (L131) / [E6] grid.CellDoubleClick (L153) → confirm() L189-209
  const confirm = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    if (list.length === 0) return void message.warning('조직을 선택해주세요');
    if (single && list.length > 1) return void message.warning('하나의 조직만 선택해주세요');
    if (single) onSelect?.(list[0]); else onSelectMulti?.(list);
    hide();
  };

  // [E4] allButton[전체].Select [callback != null] (L137) → callback.execute(null); hide()
  const selectAll = () => { onSelect?.(null); hide(); };

  // open() L75-109 끝: show() → retrieve()
  useEffect(() => { setStdDate(openDate); }, [openDate]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (openDate && stdDate === openDate) retrieve(); }, [openDate, stdDate]);

  return (
    <LookupModal
      open={!!openDate}
      title="조직찾기"
      width={560}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {allButton && <Button type="reset" onClick={selectAll}>전체</Button>}
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L125) → retrieve() */}
        <SearchBar onSearch={retrieve} style={{ flexWrap: 'nowrap' }}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} value={stdDate ? dayjs(stdDate) : null} format="YYYY-MM-DD"
              allowClear={false} onChange={d => d && setStdDate(d.format('YYYY-MM-DD'))} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L116) → retrieve() */}
            <SearchBar.Input style={{ width: 150 }} placeholder="조직코드/조직명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<OrgTdm> rowClick
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.orgCodeId)}
            onRowDoubleClicked={e => { e.api.deselectAll(); e.node.setSelected(true); confirm(); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
