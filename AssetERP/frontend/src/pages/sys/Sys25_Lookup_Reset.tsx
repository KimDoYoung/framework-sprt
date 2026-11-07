/**
 * 비밀번호 재설정 창 (EE60) — 로그인 화면의 [비밀번호 재설정]이 연다. 로그인 ID·휴대폰 번호로 인증번호를 문자로 받아 확인하면 비밀번호 변경(init)을 연다
 * AS-IS: myApp/client/vi/sys/Sys25_Lookup_Reset.java (224줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-69: 420×300, 머리말 "비밀번호 재설정", [로그인 ID][휴대폰 번호][인증 번호 + 전송 + 남은 시간] + 안내 2줄, 푸터 [비밀번호 변경]
 * setting() L71-109: 처음엔 [전송] 켜짐 · 인증번호 칸·[비밀번호 변경] 꺼짐. 빈 칸 옆에는 빨간 느낌표
 * ※ 인증번호는 서버가 들고 있고 비교도 서버가 한다(AS-IS는 번호를 화면에 내려보내 비교). 문자 발송 연동이 없으면 [전송]이 거절된다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, Space, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { authApi } from '@/api/auth';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const LABEL_W = 110;
const SECONDS = 60; // L46

interface Props {
  open: boolean;
  companyCode: string;
  /** 인증번호가 맞았을 때 — 부르는 쪽이 비밀번호 변경(init, 3개월 연장 없음) 창을 연다 (L175-177) */
  onVerified: (empNo: string) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>{label}</span>
    {children}
  </div>
);

export const Sys25_Lookup_Reset: React.FC<Props> = ({ open, companyCode, onVerified, onClose }) => {
  const [empNo, setEmpNo] = useState('');
  const [phone, setPhone] = useState('');
  const [temp, setTemp] = useState('');
  const [sent, setSent] = useState(false);          // setEnables(false) — 발송 후
  const [remaining, setRemaining] = useState(0);    // 남은 시간(초), 0이면 표시 없음
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  // [E0] 열림 (open L51-54 → setting() L71-109): 처음 상태로
  useEffect(() => {
    if (!open) return;
    stopTimer();
    setEmpNo(''); setPhone(''); setTemp(''); setSent(false); setRemaining(0);
    return stopTimer;
  }, [open]);

  // startTimer() L192-215: 1초마다 줄어 0이 되면 [전송]을 다시 켜고 인증번호는 무효
  const startTimer = () => {
    stopTimer();
    setRemaining(SECONDS);
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { stopTimer(); setSent(false); return 0; }
        return r - 1;
      });
    }, 1000);
  };

  // [E3] sendButton[전송].Select (L97) → sendCode() L147-170 — sys.Sys25_Password.getCode
  const sendCode = async () => {
    setBusy(true);
    try {
      await authApi.sendPasswordCode(companyCode, empNo, phone);
      message.info('인증번호가 발송되었습니다');   // L158
      setSent(true);
      startTimer();
    } catch (err) {
      message.info(errorMessage(err, '일치하는 정보가 없습니다'));   // L163
      setSent(false);
      setRemaining(0);
    } finally {
      setBusy(false);
    }
  };

  // [E4] resetButton[비밀번호 변경].Select (L103) → resetPassword() L172-183: 인증번호가 맞으면 비밀번호 변경(init) 창 + hide()
  const resetPassword = async () => {
    setBusy(true);
    try {
      await authApi.verifyPasswordCode(companyCode, empNo, temp);
      stopTimer();
      onClose();
      onVerified(empNo);
    } catch (err) {
      message.info(errorMessage(err, '인증번호 6자리를 다시 확인해주세요'));   // L179
    } finally {
      setBusy(false);
    }
  };

  const warn = (v: string) => <ExclamationCircleOutlined style={{ color: '#DE5449', fontSize: 20, visibility: v ? 'hidden' : 'visible' }} />;

  return (
    <LookupModal
      open={open}
      title="비밀번호 재설정"
      width={420}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}><Button type="save" onClick={resetPassword} disabled={!sent} loading={busy}>비밀번호 변경</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 0' }}>
        {/* [E1] empNoField.ValueChange (L75) · [E2] phoneField.ValueChange (L86): 값이 있으면 느낌표가 사라진다 */}
        <Row label="로그인 ID">
          <Input style={{ flex: 1 }} placeholder="로그인 ID" value={empNo} onChange={e => setEmpNo(e.target.value)} />
          {warn(empNo)}
        </Row>
        <Row label="휴대폰 번호">
          <Input style={{ flex: 1 }} placeholder="Asset-ERP에 등록된 휴대폰번호" value={phone} onChange={e => setPhone(e.target.value)} />
          {warn(phone)}
        </Row>
        <Row label="인증 번호">
          <Space size={8}>
            <Input style={{ width: 130 }} placeholder="6자리" maxLength={6} disabled={!sent} value={temp} onChange={e => setTemp(e.target.value)} onPressEnter={resetPassword} />
            <Button type="send" onClick={sendCode} disabled={sent} loading={busy && !sent}>전송</Button>
            <span style={{ color: '#575757', fontSize: 12, whiteSpace: 'nowrap' }}>{remaining > 0 ? `${remaining}초 남음` : ''}</span>
          </Space>
        </Row>
        <div style={{ color: '#575757', fontWeight: 600, fontSize: 13, lineHeight: 1.7 }}>
          <div>로그인 ID와 휴대폰 번호를 입력해주세요.</div>
          <div>인증번호 입력 후 비밀번호 재설정 팝업이 표시됩니다.</div>
        </div>
      </div>
    </LookupModal>
  );
};
