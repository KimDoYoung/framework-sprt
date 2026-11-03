/**
 * 배포자 비고 조회창 (EE18) — Scm13_Page_Deploy 그리드의 비고 [수정] 아이콘이 연다
 * AS-IS: myApp/client/vi/scm/Scm13_Lookup_Note.java (94줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(devProgramModel, callback) L37-72: 모달 1000×500 "내용", 글 상자 하나(MyTextArea) + [저장][닫기]
 * (modal-style: 헤더 아래 선·푸터 위 선 — 11 §4a)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { DeployProgram } from '@/types/scm';

interface Props {
  open: boolean;
  program: DeployProgram | null;
  /** callback.execute() — [저장]이 끝난 뒤 (그리드를 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

export const Scm13_Lookup_Note: React.FC<Props> = ({ open, program, onSaved, onClose }) => {
  // 화면 열림 (open L37-72) → editDriver.edit(devProgramModel), show()
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setNote(program?.deployNote ?? ''); }, [open, program]);

  // [E1] updateButton[저장].Select (L55) → update() L74-88: scm.Scm13_DevProgram.updateNote → callback.execute(), hide()
  const update = async () => {
    if (!program?.devProgramId) return;
    setSaving(true);
    try {
      await scmApi.updateDeployNote(program.devProgramId, note);
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="내용"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        body: { padding: '12px 2px' },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" loading={saving} onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L61) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ width: '100%', height: 300, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
    </LookupModal>
  );
};
