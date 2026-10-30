import React from 'react';
import { Button as AntButton, Tooltip } from 'antd';
import { ApartmentOutlined, UnorderedListOutlined } from '@ant-design/icons';

/**
 * 트리/리스트 보기 전환 (UX보강 — 공통 조회창·목록 화면의 보기 방식)
 * 아이콘 버튼 두 개를 한 덩어리로 붙이고, 지금 보기 중인 쪽이 "눌려 있는" 버튼(배경색 + 안쪽 그림자 + 파란 아이콘),
 * 아닌 쪽은 "눌려 있지 않은" 버튼(옅은 바탕)으로 보인다. 아이콘 위에 마우스를 올리면 문구(툴팁).
 * 사용: `<TreeListToggle value={view} onChange={setView} />` — value·onChange 값은 'tree' | 'list'.
 */
export type TreeListValue = 'tree' | 'list';

export interface TreeListToggleProps {
  value: TreeListValue;
  onChange: (value: TreeListValue) => void;
  disabled?: boolean;
  treeText?: string;
  listText?: string;
}

const PRESSED: React.CSSProperties = { background: '#d6e4ff', color: '#1677ff', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)', borderColor: '#91caff' };
const RAISED: React.CSSProperties = { background: '#fafafa', color: '#8c8c8c', borderColor: '#d9d9d9' };

export const TreeListToggle: React.FC<TreeListToggleProps> = ({ value, onChange, disabled, treeText = '트리로 보기', listText = '리스트로 보기' }) => {
  const item = (key: TreeListValue, icon: React.ReactNode, text: string, radius: React.CSSProperties) => (
    <Tooltip title={text}>
      <AntButton
        aria-label={text}
        aria-pressed={value === key}
        disabled={disabled}
        icon={icon}
        onClick={() => value !== key && onChange(key)}
        style={{ ...(value === key ? PRESSED : RAISED), ...radius }}
      />
    </Tooltip>
  );
  return (
    <span style={{ display: 'inline-flex' }}>
      {item('tree', <ApartmentOutlined />, treeText, { borderTopRightRadius: 0, borderBottomRightRadius: 0 })}
      {item('list', <UnorderedListOutlined />, listText, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: -1 })}
    </span>
  );
};
