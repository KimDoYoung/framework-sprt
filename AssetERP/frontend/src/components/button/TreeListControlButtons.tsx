import React from 'react';
import { Divider } from 'antd';
import { TreeListToggle } from './TreeListToggle';
import type { TreeListValue } from './TreeListToggle';
import { ExpandCollapseButtons } from './ExpandCollapseButtons';

/**
 * 트리/리스트 보기 전환 + 모두펼치기/모두접기를 한 묶음으로 (UX보강 — 공통 조회창·목록 화면)
 * 두 부품(`TreeListToggle`·`ExpandCollapseButtons`) 사이에 세로 구분선을 둔다. 리스트 보기에서는 펼치기·접기를 막는다.
 * 사용: `<TreeListControlButtons value={view} onChange={setView} onExpandAll={expandAll} onCollapseAll={() => setExpanded([])} />`
 */
export interface TreeListControlButtonsProps {
  value: TreeListValue;
  onChange: (value: TreeListValue) => void;
  onExpandAll: () => unknown;
  onCollapseAll: () => unknown;
  /** 전체 비활성 (보기 전환 포함) */
  disabled?: boolean;
  /** 펼치기·접기만 추가로 비활성 (예: 트리 데이터가 없을 때). 리스트 보기에서는 항상 비활성 */
  expandDisabled?: boolean;
}

export const TreeListControlButtons: React.FC<TreeListControlButtonsProps> = ({
  value, onChange, onExpandAll, onCollapseAll, disabled, expandDisabled,
}) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1, flex: 'none', whiteSpace: 'nowrap' }}>
    <TreeListToggle value={value} onChange={onChange} disabled={disabled} />
    <Divider type="vertical" style={{ height: 20, margin: 0 }} />
    <ExpandCollapseButtons
      onExpandAll={onExpandAll}
      onCollapseAll={onCollapseAll}
      disabled={disabled || expandDisabled || value === 'list'}
    />
  </span>
);
