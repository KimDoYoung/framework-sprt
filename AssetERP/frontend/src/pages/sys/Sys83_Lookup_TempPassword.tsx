/**
 * 2차 인증 창 (EE64) — 회사가 2차 인증을 쓰면(회사 설정) 로그인 직후 열린다. 내 휴대폰으로 받은 6자리 인증번호를 확인해야 화면이 열린다
 * AS-IS: myApp/client/vi/sys/Sys83_Lookup_TempPassword.java (200줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-73: 500×210, 머리말 "2차 인증", [인증번호] + 안내 2줄, 푸터 [발급][인증]
 * settings() L75-106: 처음엔 [발급]만 켜짐. 발급 뒤 [인증] 켜짐
 * ※ AS-IS는 번호를 화면이 만들어 보냈다 — TOBE는 서버가 만들어 내 등록 번호로 보낸다. 문자 발송 연동이 없으면 [발급]이 거절된다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { sysSecondaryAuthApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** 인증에 성공했을 때 (AS-IS callBack.execute("true"), L168) */
  onVerified: () => void;
  /** 닫기(X) — AS-IS는 화면이 열리지 않은 채 로그인 화면에 남는다 */
  onClose: () => void;
}

export const Sys83_Lookup_TempPassword: React.FC<Props> = ({ open, onVerified, onClose }) => {
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);   // sendButton 꺼짐 / updateButton 켜짐
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) { setCode(''); setSent(false); } }, [open]);

  // [E1] sendButton[발급].Select (L78) → sendTempPassword() L131-153
  const send = async () => {
    setBusy(true);
    try {
      await sysSecondaryAuthApi.sendCode();
      message.info('인증번호가 발송되었습니다');   // L143
      setSent(true);
    } catch (err) {
      message.info(errorMessage(err, '2차인증 중 오류가 발생했습니다. 관리자에게 문의하세요'));   // L148
    } finally {
      setBusy(false);
    }
  };

  // [E2] updateButton[인증].Select (L92) → confirm() L155-176
  const confirm = async () => {
    if (!sent) { message.info('인증번호를 먼저 발급받아주세요'); return; }   // L96
    if (!code.trim()) { message.info('인증번호를 입력해주세요'); return; }    // L99
    setBusy(true);
    try {
      if (await sysSecondaryAuthApi.verify(code)) onVerified();   // L166-169
      else message.info('인증번호를 다시 확인해주세요');            // L171
    } catch (err) {
      message.info(errorMessage(err, '인증번호를 다시 확인해주세요'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="2차 인증"
      width={500}
      maskClosable={false}
      keyboard={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="send" onClick={send} disabled={sent} loading={busy && !sent}>발급</Button>
            <Button type="save" onClick={confirm} disabled={!sent} loading={busy && sent}>인증</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 40px 0 20px' }}>
          <span style={{ width: 80, textAlign: 'right', fontSize: 12, fontWeight: 'bold' }}>인증번호</span>
          <Input placeholder="발송된 숫자 6자리 입력" maxLength={6} value={code} onChange={e => setCode(e.target.value)} onPressEnter={confirm} />
        </div>
        <div style={{ color: '#575757', fontWeight: 600, fontSize: 13, lineHeight: 1.7 }}>
          <div>Asset-ERP에 등록된 사원의 휴대폰 번호로 인증문자가 발송됩니다.</div>
          <div>휴대폰 번호 미등록시, 접속이 불가능합니다. 관리자에게 문의부탁드립니다.</div>
        </div>
      </div>
    </LookupModal>
  );
};
