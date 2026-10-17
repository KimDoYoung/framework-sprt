/**
 * [1102] I/F > 91. 기관정보관리(관리자) > 수탁사정보 관리(관리자) (D11)
 * AS-IS: myApp/client/vi/fnd/Fnd03_Tab_ConsignmentManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-104: 툴바(사무수탁사명 · 검색칸(400, 빈칸 글자 "전체") · 조회 · 저장 · ICAM가져오기 · 사용여부 체크) + 그리드(행번호, 체크박스 단일,
 *   수탁사코드·수탁사명·비고 편집, 사용여부는 체크 표시만). 행 추가·삭제 버튼은 원본에 없다. 여백 20, 최대 폭 1000
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 공통 회사(0) 전용 — 서버 SQL이 company = 0 AND company = 로그인 회사라 관리자 회사가 아니면 0행. ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절(작업기록 의존)
 */
import React, { useCallback, useMemo, useState } from 'react';
import { Checkbox, message } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Consignment } from '@/types/fnd';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Consignment>();
const NEW_ROW: Partial<Consignment> = {};

/** AS-IS buildGrid() L125-135 */
const buildGrid = () => [
  gb.text('consignmentCode', 80, '수탁사코드', { editor: 'text' }),  // L129
  gb.text('consignmentName', 250, '수탁사명', { editor: 'text' }),  // L130
  gb.boolean('useYn', 70, '사용여부'),  // L131 addBoolean (편집기 없음)
  gb.text('note', 300, '비고', { editor: 'text' }),  // L132
];

// [E0] 화면 열림 (생성자 L47-105): 검색칸 폭 400·빈칸 글자 "전체", 사용여부 체크 켬. 열 때 조회하지 않는다
export const Fnd03_Tab_ConsignmentManager: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);

  const crud = useGridCrud<Consignment>({
    idField: 'consignmentId',
    // retrieve() L137-153: searchText · companyId(서버) · useYn → fnd.Fnd03_Consignment.selectByCompanyId0
    search: useCallback(() => fndApi.searchConsignments(searchText, useYn), [searchText, useYn]),
    // update() L155-169: GridUpdate → fnd.Fnd03_Consignment.insertCheck 뒤 retrieve()
    save: fndApi.saveConsignments,
    reloadAfterSave: true,
    // 행 추가·삭제 버튼이 없다(원본에 insertRow·deleteRow 없음)
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // importIcam() L107-123: 실패(status -1)면 메시지 상자, 아니면 retrieve()
  const importIcam = async () => {
    try {
      await fndApi.importIcamConsignments();
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      {/* [E1] searchText.KeyPress [Enter] (L50) → retrieve(), [E2] retrieveButton[조회].Select (L58) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<>
        {/* [E3] updateButton[저장].Select (L64) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] importButton[ICAM가져오기].Select (L70) → importIcam() */}
        <Button type="download" onClick={importIcam}>ICAM가져오기</Button>
        <SearchBar.Field label="사용여부">
          <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)} />
        </SearchBar.Field>
      </>}>
        <SearchBar.Field label="사무수탁사명">
          <SearchBar.Input style={{ width: 400 }} placeholder="전체" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Consignment> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true }} />
      </div>
    </div>
  );
};
