/**
 * 확인(검증) 창 — 본인 메일 계정 (EE35) — Dcr10_Lookup_MailSender의 [본인메일]이 연다
 * AS-IS: myApp/client/vi/emp/Emp10_Lookup_MailRetrieve.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * makeLayout() L62-85: 모달 "확인(검증)" 380×180, 메일주소 · 비밀번호(라벨 75), 아래 가운데 [초기화][검증][닫기]. 열 때 retrieve() L108-124(본인 메일·비밀번호)
 * 주의: AS-IS는 callbackResult를 받아 두기만 하고 어디서도 부르지 않는다 — 바꾸거나 초기화해도 발송창의 본인 메일 칸은 다시 읽히지 않는다(그대로 옮김)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import { empPersonMailApi } from '@/api/dcrMail';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp10_Lookup_MailRetrieve: React.FC<Props> = ({ open, onClose }) => {
  const [mailAddress, setMailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkEnabled, setCheckEnabled] = useState(true);

  // [E0] init() L56-60 → retrieve() L108-124: emp.Emp01_Person.selectByPersonId → 메일주소·복호 비밀번호
  useEffect(() => {
    if (!open) return;
    setFieldsLocked(false);
    setCheckEnabled(true);
    setBusy(false);
    setMailAddress('');
    setPassword('');
    empPersonMailApi.get()
      .then(m => { setMailAddress(m.mailAddress ?? ''); setPassword(m.password ?? ''); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open]);

  // update() L184-196 → emp.Emp01_Person.changeMail 뒤 hide()
  const update = async () => {
    try {
      await empPersonMailApi.change(mailAddress, password);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onClose();
  };

  // [E2] checkButton[검증].Select (L94) → checkMail() L126-182
  const checkMail = async () => {
    setBusy(true);
    setCheckEnabled(false);
    try {
      const res = await empPersonMailApi.check(mailAddress, password);
      if (res.ok) {
        // 성공: 확인창 "확인(저장)" / "닫기(취소)" (폭 450) — [E4] msgBox.DialogHide [YES] (L147) → update()
        Modal.confirm({
          title: '확인',
          content: res.message,
          width: 450,
          okText: '확인(저장)',
          cancelText: '닫기(취소)',
          onOk: () => {
            setFieldsLocked(true);
            setCheckEnabled(false);
            setBusy(false);
            return update();
          },
          onCancel: () => {
            setFieldsLocked(false);
            setCheckEnabled(true);
            setBusy(false);
          },
        });
      } else {
        message.warning(res.message ?? '');
        setCheckEnabled(true);
        setBusy(false);
      }
    } catch (err) {
      message.error(errorMessage(err, '검증 실패'));
      setCheckEnabled(true);
      setBusy(false);
    }
  };

  // [E3] resetButton[초기화].Select (L100) → resetMail() L198-209: emp.Emp01_Person.resetMail → "패스워드가 초기화되었습니다." 뒤 hide()
  const resetMail = async () => {
    try {
      await empPersonMailApi.reset();
    } catch (err) {
      message.error(errorMessage(err, '초기화 실패'));
      return;
    }
    message.info('패스워드가 초기화되었습니다.');
    onClose();
  };

  return (
    <Modal
      open={open}
      title="확인(검증)"
      width={380}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="reset" onClick={resetMail} disabled={busy}>초기화</Button>
            <Button type="view" onClick={checkMail} disabled={!checkEnabled}>검증</Button>
            {/* [E1] closeButton[닫기].Select (L88) → hide() */}
            <Button type="close" onClick={onClose} disabled={busy}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text style={{ width: 75, flex: 'none', textAlign: 'right', paddingRight: 10 }}>메일주소</Typography.Text>
          <Input autoFocus disabled={fieldsLocked} value={mailAddress} onChange={e => setMailAddress(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text style={{ width: 75, flex: 'none', textAlign: 'right', paddingRight: 10 }}>비밀번호</Typography.Text>
          <Input.Password disabled={fieldsLocked} value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
};
