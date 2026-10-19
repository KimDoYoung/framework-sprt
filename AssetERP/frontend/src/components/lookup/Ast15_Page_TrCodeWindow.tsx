/**
 * 화면별 거래유형 지정 페이지 (E29) — Ast15_Lookup_TrCodeWindow 오른쪽에 들어가는 두 그리드 페이지
 * AS-IS: myApp/client/vi/ast/Ast15_Page_TrCodeWindow.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-108: 툴바(검색 [text] [찾기] [저장] ▶ 안내 글) + 왼쪽 gridL(이 화면에 쓸 거래코드) | → ← | 오른쪽 gridR(아직 안 쓰는 거래코드).
 * setGridGroup() L110-121: 두 그리드 사이를 행 끌어놓기(GridDragSource·GridDropTarget, 그룹 "trCode")로 옮긴다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { TrCodeWindow } from '@/types/ast';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<TrCodeWindow>();

/** buildGrid() L123-128 · buildMainGrid() L130-135 (같은 모양) */
const columnDefs = [
  gb.textCenter('trCode', 100, '거래코드', { rowDrag: true }),
  gb.text('trName', 220, '거래코드명'),
];

/** 검색 결과를 여러 개 고를 수 있어야 하므로 클릭 선택만 여러 행으로 둔다 (search() L181-205가 일치하는 행을 모두 고른다) */
const MULTI_ROW = { mode: 'multiRow', checkboxes: false, enableClickSelection: true } as const;

export interface TrCodeWindowTarget {
  className: string | null;
  companyId: number | null;
  /** 같은 화면을 다시 눌러도 다시 읽도록 올리는 번호 (retrievePage()는 클릭할 때마다 retrieve) */
  nonce: number;
}

interface Props {
  target: TrCodeWindowTarget;
}

export const Ast15_Page_TrCodeWindow: React.FC<Props> = ({ target }) => {
  const leftRef = useRef<AgGridReact<TrCodeWindow>>(null);
  const rightRef = useRef<AgGridReact<TrCodeWindow>>(null);
  const leftBox = useRef<HTMLDivElement>(null);
  const rightBox = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState('');
  const [left, setLeft] = useState<TrCodeWindow[]>([]);
  const [right, setRight] = useState<TrCodeWindow[]>([]);

  // retrieve(className, companyId) L159-179: className이 없으면 두 그리드를 비우고, 있으면 selectByClassName(왼쪽)·getTrCode(오른쪽)
  const retrieve = useCallback(async (className: string | null, companyId: number | null) => {
    if (className == null) {
      setLeft([]);
      setRight([]);
      return;
    }
    try {
      const [l, r] = await Promise.all([
        astApi.searchAssignedTrCodes(className, companyId),
        astApi.searchUnassignedTrCodes(className, companyId),
      ]);
      setLeft(l);
      setRight(r);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  useEffect(() => {
    void retrieve(target.className, target.companyId);
  }, [target.className, target.companyId, target.nonce, retrieve]);

  // [E0] 화면 열림 (생성자 L52-108) → setGridGroup()
  // setGridGroup() L110-121: 한 그리드의 행을 끌어 다른 그리드 위에 놓으면 그쪽으로 옮긴다 (같은 그리드 안의 순서 바꾸기는 저장·조회에 영향이 없어 두지 않는다)
  const move = (from: 'left' | 'right', rows: TrCodeWindow[]) => {
    if (rows.length === 0) return;
    const codes = new Set(rows.map(r => r.trCode));
    const keep = (list: TrCodeWindow[]) => list.filter(r => !codes.has(r.trCode));
    const add = (list: TrCodeWindow[]) => [...list, ...rows].sort((a, b) => (a.trCode ?? '').localeCompare(b.trCode ?? ''));
    if (from === 'left') {
      setLeft(keep);
      setRight(add);
    } else {
      setRight(keep);
      setLeft(add);
    }
  };
  const moveRef = useRef(move);
  moveRef.current = move;

  const registerZone = (api: GridApi<TrCodeWindow>, from: 'left' | 'right', target: () => HTMLElement | null) => {
    api.addRowDropZone({
      getContainer: () => target() as HTMLElement,
      onDragStop: (p) => {
        const rows = p.nodes.map(n => n.data as TrCodeWindow);
        const selected = api.getSelectedRows();
        moveRef.current(from, p.nodes.some(n => n.isSelected()) ? selected : rows);
      },
    });
  };

  const onLeftReady = (e: GridReadyEvent<TrCodeWindow>) => registerZone(e.api, 'left', () => rightBox.current);
  const onRightReady = (e: GridReadyEvent<TrCodeWindow>) => registerZone(e.api, 'right', () => leftBox.current);

  // [E1] searchText.KeyPress [Enter] (L85) / [E2] retrieveButton[찾기].Select (L94) → search() L181-205: 선택을 모두 풀고, 거래코드·거래명에 글자가 들어간 행을 두 그리드에서 모두 고른다
  const search = () => {
    const l = leftRef.current?.api;
    const r = rightRef.current?.api;
    l?.deselectAll();
    r?.deselectAll();
    if (!searchText) return;
    for (const [api, list] of [[l, left], [r, right]] as const) {
      list.forEach(row => {
        if ((row.trName ?? '').includes(searchText) || (row.trCode ?? '').includes(searchText)) {
          api?.getRowNode(String(row.trCode))?.setSelected(true);
        }
      });
    }
  };

  // [E3] updateButton[저장].Select (L102) → update() L137-157: 왼쪽 그리드 전부를 새 ID로 넣고(서버가 이 화면의 기존 지정을 먼저 지운다) 다시 읽는다
  const update = async () => {
    if (target.className == null) return;
    try {
      await astApi.saveTrCodeWindow(target.className, left.map(r => ({ trCode: r.trCode ?? '', note: r.note })), target.companyId);
      await retrieve(target.className, target.companyId);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <span>검색</span>
        <Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
        <Button type="search" onClick={search}>찾기</Button>
        <Button type="save" onClick={update}>저장</Button>
        <span style={{ color: '#4472C4' }}>▶ 사용할 거래코드를 우측에서 좌측으로 드래그하여 옮겨주세요</span>
      </Space>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div ref={leftBox} style={{ flex: 1, minWidth: 0 }}>
          <SingleGrid<TrCodeWindow>
            gridRef={leftRef}
            rowData={left}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trCode)}
            rowSelection={MULTI_ROW}
            rowDragMultiRow
            rowDragEntireRow
            onGridReady={onLeftReady}
          />
        </div>
        <div style={{ width: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: '1px solid #d9d9d9', fontWeight: 'bold' }}>
          <span>→</span>
          <span>←</span>
        </div>
        <div ref={rightBox} style={{ flex: 1, minWidth: 0 }}>
          <SingleGrid<TrCodeWindow>
            gridRef={rightRef}
            rowData={right}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.trCode)}
            rowSelection={MULTI_ROW}
            rowDragMultiRow
            rowDragEntireRow
            onGridReady={onRightReady}
          />
        </div>
      </div>
    </div>
  );
};
