/**
 * 의뢰 처리결과 폼 — 읽기 전용 (EE15). Scm01_Tab_Sr 맨 아래(150)
 * AS-IS: myApp/client/vi/scm/Scm01_Edit_SrRO.java (128줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L74-104: 라벨 100 · 처리상태(250) + 처리내용(805×140) / 완료예정일 / 완료일. settings() L67-72: 네 칸 모두 읽기 전용
 * 처리 내용은 KFS 개발 쪽(시스템 개발 관리, EE16)이 입력한다
 */
import React from 'react';
import { Input } from 'antd';
import { Sr } from '@/types/scm';

const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 8, flex: 'none', fontSize: 12 };

interface Props {
  /** retrieve(param) — 고른 의뢰. null이면 initialize */
  sr: Sr | null;
}

// [E0] 화면 열림 (생성자 L49-65) → settings() 네 칸 읽기 전용, getEditor(), show()
export const Scm01_Edit_SrRO: React.FC<Props> = ({ sr }) => (
  <div style={{ height: '100%', boxSizing: 'border-box', overflow: 'auto', padding: 12, display: 'flex', gap: 30 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360, flex: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>처리상태</span>
        <Input readOnly value={sr?.srStatusNm ?? ''} style={{ width: 250 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>완료예정일</span>
        <Input readOnly value={sr?.dueDate ?? ''} style={{ width: 130 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>완료일</span>
        <Input readOnly value={sr?.closeDate ?? ''} style={{ width: 130 }} />
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
      <span style={{ ...LABEL, paddingTop: 5 }}>처리내용</span>
      <Input.TextArea readOnly value={sr?.resultContent ?? ''} style={{ flex: 1, maxWidth: 805, height: '100%', resize: 'none' }} />
    </div>
  </div>
);
