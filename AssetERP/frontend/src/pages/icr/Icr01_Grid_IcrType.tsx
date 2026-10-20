/**
 * 내규 그리드 (H09) — Icr01_Tab_ClassTree 오른쪽(center). 트리에서 분류를 고르면 그 분류와 모든 하위의 내규를 보여 준다.
 * AS-IS: myApp/client/vi/icr/Icr01_Grid_IcrType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L69-129: 위 툴바(검색 · 검색칸(200, 빈칸 글자 "분류코드/내규명") · [검색]) + 그리드 + 아래 가운데 [삭제][등록][저장].
 *   삭제·등록·저장은 트리에서 분류를 고르기 전에는 비활성(L117-119)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03). 조건이 검색어 하나라 초기화(UX-02)는 없다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { icrApi } from '@/api/icr';
import { IcrRule } from '@/types/icr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sch03_Lookup_Ics } from '@/components/lookup/Sch03_Lookup_Ics';
import { Icr01_Lookup_Content } from './Icr01_Lookup_Content';
import { Icr01_Lookup_IcrFile } from './Icr01_Lookup_IcrFile';
import { Icr01_Lookup_Share } from './Icr01_Lookup_Share';
import { Icr01_Move_Grid } from './Icr01_Move_Grid';

const gb = gbFor<IcrRule>();

interface Props {
  /** 트리에서 고른 분류 (retrieve(classTreeModel)의 인자) — 바뀌면 조회한다 */
  classTreeId: number | null;
}

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof IcrRule & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

