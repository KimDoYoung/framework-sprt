/**
 * 거래처 조회창 (I02) — Flt03_Tab_AccountReport 개설기관 칸에서 연다 (act·ast·pay… 여러 도메인이 쓰는 공통 창).
 * AS-IS: myApp/client/vi/sys/Sys15_Lookup_Corp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(regYn, callback) L72: regYn이면 [거래처추가]가 보이고 [전체]가 [선택안함]이 된다. 창 610×500, 열 때 검색칸에 커서
 * empYn(임직원 포함, openSearch·open(regYn, empYn, …))과 [거래처추가] 창(Sys15_Lookup_AddCorp)은 다음 단계 — 쓰는 화면이 생길 때 만든다
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05·06
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<Corp>();

/** AS-IS buildGrid() L206-216 (setChecked MULTI) */
const buildGrid = () => [
  gb.text('corpTypeName', 120, '거래처구분'),  // L211
  gb.text('corpName', 200, '거래처명'),  // L212
  gb.text('note', 200, '비고'),  // L213
];

interface Props {
  open: boolean;
  /** open(regYn, callback): true면 [거래처추가]를 보이고 [전체]를 [선택안함]으로 부른다 */
  regYn?: boolean;
  /** callback.execute(result): [확인]·더블클릭이면 고른 거래처, [전체]·[선택안함]이면 null */
  onResult: (corp: Corp | null) => void;
  onClose: () => void;
}

export const Sys15_Lookup_Corp: React.FC<Props> = ({ open, regYn = false, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<Corp>>(null);
  const lastSelected = useRef<Corp | undefined>(undefined);
  const [corpType, setCorpType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Corp[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L218-239: 서비스 sys.Sys15_Corp.selectByUseYn(companyId, corpType, searchText "%…%", empYn). 검색어가 없으면 "%"
  const retrieve = useCallback(async (type: string, text: string) => {
    try {
      setRows(await sysApi.lookupCorps(type, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // open() L83-120: 원본은 열 때마다 새 창 → 검색을 비우고, 구분 콤보(CorpType, "전체") 로드가 끝나면 retrieve() (setting() L123-138)
  useEffect(() => {
    if (!open) return;
    setCorpType('%');
    setSearchText('');
    setRows([]);
    lastSelected.current = undefined;
    void retrieve('%', '');
  }, [open, retrieve]);

  // [E6] confirmButton[확인].Select (L179) · [E3] grid.RowDoubleClick (L159) → confirm() L241-250
  const confirm = (picked?: Corp) => {
    const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
    const corp = picked ?? (selectedRows.includes(lastSelected.current!) ? lastSelected.current : selectedRows[0]);
    if (!corp) {
      message.warning('거래처를 선택해주세요');
      return;
    }
    onResult(corp);
  };

  return (
    <LookupModal
      open={open}
      title="거래처목록"
      width={610}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E7] selectAllButton[전체].Select [callback != null] (L189) → callback(null) + hide(). regYn이면 문구가 "선택안함" (L187) */}
            <Button onClick={() => onResult(null)}>{regYn ? '선택안함' : '전체'}</Button>
            {/* [E8] cancelButton[닫기].Select (L198) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L166) → retrieve(). [E2] searchText.KeyPress [Enter] (L150) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve(corpType, searchText)}
          extra={regYn ? (
            // [E5] addButton[거래처추가].Select (L172) → lookupAddCorp() L252-260: [E5 다음 단계] Sys15_Lookup_AddCorp
            <Button type="register" onClick={() => message.info('거래처추가 창은 다음 단계에서 연결합니다.')}>거래처추가</Button>
          ) : undefined}
        >
          <SearchBar.Field label="구분">
            {/* [E1] corpTypeComboBox[CorpType].Collapse (L141) → retrieve() */}
            <SystemCodeComboBox
              kindCd="CorpType"
              altCode={['%', '전체']}
              style={{ width: 100 }}
              value={corpType}
              onChange={code => { const v = code ?? '%'; setCorpType(v); void retrieve(v, searchText); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="거래처명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Corp>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: false, enableClickSelection: true }}
            getRowId={p => String(p.data.corpId)}
            onRowSelected={e => { if (e.node.isSelected() && e.data) lastSelected.current = e.data; }}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
