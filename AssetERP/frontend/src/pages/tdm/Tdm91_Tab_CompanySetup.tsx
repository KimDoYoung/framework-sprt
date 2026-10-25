/**
 * [1469] 책무 > 90. 책무관리현황 > 책무관리 시스템설정 (N29)
 * AS-IS: myApp/client/vi/tdm/Tdm91_Tab_CompanySetup.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-78: 툴바([조회][등록][등록(복사)][저장][삭제]) + 설정 그리드(CellEditGrid, 단일 체크) + 아래 안내 글(빨간 굵은 글 포함, L52-53)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useMemo } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { tdmApi } from '@/api/tdm';
import { TdmCompanySetup } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<TdmCompanySetup>();

/** setChecked(SINGLE): 체크 한 행만 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: false } as const;

export const Tdm91_Tab_CompanySetup: React.FC = () => {
  // buildGrid(): 적용시작일자 120 · 의견입력 최소 글자수 150 · 일괄점검/일괄승인/증빙필수 150 · 비고 350
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일자', { editor: 'date' }),
    gb.longCenter('cmntMinLimit', 150, '의견입력<br>최소 글자수', { editor: 'number' }),
    gb.boolean('batchCheckUseYn', 150, '일괄점검사용', { editable: true }),
    gb.boolean('batchApprUseYn', 150, '일괄승인사용', { editable: true }),
    gb.boolean('evidFileCheckYn', 150, '증빙필수', { editable: true }),
    gb.text('note', 350, '비고', { editor: 'text' }),
  ], []);

  const crud = useGridCrud<TdmCompanySetup>({
    idField: 'companySetupId',
    // retrieve() L128-142: tdm.Tdm91_CompanySetup.selectByCompanyId(companyId는 서버) — 끝나면 첫 행 선택
    search: useCallback(async () => {
      const list = await tdmApi.searchCompanySetups();
      setTimeout(() => crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
      return list;
    }, []),   // eslint-disable-line react-hooks/exhaustive-deps
    save: useCallback((rows: TdmCompanySetup[]) => tdmApi.saveCompanySetups(rows), []),
    remove: useCallback((ids: number[]) => tdmApi.deleteCompanySetups(ids), []),
    newRow: useCallback((): Partial<TdmCompanySetup> => ({}), []),
    deleteConfirm: '선택한 내역을 삭제하시겠습니까?',   // deleteRow() L201-221
    // update() L179-198
    validate: changed => (changed.some(r => !r.startDate) ? '적용시작일자를 입력하세요' : undefined),
  });
  const { retrieve, addRows } = crud;

  // [E0] 화면 열림 (생성자 L55-78) → settings(), retrieve()
  React.useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] insertButton[등록].Select (L87) → insertRow() L145-158: 일괄승인 false · 증빙필수 true · 적용시작일자 = 오늘(변경으로 친다)
  const insertRow = () => addRows([{ batchApprUseYn: 'false', evidFileCheckYn: 'true', startDate: dayjs().format('YYYY-MM-DD') }], true);

  // [E3] copyButton[등록(복사)].Select (L93) → copyInsertRow() L160-176: 고른 행을 복사(ID 없음), 적용시작일자 = 오늘
  const copyInsertRow = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) {
      message.warning('복사할 대상을 선택하세요');
      return;
    }
    const { companySetupId: _id, ...rest } = selected;
    void _id;
    addRows([{ ...rest, startDate: dayjs().format('YYYY-MM-DD') }], true);
  };

  // [E5] deleteButton[삭제].Select (L105) → deleteRow() L201-221: 고른 것이 없으면 안내 → 확인 [E6] messageBox.DialogHide (L208) → delete
  const deleteRow = () => {
    if ((crud.gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 내역을 선택하세요');
      return;
    }
    crud.deleteChecked();
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L81) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <>
              <Button type="register" onClick={insertRow}>등록</Button>
              <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
              {/* [E4] updateButton[저장].Select (L99) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
            </>
          }
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<TdmCompanySetup> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
        </div>
        {/* label01 (L52-53): 12px 안내 글, 빨간 굵은 글 */}
        <div style={{ fontSize: 12, color: '#000', margin: 15 }}>
          * 일괄승인 사용 시, 대표이사 및 임원의{' '}
          <b style={{ color: '#DD5E5E' }}>'상당한 주의 의무' 위반으로 간주될 수 있으며, 해당 절차의 실효성을 인정받기 어려울 수 있으니</b>
          {' '}유의하시기 바랍니다.
        </div>
      </div>
    </div>
  );
};
