/**
 * 법규 그리드 (E01) — Ics01_Tab_ClassTree 오른쪽(center). 트리에서 분류를 고르면 그 분류와 모든 하위의 법규를 보여 준다.
 * AS-IS: myApp/client/vi/ics/Ics01_Grid_IcsType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L117-139: 위 툴바(검색 · 검색칸(200, 빈칸 글자 "분류코드/법규명") · 일임(자문)관련 법규만 조회 체크 · [검색]) + 그리드 + 아래 가운데 [삭제][등록][저장].
 *   삭제·등록·저장은 트리에서 분류를 고르기 전에는 비활성(L131-133)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 조건이 검색어 하나라 초기화(UX-02)는 없다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { icsApi } from '@/api/ics';
import { IcsLaw } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics01_Lookup_Content } from './Ics01_Lookup_Content';
import { Ics01_Lookup_IcsFile } from './Ics01_Lookup_IcsFile';
import { Ics01_Lookup_RelateTdm } from './Ics01_Lookup_RelateTdm';
import { Ics01_Move_Grid } from './Ics01_Move_Grid';
import { Ics20_Lookup_RevisionHistory } from './Ics20_Lookup_RevisionHistory';

const gb = gbFor<IcsLaw>();

interface Props {
  /** 트리에서 고른 분류 (retrieve(classTreeModel)의 인자) — 바뀌면 조회한다 */
  classTreeId: number | null;
}

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof IcsLaw & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

