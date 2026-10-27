/**
 * 담당자 그리드 컴포넌트 (R09) — Ast10_Grid_Manager
 * AS-IS: myApp/client/vi/ast/Ast10_Grid_Manager.java (95줄)
 */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, checkCell } from '@/components/grid';
import { AstManager } from '@/types/ast';
import { Ast10_Lookup_Manager } from './Ast10_Lookup_Manager';

export interface Ast10GridManagerHandle {
  retrieve: (linkId: number) => void;
  clear: () => void;
}

interface Ast10GridManagerProps {
  linkId: number | null;
}

const gb = gbFor<AstManager>();

export const Ast10_Grid_Manager = forwardRef<Ast10GridManagerHandle, Ast10GridManagerProps>(
  ({ linkId }, ref) => {
    const [rows, setRows] = useState<AstManager[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLinkId, setCurrentLinkId] = useState<number | null>(linkId);

    const retrieve = useCallback(async (id: number) => {
      setCurrentLinkId(id);
      setLoading(true);
      try {
        const data = await astApi.searchManagers(id);
        setRows(data);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, []);

    const clear = useCallback(() => {
      setCurrentLinkId(null);
      setRows([]);
    }, []);

    useImperativeHandle(ref, () => ({
      retrieve,
      clear,
    }));

    // [E0] 화면 열림 (생성자 L32-51) → 초기화
    useEffect(() => {
      if (linkId) {
        retrieve(linkId);
      } else {
        clear();
      }
    }, [linkId, retrieve, clear]);

    // [E1] insertButton[담당자 관리].Select (L35) → editManager()
    const editManager = () => {
      setModalOpen(true);
    };

    // grid() 컬럼 (L73-76)
    const columns: ColDef<AstManager>[] = useMemo(
      () => [
        gb.textCenter('managerName', 50, '구분'),
        gb.text('orgName', 150, '부서'),
        gb.text('personName', 80, '성명'),
        {
          ...gb.boolean('reprYn', 50, '대표'),
          cellRenderer: checkCell,
        },
      ],
      []
    );

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
          {/* [E1] insertButton[담당자 관리].Select */}
          <Button type="org" onClick={editManager} disabled={!currentLinkId}>
            담당자 관리
          </Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstManager>
            columnDefs={columns}
            rowData={rows}
            loading={loading}
            getRowId={(params) => String(params.data.managerId)}
          />
        </div>

        <Ast10_Lookup_Manager
          open={modalOpen}
          linkId={currentLinkId}
          onClose={() => {
            setModalOpen(false);
            if (currentLinkId) retrieve(currentLinkId);
          }}
        />
      </div>
    );
  }
);

Ast10_Grid_Manager.displayName = 'Ast10_Grid_Manager';
