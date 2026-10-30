/**
 * 고유자산 종목 그리드 (W01) — Ast01_Tab_ClassTreeIntrinsic 오른쪽
 * AS-IS: myApp/client/vi/ast/Ast01_Grid_AstType.java (332줄) — 함수 이름은 원본 메서드 이름 그대로
 * 운용자산 쪽 Ast01_Grid_AstTypeManagement(R08)와 달리 검색(종목명/종목코드/종목구분)·사용여부·추가정보·C/F 열이 있다.
 */
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import type { ColDef, RowSelectionOptions } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree, AstClassTreeItem } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ast10_Lookup_Manager } from './Ast10_Lookup_Manager';
import { Ast01_Move_ClassTree } from './Ast01_Move_ClassTree';
import { Ast01_Lookup_ItemClass } from './Ast01_Lookup_ItemClass';
import { Ast03_Lookup_CfInfo } from './Ast03_Lookup_CfInfo';

export interface Ast01GridAstTypeHandle {
  retrieve: (parent: AstClassTree | null) => Promise<void>;
  clear: () => void;
}

interface Props {
  style?: React.CSSProperties;
  /** 이동 팝업이 보여 줄 트리의 자산구분 (원본 this.assetType) */
  assetType?: string;
  onRefreshParent?: () => void;
}

const gb = gbFor<AstClassTreeItem>();

/** setChecked(SINGLE): 체크박스 한 개만. 행 클릭은 삭제 대상을 바꾸므로 쓰지 않는다(03 원칙 16) */
const SINGLE_CHECK: RowSelectionOptions<AstClassTreeItem> = { mode: 'singleRow', checkboxes: true, enableClickSelection: false };

