/**
 * 기기 등록요청 창 (EE61) — 허가받지 않은 기기로 접속했을 때 관리자에게 승인을 요청한다
 * AS-IS: myApp/client/vi/sys/Sys27_Lookup_Request.java (134줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-74: 500×260, 머리말 "Asset-ERP 기기 등록요청", 닫기(X) 없음, [구 분(LoginPlaceCode 콤보)][사 유(글상자 100)], 푸터 [신청][취소]
 * ※ AS-IS 호출처 LoginPage.checkMacAddress()는 `@SuppressWarnings("unused")` 로 어디서도 부르지 않는다(도달 불가) — 창만 만들고 화면에는 연결하지 않았다
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

const LABEL_W = 60;

interface Props {
  open: boolean;
  /** 신청했으면 true, 취소(L61 callBackResult.execute(null))면 null */
  onResult: (requested: true | null) => void;
}

const Row: React.FC<{ label: string; top?: boolean; children: React.ReactNode }> = ({ label, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 8 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0, paddingTop: top ? 6 : 0 }}>{label}</span>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

export const Sys27_Lookup_Request: React.FC<Props> = ({ open, onResult }) => {
  const [place, setPlace] = useState<string | undefined>();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) { setPlace(undefined); setReason(''); } }, [open]);

  // [E1] updateButton[신청].Select (L52) → update() L94-126 — sys.Sys27_LoginManage.insert
  const update = async () => {
    if (!place) { message.info('구분 값을 먼저 선택해주세요'); return; }          // L96-99
    if (reason.length <= 0) { message.info('간단한 사유를 입력해주세요'); return; }   // L101-104
    setBusy(true);
    try {
      // 브라우저는 기기 Mac 주소를 알 수 없다(AS-IS LoginUser.getMacAddress는 별도 프로그램이 준 값) — 비워 보낸다
      if (await sysApi.requestLoginManage(place, reason)) onResult(true);          // L117-119
      else message.info('이미 신청완료된 기기입니다');                              // L121
    } catch (err) {
      message.error(errorMessage(err, '신청 실패'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="Asset-ERP 기기 등록요청"
      width={500}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={busy}>신청</Button>
            {/* [E2] closeButton[취소].Select (L58) → callBackResult.execute(null), hide() */}
            <Button type="close" onClick={() => onResult(null)}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 0' }}>
        <Row label="구 분">
          <SystemCodeComboBox kindCd="LoginPlaceCode" placeholder="선택해주세요" style={{ width: '100%' }} value={place} onChange={c => setPlace(c ?? undefined)} />
        </Row>
        <Row label="사 유" top>
          <Input.TextArea placeholder="사유를 입력해주세요" style={{ height: 100, resize: 'none' }} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} />
        </Row>
      </div>
    </LookupModal>
  );
};