export const Ics01_Grid_IcsType: React.FC<Props> = ({ classTreeId }) => {
  const [searchText, setSearchText] = useState('');
  const [advisYn, setAdvisYn] = useState(false);
  const [moveLaw, setMoveLaw] = useState<IcsLaw | null>(null);
  const [contentLaw, setContentLaw] = useState<IcsLaw | null>(null);
  const [fileLaw, setFileLaw] = useState<IcsLaw | null>(null);
  const [revisionId, setRevisionId] = useState<number | null>(null);
  const [tdmLaw, setTdmLaw] = useState<IcsLaw | null>(null);
  const classTreeIdRef = useRef(classTreeId);
  classTreeIdRef.current = classTreeId;

  const crud = useGridCrud<IcsLaw>({
    idField: 'classTreeId',
    // retrieve(classTreeModel) L239-270: classTreeId · publicType(%) · companyId(서버) · typeCode IT · searchText · advisYn → ics.Ics01_ClassTree.selectByClassTreeId
    search: useCallback(async () => (classTreeId == null ? [] : icsApi.searchLaws(classTreeId, searchText, advisYn)), [classTreeId, searchText, advisYn]),
    // update() L272-298: GridUpdate → ics.Ics01_ClassTree.update
    save: icsApi.saveLaws,
    // delete() L366-370: GridDeleteData → ics.Ics01_ClassTree.delete
    remove: icsApi.deleteLaws,
    // deleteRow() L346-364: HtmlMessageBox "삭제" / "선택한 문서를 삭제하시겠습니까?"
    deleteConfirm: '선택한 문서를 삭제하시겠습니까?',
    // insertRow() L334-344: 회사(서버) · parentTreeId = 고른 분류 · typeCode IT · 사용 true · 업무분류 '0'
    newRow: useCallback(() => ({ parentTreeId: classTreeIdRef.current, advisYn: 'false' }), []),
    firstEditField: 'classTreeCode',
    // update() L276-290: 수정한 행마다 법규명 → 분류코드 순으로 검사
    validate: (changed) => {
      for (const m of changed) {
        if (!m.classTreeName) return '법규 내용을 입력해주세요';
        if (m.classTreeCode == null) return '분류코드를 입력해주세요';
      }
      return undefined;
    },
  });

  // 트리의 선택이 바뀔 때마다 retrieve(classTreeModel) — searchText 같은 조건 변경으로는 다시 부르지 않는다
  const retrieveRef = useRef(crud.retrieve);
  retrieveRef.current = crud.retrieve;
  useEffect(() => { if (classTreeId != null) void retrieveRef.current(); }, [classTreeId]);

  // refresh() L372-390: 조회창을 닫은 뒤 한 행만 다시 읽어 그 자리에 넣는다
  const refresh = async (id: number) => {
    try {
      const row = await icsApi.refreshLaw(id);
      crud.replaceRow(id, row);
    } catch (err) {
      message.warning((err as Error).message);
    }
  };

  // buildGrid() L142-227
  const columnDefs = useMemo(() => [
    iconCell<IcsLaw>('move', 'actionCellMove', 40, '이동', row => setMoveLaw(row)),  // L209 moveItem()
    gb.textCenter('classTreeCode', 70, '분류코드', { editor: 'text' }),  // L210
    gb.textArea('classTreeName', 200, '법규명', { editor: 'largeText' }),  // L211
    textLimitArea('content', 300, '상세내용'),  // L212 addTextLimitArea
    iconCell<IcsLaw>('edit', 'actionCellContent', 30, ' ', row => setContentLaw(row)),  // L213 contentEdit(): modified()로 고치던 값을 모델에 넣고 Ics01_Lookup_Content.open
    gb.textArea('submitTo', 170, '제출처', { editor: 'largeText' }),  // L214
    gb.text('cycleName', 100, '주기'),  // L215
    iconCell<IcsLaw>('edit', 'actionCellDeadline', 30, '기한', () => message.info('기한(Sch03_Lookup_Ics)은 아직 변환 전입니다.')),  // L216 deadlineList()
    gb.textCenter('fileCount', 60, '서식파일'),  // L217
    iconCell<IcsLaw>('add', 'actionCellFile', 30, ' ', row => setFileLaw(row)),  // L218 fileAddList() → Ics01_Lookup_IcsFile.open
    gb.textArea('relatedLaw', 150, '관련조문', { editor: 'largeText' }),  // L219
    gb.textCenter('revisionCount', 60, '개정이력'),  // L220
    iconCell<IcsLaw>('view', 'actionCellRevision', 30, ' ', row => setRevisionId(row.classTreeId)),  // L221 revisionList() → Ics20_Lookup_RevisionHistory.open
    gb.textCenter('tdmCount', 60, '연결책무'),  // L222
    iconCell<IcsLaw>('edit', 'actionCellTdm', 30, ' ', row => setTdmLaw(row)),  // L223 Ics01_Lookup_RelateTdm.open → 닫을 때 refresh
    gb.boolean('advisYn', 60, '일임<br>(자문)', { editable: true }),  // L224
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const noParent = classTreeId == null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      {/* [E1] searchText.KeyPress [Enter] (L78) → retrieve(), [E2] retrieveButton[검색].Select (L90) → retrieve() */}
      <SearchBar
        searchText="검색"
        disabled={noParent}
        onSearch={crud.retrieve}
        // 검색칸 폭 200, 빈칸 글자 "분류코드/법규명" (L76-77) · 일임(자문)관련 법규만 조회 (L87-88)
        extra={<Checkbox checked={advisYn} onChange={e => setAdvisYn(e.target.checked)}>일임(자문)관련 법규만 조회</Checkbox>}
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="분류코드/법규명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcsLaw> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {/* [E3] deleteButton[삭제].Select (L98) → deleteRow() → [E7] msgBox.DialogHide [YES] (L349) → delete() */}
        <Button type="delete" disabled={noParent} onClick={crud.deleteChecked}>삭제</Button>
        {/* [E4] insertButton[등록].Select (L104) → insertRow() */}
        <Button type="register" disabled={noParent} onClick={crud.addRow}>등록</Button>
        {/* [E5] updateButton[저장].Select (L110) → update(). 저장(n)은 UX-03 */}
        <Button type="save" disabled={noParent} count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </div>
      {/* [E6] publicType[IcsPublicType].Collapse (L169): 그리드 컬럼에 쓰이지 않는 콤보라 화면에 나오지 않는다 */}
      <Ics01_Lookup_Content
        law={contentLaw}
        onClosed={() => { if (contentLaw) void refresh(contentLaw.classTreeId); }}
        onClose={() => setContentLaw(null)}
      />
      <Ics01_Lookup_IcsFile
        law={fileLaw}
        onClosed={() => { if (fileLaw) void refresh(fileLaw.classTreeId); }}
        onClose={() => setFileLaw(null)}
      />
      <Ics20_Lookup_RevisionHistory classTreeId={revisionId} onClose={() => setRevisionId(null)} />
      <Ics01_Lookup_RelateTdm
        icsId={tdmLaw?.classTreeId ?? null}
        icsName={tdmLaw?.classTreeName ?? ''}
        onChanged={() => { if (tdmLaw) void refresh(tdmLaw.classTreeId); }}
        onClose={() => setTdmLaw(null)}
      />
      <Ics01_Move_Grid
        law={moveLaw}
        onMoved={() => { void crud.retrieve(); }}
        onClose={() => setMoveLaw(null)}
      />
    </div>
  );
};
