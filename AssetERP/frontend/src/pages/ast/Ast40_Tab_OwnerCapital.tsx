/**
 * [1299] 고유자산 > 10. 고유자산 등록 > 자기자본/투자한도 등록 (W03)
 * AS-IS: myApp/client/vi/ast/Ast40_Tab_OwnerCapital.java (239줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-86: 가운데(여백 20, 테두리) = 툴바(기준연도 · [조회][등록][삭제][저장] · [투자한도/StopLoss 설정]) + 자기자본 그리드(CellEditGrid, 체크박스)
 * 함께: Ast41_Lookup_InvestLimit(투자한도/StopLoss 설정 창) → Ast41_Lookup_Insert(적용일 생성)
 * 스타일: CG (docs/page-style.md — 조건 입력이 있는 편집 그리드: SearchBar + extra. yunhee 판별은 AS-IS SG)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { astApi } from '@/api/ast';
import { OwnerCapital } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ast41_Lookup_InvestLimit } from './Ast41_Lookup_InvestLimit';

const gb = gbFor<OwnerCapital>();

export const Ast40_Tab_OwnerCapital: React.FC = () => {
  const [stdYear, setStdYear] = useState(String(new Date().getFullYear()));   // settings() L89-91: 올해(YYYY)
  const [stopLossOpen, setStopLossOpen] = useState(false);

  // buildGrid() L133-
  const columnDefs = useMemo(() => [
    gb.date('stdDate', 100, '기준일', { editor: 'date' }),
    gb.long('amt', 200, '자기자본금', { editor: 'number' }),
    gb.text('note', 800, '비고', { editor: 'text' }),
  ], []);

  // retrieve() L144-160: ast.Ast40_OwnerCapital.selectByDate (companyId는 서버, stdYear)
  const search = useCallback(() => astApi.searchOwnerCapitals(stdYear), [stdYear]);
  const save = useCallback((changed: OwnerCapital[]) => astApi.saveOwnerCapitals(changed), []);
  const remove = useCallback((ids: number[]) => astApi.deleteOwnerCapitals(ids), []);
  const newRow = useCallback((): Partial<OwnerCapital> => ({}), []);   // insertRow() L191-196: 회사 ID는 서버

  const crud = useGridCrud<OwnerCapital>({
    idField: 'ownerCapitalId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'stdDate',
    // delete() L203-229: "N건의 정보를 삭제하시겠습니까?"
    deleteConfirm: n => `${n}건의 정보를 삭제하시겠습니까?`,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L55-86) → settings(), retrieve()
  useEffect(() => { void retrieve(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // 조회 뒤 첫 행 선택(retrieve() L153-157: grid.getSelectionModel().select(0, false))
  const selectFirst = React.useRef(true);
  const onRowDataUpdated = () => {
    if (!selectFirst.current) return;
    selectFirst.current = false;
    crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
  };
  const onSearch = async () => { selectFirst.current = true; await retrieve(); };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L101) → retrieve() */}
        <SearchBar
          onSearch={onSearch}
          extra={
            <>
              {/* [E3] insertButton[등록].Select (L107) → insertRow() */}
              <Button type="register" onClick={crud.addRow}>등록</Button>
              {/* [E4] deleteButton[삭제].Select (L113) → delete() → [E7] msgBox YES → ast.Ast40_OwnerCapital.delete */}
              <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
              {/* [E5] updateButton[저장].Select (L119) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E6] stopLossButton[투자한도/StopLoss 설정].Select (L125) → lookupStopLoss() L231-234 */}
              <Button type="view" onClick={() => setStopLossOpen(true)}>투자한도/StopLoss 설정</Button>
            </>
          }
        >
          <SearchBar.Field label="기준연도">
            {/* [E1] leaveYText.KeyPress [Enter] (L93) → retrieve() */}
            <SearchBar.Input style={{ width: 80 }} placeholder="YYYY" value={stdYear} onChange={e => setStdYear(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<OwnerCapital> crud={crud} columnDefs={columnDefs} onRowDataUpdated={onRowDataUpdated} />
        </div>
      </div>
      <Ast41_Lookup_InvestLimit open={stopLossOpen} onClose={() => setStopLossOpen(false)} />
    </div>
  );
};
