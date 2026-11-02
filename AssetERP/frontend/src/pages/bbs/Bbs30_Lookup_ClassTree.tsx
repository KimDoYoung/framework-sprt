/**
 * 게시물 분류/세부항목 관리 조회창 (Z13) — Bbs30_Tab_ClassTree의 [게시물 항목 설정]이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs30_Lookup_ClassTree.java (455줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-113: 모달 "게시물 분류/세부항목 관리" 900×800, 왼쪽 320 = [등록][저장][삭제] + 분류 그리드(buildGrid01 L168-173: 게시물 분류명 200(편집) · 사용 50(체크 편집)),
 *   오른쪽 = [등록][저장][삭제] + 세부항목 그리드(buildGrid02 L175-256: 이동 50(아이콘) · 게시물 세부항목명 200(편집) · 사용 50 · 전체공개 100 · 권한 50(아이콘) · 순서 50(숫자 편집)), 아래 가운데 [닫기]
 * 연결: Bbs30_Lookup_ParentTree(이동 아이콘) · Bbs33_Lookup_Role(권한 아이콘)
 * 두 그리드는 단일 선택(체크박스 없음)이고 삭제는 선택한 줄을 지운다 — useGridCrud의 삭제 체크를 쓰지 않고 removeRows로 뺀다.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsClassTree } from '@/types/bbs';
import { useGridCrud, editableCol } from '@/hooks/useGridCrud';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs30_Lookup_ParentTree } from './Bbs30_Lookup_ParentTree';
import { Bbs33_Lookup_Role } from './Bbs33_Lookup_Role';

const gb = gbFor<BbsClassTree>();
const SINGLE = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** [닫기] (callback.execute() 뒤 hide()) — 부르는 쪽이 왼쪽 목록을 다시 읽는다 */
  onClose: () => void;
}

