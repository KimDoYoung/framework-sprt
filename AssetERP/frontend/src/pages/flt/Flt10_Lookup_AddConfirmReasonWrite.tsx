/**
 * 승인 및 반려사유 창 (EE98) — 사전승인 추가(Flt10_Tab_PreApproveAdd)에서 승인(25)·반려(30) 사유를 쓰거나 거래의 추가확인사유를 고친다
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_AddConfirmReasonWrite.java (140줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-60: 500×350 모달 "승인 및 반려사유", 여러 줄 입력(490×250), 아래 가운데 [저장][취소]
 * 두 가지로 연다 — open(statusCode, callback) L62-72: 25면 "승인사유", 30이면 "반려사유", [저장]이 쓴 글을 부른 쪽에 돌려줌 / edit(trModel, callback) L74-80: 거래의 추가확인사유를 고쳐 서버에 저장
 * 호출처 Flt10_Tab_PreApproveAdd는 TOBE에 없다 — 창만 만들고 연결하지 않는다
 */
import React, { useState } from 'react';
import { Input, message, Space } from 'antd';
import { fltAddConfirmReasonApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

/** 열 때 받는 값 — trId가 있으면 edit(trModel) 모드, 없으면 open(statusCode) 모드 */
export interface AddConfirmReasonTarget {
  /** 25 승인, 30 반려 (edit 모드에서는 거래의 상태 코드) */
  statusCode: string | null;
  /** edit 모드: 거래 번호 */
  trId?: number | null;
  /** edit 모드: 지금 추가확인사유 */
  reason?: string | null;
}

interface Props {
  /** 값이 있으면 열림 */
  target: AddConfirmReasonTarget | null;
  /** callback.execute(result): open 모드 = 쓴 글, edit 모드 = 저장한 글, [취소]는 null */
  onResult: (result: string | null) => void;
  onClose: () => void;
}

export const Flt10_Lookup_AddConfirmReasonWrite: React.FC<Props> = ({ target, onResult, onClose }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const edit = target?.trId != null;
  const status = target?.statusCode ?? null;
  // open() L65-70: 25 승인사유, 30 반려사유 (그 밖에는 생성자의 "승인 및 반려사유")
  const title = !edit && status === '25' ? '승인사유' : !edit && status === '30' ? '반려사유' : '승인 및 반려사유';

  // [E1] updateButton[저장].Select (L83) → preUpdate() L98-110: 반려(30)인데 글이 없으면 "사유를 입력하세요", edit면 update(), 아니면 callback(글), hide()
  const preUpdate = async () => {
    const text = note === '' ? null : note;
    if (status === '30' && text == null) { message.info('사유를 입력하세요'); return; }
    if (!edit) { onResult(text); onClose(); return; }
    // update() L112-136: flt.Flt10_Tr.update → "저장이 완료되었습니다", callback(trModel), hide()
    setSaving(true);
    try {
      await fltAddConfirmReasonApi.update(target!.trId!, text);
      message.info('저장이 완료되었습니다');
      onResult(text);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={target != null}
      title={title}
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      afterOpenChange={open => { if (open) setNote(target?.reason ?? ''); }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => void preUpdate()} loading={saving}>저장</Button>
            {/* [E2] closeButton[취소].Select (L89) → callback.execute(null), hide() */}
            <Button type="close" onClick={() => { onResult(null); onClose(); }}>취소</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea autoFocus value={note} onChange={e => setNote(e.target.value)} style={{ height: 250, resize: 'none' }} />
    </LookupModal>
  );
};
