import React from 'react';
import { Space, Tooltip } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Button } from './index';

/**
 * 모두펼치기/모두접기 버튼 묶음 (UX-09, docs/10-UX보강.md) — 그룹 헤더·트리처럼 접고 펼치는 목록 위에 둔다.
 * 아이콘 두 개를 한 덩어리로 붙이고, 기본은 아이콘만(툴팁이 문구), `textVisible`이면 문구도 보인다.
 * 아이콘·색은 `Button`의 `expand`/`collapse` type을 그대로 쓴다.
 */
export interface ExpandCollapseButtonsProps {
  onExpandAll: () => unknown;
  onCollapseAll: () => unknown;
  /** true면 아이콘 옆에 문구도 보인다 (기본 false — 아이콘만) */
  textVisible?: boolean;
  size?: SizeType;
  disabled?: boolean;
  expandText?: string;
  collapseText?: string;
}

export const ExpandCollapseButtons: React.FC<ExpandCollapseButtonsProps> = ({
  onExpandAll, onCollapseAll, textVisible = false, size, disabled, expandText = '모두펼치기', collapseText = '모두접기',
}) => {
  const item = (type: 'expand' | 'collapse', text: string, onClick: () => unknown) => {
    const button = (
      <Button type={type} size={size} disabled={disabled} onClick={onClick} aria-label={text}>
        {textVisible ? text : null}
      </Button>
    );
    return textVisible ? button : <Tooltip title={text}>{button}</Tooltip>;
  };
  return (
    <Space.Compact size={size}>
      {item('expand', expandText, onExpandAll)}
      {item('collapse', collapseText, onCollapseAll)}
    </Space.Compact>
  );
};
