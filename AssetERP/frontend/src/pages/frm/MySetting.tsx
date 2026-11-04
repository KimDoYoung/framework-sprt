/**
 * 기본설정(도움말) 창 — MainFrame 상단 톱니바퀴(TOBE: 사용자 메뉴 [개인 환경설정])가 연다. 설정 창들로 가는 링크 모음
 * AS-IS: myApp/client/vi/MySetting.java (160줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-81: 머리말 "기본설정(도움말)". 일반 사용자 360×345 = 링크 4개(매뉴얼·화면안내·테마설정·문자&메일 알림설정),
 * 관리자(회사관리자·사용자관리자) 370×590 = 링크 8개(위 4개 + 특정화면 문서분류·특정양식·특정직위·특정알림). 푸터 [닫기]
 * 연결: 화면안내 → Emp91_Lookup_List(EE62) · 문자&메일 알림설정 → Emp92_Lookup_SmsNotice(EE63) · 매뉴얼 → 새 창(노션)
 *       나머지(테마설정·특정화면 문서분류·특정양식·특정직위·특정알림)는 창이 아직 없어 다음 단계 안내
 */
import React, { useState } from 'react';
import { message } from 'antd';
import { BgColorsOutlined, BookOutlined, CheckSquareOutlined, MailOutlined, ReadOutlined } from '@ant-design/icons';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp91_Lookup_List } from '../emp/Emp91_Lookup_List';
import { Emp92_Lookup_SmsNotice } from '../emp/Emp92_Lookup_SmsNotice';

const MANUAL_URL = 'https://dusty-casquette-8e6.notion.site/Asset-ERP-9c12459a8139475589535580128a413e';

interface Props {
  open: boolean;
  /** LoginUser.getIsManager() — 회사관리자(userId < 0). 사용자관리자(getAdminCheck)는 아직 판정하지 않는다 */
  isManager: boolean;
  onClose: () => void;
}

export const MySetting: React.FC<Props> = ({ open, isManager, onClose }) => {
  const [guideOpen, setGuideOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const next = (name: string) => () => message.info(`${name} 창은 다음 단계에서 제공됩니다.`);

  const links: { icon: React.ReactNode; text: string; onClick: () => void; managerOnly?: boolean }[] = [
    // [E1] anchor01 (L84) → Window.open(노션 매뉴얼, 850×1000)
    { icon: <ReadOutlined />, text: 'Asset-ERP 매뉴얼 (초기설정)', onClick: () => window.open(MANUAL_URL, 'chromewin', 'width=850,height=1000,scrollbars=yes') },
    // [E2] anchor02 (L91) → Emp91_Lookup_List.open()
    { icon: <BookOutlined />, text: 'Asset-ERP 화면안내', onClick: () => setGuideOpen(true) },
    // [E3] anchor03 (L98) → MyThemePopup — 다음 단계
    { icon: <BgColorsOutlined />, text: 'Asset-ERP 시스템 테마설정', onClick: next('시스템 테마설정') },
    // [E4~E7] anchor04~07 (L104-141) → Dcr30_Lookup_Link · Sys00_Lookup_Mapping · Emp03_Lookup_Grade · Emp93_Lookup_SmsNoticeTargetList — 다음 단계(관리자만 보인다)
    { icon: <CheckSquareOutlined />, text: '특정화면 문서분류 지정', onClick: next('특정화면 문서분류 지정'), managerOnly: true },
    { icon: <CheckSquareOutlined />, text: '특정양식 지정 (연봉계약서)', onClick: next('특정양식 지정'), managerOnly: true },
    { icon: <CheckSquareOutlined />, text: '특정직위 지정', onClick: next('특정직위 지정'), managerOnly: true },
    { icon: <CheckSquareOutlined />, text: '특정알림 설정', onClick: next('특정알림 설정'), managerOnly: true },
    // [E8] anchor08 (L142) → Emp92_Lookup_SmsNotice.open()
    { icon: <MailOutlined />, text: '문자 & 메일 알림설정', onClick: () => setSmsOpen(true) },
  ];
  // 일반 사용자: 1·2·3·8번째만 (L62-65), 관리자: 순서대로 8개 (L68-75: 1,2,3,4,5,6,7,8)
  const shown = links.filter(l => isManager || !l.managerOnly);

  return (
    <>
      <LookupModal
        open={open}
        title="기본설정(도움말)"
        width={isManager ? 370 : 360}
        maskClosable={false}
        onCancel={onClose}
        footer={<div style={{ textAlign: 'center' }}>{/* [E9] closeButton[닫기].Select (L149) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px' }}>
          {shown.map(l => (
            <a key={l.text} onClick={l.onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer', textDecoration: 'none' }}>
              <span style={{ fontSize: 22 }}>{l.icon}</span>{l.text}
            </a>
          ))}
        </div>
      </LookupModal>
      <Emp91_Lookup_List open={guideOpen} onClose={() => setGuideOpen(false)} />
      <Emp92_Lookup_SmsNotice open={smsOpen} onClose={() => setSmsOpen(false)} />
    </>
  );
};