export const Bbs30_Lookup_ClassTree: React.FC<Props> = ({ open, onClose }) => {
  const [parent, setParent] = useState<BbsClassTree | null>(null);  // parentModel
  const [initTick, setInitTick] = useState(0);
  const [moveTarget, setMoveTarget] = useState<BbsClassTree | null>(null);
  const [roleTarget, setRoleTarget] = useState<BbsClassTree | null>(null);

  // 분류 그리드 (grid01) — 서비스 bbs.Bbs30_ClassTree.selectByTypeCode(companyId, "C") / update
  const crud01 = useGridCrud<BbsClassTree>({
    idField: 'classTreeId',
    search: () => bbsBoardApi.searchClassTrees('C'),
    save: rows => bbsBoardApi.saveClassTrees(rows),
    remove: async () => undefined,
    // insert01() L276-284: 회사 = 로그인(서버), 상위 0, 유형 "C", 사용 true
    newRow: () => ({ classTreeNm: null, parentTreeId: 0, seq: null, typeCd: 'C', useYn: true, publicYn: false }),
    firstEditField: 'classTreeNm',
    // update01() L286-303
    validate: changed => (changed.some(r => !r.classTreeNm?.trim()) ? '게시물 분류명은 필수입력 항목입니다' : undefined),
    reloadAfterSave: true,
  });
  // 세부항목 그리드 (grid02) — 서비스 bbs.Bbs30_ClassTree.selectByParentTreeId(companyId, "T", parentTreeId) / update
  const crud02 = useGridCrud<BbsClassTree>({
    idField: 'classTreeId',
    search: async () => (parent ? bbsBoardApi.searchClassTrees('T', parent.classTreeId) : []),
    save: rows => bbsBoardApi.saveClassTrees(rows),
    remove: async () => undefined,
    // insert02() L372-386: 상위 = 선택한 분류, 유형 "T", 사용 true, 전체공개 true
    newRow: () => ({ classTreeNm: null, parentTreeId: parent?.classTreeId ?? 0, seq: null, typeCd: 'T', useYn: true, publicYn: true }),
    firstEditField: 'classTreeNm',
    // update02() L388-410
    validate: changed => {
      if (changed.some(r => !r.classTreeNm?.trim())) return '게시물 세부항목명은 필수입력 항목입니다';
      if (changed.some(r => r.seq == null)) return '순서는 필수입력 항목입니다';
      return undefined;
    },
  });

  // [E0] 열림 (open L71-74, 생성자 L76-113) → settings(), show() → retrieve01() L258-274: 분류를 읽고 첫 줄을 골라 retrieve02
  const crud01Ref = useRef(crud01);
  crud01Ref.current = crud01;
  useEffect(() => {
    if (!open) return;
    setParent(null);
    void (async () => {
      await crud01Ref.current.retrieve();
      setInitTick(t => t + 1);
    })();
  }, [open]);
  useEffect(() => {
    if (initTick === 0) return;
    const first = crud01Ref.current.rows[0] ?? null;
    setParent(first);
    setTimeout(() => crud01Ref.current.gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
  }, [initTick]);

  // retrieve02(parentModel) L345-370: 선택한 분류가 없으면 오른쪽 [등록][저장][삭제]·그리드를 끈다
  const crud02Ref = useRef(crud02);
  crud02Ref.current = crud02;
  useEffect(() => {
    if (!open) return;
    if (parent) void crud02Ref.current.retrieve();
    else crud02Ref.current.clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, parent?.classTreeId]);

  // [E1] insertButton01[등록].Select (L116) → insert01()
  // [E2] grid01.RowClick (L122) → retrieve02(선택한 분류) — 아래 onRowClicked
  // [E3] updateButton01[저장].Select (L128) → update01() — crud01.saveRows
  // [E4] deleteButton01[삭제].Select (L134) → deleteChk01() L305-321: 서비스 bbs.Bbs31_Content.selectByParentTreeId — 그 분류 아래 게시물이 있으면 안내 / 없으면 delete01() L323-343 확인 "해당 분류를 삭제하시겠습니까?"(폭 300) → [E11] bbs.Bbs30_ClassTree.delete
  const selectedOf = (c: typeof crud01) => c.gridRef.current?.api?.getSelectedRows()[0];
  const deleteSelected = async (c: typeof crud01, byParent: boolean, existsMsg: string, confirmMsg: string) => {
    const row = selectedOf(c);
    if (!row) return;
    try {
      if (row.classTreeId > 0 && await bbsBoardApi.existsContents(row.classTreeId, byParent)) {
        message.warning(existsMsg);
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '확인',
      content: confirmMsg,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          if (row.classTreeId > 0) await bbsBoardApi.deleteClassTree(row.classTreeId);
          c.removeRows([row.classTreeId]);
          if (c === crud01 && parent?.classTreeId === row.classTreeId) setParent(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };
  // [E6] updateButton02[저장].Select (L147) → update02() L388-410 — crud02.saveRows (아래 오른쪽 [저장])
  // [E5] insertButton02[등록].Select (L141) → insert02() L372-386: 선택한 분류가 없으면 "우측 게시물 분류를 먼저 선택해주세요"
  const insert02 = () => {
    if (!parent) return message.warning('우측 게시물 분류를 먼저 선택해주세요');
    crud02.addRow();
  };
  // [E7] deleteButton02[삭제].Select (L153) → deleteChk02() L412-428: bbs.Bbs31_Content.selectByClassTreeId — 게시물이 있으면 안내 / 없으면 delete02() 확인 "해당 세부항목을 삭제하시겠습니까?" → [E12] bbs.Bbs30_ClassTree.delete

  // buildGrid02 L175-256 의 [E9]·[E10] ImageCell 두 개: 바뀐 줄이 있으면 먼저 저장하라는 안내(이름·순서 필수 검사 포함)
  const guardChanges = (action: '이동' | '권한설정'): boolean => {
    if (!crud02.hasChanges()) return true;
    const changed = crud02.getChanged();
    if (changed.some(r => !r.classTreeNm?.trim())) message.warning('게시물 세부항목명은 필수입력 항목입니다');
    else if (changed.some(r => r.seq == null)) message.warning('게시물 세부항목의 순서는 필수입력 항목입니다');
    else message.warning(`변경사항을 먼저 저장후에 ${action}이 가능합니다`);
    return false;
  };

  const columns01 = useMemo(() => [
    editableCol(gb.text('classTreeNm', 200, '게시물 분류명', { editor: 'text' })),  // L170
    gb.boolean('useYn', 50, '사용', { editable: true }),  // L171
  ], []);
  const columns02 = useMemo(() => [
    iconCell<BbsClassTree>('move', 'moveCell', 50, '이동', row => { if (guardChanges('이동')) setMoveTarget(row); }),  // L249 [E9]
    editableCol(gb.text('classTreeNm', 200, '게시물 세부항목명', { editor: 'text' })),  // L250
    gb.boolean('useYn', 50, '사용', { editable: true }),  // L251
    gb.boolean('publicYn', 100, '전체공개', { editable: true }),  // L252
    iconCell<BbsClassTree>('edit', 'roleCell', 50, '권한', row => { if (guardChanges('권한설정')) setRoleTarget(row); }),  // L253 [E10]
    editableCol(gb.long('seq', 50, '순서', { editor: 'number' })),  // L254
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [crud02.rows, crud02.changes]);

  return (
    <LookupModal
      open={open}
      title={<b>게시물 분류/세부항목 관리</b>}
      width={900}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E8] closeButton[닫기].Select (L159) → callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 20, height: 'min(620px, calc(100vh - 250px))' }}>
        <div style={{ width: 320, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="register" onClick={() => crud01.addRow()}>등록</Button>
            <Button type="save" count={crud01.changes} onClick={crud01.saveRows}>저장</Button>
            <Button type="delete" onClick={() => void deleteSelected(crud01, true, '해당 분류하위에 게시물이 존재합니다', '해당 분류를 삭제하시겠습니까?')}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<BbsClassTree>
              crud={crud01}
              rowData={crud01.rows}
              columnDefs={columns01}
              getRowId={p => String(p.data.classTreeId)}
              rowSelection={SINGLE}
              onRowClicked={e => { if (e.data) setParent(e.data); }}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="register" disabled={!parent} onClick={insert02}>등록</Button>
            <Button type="save" count={crud02.changes} disabled={!parent} onClick={crud02.saveRows}>저장</Button>
            <Button type="delete" disabled={!parent} onClick={() => void deleteSelected(crud02, false, '해당 세부항목에 게시물이 존재합니다', '해당 세부항목을 삭제하시겠습니까?')}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0, opacity: parent ? 1 : 0.5, pointerEvents: parent ? 'auto' : 'none' }}>
            <CellEditGrid<BbsClassTree>
              crud={crud02}
              rowData={crud02.rows}
              columnDefs={columns02}
              getRowId={p => String(p.data.classTreeId)}
              rowSelection={SINGLE}
            />
          </div>
        </div>
      </div>
      <Bbs30_Lookup_ParentTree target={moveTarget} onMoved={() => void crud02.retrieve()} onClose={() => setMoveTarget(null)} />
      <Bbs33_Lookup_Role target={roleTarget} onClose={() => { setRoleTarget(null); void crud02.retrieve(); }} />
    </LookupModal>
  );
};
