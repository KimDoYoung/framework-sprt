import type { ReactNode } from 'react';
import type { DataNode } from 'antd/es/tree';

/**
 * 깊이 우선 평평한 목록(id·parentId) → antd Tree 데이터. 상위가 목록에 없는 행이 최상위가 된다.
 * 읽기 전용 트리(조직도, 사원 메뉴 …)에 쓴다. 편집 그리드 트리는 `useTreeGrid`.
 */
export function toTreeData<T>(rows: T[], idOf: (r: T) => number, parentOf: (r: T) => number, title: (r: T) => ReactNode): DataNode[] {
  const byParent = new Map<number, T[]>();
  rows.forEach(r => byParent.set(parentOf(r), [...(byParent.get(parentOf(r)) ?? []), r]));
  const ids = new Set(rows.map(idOf));
  const build = (r: T): DataNode => ({ key: idOf(r), title: title(r), children: (byParent.get(idOf(r)) ?? []).map(build) });
  return rows.filter(r => !ids.has(parentOf(r))).map(build);
}
