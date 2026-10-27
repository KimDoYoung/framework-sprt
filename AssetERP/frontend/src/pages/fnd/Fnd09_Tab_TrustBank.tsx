/**
 * [1100] 펀드관리 > 90. 기관정보관리 > 수탁은행정보 관리 (R12)
 * AS-IS: myApp/client/vi/fnd/Fnd09_Tab_TrustBank.java (268줄)
 * 스타일: CG (CrudGrid — docs/page-style.md)
 * 레이아웃 L106-135: 툴바(수탁은행명 300 "전체" · 사용여부 체크 · 조회 · 등록 · 저장 · 삭제 · 가져오기(ICAM)) + 그리드(행번호, 체크박스 단일,
 *   수탁은행코드·수탁은행명·사용여부·비고·신한아이타스~스카이 편집). 여백 20, 최대 폭 1000
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { TrustBank } from '@/types/fnd';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<TrustBank>();
const NEW_ROW: Partial<TrustBank> = { useYn: 'true' };
const ROW_SELECTION = { mode: 'singleRow' as const, checkboxes: true };

/** AS-IS buildGrid() L139-158 */
const buildGrid = () => [
  gb.text('trustBankCode', 100, '수탁은행코드', { editor: 'text' }),  // L143
  gb.text('trustBankName', 250, '수탁은행명', { editor: 'text' }),  // L144
  gb.boolean('useYn', 70, '사용여부', { editable: true }),  // L145
  gb.text('note', 300, '비고', { editor: 'text' }),  // L146
  gb.text('etcTrustBankCode01', 100, '신한아이타스', { editor: 'text' }),  // L147
  gb.text('etcTrustBankCode02', 100, '우리펀드', { editor: 'text' }),  // L148
  gb.text('etcTrustBankCode03', 100, '하나펀드', { editor: 'text' }),  // L149
  gb.text('etcTrustBankCode04', 100, '미래에셋', { editor: 'text' }),  // L150
  gb.text('etcTrustBankCode05', 100, '예탁원', { editor: 'text' }),  // L151
  gb.text('etcTrustBankCode06', 100, '국민', { editor: 'text' }),  // L152
  gb.text('etcTrustBankCode07', 100, '코스콤', { editor: 'text' }),  // L153
  gb.text('etcTrustBankCode08', 100, '삼정', { editor: 'text' }),  // L154
  gb.text('etcTrustBankCode09', 100, '스카이', { editor: 'text' }),  // L155
];

export const Fnd09_Tab_TrustBank: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);

  const crud = useGridCrud<TrustBank>({
    idField: 'trustBankId',
    // retrieve() L160-176: searchText · companyId(서버) · useYn → fnd.Fnd09_TrustBank.selectByCompanyId
    search: useCallback(() => fndApi.searchCompanyTrustBanks(searchText, useYn), [searchText, useYn]),
    // preUpdate() L185-212 → update() L214-217: fnd.Fnd09_TrustBank.preUpdate + update
    save: fndApi.saveCompanyTrustBanks,
    // [E7] messageBox.DialogHide (L222) → delete() L234-245: fnd.Fnd09_TrustBank.delete
    remove: fndApi.deleteCompanyTrustBanks,
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'trustBankCode',
  });

  // [E0] 화면 열림 (생성자 L61-137) → retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // importIcam() L247-263: 실패(status -1)면 메시지 상자, 아니면 retrieve()
  const importIcam = async () => {
    try {
      await fndApi.importCompanyIcamTrustBanks();
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E1] searchText.KeyPress [Enter] (L64) → retrieve(), [E2] retrieveButton[조회].Select (L72) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E3] insertButton[등록].Select (L78) → insertRow() */}
        <Button type="register" onClick={() => crud.addRow()}>등록</Button>
        {/* [E4] updateButton[저장].Select (L84) → preUpdate() → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E5] deleteButton[삭제].Select (L90) → deleteRow() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E6] importButton[가져오기(ICAM)].Select (L96) → importIcam() */}
        <Button type="download" onClick={importIcam}>가져오기(ICAM)</Button>
      </>}>
        <SearchBar.Field label="수탁은행명">
          <SearchBar.Input style={{ width: 300 }} placeholder="전체" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="사용여부">
          <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<TrustBank> crud={crud} columnDefs={columnDefs} rowSelection={ROW_SELECTION} />
      </div>
    </div>
  );
};
