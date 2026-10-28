/**
 * 신청내역으로 증명서 발급 창 (S05) — Emp15_Lookup_GetCert에서 고른 신청내역을 받아 연다
 * AS-IS: myApp/client/vi/emp/Emp15_Lookup_StampDocCert.java (503줄) — 모달 1305×450 "증명서 발급", insert(applicationModel, callBack) L98-149
 * 왼쪽(650) 발급 폼은 Emp15_Lookup_Cert와 같고, 오른쪽에 신청 내용(content, setHtmlTextViewWhenLoaded L470-494)을 보여 준다
 * 증명서종류는 신청구분으로 정한다: 10 → B01 재직증명서, 11 → B03 경력증명서, 12 → B04 징계내역확인서, 그 밖은 "등록되지 않는 시스템코드입니다. 관리자에게 문의바랍니다."
 * 1단계: [상신] 뒤 updateApprId() → updateApplication(요청상태 변경, bbs.Bbs11_Application.updateAppStatus)은 결재 문서 작성과 함께 다음 단계
 */
import React from 'react';
import { message } from 'antd';
import { BbsApplication } from '@/types/bbs';
import { HtmlView } from '@/components/form/HtmlView';
import { Emp15_CertEdit } from './Emp15_CertEdit';

interface Props {
  /** 고른 신청내역 — 값이 있으면 열린다 */
  application: BbsApplication | null;
  onSaved: () => void;
  onClose: () => void;
}

const LINK_CODES: Record<string, string> = { '10': 'B01', '11': 'B03', '12': 'B04' };

export const Emp15_Lookup_StampDocCert: React.FC<Props> = ({ application, onSaved, onClose }) => {
  const linkCode = application?.appType ? LINK_CODES[application.appType] : undefined;
  React.useEffect(() => {
    if (application && !linkCode) {
      message.warning('등록되지 않는 시스템코드입니다. 관리자에게 문의바랍니다.');
      onClose();
    }
  }, [application]);  // eslint-disable-line react-hooks/exhaustive-deps
  if (!application || !linkCode) return null;
  return (
    <Emp15_CertEdit
      key={application.applicationId}
      width={1305}
      preset={{ linkCode, personId: application.appEmpId ?? undefined, personName: application.appEmpName ?? '' }}
      side={application.content ? <HtmlView html={application.content} height={330} /> : undefined}
      onSaved={onSaved}
      onClose={onClose}
    />
  );
};
