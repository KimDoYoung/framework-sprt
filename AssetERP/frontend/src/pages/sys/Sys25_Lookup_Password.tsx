/**
 * 비밀번호 변경 창 (EE59) — 로그인 화면이 연다: 비밀번호가 만료됐을 때(modi) · 최초/초기화 뒤(init) · 인증번호 확인 뒤(init, 3개월 연장 없음)
 * AS-IS: myApp/client/vi/sys/Sys25_Lookup_Password.java (353줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-90: 450×320, 머리말 "비밀번호 변경", [현재 비밀번호][변경 비밀번호] + 규칙 안내 + [비밀번호 확인], 각 칸 옆에 "[대문자]" 표시, 푸터 [확인][3개월 후 변경]
 * open/openNoExtension L58-74, setting() L92-164: init이면 현재 비밀번호 칸 비활성 + [3개월 후 변경] 감춤
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, message } from 'antd';
import type { InputRef } from 'antd';
import { authApi } from '@/api/auth';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const LABEL_W = 115;
const RULE_TEXT = [
  '· 영문 대소문자+숫자 조합 최소 10자리 이상',
  '· 영문 대소문자+숫자+특수문자 조합 최소 8자리 이상',
  '· 연속된 문자(숫자)나 순차적인 문자(숫자) 3개 이상 사용불가',
];

interface Props {
  open: boolean;
  companyCode: string;
  loginId: string;
  /** init: 최초 및 초기화 후 설정(현재 비밀번호 없음), modi: 변경 */
  statusType: 'init' | 'modi';
  /** openNoExtension — [3개월 후 변경]을 감춘다 */
  noExtension?: boolean;
  onClose: () => void;
}

/** 칸 한 줄: 라벨(오른쪽 정렬) + 칸 + 대문자 표시 */
const Row: React.FC<{ label: string; caps: boolean; children: React.ReactNode }> = ({ label, caps, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1 }}>{children}</div>
    <span style={{ width: 50, color: '#DE5449', fontWeight: 'bold', fontSize: 12 }}>{caps ? '[대문자]' : ''}</span>
  </div>
);

export const Sys25_Lookup_Password: React.FC<Props> = ({ open, companyCode, loginId, statusType, noExtension, onClose }) => {
  const [before, setBefore] = useState('');
  const [after1, setAfter1] = useState('');
  const [after2, setAfter2] = useState('');
  const [caps, setCaps] = useState<0 | 1 | 2 | 3>(0); // capsLock1~3 (한 번에 하나만 표시, L99-134)
  const [busy, setBusy] = useState(false);
  const beforeRef = React.useRef<InputRef>(null);
  const afterRef = React.useRef<InputRef>(null);
  const isInit = statusType === 'init';

  // [E0] 열림: 칸 비움 (open L58-74). init이면 현재 비밀번호 칸이 비활성이라 변경 비밀번호에 커서
  useEffect(() => {
    if (!open) return;
    setBefore(''); setAfter1(''); setAfter2(''); setCaps(0);
    setTimeout(() => (isInit ? afterRef.current : beforeRef.current)?.focus(), 100);
  }, [open, isInit]);

  // [E1~E3] 칸 keyPress → checkCapsLock() L324-336: 대문자 표시 (CapsLock 상태로 판정)
  const onKey = (n: 1 | 2 | 3) => (e: React.KeyboardEvent) => setCaps(e.getModifierState('CapsLock') ? n : (c => (c === n ? 0 : c))(caps));

  // [E4] updateButton[확인].Select (L135) → insertChcek() L205-281 → checkPassword · checkPasswordRule · insert (서버)
  const submit = async () => {
    if (after2 !== after1) { message.info('[변경 비밀번호]와 [비밀번호 확인]이 일치하지 않습니다.'); return; } // L236
    setBusy(true);
    try {
      const res = await authApi.changePassword(companyCode, loginId, isInit ? undefined : before, after1);
      message.info(res.message || '비밀번호 변경이 완료되었습니다');   // L295
      onClose();                                                          // hide()
    } catch (err) {
      message.info(errorMessage(err, '처리중 오류발생. 전산팀에 문의하여 주십시오.'));
    } finally {
      setBusy(false);
    }
  };

  // [E5] extensionButton[3개월 후 변경].Select (L141) → 확인창 "비밀번호를 3개월 후 변경하시겠습니까?" [예] → extension() L305-322
  const extend = () => {
    Modal.confirm({
      title: '확인', content: '비밀번호를 3개월 후 변경하시겠습니까?', okText: '예', cancelText: '아니오', width: 450,
      onOk: async () => {
        try {
          const res = await authApi.extendPassword(companyCode, loginId, before);
          message.info(res.message || '비밀번호 만료기한이 3개월 연장되었습니다');   // L315
          onClose();
        } catch (err) {
          message.info(errorMessage(err, '처리중 오류발생. 전산팀에 문의하여 주십시오.'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="비밀번호 변경"
      width={450}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={submit} loading={busy}>확인</Button>
            {!isInit && !noExtension && <Button type="close" onClick={extend}>3개월 후 변경</Button>}
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
        <Row label="현재 비밀번호" caps={caps === 1}>
          <Input.Password ref={beforeRef} disabled={isInit} value={before} onChange={e => setBefore(e.target.value)} onKeyDown={onKey(1)} autoComplete="current-password" />
        </Row>
        <Row label="변경 비밀번호" caps={caps === 2}>
          <Input.Password ref={afterRef} value={after1} onChange={e => setAfter1(e.target.value)} onKeyDown={onKey(2)} autoComplete="new-password" />
        </Row>
        <div style={{ color: '#575757', fontWeight: 600, fontSize: 13, padding: '0 0 0 20px', lineHeight: 1.7 }}>
          {RULE_TEXT.map(t => <div key={t}>{t}</div>)}
        </div>
        <Row label="비밀번호 확인" caps={caps === 3}>
          <Input.Password value={after2} onChange={e => setAfter2(e.target.value)} onKeyDown={onKey(3)} onPressEnter={submit} autoComplete="new-password" />
        </Row>
      </div>
    </LookupModal>
  );
};
