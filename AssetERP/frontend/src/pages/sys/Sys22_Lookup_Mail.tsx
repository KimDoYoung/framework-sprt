/**
 * 회사 메일 확인(검증) 창 (EE102) — 메일주소·비밀번호·비고를 저장하고 시험 메일로 검증한다
 * AS-IS: myApp/client/vi/sys/Sys22_Lookup_Mail.java (155줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC)
 * 호출처 Sys22_Tab_Mail(회사 메일 관리)은 TOBE에 아직 없다 — 창만 만들고 여는 곳은 없다.
 * 레이아웃 makeLayout() L61-85: 모달 380×230 "확인(검증)"(크기 고정) · 라벨 폭 75 · 메일주소 · 비밀번호 · 비고 · 아래 가운데 [저장(검증)][닫기]
 * open(mailModel, callback) L44-49: 고칠 메일(또는 [등록]이 만든 빈 줄)을 채운다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { sysMailApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { SysMail } from '@/types/sys';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** open(mailModel, callback) — 고칠 메일. mailId가 없으면 새 메일 */
  mail: SysMail;
  /** callback.execute() — [저장(검증)]·[닫기]를 누르면 부른다 (목록 다시 조회) */
  onCallback: () => void;
  onClose: () => void;
}

const LABEL_WIDTH = 75;

export const Sys22_Lookup_Mail: React.FC<Props> = ({ open, mail, onCallback, onClose }) => {
  const [mailAddress, setMailAddress] = useState('');
  const [mailDecPassword, setMailDecPassword] = useState('');
  const [note, setNote] = useState('');
  // 저장 뒤에 새 메일이 얻은 ID — 같은 창에서 다시 [저장(검증)]을 누르면 고친다
  const [mailId, setMailId] = useState<number | null>(null);

  // [E0] 화면 열림 (생성자 L51-54, open L44-49) → editDriver.edit(mailModel), show()
  useEffect(() => {
    if (!open) return;
    setMailAddress(mail.mailAddress ?? '');
    setMailDecPassword(mail.mailDecPassword ?? '');
    setNote(mail.note ?? '');
    setMailId(mail.mailId ?? null);
  }, [open, mail]);

  // checkMail() L104-122: 서비스 utils.mail.SendMailSMTP.checkCompanyMail(companyId, mailAddress, password)
  const checkMail = async () => {
    const result = await sysMailApi.check(mailAddress, mailDecPassword);
    if (result.message === '정상적인 접속입니다') {
      message.info(result.message);  // SimpleMessage(result.getMessage())
    } else {
      message.error('메일 또는 비밀번호를 확인해주세요');  // SimpleMessage("오류", "메일 또는 비밀번호를 확인해주세요")
    }
  };

  // update() L124-145: 필수 검사 → 서비스 sys.Sys22_Mail.modelUpdate(updateModel) → 끝나면 checkMail()
  const update = async () => {
    if (!mailAddress) { message.warning('메일주소는 필수입력 항목입니다'); return; }
    if (!mailDecPassword) { message.warning('패스워드는 필수입력 항목입니다'); return; }
    try {
      const saved = await sysMailApi.save(mailId, mailAddress, mailDecPassword, note);
      setMailId(saved.mailId);
      await checkMail();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="확인(검증)"
      width={380}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[저장(검증)].Select (L95) → callback.execute(), update() */}
            <Button type="save" onClick={() => { onCallback(); void update(); }}>저장(검증)</Button>
            {/* [E1] closeButton[닫기].Select (L88) → callback.execute(), hide() */}
            <Button type="close" onClick={() => { onCallback(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 10px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: LABEL_WIDTH, flex: 'none' }}>메일주소</span>
          <Input value={mailAddress} onChange={e => setMailAddress(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: LABEL_WIDTH, flex: 'none' }}>비밀번호</span>
          <Input.Password value={mailDecPassword} onChange={e => setMailDecPassword(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: LABEL_WIDTH, flex: 'none' }}>비고</span>
          <Input value={note} onChange={e => setNote(e.target.value)} />
        </div>
      </div>
    </LookupModal>
  );
};
