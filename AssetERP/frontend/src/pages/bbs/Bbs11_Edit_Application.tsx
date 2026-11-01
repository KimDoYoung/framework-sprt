/**
 * 기타신청서 작성 창 (Y13) — Bbs11_Tab_Application의 [등록] 버튼·상세보기 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs11_Edit_Application.java (422줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-123: 모달 "기타신청서 작성" 830×650, 라벨 폭 80, 신청일(180)·신청자(180)·신청구분(나머지) · 비고 · 내용(HTML 편집기 450), 아래 가운데 [신청][신청취소] · [임시저장][닫기]
 * 편집창(EditModal) 규격: 11 §4a (머리말 아래 선·푸터 위 선·라벨 오른쪽 정렬)
 */
import React, { useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { bbsApplicationApi, bbsApplicationFormApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsApplicationMine } from '@/types/bbs';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const DATE = 'YYYY-MM-DD';

/** 열 때 받는 값: applicationId가 없으면 새 신청서(신청일 오늘·신청자 로그인 사원만 정해져 있다 — insert() L125-147) */
export type BbsApplicationEdit = Partial<BbsApplicationMine>;

interface Props {
  /** 편집할 신청서 — null이면 닫힘 */
  model: BbsApplicationEdit | null;
  /** 로그인 사원 ID — 신청자와 다르면 읽기 전용(edit() L149-169) */
  userId: number;
  onClose: () => void;
  /** AS-IS grid.getStore().update(model) — 저장·신청취소로 바뀐 행 */
  onChanged: (row: BbsApplicationMine) => void;
  /** AS-IS callback.execute() — 신청이 끝나면 목록을 다시 조회 */
  onApplied: () => void;
}

/** 라벨 폭 80 (form.setLabelWidth(80)) */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode }> = ({ label, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 80, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** 안쪽 본체 — model이 바뀔 때마다 새로 만들도록 부모가 key를 준다 */
const Body: React.FC<Required<Pick<Props, 'userId' | 'onClose' | 'onChanged' | 'onApplied'>> & { model: BbsApplicationEdit }> = ({ model, userId, onClose, onChanged, onApplied }) => {
  // [E0] 화면 열림 (생성자 L79-123) → settings(), getEditor(), show() — 열릴 때 insert()/edit()의 값이 model로 들어온다
  const [f, setF] = useState<BbsApplicationEdit>(model);
  const [saving, setSaving] = useState(false);
  // 편집기 내용(AS-IS getHtmlText()) — HtmlEditor는 만들 때 한 번만 값을 반영하므로 양식을 불러오면 key를 바꾼다
  const html = useRef<string>(model.content ?? '');
  const [editorKey, setEditorKey] = useState(0);
  const set = <K extends keyof BbsApplicationEdit>(k: K, v: BbsApplicationEdit[K]) => setF(prev => ({ ...prev, [k]: v }));

  const isOwner = f.appEmpId === userId;
  const status = f.appStatus ?? null;
  // setButton() L229-249: 상태 없음 → [신청][임시저장], 10(신청) → [신청취소], 그 밖 → 모두 숨김. 본인이 아니면 모두 숨김(edit() L152-162)
  const editable = isOwner && status == null;
  const showButtons = isOwner && (status == null || status === '10');

  // [E1] appTypeName[신청구분].Collapse (L177) → 서비스 bbs.Bbs12_ApplicationForm.appTypeCall: 고른 신청구분의 양식 내용을 편집기에 넣는다
  const onTypeChange = async (code: string | undefined, name?: string) => {
    setF(prev => ({ ...prev, appType: code ?? null, appTypeName: name ?? null }));
    if (code == null) return;
    try {
      const content = await bbsApplicationFormApi.getContent(code);
      html.current = content ?? '';
      setF(prev => ({ ...prev, content: content ?? '' }));
      setEditorKey(k => k + 1);
    } catch (err) {
      message.error(errorMessage(err, '양식 조회 실패'));
    }
  };

  // updateStatus() L300-350: 신청(P)이면 상태 10, 신청취소(C)면 상태 없음 → 알림문자(B03) → 안내
  const updateStatus = async (id: number, type: 'P' | 'C') => {
    const res = await bbsApplicationApi.changeStatus(id, type);
    const noticeMsg = res.notice === 0 ? ' (등록된 알림 수신자가 존재하지 않아 알림 발송은 생략되었습니다)' : res.notice === -1 ? '' : ' (알림 발송 완료)';
    onChanged(res.row);
    if (type === 'P') {
      message.success('신청이 완료되었습니다' + noticeMsg);
      onApplied();
      onClose();
    } else {
      message.success('신청이 취소되었습니다' + noticeMsg);
      setF(res.row);
    }
  };

  // [E2] applButton[신청].Select (L200) → update("P"), [E3] cancelButton[신청취소].Select (L206) → update("C"), [E4] updateButton[임시저장].Select (L212) → update("U")
  // update() L265-298
  const update = async (type: 'P' | 'C' | 'U') => {
    if (f.appType == null) { message.warning('신청구분을 선택하세요'); return; }
    setSaving(true);
    try {
      if (type === 'C') {
        await updateStatus(f.applicationId!, 'C');
        return;
      }
      const saved = await bbsApplicationApi.saveMine({
        applicationId: f.applicationId ?? null,
        appDate: f.appDate ?? dayjs().format(DATE),
        appType: f.appType,
        note: f.note ? f.note : null,
        content: html.current === '' ? null : html.current,
      });
      if (type === 'P') {
        await updateStatus(saved.applicationId, 'P');
      } else {
        message.success('저장이 완료되었습니다.');
        onChanged(saved);
        setF(saved);  // NEW → EDIT: 다음 저장은 같은 신청서를 고친다
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="기타신청서 작성"
      width={830}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 견본: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space size={8}>
            {showButtons && <Button type="save" disabled={!editable} loading={saving} onClick={() => update('P')}>신청</Button>}
            {showButtons && <Button type="cancel" disabled={status !== '10'} loading={saving} onClick={() => update('C')}>신청취소</Button>}
            {showButtons && <span style={{ display: 'inline-block', width: 40 }} />}
            {showButtons && <Button type="save" disabled={!editable} loading={saving} onClick={() => update('U')}>임시저장</Button>}
            {/* [E5] closeButton[닫기].Select (L218) → hide() (새 신청서를 저장하지 않고 닫으면 목록에는 아무것도 남지 않는다) */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Field label="신청일" width={190}>
            <DatePicker style={{ width: '100%' }} allowClear={false} disabled={!editable} value={f.appDate ? dayjs(f.appDate) : null}
              onChange={d => d && set('appDate', d.format(DATE))} />
          </Field>
          <Field label="신청자" width={190}><Input disabled value={f.appEmpName ?? ''} /></Field>
          <Field label="신청구분" width="auto">
            <div style={{ flex: 1 }}>
              <SystemCodeComboBox kindCd="ApplicationType" style={{ width: 150 }} placeholder="(선택하세요)" disabled={!editable}
                value={f.appType ?? undefined} onChange={onTypeChange} />
            </div>
          </Field>
        </div>
        <Field label="비고">
          <Input disabled={!editable} placeholder="중복 신청을 방지하기 위해 수신처를 정확히 입력해 주세요" value={f.note ?? ''} onChange={e => set('note', e.target.value)} />
        </Field>
        <Field label="내용">
          {/* getEditor() L251-263: HTML 편집기(높이 450). 본인 것이 아니거나 진행된 신청서는 읽기 전용 */}
          <div style={{ pointerEvents: editable ? undefined : 'none', opacity: editable ? 1 : 0.7 }}>
            <HtmlEditor key={editorKey} value={f.content} onChange={h => { html.current = h; }} height={400} />
          </div>
        </Field>
      </div>
    </Modal>
  );
};

export const Bbs11_Edit_Application: React.FC<Props> = ({ model, ...rest }) => {
  if (!model) return null;
  return <Body model={model} {...rest} />;
};
