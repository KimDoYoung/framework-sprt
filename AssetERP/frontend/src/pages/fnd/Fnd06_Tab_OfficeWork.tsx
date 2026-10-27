/**
 * [1052] 펀드관리 > 90. 기관정보관리 > 사무수탁사정보 관리 (R11)
 * AS-IS: myApp/client/vi/fnd/Fnd06_Tab_OfficeWork.java (292줄)
 * 스타일: CG (CrudGrid — docs/page-style.md)
 * 레이아웃 L115-145: 툴바(사무수탁사명 300 "전체" · 사용여부 체크 · 조회 · 등록 · 저장 · 삭제 · 가져오기(ICAM)) + 그리드(행번호, 체크박스 단일,
 *   사무수탁사 코드·사무수탁사명·금융투자협회코드·신한펀드·사용여부·비고 편집). 여백 20, 최대 폭 1000
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OfficeWork } from '@/types/fnd';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<OfficeWork>();
const NEW_ROW: Partial<OfficeWork> = { officeWorkUseYn: 'true' };
const ROW_SELECTION = { mode: 'singleRow' as const, checkboxes: true };

/** AS-IS buildGrid() L148-165 */
const buildGrid = () => [
  gb.textCenter('officeWorkCode', 150, '사무수탁사 코드', { editor: 'text' }),  // L152
  gb.text('officeWorkName', 250, '사무수탁사명', { editor: 'text' }),  // L153
  gb.textCenter('kofiaCode', 150, '금융투자협회코드', { editor: 'text' }),  // L154
  gb.textCenter('etcOfficeWorkCode01', 100, '신한펀드', { editor: 'text' }),  // L155
  gb.boolean('officeWorkUseYn', 70, '사용여부', { editable: true }),  // L156
  gb.text('officeWorkNote', 300, '비고', { editor: 'text' }),  // L157
];

export const Fnd06_Tab_OfficeWork: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);

  const crud = useGridCrud<OfficeWork>({
    idField: 'officeWorkId',
    // retrieve() L171-187: searchText · companyId(서버) · useYn → fnd.Fnd06_OfficeWork.selectByCompanyId
    search: useCallback(() => fndApi.searchCompanyOfficeWorks(searchText, useYn), [searchText, useYn]),
    // preUpdate() L189-225 → update() L228-231: fnd.Fnd06_OfficeWork.preUpdate + update
    save: fndApi.saveCompanyOfficeWorks,
    validate: changed => {
      for (const r of changed) {
        if (!r.officeWorkCode) return '사무수탁사 코드를 입력하세요';
        if (!r.officeWorkName) return '사무수탁사명을 입력하세요';
      }
      return undefined;
    },
    // [E7] messageBox.DialogHide (L246) → delete() L258-269: fnd.Fnd06_OfficeWork.delete
    remove: fndApi.deleteCompanyOfficeWorks,
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'officeWorkCode',
  });

  // [E0] 화면 열림 (생성자 L63-146) → retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // importIcam() L271-287: 실패(status -1)면 메시지 상자, 아니면 retrieve()
  const importIcam = async () => {
    try {
      await fndApi.importCompanyIcamOfficeWorks();
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E1] searchText.KeyPress [Enter] (L66) → retrieve(), [E2] retrieveButton[조회].Select (L81) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E3] insertButton[등록].Select (L87) → insertRow() */}
        <Button type="register" onClick={() => crud.addRow()}>등록</Button>
        {/* [E4] updateButton[저장].Select (L93) → preUpdate() → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E5] deleteButton[삭제].Select (L99) → deleteRow() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E6] importButton[가져오기(ICAM)].Select (L105) → importIcam() */}
        <Button type="download" onClick={importIcam}>가져오기(ICAM)</Button>
      </>}>
        <SearchBar.Field label="사무수탁사명">
          <SearchBar.Input style={{ width: 300 }} placeholder="전체" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="사용여부">
          <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<OfficeWork> crud={crud} columnDefs={columnDefs} rowSelection={ROW_SELECTION} />
      </div>
    </div>
  );
};
