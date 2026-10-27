/**
 * 펀드자산 종목 상세 그리드 (R08) — 우측 센터
 * AS-IS: myApp/client/vi/ast/Ast01_Grid_AstTypeManagement.java (221줄)
 */
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { AstClassTree, AstClassTreeItem } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ast10_Lookup_Manager } from './Ast10_Lookup_Manager';
import { Ast01_Move_ClassTree } from './Ast01_Move_ClassTree';

export interface Ast01GridAstTypeManagementHandle {
  retrieve: (parent: AstClassTree | null) => Promise<void>;
  clear: () => void;
}

interface Props {
  style?: React.CSSProperties;
  onRefreshParent?: () => void;
}

const gb = gbFor<AstClassTreeItem>();

export const Ast01_Grid_AstTypeManagement = forwardRef<Ast01GridAstTypeManagementHandle, Props>(
  ({ style, onRefreshParent }, ref) => {
    const [parentModel, setParentModel] = useState<AstClassTree | null>(null);
    const parentModelRef = useRef<AstClassTree | null>(null);
    parentModelRef.current = parentModel;

    const [managerModalOpen, setManagerModalOpen] = useState(false);
    const [managerLinkId, setManagerLinkId] = useState<number | null>(null);

    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [moveClassTreeId, setMoveClassTreeId] = useState<number | null>(null);

    // [E0] 화면 열림 (생성자 L48-79) → 초기화
    const crud = useGridCrud<AstClassTreeItem>({
      idField: 'classTreeId',
      search: useCallback(async () => {
        const p = parentModelRef.current;
        if (!p) return [];
        return astApi.searchClassTreeItems(p.classTreeId, 'IT');
      }, []),
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
        return astApi.searchClassTreeItems(p.classTreeId, 'IT');
      }, []),
      validate: (changed) => {
        for (const r of changed) {
          if (!r.classTreeName || r.classTreeName.trim().length < 1) {
            return '종목명을 입력해주세요';
          }
        }
        return undefined;
      },
      remove: useCallback(async (ids: number[]) => {
        for (const id of ids) {
          await astApi.deleteClassTree(id);
        }
      }, []),
      // [E5] msgBox.DialogHide [YES] (L199) → delete()
      deleteConfirm: '선택한 종목을 삭제하시겠습니까?',
      newRow: useCallback(() => ({
        companyId: parentModelRef.current?.companyId ?? 0,
        parentTreeId: parentModelRef.current?.classTreeId ?? 0,
        seq: 10,
        isin: '',
        classTreeName: '',
        useYn: 'true',
      }), []),
      reloadAfterSave: true,
    });

    const columnDefs: ColDef<AstClassTreeItem>[] = useMemo(
      () => [
        gb.long('seq', 50, '순서', { editor: 'number' }),
        gb.text('isin', 120, '종목코드', { editor: 'text' }),
        gb.text('classTreeName', 350, '종목명', { editor: 'text' }),
        // [E4] actionCell (ImageCell).callbackOnCreate (L95) → 담당자
        iconCell<AstClassTreeItem>('edit', 'managerCol', 50, '담당자', (row) => {
          if (row.classTreeId <= 0) {
            message.warning('저장 후 담당자를 설정할 수 있습니다.');
            return;
          }
          setManagerLinkId(row.classTreeId);
          setManagerModalOpen(true);
        }),
        // [E4] actionCell (ImageCell).callbackOnCreate (L95) → 이동
        iconCell<AstClassTreeItem>('move', 'moveCol', 50, '이동', (row) => {
          if (row.classTreeId <= 0) {
            message.warning('저장 후 이동할 수 있습니다.');
            return;
          }
          setMoveClassTreeId(row.classTreeId);
          setMoveModalOpen(true);
        }),
      ],
      []
    );

    // [E1] deleteButton[삭제].Select (L51) → deleteRow()
    const deleteRow = () => {
      crud.deleteChecked();
    };

    // [E2] insertButton[등록].Select (L57) → insertRow()
    const insertRow = () => {
      if (!parentModelRef.current) {
        message.warning('상위분류를 먼저 선택하세요.');
        return;
      }
      crud.addRow();
    };

    // [E3] updateButton[저장].Select (L63) → update()
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
        <div style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
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

        <div style={{ flex: 1, minHeight: 0, marginTop: 4 }}>
          <CellEditGrid<AstClassTreeItem>
            crud={crud}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            getRowId={(p) => String(p.data.classTreeId)}
          />
        </div>

        <Ast10_Lookup_Manager
          open={managerModalOpen}
          linkId={managerLinkId}
          onClose={() => setManagerModalOpen(false)}
        />

        <Ast01_Move_ClassTree
          open={moveModalOpen}
          classTreeId={moveClassTreeId}
          onClose={() => setMoveModalOpen(false)}
          onSuccess={() => {
            crud.retrieve();
            onRefreshParent?.();
          }}
        />
      </div>
    );
  }
);

Ast01_Grid_AstTypeManagement.displayName = 'Ast01_Grid_AstTypeManagement';
