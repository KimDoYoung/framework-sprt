/**
 * 계정과목 트리 조회창 (X17) — Act02_Tab_JournalSub의 계정코드 칸에서 연다
 * AS-IS: myApp/client/vi/act/Act01_Lookup_AccountTree.java (240줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-61·open() L63-91: 모달 800×600 "계정과목", 툴바(계정과목 200 · [찾기]) + 계정과목 트리(계정코드 100 · 계정과목 500 · LEVEL 100), 아래 가운데 [확인][닫기]. 열 때 retrieve()
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창 UX-05
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCodeTree } from '@/types/act';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AccountCodeTree>();

/** 트리 선택은 한 행 (체크박스 없음). rowSelection은 상수로 넘긴다(11 §1 함정) */
const TREE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(model): [확인]·더블클릭이면 고른 계정, 고른 게 없으면 null — 닫는 것은 부르는 쪽 */
  onResult: (account: AccountCodeTree | null) => void;
  onClose: () => void;
}

export const Act01_Lookup_AccountTree: React.FC<Props> = ({ open, onResult, onClose }) => {
  const user = useLoginUser();
  const tree = useTreeGrid<AccountCodeTree>({ idField: 'accountCodeId', parentField: 'parentId', depthField: 'level' });
  const [searchText, setSearchText] = useState('');
  const pendingFind = useRef<{ select: number; focus: number } | null>(null);
  const columnDefs = useMemo(() => [
    gb.textCenter('accountCode', 100, '계정코드'),  // L136
    tree.treeCol('accountName2', 500, '계정과목'),  // L137 — getTreeGrid(2): 트리 열은 계정과목
    gb.long('level', 100, 'LEVEL'),  // L138
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  // retrieve() L143-174: act.Act01_AccountCode.selectTreeByCompanyId(companyId) — 서버가 전위 순서로 주므로 부모 ID만 코드로 찾아 채운다
  const retrieve = useCallback(async () => {
    try {
      const list = await actApi.searchAccountTree(user.companyId);
      const idByCode = new Map(list.map(a => [a.accountCode, a.accountCodeId]));
      tree.setRows(list.map(a => ({ ...a, parentId: idByCode.get(a.parentCode ?? '') ?? 0 })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [user.companyId, tree.setRows]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L54-61) → open() L63-91 → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    tree.setRows([]);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] searchText.KeyPress [Enter] (L104) / [E3] searchButton[찾기].Select (L113) → search() L186-223
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const matches = tree.rows.filter(a => (a.accountName + a.accountCode).indexOf(searchText) > -1);
    if (matches.length === 0) return;
    // 일치하는 계정의 부모를 펼친다. 선택은 마지막 일치 행(단일 선택이라 마지막이 남는다), 화면 이동은 처음·가장 깊은 일치 행
    tree.expandAncestors(matches.map(a => a.accountCodeId));
    let focus = matches[0];
    matches.forEach(a => { if (a.level > focus.level) focus = a; });
    pendingFind.current = { select: matches[matches.length - 1].accountCodeId, focus: focus.accountCodeId };
  };
  // 펼침이 반영된 뒤(필터가 바뀐 뒤)에 선택하고 보이게 한다
  useEffect(() => {
    const p = pendingFind.current;
    const api = tree.gridRef.current?.api;
    if (!p || !api) return;
    pendingFind.current = null;
    setTimeout(() => {
      api.getRowNode(String(p.select))?.setSelected(true);
      const idx = api.getRowNode(String(p.focus))?.rowIndex;
      if (idx != null) api.ensureIndexVisible(idx);
    });
  }, [tree.expanded]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] treeGrid.RowDoubleClick (L96) / [E4] confirmButton[확인].Select (L119) → confirm() L225-231: 고른 행(없으면 null)을 돌려주고 닫는다
  const confirm = () => onResult(tree.gridRef.current?.api.getSelectedRows()[0] ?? null);

  return (
    <LookupModal open={open} title="계정과목" width={800} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="save" onClick={confirm}>확인</Button>
          {/* [E5] closeButton[닫기].Select (L125) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 500, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={search}
          searchText="찾기"
        >
          <SearchBar.Field label="계정과목">
            {/* Enter는 SearchBar.Input이 조회(=찾기)로 처리 */}
            <Input allowClear style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AccountCodeTree>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            rowSelection={TREE_SELECTION}
            onRowDoubleClicked={e => { if (e.data) onResult(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
