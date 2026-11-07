/**
 * 업무공유 등록/수정 창 (Z07) — Bbs10_Tab_BizShare의 [등록]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs10_Edit_BizShare.java (193줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L52-64: "업무공유 등록", 등록일 오늘·등록자 로그인 사원 / edit() L66-82: "업무공유 수정", 관리자이거나 남의 글이면 구분·업무내용 칸 잠금
 * 생성자 L85-129: 700×590, 라벨 폭 75, 등록일 · 구분 · 업무내용(높이 230) · 비고(높이 150) · 키워드, 아래 가운데 저장·닫기
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { bbsBizShareApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsBizShare } from '@/types/bbs';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';

const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: bizShareId가 없으면 새 글(등록일 오늘) */
export type BbsBizShareEdit = Partial<BbsBizShare>;

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: BbsBizShareEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute() → retrieve() (저장한 뒤) */
  onDone?: () => void;
}

/** 라벨 폭 75 (form.setLabelWidth(75)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 75, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Bbs10_Edit_BizShare: React.FC<Props> = ({ model, onClose, onDone }) => {
  const user = useLoginUser();
  const [f, setF] = useState<BbsBizShareEdit | null>(model);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f) return null;
  const set = <K extends keyof BbsBizShareEdit>(k: K, v: BbsBizShareEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  const isNew = f.bizShareId == null;
  // edit() L71-76: 관리자(LoginUser.getIsManager = 회사관리자, 세션 사용자 ID 음수)이거나 등록자가 내가 아니면 구분·업무내용 칸을 잠근다
  const locked = !isNew && (user.userId < 0 || f.personId !== user.userId);

  // [E1] updateButton[저장].Select (L133) → update() L148-183
  const update = async () => {
    if (!f.date) return message.warning('등록일은 필수입력 항목입니다');
    if (!f.bizShareType) return message.warning('구분은 필수선택 항목입니다');
    if (n(f.content) == null) return message.warning('업무내용은 필수작성 항목입니다');
    if ((f.keyword ?? '').length > 30) return message.warning(`키워드는 최대 30자까지만 입력하세요 (현재:${(f.keyword ?? '').length}자리)`);
    setSaving(true);
    try {
      await bbsBizShareApi.save({ bizShareId: f.bizShareId ?? null, date: f.date, bizShareType: f.bizShareType, content: f.content!, keyword: n(f.keyword), note: n(f.note) });
      onClose();
      onDone?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? '업무공유 등록' : '업무공유 수정'}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 규격: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L139) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L85-129) → settings(), show() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="등록일" width={200}>
          <DatePicker style={{ width: '100%' }} allowClear={false} value={f.date ? dayjs(f.date) : null} onChange={d => set('date', d ? d.format(DATE) : null)} />
        </Field>
        <Field label="구분">
          <SystemCodeComboBox kindCd="BizShareType" style={{ width: '100%' }} disabled={locked} placeholder="" value={f.bizShareType ?? undefined}
            onChange={c => set('bizShareType', c ?? null)} />
        </Field>
        <Field label="업무내용"><Input.TextArea rows={9} disabled={locked} value={f.content ?? ''} onChange={e => set('content', e.target.value)} /></Field>
        <Field label="비고"><Input.TextArea rows={5} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
        <Field label="키워드"><Input value={f.keyword ?? ''} onChange={e => set('keyword', e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
