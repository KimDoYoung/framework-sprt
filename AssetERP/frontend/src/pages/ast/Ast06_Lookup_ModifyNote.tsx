/**
 * 적요 수정창 (W16) — Ast13_Tab_OfficeAssets 그리드의 적요 칸 더블클릭
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_ModifyNote.java (109줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L34-53: 550×200 "적요 수정", 폼 라벨 70 "적요" + TextField(폭 500) + 푸터 [저장][닫기]. open(trId, note, callback) L55-61: 현재 적요를 채운다
 * 편집창: 11 §4a 규격(머리 아래 선·푸터 위 선·라벨 오른쪽 정렬, 필수 검사 없음)
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

export interface ModifyNoteTarget {
  trId: number;
  note: string | null;
}

interface Props {
  target: ModifyNoteTarget | null;
  /** 저장한 적요 — AS-IS callback.execute(note)가 그리드 행을 바꾼다 */
  onSaved: (trId: number, note: string) => void;
  onClose: () => void;
}

export const Ast06_Lookup_ModifyNote: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L34-53, open L55-61) → note.setValue(note), setting() L63-77
  useEffect(() => { if (target) setNote(target.note ?? ''); }, [target]);

  // [E2] updateButton[저장].Select (L71) → update() L79-100: ast.Ast06_Tr.updateNote(trId, note) → "저장이 완료되었습니다." → callback(note) → hide()
  const update = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await astApi.updateTrNote(target.trId, note);
      message.success('저장이 완료되었습니다.');
      onSaved(target.trId, note);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={target !== null} title="적요 수정" width={550} maskClosable={false} onCancel={onClose} destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        <Button key="save" type="save" loading={saving} onClick={update}>저장</Button>,
        /* [E1] cancleButton[닫기].Select (L64) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ padding: '12px 2px', display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 70, textAlign: 'right', paddingRight: 10 }}>적요</span>
        <Input autoFocus style={{ width: 430 }} value={note} onChange={e => setNote(e.target.value)} onPressEnter={update} />
      </div>
    </Modal>
  );
};
