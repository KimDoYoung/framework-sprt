/**
 * 영업거래처 기본 공유지정 창 (EE86) — Crm09_Lookup_ContactPoint(영업거래처 창)의 공유기본 [설정]이 연다
 * AS-IS: myApp/client/vi/crm/Crm14_Lookup_ShareDefault.java (322줄). 본문은 Crm15_Lookup_Share와 같아 `CrmShareWindow`를 쓴다.
 * 머리말 "공유지정", 서비스 crm.Crm14_ShareDefault.selectByContactId / delete / update / selectShareInfo
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React from 'react';
import { crmShareApi } from '@/api/biz';
import { CrmShareWindow } from './CrmShareWindow';

interface Props {
  /** open(contactId, callbackResult) — 값이 있으면 열린다 */
  contactId: number | null;
  /** callbackResult.execute(공유 문구) */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

export const Crm14_Lookup_ShareDefault: React.FC<Props> = ({ contactId, onResult, onClose }) => (
  <CrmShareWindow
    ownerId={contactId}
    title="공유지정"
    load={crmShareApi.searchDefault}
    save={crmShareApi.saveDefault}
    onResult={onResult}
    onClose={onClose}
  />
);