export const Ast01_Grid_AstType = forwardRef<Ast01GridAstTypeHandle, Props>(
  ({ style, assetType = '1', onRefreshParent }, ref) => {
    const [parentModel, setParentModel] = useState<AstClassTree | null>(null);
    const parentModelRef = useRef<AstClassTree | null>(null);
    parentModelRef.current = parentModel;

    const [astSearch, setAstSearch] = useState('');
    const astSearchRef = useRef('');
    astSearchRef.current = astSearch;

    const [managerLinkId, setManagerLinkId] = useState<number | null>(null);
    const [moveClassTreeId, setMoveClassTreeId] = useState<number | null>(null);
    const [itemClassModel, setItemClassModel] = useState<AstClassTree | null>(null);
    const [cfModel, setCfModel] = useState<AstClassTree | null>(null);

    // [E0] 화면 열림 (생성자 L63-122) → 초기화
    const crud = useGridCrud<AstClassTreeItem>({
      idField: 'classTreeId',
      // retrieve(classTreeModel, searchText) L205-250: ast.Ast01_ClassTree.selectBySearchParentId
      search: useCallback(async () => {
        const p = parentModelRef.current;
        if (!p) return [];
        return astApi.searchClassTreeItems(p.classTreeId, 'IT', astSearchRef.current);
      }, []),
      // update() L246-278 → ast.Ast01_ClassTree.insert 뒤 retrieve(classTreeModel, astSearch.getText())
      save: useCallback(async (changed: AstClassTreeItem[]) => {
        const p = parentModelRef.current;
        if (!p) return [];
        await astApi.saveClassTreeItems(
          p.classTreeId,
          changed.map((r) => ({
            classTreeId: r.classTreeId > 0 ? r.classTreeId : null,
            parentTreeId: p.classTreeId,
            classTreeName: r.classTreeName,
            isin: r.isin,
            seq: r.seq,
            useYn: r.useYn ?? 'true',
          }))
        );
        return astApi.searchClassTreeItems(p.classTreeId, 'IT', astSearchRef.current);
      }, []),
      validate: (changed) => {
        for (const r of changed) {
          if (r.seq == null) return '순서를 입력해주세요';
          if (!r.classTreeName || r.classTreeName.length < 1) return '종목명을 입력해주세요';
        }
        return undefined;
      },
      // delete() L314-327: 서버가 거절하면(사용중인 종목 등) 그 메시지를 보여 준다(crud가 errorMessage로 처리)
      remove: useCallback(async (ids: number[]) => {
        for (const id of ids) {
          await astApi.deleteClassTree(id);
        }
      }, []),
      // [E8] msgBox.DialogHide [YES] (L297) → delete()
      deleteConfirm: '선택한 종목을 삭제하시겠습니까?',
      // insertRow() L280-292: companyId·parentTreeId·typeCode IT·assetType·curCode KRW·useYn true (seq는 비워 둔다 — update()가 검사)
      newRow: useCallback(() => ({
        companyId: parentModelRef.current?.companyId ?? 0,
        parentTreeId: parentModelRef.current?.classTreeId ?? 0,
        seq: null as unknown as number,
        isin: '',
        classTreeName: '',
        useYn: 'true',
      }), []),
      reloadAfterSave: true,
    });

    /** 저장 안 된 행(음수 id)은 서버에 없어서 팝업을 열 수 없다 */
    const needSaved = (row: AstClassTreeItem, what: string) => {
      if (row.classTreeId > 0) return true;
      message.warning(`저장 후 ${what}할 수 있습니다.`);
      return false;
    };

    /** 추가정보·C/F 팝업은 AS-IS처럼 그리드 모델 전체를 받는다 → 분류 1건을 다시 읽어 연다 */
    const openWithModel = async (row: AstClassTreeItem, what: string, open: (m: AstClassTree) => void) => {
      if (!needSaved(row, what)) return;
      try {
        open(await astApi.getClassTree(row.classTreeId));
      } catch (e) {
        message.error(errorMessage(e));
      }
    };

    const columnDefs: ColDef<AstClassTreeItem>[] = useMemo(
      () => [
        gb.long('seq', 50, '순서', { editor: 'number' }),
        gb.text('classTreeName', 350, '종목명', { editor: 'text' }),
        gb.text('isin', 120, '종목코드', { editor: 'text' }),
        gb.text('itemClassName', 250, '종목구분'),
        gb.boolean('useYn', 80, '사용여부', { editable: true }),
        // [E6 앞] detailCell(ImageCell "Edit") L125-146 → Ast01_Lookup_ItemClass.open(선택 모델)
        iconCell<AstClassTreeItem>('edit', 'addInfoCol', 50, '추가정보', (row) =>
          openWithModel(row, '추가정보를 설정', setItemClassModel)),
        // [E6] actionCell (ImageCell).callbackOnCreate (L158) → Ast10_Lookup_Manager
        iconCell<AstClassTreeItem>('edit', 'managerCol', 50, '담당자', (row) => {
          if (needSaved(row, '담당자를 설정')) setManagerLinkId(row.classTreeId);
        }),
        // [E7] cfCell (ImageCell "Edit").callbackOnCreate (L172) → Ast03_Lookup_CfInfo.editData(선택 모델)
        iconCell<AstClassTreeItem>('edit', 'cfCol', 50, 'C/F', (row) =>
          openWithModel(row, 'C/F를 설정', setCfModel)),
        // moveCell(ImageCell "TreeChange") L147-164 → Ast01_Move_ClassTree
        iconCell<AstClassTreeItem>('move', 'moveCol', 50, '이동', (row) => {
          if (needSaved(row, '이동')) setMoveClassTreeId(row.classTreeId);
        }),
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    // [E1] astSearch.KeyPress [Enter] (L68) → retrieve(classTreeModel, astSearch.getText())
    // [E2] retrieveButton[찾기].Select (L77) → retrieve(classTreeModel, astSearch.getText())
    const retrieve = () => {
      if (!parentModelRef.current) return;
      crud.retrieve();
    };

    // [E3] deleteButton[삭제].Select (L84) → deleteRow()
    const deleteRow = () => {
      crud.deleteChecked();
    };

    // [E4] insertButton[등록].Select (L90) → insertRow()
    const insertRow = () => {
      if (!parentModelRef.current) {
        message.warning('상위분류를 먼저 선택하세요.');
        return;
      }
      crud.addRow();
    };

    // [E5] updateButton[저장].Select (L96) → update()
    const update = async () => {
      await crud.saveRows();
    };

    useImperativeHandle(ref, () => ({
      retrieve: async (parent: AstClassTree | null) => {
        parentModelRef.current = parent;
        setParentModel(parent);
        if (parent) {
          await crud.retrieve();
        } else {
          crud.clear();
        }
      },
      clear: () => {
        parentModelRef.current = null;
        setParentModel(null);
        crud.clear();
      },
    }));

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 8, flex: 'none', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>검색</span>
            <Input
              style={{ width: 300 }}
              allowClear
              placeholder="종목명/종목코드/종목구분"
              value={astSearch}
              onChange={(e) => setAstSearch(e.target.value)}
              onPressEnter={retrieve}
            />
            <Button type="search" onClick={retrieve} disabled={!parentModel}>
              찾기
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="delete" onClick={deleteRow} disabled={!parentModel}>
              삭제
            </Button>
            <Button type="register" onClick={insertRow} disabled={!parentModel}>
              등록
            </Button>
            <Button type="save" count={crud.changes} onClick={update} disabled={!parentModel}>
              저장
            </Button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstClassTreeItem>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={SINGLE_CHECK}
            getRowId={(p) => String(p.data.classTreeId)}
          />
        </div>

        <Ast01_Lookup_ItemClass
          open={itemClassModel != null}
          data={itemClassModel}
          onClose={() => setItemClassModel(null)}
          onSuccess={() => crud.retrieve()}
        />

        <Ast10_Lookup_Manager
          open={managerLinkId != null}
          linkId={managerLinkId}
          onClose={() => setManagerLinkId(null)}
        />

        <Ast03_Lookup_CfInfo
          open={cfModel != null}
          classTreeModel={cfModel}
          onClose={() => setCfModel(null)}
        />

        <Ast01_Move_ClassTree
          open={moveClassTreeId != null}
          classTreeId={moveClassTreeId}
          assetType={assetType}
          onClose={() => setMoveClassTreeId(null)}
          onSuccess={() => {
            crud.retrieve();
            onRefreshParent?.();
          }}
        />
      </div>
    );
  }
);

Ast01_Grid_AstType.displayName = 'Ast01_Grid_AstType';
