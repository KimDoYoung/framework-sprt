/**
 * 일일점검 분류 조회창 (E07) — Chk02_Tab_DailyListAdmin의 분류칸, Chk02_Edit_DailyList의 분류칸에서 연다
 * AS-IS: myApp/client/vi/chk/Chk01_Lookup_ClassTree.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L56-66: 570×700, [전체] 보임, [등록] 숨김, 수정 칸(index 3) 숨김 / edit() L68-77: 610×700, [전체] 숨김, [등록] 보임
 * 그리드: getTreeGrid(1) — 행번호 없음, 분류명 450(트리) · 순서 40 · 잠금 40(adminYn) · 수정 50
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkClassTree } from '@/types/chk';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Chk01_Edit_ClassTree, ChkClassTreeEdit } from './Chk01_Edit_ClassTree';

const gb = gbFor<ChkClassTree>();

interface Props {
  open: boolean;
  /** open() = 선택 모드, edit() = 분류 편집 모드 */
  mode: 'open' | 'edit';
  /** parentTreeId — 이 분류의 아래를 보여 준다 */
  classTreeId?: number | null;
  /** callback.execute(model): [확인]·더블클릭은 고른 분류, [전체]는 null */
  onResult: (node: ChkClassTree | null) => void;
  onClose: () => void;
}

export const Chk01_Lookup_ClassTree: React.FC<Props> = ({ open, mode, classTreeId, onResult, onClose }) => {
  const user = useLoginUser();
  const tree = useTreeGrid<ChkClassTree>({ idField: 'classTreeId', parentField: 'parentTreeId', depthField: 'depth' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ChkClassTreeEdit | null>(null);
  const pendingSelect = useRef<{ id?: number } | null>(null);   // updatedModel: 다시 조회한 뒤 펼치고 고를 분류
  const isEdit = mode === 'edit';

  // retrieve() L216-224: 서비스 chk.Chk01_ClassTree.selectByCompanyId(companyId, parentTreeId) → getServiceResult() L239-264
  const retrieve = useCallback(async (select?: number) => {
    setLoading(true);  // 원본은 마스크 없음 — 빈 그리드가 깜빡이지 않게만
    try {
      const list = await chkApi.searchClassTreeByCompany(classTreeId ?? 0);
      pendingSelect.current = { id: select };
      tree.setRows(list);
    } catch (err) {
      message.error(errorMessage(err, 'error'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId, tree.setRows]);

  // [E0] 화면 열림 (생성자 L79-104) → settings(), show(), open()/edit() → retrieve()
  useEffect(() => {
    if (!open) return;
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // getServiceResult(): 모든 분류를 펼치고(setExpanded(item, true)), updatedModel이 있으면 고른다
  useEffect(() => {
    const p = pendingSelect.current;
    if (!p) return;
    pendingSelect.current = null;
    tree.expandAll();
    if (p.id != null) {
      const id = p.id;
      setTimeout(() => {
        const api = tree.gridRef.current?.api;
        const node = api?.getRowNode(String(id));
        node?.setSelected(true, true);
        if (node) api?.ensureNodeVisible(node, 'middle');
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // editClassTree() L183-192: 선택한 분류로 Chk01_Edit_ClassTree.edit → 저장하면 updatedModel = 결과, retrieve()
  // 수정 칸 delegate (buildTreeGrid L160-176): 회사가 0이 아니고 관리자(회사 0) 분류면 막는다
  const editCell = (row: ChkClassTree) => {
    tree.gridRef.current?.api?.getRowNode(String(row.classTreeId))?.setSelected(true, true);
    if (user.companyId !== 0 && row.companyId === 0) {
      message.warning('해당 분류내역은 수정이 불가능합니다');
      return;
    }
    const { depth: _depth, ...rest } = row;
    setEditing(rest);
  };

  // [E3] addChildButton[등록].Select (L121) → insertClassTree() L194-214: 새 분류(상위 = 기준 분류, 사용 true). 새 id는 저장 때 서버가 채번
  const insertClassTree = () => setEditing({ parentTreeId: classTreeId ?? 0, useYn: 'true' });

  // [E4] selectButton[확인].Select (L127): 선택이 없으면 "분류를 선택해주세요"
  const select = () => {
    const selected = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) {
      message.warning('분류를 선택해주세요');
      return;
    }
    onResult(selected);
    onClose();
  };

  // [E1] treeGrid.RowDoubleClick (L108): 고른 행을 결과로 닫기
  const rowDoubleClick = (row: ChkClassTree | undefined) => {
    if (!row) return;
    onResult(row);
    onClose();
  };

  // buildTreeGrid() L156-181: open()은 수정 칸(index 3)을 숨긴다
  const columnDefs = useMemo(() => [
    tree.treeCol('classTreeName', 450, '분류명'),  // L176
    gb.longCenter('seq', 40, '순서'),  // L177
    gb.booleanIcon(undefined, 40, '', { colId: 'lock', valueGetter: p => p.data?.companyId === 0 }),  // L178 addBooleanIcon(adminYn) — 관리자(회사 0) 분류면 잠금
    ...(isEdit ? [iconCell<ChkClassTree>('edit', 'actionCell', 50, '수정', editCell)] : []),  // L179 addCell
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol, isEdit, user.companyId]);

  return (
    <LookupModal
      open={open}
      title="분류"
      width={isEdit ? 610 : 570}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={select}>확인</Button>
            {/* [E5] allSelectButton[전체].Select (L139) → callback.execute(null); hide() — open()에서만 보인다 */}
            {!isEdit && <Button onClick={() => { onResult(null); onClose(); }}>전체</Button>}
            {/* [E6] cancleButton[닫기].Select (L147) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
          {/* [E2] retrieveButton[조회].Select (L115) → retrieve() */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {isEdit && <Button type="register" onClick={insertClassTree}>등록</Button>}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<ChkClassTree>
            gridRef={tree.gridRef}
            {...tree.gridProps}
            columnDefs={columnDefs}
            rowNumber={false}
            loading={loading}
            onRowDoubleClicked={e => rowDoubleClick(e.data)}
          />
        </div>
      </div>
      <Chk01_Edit_ClassTree model={editing} onClose={() => setEditing(null)} onDone={id => { void retrieve(id); }} />
    </LookupModal>
  );
};
