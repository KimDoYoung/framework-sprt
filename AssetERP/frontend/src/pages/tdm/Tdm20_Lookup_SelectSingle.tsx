/**
 * 직책선택(단일) 조회창 (N08) — 직책 편집창의 보고CEO 칸·직책 그리드의 보고CEO 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm20_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1200×600(원본, 열 합계 1090+행번호·선택 60+여백 130 = 1280이라 원본 폭 유지): 검색줄(기준일 + 검색 + [조회]) + 단일 선택 그리드 + [확인]([전체])[닫기]
 * `roleModel`이 있으면(AS-IS open(roleType, roleModel, cb)) [확인]이 그 직책의 보고CEO를 서버에 저장한 뒤 돌려준다
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmRole>();
const FORMAT = 'YYYY-MM-DD';

/** buildGrid() L169-178 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('roleName', 200, '직책'),  // L172
  gb.text('roleTypeName', 120, '직책그룹'),  // L173
  gb.text('roleTypeEtcName', 170, '기타그룹명'),  // L174
  gb.textArea('overview', 600, '개요'),  // L175
];

interface Props {
  open: boolean;
  /** AS-IS roleType — 있으면 그 직책그룹만 보인다 (보고CEO 고르기는 "C") */
  roleType?: string | null;
  /** AS-IS roleModel — 있으면 [확인]이 이 직책의 보고CEO를 저장한다 */
  roleModel?: TdmRole | null;
  /** AS-IS openAll → allButtonYn: [전체] 버튼 (닫기만 한다, E6) */
  allButton?: boolean;
  /** AS-IS openAll(stdDate, …)의 기준일 — 없으면 오늘 */
  stdDate?: string | null;
  /** AS-IS callback.execute(고른 직책) — roleModel이 있으면 보고CEO가 바뀐 그 직책. 닫기는 onClose */
  onSelect: (role: TdmRole) => void;
  onClose: () => void;
}

export const Tdm20_Lookup_SelectSingle: React.FC<Props> = ({ open, roleType, roleModel, allButton = false, stdDate, onSelect, onClose }) => {
  const gridRef = useRef<AgGridReact<TdmRole>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmRole[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L180-194: tdm.Tdm20_Role.selectByDate (companyId는 서버, baseDate, searchText = '%' + 글자 + '%', roleType)
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    try {
      setRows(await tdmApi.searchRoles({ baseDate: date.format(FORMAT), allYn: false, searchText: text, roleType }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleType]);

  // [E0] 화면 열림 (생성자 L62-67) → open() L88-118 → retrieve()
  useEffect(() => {
    if (!open) return;
    const date = stdDate ? dayjs(stdDate) : dayjs();
    setBaseDate(date);
    setSearchText('');
    setRows([]);
    void retrieve(date, '');
  }, [open, stdDate, retrieve]);

  // confirm() L196-222: 선택이 없으면 "선택된 직책이 없습니다". roleModel이 있으면 보고CEO 저장(modelUpdate) 뒤 callback + hide(), 없으면 callback(선택) + hide()
  const confirm = async (fallback?: TdmRole) => {
    const selected = gridRef.current?.api.getSelectedRows()[0] ?? fallback;
    if (!selected) {
      message.warning('선택된 직책이 없습니다');
      return;
    }
    if (roleModel) {
      try {
        onSelect(await tdmApi.updateRoleCeo(roleModel.roleId, selected.roleId));
      } catch (err) {
        message.error(errorMessage(err, '저장 실패'));
        return;
      }
    } else {
      onSelect(selected);
    }
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="직책선택"
      width={1200}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[확인].Select (L148) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E6] allButton[전체].Select (L160) → hide() */}
            {allButton && <Button type="reset" onClick={onClose}>전체</Button>}
            {/* [E5] closeButton[닫기].Select (L154) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 450, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L142) → retrieve() */}
        <SearchBar onSearch={() => retrieve(baseDate, searchText)}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} format={FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L128) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="직책/직책그룹/개요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L136) → confirm() */}
          <SingleGrid<TdmRole>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.roleId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
