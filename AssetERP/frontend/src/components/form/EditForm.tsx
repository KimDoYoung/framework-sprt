/**
 * 편집 폼 모달 부품 (docs/modal-style.md "편집 폼 모달 원칙", 사용자 확정 2026-11-09) — 견본 `Dcr01_Edit_ClassTree`
 *   1. 라벨은 오른쪽 맞춤(라벨 칸 폭은 AS-IS `setLabelWidth` 그대로 `labelWidth`), 라벨과 입력칸 8px
 *   2. 푸터 위 선(LookupModal)  3. 행 사이 세로 8px, 한 행 안의 칸 사이 8px  4. 모달 좌우 여백 20, 폼 위아래 20
 * 사용:
 *   <EditModal open title="…" width={500} footer={…} onCancel={onClose}>
 *     <EditRow>
 *       <EditField label="분류코드" width={260}><Input …/></EditField>
 *       <EditField label="조회순서" width={192}><Input …/></EditField>
 *     </EditRow>
 *     <EditField label="분류명"><Input …/></EditField>
 *   </EditModal>
 * 한 행에 칸이 둘 이상이면 폭의 합이 안쪽 폭(모달 폭 − 40) − 칸 사이 8px들과 같게 맞춘다(오른쪽 끝이 다른 행과 일치).
 */
import React from 'react';
import type { ModalProps } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';

interface EditModalProps extends ModalProps {
  /** 열릴 때 첫 입력칸 포커스 (기본 true) */
  focusFirst?: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({ styles, children, ...rest }) => (
  <LookupModal
    maskClosable={false}
    {...rest}
    styles={{ ...styles, content: { padding: 20, ...(styles as { content?: React.CSSProperties } | undefined)?.content } }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 0' }}>{children}</div>
  </LookupModal>
);

/** 한 줄에 칸 둘 이상 — 칸 사이 8px */
export const EditRow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...style }}>{children}</div>
);

interface EditFieldProps {
  label: React.ReactNode;
  /** 라벨 칸 폭 (AS-IS setLabelWidth, 기본 70) */
  labelWidth?: number;
  /** 라벨 + 입력칸 전체 폭 (기본 100%) */
  width?: number | string;
  children: React.ReactNode;
}

/** 라벨(오른쪽 맞춤, 입력칸과 8px) + 입력칸 */
export const EditField: React.FC<EditFieldProps> = ({ label, labelWidth = 70, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width, flex: width === '100%' ? undefined : 'none' }}>
    <span style={{ width: labelWidth, flex: 'none', paddingTop: 4, paddingRight: 8, textAlign: 'right', boxSizing: 'border-box' }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);
