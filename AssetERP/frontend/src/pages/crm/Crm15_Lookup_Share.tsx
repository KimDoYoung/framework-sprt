/**
 * 업무활동내역 공유지정 창 (EE87) — Crm12_Lookup_WorkDetail(업무활동내역 창)의 공유 [설정]이 연다
 * AS-IS: myApp/client/vi/crm/Crm15_Lookup_Share.java (320줄). 본문은 Crm14_Lookup_ShareDefault와 같아 `CrmShareWindow`를 쓴다.
 * 머리말 "업무활동내역 공유지정", 서비스 crm.Crm15_Share.selectByWorkDetailId / delete / update / selectShareInfo
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { crmShareApi } from '@/api/biz';
import { CrmShareWindow } from './CrmShareWindow';

interface Props {
  /** open(workDetailId, callbackResult) — 값이 있으면 열린다 */
  workDetailId: number | null;
  /** callbackResult.execute(공유 문구) */
  onResult: (shareInfo: string) => void;
  onClose: () => void;
}

export const Crm15_Lookup_Share: React.FC<Props> = ({ workDetailId, onResult, onClose }) => (
  <CrmShareWindow
    ownerId={workDetailId}
    title="업무활동내역 공유지정"
    load={crmShareApi.searchByWorkDetail}
    save={crmShareApi.saveByWorkDetail}
    onResult={onResult}
    onClose={onClose}
  />
);
