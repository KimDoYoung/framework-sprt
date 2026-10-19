/**
 * 조회창 트리거 칸 — 읽기 전용 입력 + 돋보기. 칸·돋보기 어느 쪽을 눌러도 조회창이 열린다(onOpen).
 * 값이 있으면(빈 값·'전체'가 아니면) 돋보기 대신 x = onClear(그 화면의 '선택안함' 처리와 같게 연결한다).
 * 조회창 자체(open 상태·결과 처리)는 부르는 쪽이 가진다 — 고객사 하나만 고르는 화면은 CompanyPopupField가 이것까지 묶어 준다.
 */
import React from 'react';
import { Input } from 'antd';
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';

interface Props {
  /** 칸에 보일 글자 */
  value: string;
  /** 값이 없음을 뜻하는 글자들. 기본 빈 값·'전체' (이때는 돋보기, 아니면 x) */
  empty?: string[];
  placeholder?: string;
  width?: number;
  disabled?: boolean;
  onOpen: () => void;
  /** true면 돋보기를 그리지 않는다(칸을 눌러 여는 건 그대로, x는 값이 있을 때 그대로) */
  hideSearchIcon?: boolean;
  /** 없으면 x를 그리지 않는다(항상 값이 있어야 하는 칸) */
  onClear?: () => void;
}

const DEFAULT_EMPTY = ['', '전체'];

export const LookupInput: React.FC<Props> = ({ value, empty = DEFAULT_EMPTY, placeholder, width = 200, disabled, onOpen, hideSearchIcon, onClear }) => {
  const filled = !!onClear && !disabled && !empty.includes(value);
  const open = () => { if (!disabled) onOpen(); };
  const iconStyle: React.CSSProperties = { cursor: 'pointer' };
  return (
    <Input
      readOnly
      disabled={disabled}
      style={{ width, cursor: disabled ? 'not-allowed' : 'pointer' }}
      placeholder={placeholder}
      value={value}
      suffix={filled
        ? <CloseCircleFilled style={{ ...iconStyle, color: 'rgba(0,0,0,.25)' }} onClick={e => { e.stopPropagation(); onClear?.(); }} />
        : hideSearchIcon ? null : <SearchOutlined style={iconStyle} onClick={open} />}
      onClick={open}
    />
  );
};
