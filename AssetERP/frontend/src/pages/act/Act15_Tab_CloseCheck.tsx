/**
 * [1368] 기초자료 > 40. 관리회계 > 마감검증 체크항목 (E32)
 * AS-IS: myApp/client/vi/act/Act15_Tab_CloseCheck.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L37-62: 가운데 = 툴바(검색 · [조회][저장]) + 고객사별 체크박스 그리드(행번호, 단일 선택, 체크박스 클릭으로 값 변경)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 조건 1개라 초기화(UX-02) 없음), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { actApi } from '@/api/act';
import { CloseCheck } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<CloseCheck>();

/** buildGrid() L89-110 — addBoolean은 클릭으로 값이 바뀌는 체크박스 */
const check = (field: Parameters<typeof gb.boolean>[0], title: string) => gb.boolean(field, 100, title, { editable: true });

const columnDefs = [
  gb.text('companyName', 220, '고객사'),
  check('depositRealMatchYn', '실제예금<br>잔고대사'),
  check('depositApprYn', '예금대사<br>결과보고'),
  check('depositLedgerMatchYn', '예금대사<br>잔고vs계정'),
  check('financeEvalYn', '금융상품<br>평가'),
  check('financeLedgerMatchYn', '금융상품<br>잔고vs계정'),
  check('fxEvalYn', '환평가'),
  check('depnYn', '감가상각'),
  check('tangibleMatchYn', '유형자산<br>잔고vs계정'),
  check('intangibleMatchYn', '무형자산<br>잔고vs계정'),
  check('supplyMatchYn', '소모품(비품)<br>잔고vs계정'),
  check('fundFeeMatchYn', '펀드보수<br>ICAMvsERP'),
  check('fundFeeEvalYn', '펀드미수보수'),
  check('unfixYn', '미승인전표'),
];

export const Act15_Tab_CloseCheck: React.FC = () => {
  // settings(): 검색칸
  const sp = useSearchParams(() => ({ searchText: '' }));
  const selectFirst = useRef(false);

  const crud = useGridCrud<CloseCheck>({
    idField: 'closeCheckId',
    // retrieve() L112-128: "%검색어%" → act.Act15_CloseCheck.selectByText
    search: useCallback(() => actApi.searchCloseChecks(sp.current.current.searchText), [sp.current]),
    // update() L135-143: GridUpdate → act.Act15_CloseCheck.update, 끝나면 retrieve()
    save: useCallback((rows: CloseCheck[]) => actApi.updateCloseChecks(rows), []),
    // 등록·삭제 버튼이 없다 — 행은 고객사마다 SQL이 만든다
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
    reloadAfterSave: true,
  });

  // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
  const retrieve = async () => {
    selectFirst.current = true;
    await crud.retrieve();
  };

  // [E0] 화면 열림 (생성자 L37-62) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grid = useMemo(() => columnDefs, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L75), [E1] searchText.KeyPress [Enter] (L66) → retrieve() */}
      <SearchBar
        onSearch={retrieve}
        loading={crud.loading}
        extra={
          // [E3] updateButton[저장].Select (L81) → update(). 저장(n)은 UX-03
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        }
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CloseCheck>
          crud={crud}
          columnDefs={grid}
          onRowDataUpdated={e => {
            // 처음 그릴 때의 빈 데이터 갱신은 건너뛴다 — 조회 결과가 들어온 뒤에 첫 행을 고른다
            if (!selectFirst.current || e.api.getDisplayedRowCount() === 0) return;
            selectFirst.current = false;
            e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
          }}
        />
      </div>
    </div>
  );
};
