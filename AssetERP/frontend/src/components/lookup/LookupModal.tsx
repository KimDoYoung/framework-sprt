/**
 * 조회창·팝업 모달 (UX-05) — antd Modal과 같고, 열릴 때마다 안쪽 첫 번째 입력칸에 포커스를 준다.
 * 모달 내용은 처음 한 번만 마운트되므로 input의 autoFocus로는 두 번째 열기부터 안 된다 → afterOpenChange에서 포커스한다.
 * 대상은 편집 가능한 글자 입력(antd Input·TextArea)뿐이다. 날짜·콤보는 포커스만으로 펼쳐지거나 의미가 없어 건너뛴다.
 * 입력칸이 없으면 아무것도 하지 않는다. 끄려면 focusFirst={false}.
 */
import React, { useRef } from 'react';
import { Modal, type ModalProps } from 'antd';

const FIRST_INPUT = 'input.ant-input:not([disabled]):not([readonly]), textarea.ant-input:not([disabled]):not([readonly])';

interface Props extends ModalProps {
  focusFirst?: boolean;
}

export const LookupModal: React.FC<Props> = ({ focusFirst = true, afterOpenChange, children, ...rest }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  return (
    <Modal
      {...rest}
      afterOpenChange={opened => {
        afterOpenChange?.(opened);
        if (!opened || !focusFirst) return;
        // 숨은 탭 안의 입력은 건너뛴다(offsetParent가 null)
        Array.from(bodyRef.current?.querySelectorAll<HTMLElement>(FIRST_INPUT) ?? []).find(el => el.offsetParent !== null)?.focus();
      }}
    >
      {/* display: contents — 안쪽 레이아웃(height·flex)에 영향 없이 ref만 건다 */}
      <div ref={bodyRef} style={{ display: 'contents' }}>{children}</div>
    </Modal>
  );
};
