/**
 * 공용메일 등록·수정 창 — Cmp10_Tab_MailBook의 [등록]·수정 아이콘이 연다 (G13)
 * AS-IS: myApp/client/vi/cmp/Cmp10_Edit_Tab_MailBook.java (213줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L77-124: 모달 400×300 "신규등록"/"수정"(닫기 X 없음), 라벨 폭 105, 메일주소 · 비밀번호 · 비고(높이 120), 아래 가운데 [검증][닫기]
 * 스타일: MF (yunhee page-style 판별 — docs/page-style.md)
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, message, Space } from 'antd';
import { cmpMailBookApi } from '@/api/cmp';
import { errorMessage } from '@/api/client';
import { CmpMailBook } from '@/types/cmp';
import { Button } from '@/components/button';
import { EditModal, EditField } from '@/components/form/EditForm';

interface Props {
  open: boolean;
  /** edit(model, callback) L54 — 고칠 공용메일. null이면 insert(callback) L65 새 공용메일 */
  mailBook: CmpMailBook | null;
  /** callback.execute() — 저장에 성공하면 부른다 (목록 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

// 라벨 칸 폭: 가장 긴 라벨(4글자) → 70 (AS-IS 105 대신 편집 폼 원칙)
const LABEL_WIDTH = 70;

export const Cmp10_Edit_Tab_MailBook: React.FC<Props> = ({ open, mailBook, onSaved, onClose }) => {
  const [emailAddr, setEmailAddr] = useState('');
  const [decPassword, setDecPassword] = useState('');
  const [note, setNote] = useState('');
  // checkMail() L126-182: 검증하는 동안·저장 확인 뒤에는 입력 칸과 두 버튼을 잠근다
  const [emailLocked, setEmailLocked] = useState(false);
  const [passwordLocked, setPasswordLocked] = useState(false);
  const [checkLocked, setCheckLocked] = useState(false);
  const [closeLocked, setCloseLocked] = useState(false);

  // [E0] 화면 열림 (생성자 L77-124) → show()
  // edit() L54-63: 메일주소는 잠그고 고칠 공용메일의 값 / insert() L65-75: 메일주소·비밀번호 모두 입력 가능
  useEffect(() => {
    if (!open) return;
    setEmailAddr(mailBook?.emailAddr ?? '');
    setDecPassword(mailBook?.decPassword ?? '');
    setNote(mailBook?.note ?? '');
    setEmailLocked(mailBook != null);
    setPasswordLocked(false);
    setCheckLocked(false);
    setCloseLocked(false);
  }, [open, mailBook]);

  // [E3] msgBox.DialogHide [YES] (L147) → update() L184-200: 서비스 cmp.Cmp10_MailBook.modelUpdate(password), 끝나면 callback.execute() + hide()
  const update = async () => {
    try {
      if (mailBook) await cmpMailBookApi.updateMailBook(mailBook.mailBookId, note);
      else await cmpMailBookApi.createMailBook(emailAddr, decPassword, note);
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E1] checkButton[검증].Select (L84) → checkMail() L126-182: 서비스 utils.mail.SendMailSMTP.checkCompanyMail(companyId, mailAddress, password)
  const checkMail = async () => {
    setCheckLocked(true);
    setCloseLocked(true);
    try {
      const result = await cmpMailBookApi.checkMail(emailAddr, decPassword);
      if (result.ok) {
        // status == 1 (L140): "확인" 창 — [확인(저장)] 이면 update(), [닫기(취소)] 이면 다시 고칠 수 있게 푼다 (폭 450)
        Modal.confirm({
          title: '확인',
          content: result.message,
          okText: '확인(저장)',
          cancelText: '닫기(취소)',
          width: 450,
          onOk: () => {
            setEmailLocked(true);
            setPasswordLocked(true);
            setCloseLocked(false);
            return update();
          },
          onCancel: () => {
            setEmailLocked(false);
            setPasswordLocked(false);
            setCheckLocked(false);
            setCloseLocked(false);
          },
        });
      } else {
        // else (L174): SimpleMessage(result.getMessage())
        message.warning(result.message);
        setCheckLocked(false);
        setCloseLocked(false);
      }
    } catch (err) {
      message.error(errorMessage(err, '검증 실패'));
      setCheckLocked(false);
      setCloseLocked(false);
    }
  };

  return (
    <EditModal
      open={open}
      title={mailBook ? '수정' : '신규등록'}
      width={400}
      closable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] checkButton[검증].Select (L84) → checkMail() */}
            <Button type="view" disabled={checkLocked} onClick={checkMail}>검증</Button>
            {/* [E2] closeButton[닫기].Select (L90) → hide() */}
            <Button type="close" disabled={closeLocked} onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <EditField label="메일주소" labelWidth={LABEL_WIDTH}>
        <Input value={emailAddr} disabled={emailLocked} onChange={e => setEmailAddr(e.target.value)} />
      </EditField>
      <EditField label="비밀번호" labelWidth={LABEL_WIDTH}>
        <Input.Password value={decPassword} disabled={passwordLocked} onChange={e => setDecPassword(e.target.value)} />
      </EditField>
      <EditField label="비고" labelWidth={LABEL_WIDTH}>
        <Input.TextArea style={{ height: 120, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
      </EditField>
    </EditModal>
  );
};