export const Icr01_Grid_IcrType: React.FC<Props> = ({ classTreeId }) => {
  const [searchText, setSearchText] = useState('');
  const [moveRule, setMoveRule] = useState<IcrRule | null>(null);
  const [contentRule, setContentRule] = useState<IcrRule | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);
  const [deadlineId, setDeadlineId] = useState<number | null>(null);
  const [shareId, setShareId] = useState<number | null>(null);
  const classTreeIdRef = useRef(classTreeId);
  classTreeIdRef.current = classTreeId;

  const crud = useGridCrud<IcrRule>({
    idField: 'classTreeId',
    // retrieve(classTreeModel) L201-230: classTreeId · companyId(서버) · typeCode IT · searchText(%…%) → icr.Icr01_ClassTree.selectByClassTreeId
    search: useCallback(async () => (classTreeId == null ? [] : icrApi.searchRules(classTreeId, searchText)), [classTreeId, searchText]),
    // update() L232-262: GridUpdate → icr.Icr01_ClassTree.update
    save: icrApi.saveRules,
    // delete() L360-364: GridDeleteData → icr.Icr01_ClassTree.delete
    remove: icrApi.deleteRules,
    // deleteRow() L340-358: HtmlMessageBox "삭제" / "선택한 문서를 삭제하시겠습니까?"
    deleteConfirm: '선택한 문서를 삭제하시겠습니까?',
    // insertRow() L329-338: 회사(서버) · parentTreeId = 고른 분류 · typeCode IT · 사용 true
    newRow: useCallback(() => ({ parentTreeId: classTreeIdRef.current, useYn: 'true' }), []),
    firstEditField: 'classTreeCode',
    // update() L236-257: 수정한 행마다 내규명 → 분류코드 → 주기 순으로 검사
    // (주기는 새 행도 비어 있어 막힌다 — 원본 그대로, 작업기록 "제안")
    validate: (changed) => {
      for (const m of changed) {
        if (!m.classTreeName) return '내규명을 입력해 주세요';
        if (m.classTreeCode == null) return '분류코드를 입력해 주세요';
        if (m.cycleName == null) return '주기정보를 등록해 주세요';
      }
      return undefined;
    },
  });

  // 트리의 선택이 바뀔 때마다 retrieve(classTreeModel) — searchText 같은 조건 변경으로는 다시 부르지 않는다
  const retrieveRef = useRef(crud.retrieve);
  retrieveRef.current = crud.retrieve;
  useEffect(() => { if (classTreeId != null) void retrieveRef.current(); }, [classTreeId]);

  // refresh() L366-384: 조회창을 닫은 뒤 한 행만 다시 읽어 그 자리에 넣는다
  const refresh = async (id: number) => {
    try {
      const row = await icrApi.refreshRule(id);
      crud.replaceRow(id, row);
    } catch (err) {
      message.warning((err as Error).message);
    }
  };

  // contentEdit() L264-279: modified() 뒤 주기가 없으면 "주기정보를 먼저 등록해 주세요", 있으면 Icr01_Lookup_Content.open → 닫으면 refresh
  const contentEdit = (row: IcrRule) => {
    if (row.cycleName == null) {
      message.warning('주기정보를 먼저 등록해 주세요');
      return;
    }
    setContentRule(row);
  };

  // buildGrid() L131-189
  const columnDefs = useMemo(() => [
    iconCell<IcrRule>('move', 'actionCellMove', 50, '이동', row => setMoveRule(row)),  // L173 moveItem()
    gb.textCenter('classTreeCode', 70, '분류코드', { editor: 'text' }),  // L174
    gb.textArea('classTreeName', 200, '내규명', { editor: 'largeText' }),  // L175
    textLimitArea('content', 300, '상세내용'),  // L176 addTextLimitArea
    iconCell<IcrRule>('edit', 'actionCellContent', 30, ' ', row => contentEdit(row)),  // L177 contentEdit()
    gb.textArea('submitTo', 200, '제출처', { editor: 'largeText' }),  // L178
    gb.text('cycleName', 100, '주기'),  // L179
    iconCell<IcrRule>('edit', 'actionCellDeadline', 30, '기한', row => setDeadlineId(row.classTreeId)),  // L180 deadlineList(): Sch03_Lookup_Icr.open(classTreeId, "6", callback → refresh)
    gb.text('managerGroupName', 120, '관리그룹'),  // L181
    iconCell<IcrRule>('edit', 'actionCellManager', 30, ' ', row => setShareId(row.classTreeId)),  // L182 managerList() → Icr01_Lookup_Share.open
    gb.textCenter('fileCount', 60, '서식파일'),  // L183
    iconCell<IcrRule>('add', 'actionCellFile', 30, ' ', row => setFileId(row.classTreeId)),  // L184 fileAddList() → Icr01_Lookup_IcrFile.open
    gb.textArea('relatedLaw', 200, '관련조문', { editor: 'largeText' }),  // L185
    gb.boolean('useYn', 100, '사용여부', { editable: true }),  // L186
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const noParent = classTreeId == null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      {/* [E1] searchText.KeyPress [Enter] (L74) → retrieve(), [E2] retrieveButton[검색].Select (L82) → retrieve() */}
      <SearchBar searchText="검색" disabled={noParent} onSearch={crud.retrieve}>
        {/* 검색칸 폭 200, 빈칸 글자 "분류코드/내규명" (L71-72) */}
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="분류코드/내규명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<IcrRule> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        {/* [E3] deleteButton[삭제].Select (L90) → deleteRow() → [E6] msgBox.DialogHide [YES] (L343) → delete() */}
        <Button type="delete" disabled={noParent} onClick={crud.deleteChecked}>삭제</Button>
        {/* [E4] insertButton[등록].Select (L96) → insertRow() */}
        <Button type="register" disabled={noParent} onClick={crud.addRow}>등록</Button>
        {/* [E5] updateButton[저장].Select (L102) → update(). 저장(n)은 UX-03 */}
        <Button type="save" disabled={noParent} count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </div>
      <Icr01_Lookup_Content
        row={contentRule}
        editable
        onClosed={() => { if (contentRule) void refresh(contentRule.classTreeId); }}
        onClose={() => setContentRule(null)}
      />
      <Icr01_Lookup_IcrFile
        classTreeId={fileId}
        admin
        onClosed={() => { if (fileId != null) void refresh(fileId); }}
        onClose={() => setFileId(null)}
      />
      <Sch03_Lookup_Ics
        classTreeId={deadlineId}
        scheduleCode="6"
        onClosed={() => { if (deadlineId != null) void refresh(deadlineId); }}
        onClose={() => setDeadlineId(null)}
      />
      <Icr01_Lookup_Share
        classTreeId={shareId}
        onResult={() => { if (shareId != null) void refresh(shareId); }}
        onClose={() => setShareId(null)}
      />
      <Icr01_Move_Grid
        rule={moveRule}
        onMoved={() => { void crud.retrieve(); }}
        onClose={() => setMoveRule(null)}
      />
    </div>
  );
};
