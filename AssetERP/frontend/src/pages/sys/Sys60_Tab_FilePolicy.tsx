/**
 * [1500] 관리자 > 09. 기타 > 파일보안정책 (A36)
 * AS-IS: myApp/client/vi/sys/Sys60_Tab_FilePolicy.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-74: 툴바(검색어·조회·등록·저장·삭제) + 셀 편집 그리드(행번호·체크박스 다중).
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 조건이 1개라 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sysApi } from '@/api/sys';
import { FilePolicy } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<FilePolicy>();

/** AS-IS buildGrid() — 행번호 · 체크(MULTI) · 확장자 100 · MIME규칙 800 · 비고 600 (addText 편집) */
const buildGrid = () => [
  gb.text('ext', 100, '확장자', { editor: 'text' }),
  gb.text('mimeType', 800, 'MIME규칙', { editor: 'text' }),
  gb.text('note', 600, '비고', { editor: 'text' }),
];

export const Sys60_Tab_FilePolicy: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<FilePolicy>({
    idField: 'filePolicyId',
    // retrieve() L124-134: '%'+검색어+'%' → sys.Sys60_FilePolicy.selectByText
    search: useCallback(() => sysApi.searchFilePolicies(searchText), [searchText]),
    // update() L137-141 → sys.Sys60_FilePolicy.update
    save: sysApi.updateFilePolicies,
    remove: sysApi.deleteFilePolicies,
    // insertRow() L144-148: GridInsertRow
    newRow: useCallback(() => ({ ext: '', mimeType: '', note: '' }), []),
    firstEditField: 'ext',
    // deleteChk() L150-168
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (생성자 L49-74) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] searchText.KeyPress [Enter] (L79) → retrieve() — SearchBar.Input의 Enter, [E2] retrieveButton[조회].Select (L87) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E3] insertButton[등록].Select (L93) → insertRow() */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E4] updateButton[저장].Select (L99) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E5] deleteButton[삭제].Select (L105) → deleteChk(), [E6] msgBox.DialogHide [YES] (L153) → deleteRow() → sys.Sys60_FilePolicy.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>}>
        <SearchBar.Field label="검색어">
          <SearchBar.Input style={{ width: 200 }} placeholder="확장자/MIME/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<FilePolicy> crud={crud} columnDefs={columnDefs} sortable={false} />
      </div>
    </div>
  );
};
