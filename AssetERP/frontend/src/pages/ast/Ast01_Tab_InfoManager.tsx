/**
 * [1089] 기초자료 > 30. 자산&경영 > 자산상세 항목관리 (E21)
 * AS-IS: myApp/client/vi/ast/Ast01_Tab_InfoManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L91-116: 툴바(라벨 "검색" · 검색칸("연관태그를 입력해주세요") · 조회 · 저장 · 행 추가 · 행 삭제 · 사용항목만 보기 체크) + 체크박스 다중 셀 편집 그리드. 여백 20, 최대 폭 1000
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 원본에 초기화 버튼이 없어 onReset(UX-02)은 넣지 않는다
 * 공통 회사(0) 전용 — 서버 SQL이 company = 0 AND company = 로그인 회사라 관리자 회사가 아니면 0행.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstDetail } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstDetail>();
// insertRow() L181-189: 자산분류ID 0 · 회사 · 디폴트 true(서버가 넣는다) · 사용여부 true
const NEW_ROW: Partial<AstDetail> = { useYn: 'true' };

/** AS-IS buildGrid() L119-127 */
const buildGrid = () => [
  gb.long('seq', 60, '조회순번', { editor: 'number' }),  // L122
  gb.text('title', 200, '항목', { editor: 'text' }),  // L123
  gb.text('tag', 280, '연관태그', { editor: 'text' }),  // L124
  gb.boolean('useYn', 60, '사용여부', { editable: true }),  // L125 addBoolean (GXT CheckBoxCell — 클릭으로 바뀐다, 05 §6)
];

// update() L153-165: 조회순번·항목은 필수
const validateRows = (changed: AstDetail[]): string | undefined => {
  for (const r of changed) {
    if (r.seq == null) return '조회순번은 필수입력 항목입니다.';
    if (r.title == null || r.title === '') return '항목은 필수입력 항목입니다.';
  }
  return undefined;
};

// [E0] 화면 열림 (생성자 L54-117): 검색칸 빈칸 글자 "연관태그를 입력해주세요", 사용항목만 보기 체크 켬. 열 때 조회하지 않는다
export const Ast01_Tab_InfoManager: React.FC = () => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);
  // deleteList (L52): [행 삭제]가 모아 두었다가 [저장]에서 보낸다. 건수는 저장(n)에 보이도록 상태로도 든다
  const deleteList = useRef<number[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState(0);

  const crud = useGridCrud<AstDetail>({
    idField: 'detailId',
    // retrieve() L130-148: defaultYn "true" · companyId(서버) · "%"+검색어+"%" · useYn → ast.Ast02_Detail.selectByCompanyId0
    search: useCallback(() => astApi.searchDetails(searchText, useYn), [searchText, useYn]),
    save: astApi.saveDetails,
    remove: useCallback(async () => 0, []),  // 쓰지 않음 — 행 삭제는 deleteRow()에서 deleteList에 모은다
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'seq',
    validate: validateRows,
  });

  // [E1] searchText.KeyPress [Enter] (L55) → retrieve(), [E2] retrieveButton[조회].Select (L63) → retrieve()
  // retrieve() L130-148: deleteList를 비우고 조회한 뒤 첫 행을 선택한다
  const retrieve = async () => {
    deleteList.current = [];
    setPendingDeletes(0);
    await crud.retrieve();
    setTimeout(() => crud.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true));
  };

  // [E3] updateButton[저장].Select (L69) → update() L151-178: 변경 행 저장(GridUpdate) 뒤 삭제 대기 목록 삭제(GridDeleteData)
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const invalid = validateRows(crud.getChanged());
    if (invalid) {
      message.warning(invalid);  // 검사에 걸리면 저장도 삭제도 하지 않는다(L158-166 return)
      return;
    }
    try {
      await crud.saveRows();
      if (deleteList.current.length > 0) {
        await astApi.deleteDetails(deleteList.current);
        deleteList.current = [];
        setPendingDeletes(0);
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] addRowButton[행 추가].Select (L75) → insertRow() L181-189
  const insertRow = () => crud.addRow();

  // [E5] deleteRowButton[행 삭제].Select (L81) → deleteRow() L192-199: 체크한 행을 store에서 빼고 deleteList에 모은다
  const deleteRow = () => {
    const ids = (crud.gridRef.current?.api?.getSelectedRows() ?? []).map(r => r.detailId);
    const saved = ids.filter(id => id > 0);
    deleteList.current.push(...saved);
    setPendingDeletes(deleteList.current.length);
    crud.removeRows(ids);
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 1000 }}>
      <SearchBar onSearch={retrieve} loading={crud.loading} extra={<>
        <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + pendingDeletes }} onClick={update}>저장</Button>
        <Button type="addRow" onClick={insertRow}>행 추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
        <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용항목만 보기</Checkbox>
      </>}>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="연관태그를 입력해주세요" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AstDetail> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
