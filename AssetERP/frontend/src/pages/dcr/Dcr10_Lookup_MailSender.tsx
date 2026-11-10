/**
 * 메일 발송 안내 확인창 (EE35) — 전자결재 문서·증명서·사용료 청구의 [메일보내기]가 연다
 * AS-IS: myApp/client/vi/dcr/Dcr10_Lookup_MailSender.java (92줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(apprId) L12 · certOpen(apprId, emailAddress) L16 · erpFeeChargeOpen(apprId, managerEmail, apprTitle, mailForm) L20 → showMessage01~03 L24-91:
 *   확인창 "메일 발송 안내" "새로운 메일 시스템을 테스트 중입니다. 해당 시스템으로 메일 발송을 진행하시겠습니까?"(폭 620)
 *   [예] → new AssetMailSend(…) — 외부 메일 시스템(SSO 토큰으로 작성창 새 창). 2026-11-10 연결(사용자 결정: 시뮬레이터로 진행) — 개발은 tools/run-ext-server.sh가 쓰기창을 흉내 낸다
 *   [아니오] → Dcr10_Lookup_MailSender_20261027 (앱 안 SMTP 발송창)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Button } from '@/components/button';
import { dcrMailSenderApi } from '@/api/dcrMail';
import { errorMessage } from '@/api/client';
import { Dcr10_Lookup_MailSender_20261027, MailSenderTarget } from './Dcr10_Lookup_MailSender_20261027';

export type { MailSenderTarget };

interface Props {
  /** 값이 있으면 열림 — `{mode:'open'|'cert'|'erpFeeCharge', apprId, …}` */
  target: MailSenderTarget | null;
  onClose: () => void;
}

export const Dcr10_Lookup_MailSender: React.FC<Props> = ({ target, onClose }) => {
  const [step, setStep] = useState<'confirm' | 'send'>('confirm');
  // 새 대상이 오면 확인창부터
  useEffect(() => { if (target) setStep('confirm'); }, [target]);

  // [YES] → new AssetMailSend(apprId, email, title, content) (client/utils/AssetMailSend L20-84): 첨부 파일 ID·refKey·SSO 토큰 → assetMail 쓰기창 주소 → 새 창(1000×760)
  //   open·cert는 제목·내용 없이(cert의 emailAddress는 원본도 서버가 쓰지 않는다), erpFeeCharge는 apprTitle·mailForm
  const yes = async () => {
    if (!target) return;
    const header = target.mode === 'erpFeeCharge' ? target.apprTitle ?? null : null;
    const content = target.mode === 'erpFeeCharge' ? target.mailForm ?? null : null;
    onClose();
    try {
      const openUrl = await dcrMailSenderApi.openAssetMail(target.apprId, header, content);
      if (!openUrl) { message.warning('메일 작성 화면 주소를 가져오지 못했습니다.'); return; }
      window.open(openUrl, '_blank', 'width=1000,height=760,menubars=0,toolbars=0,location=0,scrollbars=yes');
    } catch (err) {
      message.warning(errorMessage(err, '메일 작성 화면 주소를 가져오지 못했습니다.'));
    }
  };

  return (
    <>
      <Modal
        open={!!target && step === 'confirm'}
        title="메일 발송 안내"
        width={620}
        maskClosable={false}
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E1] msgBox.DialogHide [YES] (L27) → AssetMailSend(apprId) · [E2] (L50) → AssetMailSend(apprId, emailAddress) · [E3] (L73) → AssetMailSend(apprId, managerEmail, apprTitle, mailForm) */}
              <Button type="save" onClick={yes}>예</Button>
              {/* [E1~E3] [NO] → Dcr10_Lookup_MailSender_20261027.open / certOpen / erpFeeChargeOpen */}
              <Button type="cancel" onClick={() => setStep('send')}>아니오</Button>
            </Space>
          </div>
        )}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 2px' }}>
          <QuestionCircleFilled style={{ fontSize: 28, color: '#1677ff' }} />
          <span>새로운 메일 시스템을 테스트 중입니다. 해당 시스템으로 메일 발송을 진행하시겠습니까?</span>
        </div>
      </Modal>
      <Dcr10_Lookup_MailSender_20261027 target={step === 'send' ? target : null} onClose={onClose} />
    </>
  );
};
