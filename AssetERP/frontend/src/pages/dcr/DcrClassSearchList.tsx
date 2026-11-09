/**
 * 문서분류 트리의 [찾기] 결과를 리스트로 보여주는 부품 (UX보강 — 트리 + 입력 + [찾기] 화면 공통)
 * 이름에 검색어가 든 분류를 루트부터의 전체 경로(`A ➡︎ B ➡︎ C`)로 한 줄씩 보인다. 행을 고르면 트리에서 고른 것과 같게 onSelect로 알린다.
 * 사용: 화면이 `view`('tree'|'list')를 들고, [찾기]·Enter에서 `setView('list')`, 열 때·검색어를 지우면 'tree'.
 *   {view === 'list' ? <DcrClassSearchList rows={rows} query={docSearch} onSelect={setSelected} /> : <Tree … />}
 * 부모 칸에 높이가 있어야 한다(그리드가 부모를 채운다).
 */
import { useMemo } from 'react';
import { SingleGrid, gbFor } from '@/components/grid';
import { DcrClassTree } from '@/types/dcr';

/** DcrClassTree·DcrWriteTree 등 분류 목록 행이 가진 최소 열 */
type ClassRow = Pick<DcrClassTree, 'classTreeId' | 'parentTreeId' | 'classTreeName' | 'typeCode'>;

interface Row { classTreeId: number; fullName: string }
const gb = gbFor<Row>();

/** 루트부터 이름을 sep으로 이은 전체 이름 */
export const classFullName = (rows: Pick<DcrClassTree, 'classTreeId' | 'classTreeName' | 'parentTreeId'>[], id: number, sep = ' ➡︎ '): string => {
  const byId = new Map(rows.map(r => [r.classTreeId, r]));
  const names: string[] = [];
  let cur = byId.get(id);
  while (cur) {
    names.unshift(cur.classTreeName);
    cur = byId.get(cur.parentTreeId);
  }
  return names.join(sep);
};

interface Props<T extends ClassRow> {
  rows: T[];
  /** 이름에 이 글자가 든 분류만 (대소문자 무시) */
  query: string;
  onSelect: (row: T | null) => void;
  /** 행을 두 번 누르면 (조회창의 [확인]처럼) */
  onDoubleClick?: (row: T) => void;
  /** true면 최하위(typeCode 'T')만 */
  leafOnly?: boolean;
}

export function DcrClassSearchList<T extends ClassRow>({ rows, query, onSelect, onDoubleClick, leafOnly }: Props<T>) {
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter(r => (!leafOnly || r.typeCode === 'T') && (q === '' || r.classTreeName.toLowerCase().includes(q)))
      .map(r => ({ classTreeId: r.classTreeId, fullName: classFullName(rows, r.classTreeId) }));
  }, [rows, query, leafOnly]);
  const find = (id: number) => rows.find(r => r.classTreeId === id) ?? null;
  return (
    <SingleGrid<Row>
      rowData={data}
      columnDefs={[gb.text('fullName', 440, '문서분류')]}
      getRowId={p => String(p.data.classTreeId)}
      onSelect={row => onSelect(row ? find(row.classTreeId) : null)}
      onRowDoubleClicked={e => { const r = e.data && find(e.data.classTreeId); if (r && onDoubleClick) onDoubleClick(r); }}
    />
  );
}
