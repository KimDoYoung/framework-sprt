/**
 * 개정내역 내용 창 (E01) — Ics20_Lookup_RevisionHistory 그리드의 상세내용 [보기] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics20_Lookup_Content.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L39-80: 모달 1000×500 "내용", 내용 입력, 아래 가운데 [저장](userType이 "admin"일 때만)·[닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionHistory } from '@/types/ics';
import { Button } from '@/components/button';

interface Props {
  /** open(feeModel, userType, callback) L39-80 — 값이 있으면 열린다 */
  revision: IcsRevisionHistory | null;
  /** "admin"이면 저장 버튼이 있다(개정내역 관리 화면). 개정이력 조회창은 "user" */
  userType: 'user' | 'admin';
  /** callback.execute(asModel): 저장한 뒤 */
  onSaved?: (revision: IcsRevisionHistory) => void;
  onClose: () => void;
}

export const Ics20_Lookup_Content: React.FC<Props> = ({ revision, userType, onSaved, onClose }) => {
  const [note, setNote] = useState('');

  useEffect(() => { if (revision) setNote(revision.note ?? ''); }, [revision]);

  // [E1] updateButton[저장].Select (L60) → update() L82-96: ics.Ics20_RevisionHistory.updateContent → callback.execute(asModel) → hide()
  const update = async () => {
    if (!revision) return;
    try {
      await icsApi.updateRevisionContent(revision.revisionHistoryId, note);
      onSaved?.({ ...revision, note });
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal
      open={!!revision}
      title="내용"
      width={1040}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {userType === 'admin' && <Button type="save" onClick={update}>저장</Button>}
            {/* [E2] closeButton[닫기].Select (L66) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 380, resize: 'none' }} value={note} readOnly={userType !== 'admin'} onChange={e => setNote(e.target.value)} />
    </Modal>
  );
};
